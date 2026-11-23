#!/usr/bin/env python3
"""Idempotent DB content hygiene pass for live public.textbook_sections.

Normalizes PDF Unicode ligatures, repeated Dion/FIFA watermark lines, raw PDF
bullet glyphs (●, ○, ▪, ■, inline `o ` sub-bullets), and noisy section titles
across all 7,788 textbook sections without bloating storage.
"""

from __future__ import annotations

import os
import re
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

import psycopg2
from psycopg2.extras import execute_values

WATERMARK_PATTERNS = [
    re.compile(r"^https?://(?:www\.)?diontraining\.com/?$", re.IGNORECASE),
    re.compile(r"^©\s*\d{4}\s*COPYRIGHT\s+FIFA.*ALL\s+RIGHTS\s+RESERVED\.?$", re.IGNORECASE),
    re.compile(r"^CompTIA\s+Security\+\s*\(Study\s+Notes\)\s*$", re.IGNORECASE),
    re.compile(r"^Page\s+\d+(?:\s+of\s+\d+)?\s*$", re.IGNORECASE),
]


def load_clean_dsn() -> str:
    env_path = Path(__file__).resolve().parent.parent / ".env"
    if env_path.exists():
        for raw_line in env_path.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

    dsn = os.environ.get("DIRECT_URL") or os.environ.get("DATABASE_URL") or ""
    if not dsn:
        raise RuntimeError("Missing DATABASE_URL / DIRECT_URL in environment or .env")

    parsed = urlparse(dsn)
    filtered_q = [
        (k, v)
        for k, v in parse_qsl(parsed.query, keep_blank_values=True)
        if k not in ("pgbouncer", "connection_limit")
    ]
    return urlunparse(parsed._replace(query=urlencode(filtered_q)))


def clean_title(raw: str) -> str:
    t = (
        raw.replace("\ufb00", "ff")
        .replace("\ufb01", "fi")
        .replace("\ufb02", "fl")
        .replace("\ufb03", "ffi")
        .replace("\ufb04", "ffl")
        .replace("\u00a0", " ")
    )
    t = re.sub(r"^Also Good For CC exam\s+", "", t, flags=re.IGNORECASE)
    t = re.sub(r"\s{2,}", " ", t).strip()
    return t


def clean_markdown(raw: str) -> str:
    if not raw:
        return raw
    text = (
        raw.replace("\ufb00", "ff")
        .replace("\ufb01", "fi")
        .replace("\ufb02", "fl")
        .replace("\ufb03", "ffi")
        .replace("\ufb04", "ffl")
        .replace("\u00a0", " ")
        .replace("\r\n", "\n")
        .replace("\r", "\n")
    )

    out_lines: list[str] = []
    in_code = False

    for line in text.split("\n"):
        trimmed = line.strip()
        if trimmed.startswith("```"):
            in_code = not in_code
            out_lines.append(line)
            continue
        if in_code:
            out_lines.append(line)
            continue

        if any(p.match(trimmed) for p in WATERMARK_PATTERNS):
            continue

        # Convert PDF bullet symbols & leading lowercase `o ` sub-bullets (spaced or adjacent)
        line = re.sub(r"^\s*[●▪■•‣]+\s*", "- ", line)
        line = re.sub(r"^\s*[○◦]+\s*", "  - ", line)
        line = re.sub(r"^\s*o\s+(?=[A-Z0-9])", "  - ", line)
        # Convert inline PDF bullets anywhere in prose (`...text ● Next` or `...service o Platform`)
        line = re.sub(r"\s*[●▪■‣]+\s*", "\n- ", line)
        line = re.sub(r"(?<=[a-z0-9.)\]])\s+o\s+(?=[A-Z][a-zA-Z0-9(])", "\n  - ", line)

        out_lines.extend(line.split("\n"))

    cleaned = "\n".join(out_lines)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned).strip()
    return cleaned


def main() -> None:
    dsn = load_clean_dsn()
    conn = psycopg2.connect(dsn)
    try:
        cur = conn.cursor()
        cur.execute("SELECT pg_size_pretty(pg_database_size(current_database()));")
        before_size = cur.fetchone()[0]

        cur.execute("SELECT id, title, content_markdown FROM public.textbook_sections ORDER BY id;")
        rows = cur.fetchall()

        updates: list[tuple[str, str, str, int]] = []
        for sec_id, title, content in rows:
            new_title = clean_title(title or "")
            new_content = clean_markdown(content or "")
            if new_title != (title or "") or new_content != (content or ""):
                wc = len(new_content.split())
                updates.append((sec_id, new_title, new_content, max(1, wc)))

        if updates:
            execute_values(
                cur,
                """
                UPDATE public.textbook_sections AS t
                SET title = v.title,
                    content_markdown = v.content_markdown,
                    word_count = v.word_count
                FROM (VALUES %s) AS v(id, title, content_markdown, word_count)
                WHERE t.id = v.id::uuid
                """,
                updates,
                page_size=250,
            )
            conn.commit()

        # Reclaim dead tuples from MVCC update so Postgres stays lean on Free Tier
        conn.autocommit = True
        vac_cur = conn.cursor()
        vac_cur.execute("VACUUM ANALYZE public.textbook_sections;")

        vac_cur.execute("SELECT pg_size_pretty(pg_database_size(current_database()));")
        after_size = vac_cur.fetchone()[0]

        vac_cur.execute(
            """
            SELECT
              COUNT(*) AS total,
              COUNT(*) FILTER (WHERE content_markdown ~ '[●○▪■]' OR content_markdown ~ E'(^|\\n)o [A-Z]') AS remaining_raw_pdf_bullets,
              COUNT(*) FILTER (WHERE content_markdown ILIKE '%diontraining.com%') AS remaining_dion_urls
            FROM public.textbook_sections;
            """
        )
        verify = vac_cur.fetchone()
        print(
            f"Scanned {len(rows)} textbook_sections | Updated {len(updates)} rows | "
            f"DB size: {before_size} -> {after_size} | Verify(total, raw_bullets, dion_urls): {verify}"
        )
    finally:
        conn.close()


if __name__ == "__main__":
    main()
