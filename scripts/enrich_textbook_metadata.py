#!/usr/bin/env python3
"""
ANOXPASS — Deterministic Textbook Chapter & Section Metadata Enrichment
100% Open-Source / Zero Paid APIs / Free Tier DB Safe (< +10 MB)
Enriches:
  1. public.textbook_chapters.domain_number (16.5% -> 100%)
  2. public.textbook_chapters.learning_objectives & key_takeaways (0% -> 100%)
  3. public.textbook_sections.key_terms & exam_tips (expands concise extracted cues)
"""

from __future__ import annotations

import os
import re
from typing import Dict, List, Optional, Tuple
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

import psycopg2
from psycopg2.extras import execute_batch

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(ROOT_DIR, ".env")

STOPWORDS = {
    "chapter", "module", "part", "unit", "section", "overview", "introduction",
    "review", "manual", "guide", "official", "practice", "exam", "certification",
    "certified", "information", "systems", "security", "management", "using",
    "with", "from", "that", "this", "their", "about", "into", "across", "under",
    "pages", "page", "topic", "topics", "volume", "edition", "complete",
}

DIRECTIVE_RE = re.compile(
    r"([A-Z][^.?!]{35,280}\b(?:must|should|primary|first|most important|critical|always|never|mandatory|requires|ensures|mitigates|prevents|enforces)\b[^.?!]{10,200}[.!])",
    re.IGNORECASE,
)

TECH_TERM_RE = re.compile(
    r"\b(?:[A-Z]{2,8}(?:-\d+)?|[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})\b"
)


def get_conn():
    env: Dict[str, str] = {}
    with open(ENV_PATH, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip().strip('"').strip("'")
    raw = env.get("DIRECT_URL") or env.get("DATABASE_URL")
    u = urlparse(raw)
    qs = [(k, v) for k, v in parse_qsl(u.query) if k not in ("pgbouncer", "connection_limit")]
    dsn = urlunparse((u.scheme, u.netloc, u.path, u.params, urlencode(qs), u.fragment))
    return psycopg2.connect(dsn)


def tokenize(text: str) -> set:
    words = re.findall(r"[a-z0-9]{3,}", (text or "").lower())
    return {w for w in words if w not in STOPWORDS}


def extract_key_terms_fast(md: str, title: str) -> List[str]:
    terms: List[str] = []
    seen = set()
    # Priority 1: bold markdown terms
    for m in re.findall(r"\*\*([A-Za-z0-9][A-Za-z0-9 /\-()]{2,38})\*\*", md[:5000]):
        t = m.strip(" .,:;")
        low = t.lower()
        if low in seen or low.startswith(("note", "tip", "exam", "chapter", "figure", "table", "page", "part")):
            continue
        seen.add(low)
        terms.append(t)
        if len(terms) >= 6:
            return terms

    # Priority 2: capitalized acronyms & technical noun phrases
    for m in TECH_TERM_RE.findall((title + " " + md[:3500])):
        t = m.strip()
        low = t.lower()
        if len(t) < 3 or low in seen or low in STOPWORDS:
            continue
        if any(bad in low for bad in ("chapter", "page", "section", "edition", "copyright", "figure", "table")):
            continue
        seen.add(low)
        terms.append(t)
        if len(terms) >= 6:
            break
    return terms


def extract_exam_tip_fast(md: str) -> Optional[str]:
    clean = re.sub(r"[#>*`_\[\]]+", " ", md[:6000])
    clean = re.sub(r"\s+", " ", clean)
    for m in DIRECTIVE_RE.finditer(clean):
        cand = m.group(1).strip()
        if 55 <= len(cand) <= 320 and not cand.lower().startswith(("copyright", "table ", "figure ", "see chapter")):
            return f"Exam Watch: {cand}"
    return None


def main():
    conn = get_conn()
    conn.autocommit = False
    cur = conn.cursor()

    # 1. Load official domains per certification slug
    cur.execute(
        """
        SELECT c.slug, d.domain_number, d.name, COALESCE(d.learning_objectives, '')
        FROM public.domains d
        JOIN public.certifications c ON c.id = d.certification_id
        ORDER BY c.slug, d.domain_number;
        """
    )
    domains_by_cert: Dict[str, List[Tuple[int, str, set]]] = {}
    for slug, dnum, dname, dobj in cur.fetchall():
        toks = tokenize(f"{dname} {dobj}")
        domains_by_cert.setdefault(slug, []).append((int(dnum), dname, toks))

    # 2. Load chapters + first 2 section titles per chapter for domain & objective enrichment
    cur.execute(
        """
        SELECT ch.id, ch.certification_slug, ch.chapter_number, ch.title, ch.domain_number,
               ch.learning_objectives, ch.key_takeaways
        FROM public.textbook_chapters ch
        ORDER BY ch.certification_slug, ch.chapter_number;
        """
    )
    chapters = cur.fetchall()

    cur.execute(
        """
        SELECT chapter_id, title, key_terms, exam_tips, sort_order
        FROM public.textbook_sections
        ORDER BY chapter_id, sort_order;
        """
    )
    secs_by_chapter: Dict[str, List[Tuple[str, List[str], Optional[str]]]] = {}
    for ch_id, s_title, kt, et, _ in cur.fetchall():
        secs_by_chapter.setdefault(str(ch_id), []).append((s_title or "", kt or [], et))

    ch_updates: List[Tuple[int, List[str], List[str], str]] = []
    mapped_from_null = 0
    objectives_filled = 0

    for ch_id, slug, ch_num, ch_title, cur_dom, cur_obj, cur_takeaways in chapters:
        ch_id_str = str(ch_id)
        ch_secs = secs_by_chapter.get(ch_id_str, [])
        doms = domains_by_cert.get(slug, [])

        # Determine domain_number if NULL
        new_dom = cur_dom
        if new_dom is None:
            mapped_from_null += 1
            if doms:
                explicit_m = re.search(r"\bdomain\s+(\d+)\b", ch_title or "", re.IGNORECASE)
                if explicit_m:
                    cand_num = int(explicit_m.group(1))
                    if any(d[0] == cand_num for d in doms):
                        new_dom = cand_num
                if new_dom is None:
                    sample_text = (ch_title or "") + " " + " ".join(s[0] for s in ch_secs[:4])
                    ch_toks = tokenize(sample_text)
                    best_dom = doms[(max(0, (ch_num or 1) - 1)) % len(doms)][0]
                    best_overlap = 0
                    for dnum, dname, dtoks in doms:
                        overlap = len(ch_toks & dtoks)
                        if overlap > best_overlap:
                            best_overlap = overlap
                            best_dom = dnum
                    new_dom = best_dom
            else:
                new_dom = 1

        # Build concise learning objectives (max 3) & key takeaways (max 2)
        new_obj = list(cur_obj or [])
        if not new_obj:
            objectives_filled += 1
            dom_name = next((d[1] for d in doms if d[0] == new_dom), f"Domain {new_dom}")
            sec_titles = [
                re.sub(r"\s*\(Part\s+\d+/\d+\)$", "", s[0]).strip()
                for s in ch_secs
                if s[0] and len(s[0].strip()) > 4
            ]
            seen_t = set()
            uniq_secs = []
            for st in sec_titles:
                low = st.lower()
                if low not in seen_t:
                    seen_t.add(low)
                    uniq_secs.append(st[:110])
                if len(uniq_secs) >= 3:
                    break
            if uniq_secs:
                new_obj = [f"Understand and apply {st} ({dom_name})." for st in uniq_secs]
            else:
                new_obj = [f"Master core principles of {ch_title[:100]} aligned with {dom_name}."]

        new_takeaways = list(cur_takeaways or [])
        if not new_takeaways:
            dom_name = next((d[1] for d in doms if d[0] == new_dom), f"Domain {new_dom}")
            new_takeaways = [
                f"Align technical and operational decisions in {ch_title[:80]} with {dom_name} requirements.",
                "Validate control implementation using objective evidence, monitoring telemetry, and risk impact.",
            ]

        if cur_dom != new_dom or not cur_obj or not cur_takeaways:
            ch_updates.append((new_dom, new_obj, new_takeaways, ch_id_str))

    if ch_updates:
        execute_batch(
            cur,
            """
            UPDATE public.textbook_chapters
            SET domain_number = %s,
                learning_objectives = %s,
                key_takeaways = %s
            WHERE id = %s::uuid;
            """,
            ch_updates,
            page_size=250,
        )

    # 3. Enrich textbook_sections missing key_terms or exam_tips
    cur.execute(
        """
        SELECT id, title, content_markdown, key_terms, exam_tips
        FROM public.textbook_sections
        WHERE exam_tips IS NULL OR array_length(key_terms, 1) IS NULL;
        """
    )
    sec_rows = cur.fetchall()
    sec_updates: List[Tuple[List[str], Optional[str], str]] = []
    terms_filled = 0
    tips_filled = 0

    for sid, stitle, md, cur_kt, cur_et in sec_rows:
        new_kt = list(cur_kt or [])
        if not new_kt:
            new_kt = extract_key_terms_fast(md or "", stitle or "")
            if new_kt:
                terms_filled += 1
        new_et = cur_et
        if not new_et:
            new_et = extract_exam_tip_fast(md or "")
            if new_et:
                tips_filled += 1
        if new_kt != list(cur_kt or []) or new_et != cur_et:
            sec_updates.append((new_kt, new_et, str(sid)))

    if sec_updates:
        execute_batch(
            cur,
            """
            UPDATE public.textbook_sections
            SET key_terms = %s,
                exam_tips = %s
            WHERE id = %s::uuid;
            """,
            sec_updates,
            page_size=250,
        )

    conn.commit()
    conn.autocommit = True
    cur.execute("VACUUM ANALYZE public.textbook_chapters;")
    cur.execute("VACUUM ANALYZE public.textbook_sections;")

    cur.execute(
        """
        SELECT COUNT(*),
               COUNT(domain_number),
               COUNT(*) FILTER (WHERE array_length(learning_objectives, 1) > 0),
               COUNT(*) FILTER (WHERE array_length(key_takeaways, 1) > 0)
        FROM public.textbook_chapters;
        """
    )
    ch_stats = cur.fetchone()
    cur.execute(
        """
        SELECT COUNT(*),
               COUNT(*) FILTER (WHERE exam_tips IS NOT NULL),
               COUNT(*) FILTER (WHERE array_length(key_terms, 1) > 0)
        FROM public.textbook_sections;
        """
    )
    sec_stats = cur.fetchone()
    cur.execute("SELECT pg_size_pretty(pg_database_size(current_database()));")
    db_sz = cur.fetchone()[0]
    conn.close()

    print(
        f"[ENRICH COMPLETE] chapters_mapped_from_null={mapped_from_null} chapters_obj_filled={objectives_filled} "
        f"sections_terms_filled={terms_filled} sections_tips_filled={tips_filled}"
    )
    print(f"Chapters (total, domain_num, objectives, takeaways): {ch_stats}")
    print(f"Sections (total, exam_tips, key_terms): {sec_stats}")
    print(f"Live Postgres DB size: {db_sz}")


if __name__ == "__main__":
    main()
