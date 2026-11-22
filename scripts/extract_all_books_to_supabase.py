#!/usr/bin/env python3
"""
ANOXPASS — Deterministic Full Book-Structured Extractor (EPUB / PDF / Markdown -> Supabase)
Extracts unabridged Book -> Part -> Chapter -> Subchapter/Section content from my_documents/
across all 16 certifications into Supabase tables:
  - public.textbooks
  - public.textbook_chapters
  - public.textbook_sections
100% Open-Source (zipfile, BeautifulSoup4, pypdf, psycopg2). Zero paid APIs.
"""

from __future__ import annotations

import argparse
import glob
import hashlib
import os
import posixpath
import re
import sys
import unicodedata
import xml.etree.ElementTree as ET
import zipfile
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

from bs4 import BeautifulSoup, NavigableString, Tag
import psycopg2
from pypdf import PdfReader

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(ROOT_DIR, ".env")

FRONT_MATTER_KEYWORDS = (
    "cover", "title page", "titlepage", "copyright", "dedication", "acknowledg",
    "about the author", "about the technical", "credits", "table of contents",
    "contents at a glance", "foreword", "preface", "assessment test", "appendix",
    "index", "advert", "endorsement", "wiley", "sybex", "pearson", "mcgraw",
)

STOP_HEADERS_RE = re.compile(
    r"^(?:©\s*ISACA.*|---\s*PAGE\s+\d+\s*---|Page\s+\d+\s+of\s+\d+|CISA®?\s+Official\s+Review\s+Manual.*|\d{1,4})$",
    re.IGNORECASE,
)


@dataclass
class ExtractedSection:
    section_code: Optional[str]
    title: str
    heading_level: int
    content_markdown: str
    key_terms: List[str] = field(default_factory=list)
    exam_tips: Optional[str] = None
    page_start: Optional[int] = None
    page_end: Optional[int] = None


@dataclass
class ExtractedChapter:
    chapter_number: int
    title: str
    domain_number: Optional[int] = None
    part_label: Optional[str] = None
    summary: Optional[str] = None
    learning_objectives: List[str] = field(default_factory=list)
    key_takeaways: List[str] = field(default_factory=list)
    page_start: Optional[int] = None
    page_end: Optional[int] = None
    word_count: int = 0
    est_read_minutes: int = 15
    sections: List[ExtractedSection] = field(default_factory=list)


@dataclass
class ExtractedBook:
    cert_slug: str
    title: str
    author: str
    edition: str
    source_file: str
    is_primary: bool
    sort_order: int
    chapters: List[ExtractedChapter] = field(default_factory=list)


def clean_text(text: str) -> str:
    if not text:
        return ""
    text = text.replace("\x00", "")
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    # De-hyphenate line breaks
    text = re.sub(r"([a-zA-Z])-\n([a-zA-Z])", r"\1\2", text)
    # Collapse excess spaces
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def sha256_str(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8", errors="ignore")).hexdigest()


def word_count(s: str) -> int:
    return len(re.findall(r"\b\w+\b", s or ""))


def extract_key_terms_and_tips(md: str) -> Tuple[List[str], Optional[str]]:
    terms: List[str] = []
    seen = set()
    for m in re.findall(r"\*\*([A-Za-z0-9][A-Za-z0-9 /\-()]{2,42})\*\*", md):
        t = m.strip(" .,:;")
        low = t.lower()
        if low in seen or low.startswith(("note", "tip", "exam", "chapter", "figure", "table", "warning")):
            continue
        seen.add(low)
        terms.append(t)
        if len(terms) >= 8:
            break

    tip = None
    tip_match = re.search(
        r"(?:^|\n)(?:>\s*)?(?:\*\*)?(Exam\s+(?:Tip|Alert|Watch|Essentials|Focus)|Key\s+Takeaway|Important\s+Note)(?:\*\*)?[:\s—-]+([^\n]{20,420})",
        md,
        re.IGNORECASE,
    )
    if tip_match:
        tip = clean_text(f"{tip_match.group(1)}: {tip_match.group(2)}")[:450]
    return terms, tip


def split_long_markdown(title: str, section_code: Optional[str], md: str, max_words: int = 2400,
                        page_start: Optional[int] = None, page_end: Optional[int] = None) -> List[ExtractedSection]:
    md = clean_text(md)
    wc = word_count(md)
    if wc < 12:
        return []
    if wc <= max_words:
        terms, tip = extract_key_terms_and_tips(md)
        return [ExtractedSection(section_code, title[:220], 2, md, terms, tip, page_start, page_end)]

    # Split cleanly along paragraph boundaries into comfortable 1,400-2,200 word parts
    paras = [p.strip() for p in md.split("\n\n") if p.strip()]
    parts: List[str] = []
    cur: List[str] = []
    cur_wc = 0
    target_words = 1650
    for p in paras:
        pwc = word_count(p)
        if cur and cur_wc + pwc > target_words:
            parts.append("\n\n".join(cur))
            cur = [p]
            cur_wc = pwc
        else:
            cur.append(p)
            cur_wc += pwc
    if cur:
        if len(parts) > 0 and cur_wc < 180:
            parts[-1] = parts[-1] + "\n\n" + "\n\n".join(cur)
        else:
            parts.append("\n\n".join(cur))

    out: List[ExtractedSection] = []
    for idx, part_md in enumerate(parts, 1):
        suffix = f" (Part {idx}/{len(parts)})" if len(parts) > 1 else ""
        sec_title = f"{title[:195]}{suffix}"
        terms, tip = extract_key_terms_and_tips(part_md)
        out.append(ExtractedSection(section_code, sec_title, 2, part_md, terms, tip, page_start, page_end))
    return out


# ===================================================================
# 1. HTML -> Markdown Converter & Native EPUB Extractor
# ===================================================================

def html_table_to_md(table: Tag) -> str:
    rows = []
    for tr in table.find_all("tr"):
        cells = []
        for cell in tr.find_all(["th", "td"]):
            txt = re.sub(r"\s+", " ", cell.get_text(" ", strip=True)).replace("|", "\\|")
            cells.append(txt)
        if cells:
            rows.append(cells)
    if not rows:
        return ""
    col_n = max(len(r) for r in rows)
    norm = [r + [""] * (col_n - len(r)) for r in rows]
    lines = [
        "| " + " | ".join(norm[0]) + " |",
        "| " + " | ".join(["---"] * col_n) + " |",
    ]
    for r in norm[1:]:
        lines.append("| " + " | ".join(r) + " |")
    return "\n".join(lines)


def inline_md(node: Tag | NavigableString) -> str:
    if isinstance(node, NavigableString):
        return str(node)
    if not isinstance(node, Tag):
        return ""
    name = (node.name or "").lower()
    if name in ("script", "style", "svg", "img"):
        return ""
    if name == "br":
        return "\n"
    inner = "".join(inline_md(c) for c in node.children)
    if name in ("strong", "b"):
        s = inner.strip()
        return f" **{s}** " if s else ""
    if name in ("em", "i"):
        s = inner.strip()
        return f" *{s}* " if s else ""
    if name == "code":
        s = inner.strip()
        return f"`{s}`" if s else ""
    return inner


def block_to_md(soup_body: Tag) -> str:
    lines: List[str] = []

    def walk(el: Tag):
        for child in el.children:
            if isinstance(child, NavigableString):
                t = str(child).strip()
                if t:
                    lines.append(t)
                continue
            if not isinstance(child, Tag):
                continue
            tag = (child.name or "").lower()
            if tag in ("script", "style", "img", "svg", "nav"):
                continue
            if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
                lvl = int(tag[1])
                txt = re.sub(r"\s+", " ", child.get_text(" ", strip=True))
                if txt:
                    lines.append(f"\n{'#' * lvl} {txt}\n")
            elif tag == "p":
                txt = re.sub(r"[ \t]+", " ", inline_md(child)).strip()
                if txt:
                    lines.append(txt + "\n")
            elif tag in ("ul", "ol"):
                idx = 1
                for li in child.find_all("li", recursive=False):
                    txt = re.sub(r"\s+", " ", inline_md(li)).strip()
                    if txt:
                        prefix = f"{idx}." if tag == "ol" else "-"
                        lines.append(f"{prefix} {txt}")
                        idx += 1
                lines.append("")
            elif tag == "table":
                tmd = html_table_to_md(child)
                if tmd:
                    lines.append("\n" + tmd + "\n")
            elif tag == "blockquote":
                txt = re.sub(r"\s+", " ", child.get_text(" ", strip=True))
                if txt:
                    lines.append(f"> {txt}\n")
            elif tag == "pre":
                txt = child.get_text("\n", strip=True)
                if txt:
                    lines.append(f"```\n{txt}\n```\n")
            else:
                # Recurse for div/section/article/aside/span
                walk(child)

    walk(soup_body)
    return clean_text("\n".join(lines))


def extract_epub_book(
    cert_slug: str,
    epub_path: str,
    title: str,
    author: str,
    edition: str,
    is_primary: bool,
    sort_order: int,
) -> Optional[ExtractedBook]:
    if not epub_path or not os.path.exists(epub_path) or not zipfile.is_zipfile(epub_path):
        print(f"[WARN] Skipping invalid/non-zip EPUB: {epub_path}", file=sys.stderr, flush=True)
        return None
    book = ExtractedBook(
        cert_slug=cert_slug,
        title=title,
        author=author,
        edition=edition,
        source_file=os.path.relpath(epub_path, ROOT_DIR),
        is_primary=is_primary,
        sort_order=sort_order,
    )
    try:
        z = zipfile.ZipFile(epub_path, "r")
    except Exception as exc:
        print(f"[WARN] Failed opening EPUB {epub_path}: {exc}", file=sys.stderr, flush=True)
        return None
    with z:
        container_xml = z.read("META-INF/container.xml")
        c_root = ET.fromstring(container_xml)
        opf_path = None
        for elem in c_root.iter():
            if elem.tag.endswith("rootfile"):
                opf_path = elem.attrib.get("full-path")
                break
        if not opf_path:
            return book
        opf_dir = posixpath.dirname(opf_path)
        opf_root = ET.fromstring(z.read(opf_path))

        manifest: Dict[str, str] = {}
        spine_ids: List[str] = []
        ncx_href: Optional[str] = None
        for elem in opf_root.iter():
            if elem.tag.endswith("item") and "id" in elem.attrib and "href" in elem.attrib:
                href = elem.attrib["href"]
                full_href = posixpath.normpath(posixpath.join(opf_dir, href)) if opf_dir else href
                manifest[elem.attrib["id"]] = full_href
                if elem.attrib.get("media-type") == "application/x-dtbncx+xml" or href.endswith(".ncx"):
                    ncx_href = full_href
            elif elem.tag.endswith("itemref") and "idref" in elem.attrib:
                spine_ids.append(elem.attrib["idref"])

        # Map file -> TOC label from NCX
        toc_labels: Dict[str, str] = {}
        if ncx_href and ncx_href in z.namelist():
            try:
                ncx_root = ET.fromstring(z.read(ncx_href))
                ncx_dir = posixpath.dirname(ncx_href)
                for np in ncx_root.iter():
                    if np.tag.endswith("navPoint"):
                        label_el = next((x for x in np.iter() if x.tag.endswith("text")), None)
                        content_el = next((x for x in np.iter() if x.tag.endswith("content")), None)
                        if label_el is not None and content_el is not None and label_el.text:
                            src = content_el.attrib.get("src", "").split("#")[0]
                            full_src = posixpath.normpath(posixpath.join(ncx_dir, src)) if ncx_dir else src
                            if full_src not in toc_labels:
                                toc_labels[full_src] = re.sub(r"\s+", " ", label_el.text).strip()
            except Exception:
                pass

        ch_num = 0
        for idref in spine_ids:
            href = manifest.get(idref)
            if not href or href not in z.namelist():
                continue
            if not href.lower().endswith((".html", ".xhtml", ".htm")):
                continue
            raw_html = z.read(href).decode("utf-8", errors="ignore")
            soup = BeautifulSoup(raw_html, "html.parser")
            body = soup.body or soup

            # Determine title from h1/h2 or NCX
            first_h = body.find(["h1", "h2"])
            raw_title = (
                re.sub(r"\s+", " ", first_h.get_text(" ", strip=True))
                if first_h
                else toc_labels.get(href, os.path.basename(href))
            )
            if not raw_title:
                raw_title = toc_labels.get(href, f"Chapter {ch_num + 1}")

            md = block_to_md(body)
            wc = word_count(md)
            low_title = raw_title.lower()
            low_href = href.lower()
            if wc < 120:
                continue
            if any(k in low_title or k in low_href for k in FRONT_MATTER_KEYWORDS) and wc < 3500:
                continue

            ch_num += 1
            dom_match = re.search(r"domain\s+(\d+)", raw_title + " " + md[:400], re.IGNORECASE)
            domain_num = int(dom_match.group(1)) if dom_match else None

            # Split chapter markdown on ## / ### headings into subchapters
            sections: List[ExtractedSection] = []
            sec_blocks = re.split(r"(?m)^(#{1,3}\s+.+)$", md)
            cur_sec_title = raw_title
            cur_buf: List[str] = []
            sec_idx = 0

            def flush_sec(t_str: str, buf: List[str]):
                nonlocal sec_idx
                body_md = clean_text("\n".join(buf))
                if word_count(body_md) < 35:
                    return
                sec_idx += 1
                code_m = re.match(r"^(\d+(?:\.\d+)+)\s+(.*)$", t_str)
                sec_code = code_m.group(1) if code_m else f"{ch_num}.{sec_idx}"
                sec_title = code_m.group(2) if code_m else t_str
                sections.extend(split_long_markdown(sec_title, sec_code, body_md))

            for chunk in sec_blocks:
                hm = re.match(r"^(#{1,3})\s+(.+)$", chunk.strip())
                if hm and "\n" not in chunk.strip():
                    flush_sec(cur_sec_title, cur_buf)
                    cur_sec_title = hm.group(2).strip()
                    cur_buf = []
                else:
                    cur_buf.append(chunk)
            flush_sec(cur_sec_title, cur_buf)

            if not sections:
                sections = split_long_markdown(raw_title, f"{ch_num}.1", md)

            if not sections:
                continue

            total_ch_words = sum(word_count(s.content_markdown) for s in sections)
            first_para = next((p for p in md.split("\n\n") if not p.startswith("#") and word_count(p) > 15), "")
            chapter = ExtractedChapter(
                chapter_number=ch_num,
                title=raw_title[:240],
                domain_number=domain_num,
                part_label=f"Chapter {ch_num}",
                summary=first_para[:400] if first_para else None,
                word_count=total_ch_words,
                est_read_minutes=max(5, round(total_ch_words / 180)),
                sections=sections,
            )
            book.chapters.append(chapter)

    return book


# ===================================================================
# 2. CISA 28th Edition Pre-Extracted Official Review Manual Parser
# ===================================================================

CISA_DOMAIN_TITLES = {
    1: "Chapter 1: Information System Auditing Process",
    2: "Chapter 2: Governance and Management of IT",
    3: "Chapter 3: Information Systems Acquisition, Development and Implementation",
    4: "Chapter 4: Information Systems Operations and Business Resilience",
    5: "Chapter 5: Protection of Information Assets",
}


def clean_pdf_lines(raw_text: str) -> str:
    """Normalizes PDF line wraps into smooth paragraphs for reading & Read Aloud."""
    raw_text = clean_text(raw_text)
    out_lines: List[str] = []
    para_buf: List[str] = []

    def flush_para():
        if para_buf:
            out_lines.append(" ".join(para_buf))
            para_buf.clear()

    for line in raw_text.split("\n"):
        s = re.sub(r"\s+", " ", line).strip()
        if not s or STOP_HEADERS_RE.match(s):
            flush_para()
            continue
        # Fix common PDF spacing before punctuation: "word ." -> "word."
        s = re.sub(r"\s+([.,;:?!])", r"\1", s)
        # Bullet line
        if s.startswith(("•", "▪", "- ", "* ")):
            flush_para()
            out_lines.append("- " + s.lstrip("•▪-* ").strip())
            continue
        # Numbered section heading like "1.1 Title" or "1.1.2 Title"
        if re.match(r"^\d+\.\d+(?:\.\d+)?\s+[A-Z][A-Za-z0-9 ,/&()\-]{4,90}$", s):
            flush_para()
            lvl = "###" if s.count(".") >= 2 else "##"
            out_lines.append(f"\n{lvl} {s}\n")
            continue
        # Part A / Part B heading
        if re.match(r"^Part\s+[AB]\s*:\s+[A-Z].{3,80}$", s, re.IGNORECASE):
            flush_para()
            out_lines.append(f"\n## {s}\n")
            continue
        para_buf.append(s)
        if s.endswith((".", "?", "!", ":")) and len(" ".join(para_buf)) > 260:
            flush_para()
    flush_para()
    return clean_text("\n\n".join(out_lines))


def extract_cisa_28th_book() -> Optional[ExtractedBook]:
    base = os.path.join(ROOT_DIR, "scripts", "cisa_28th_extracted")
    if not os.path.isdir(base):
        return None
    book = ExtractedBook(
        cert_slug="cisa",
        title="CISA Official Review Manual, 28th Edition (2024)",
        author="ISACA",
        edition="28th Edition (2024)",
        source_file="my_documents/cisa/CISA Official Review Manual, 28th Edition 2024 by ISACA .pdf",
        is_primary=True,
        sort_order=1,
    )
    for dom in range(1, 6):
        p = os.path.join(base, f"domain_{dom}.txt")
        if not os.path.exists(p):
            continue
        with open(p, encoding="utf-8", errors="ignore") as f:
            raw = f.read()
        md = clean_pdf_lines(raw)
        # Split on top-level subchapter headers (## 1.1 ... or ## Part A/B ...)
        blocks = re.split(r"(?m)^(##\s+.+)$", md)
        sections: List[ExtractedSection] = []
        cur_title = f"Domain {dom} Overview & Exam Blueprint"
        cur_code: Optional[str] = f"{dom}.0"
        cur_buf: List[str] = []

        def flush_cisa():
            body = clean_text("\n\n".join(cur_buf))
            if word_count(body) < 40:
                return
            sections.extend(split_long_markdown(cur_title, cur_code, body))

        for blk in blocks:
            hm = re.match(r"^##\s+(.+)$", blk.strip())
            if hm and "\n" not in blk.strip():
                flush_cisa()
                ht = hm.group(1).strip()
                cm = re.match(r"^(\d+\.\d+(?:\.\d+)?)\s+(.*)$", ht)
                cur_code = cm.group(1) if cm else f"{dom}.{len(sections) + 1}"
                cur_title = cm.group(2) if cm else ht
                cur_buf = []
            else:
                cur_buf.append(blk)
        flush_cisa()

        if not sections:
            sections = split_long_markdown(CISA_DOMAIN_TITLES[dom], f"{dom}.1", md)
        ch_wc = sum(word_count(s.content_markdown) for s in sections)
        book.chapters.append(
            ExtractedChapter(
                chapter_number=dom,
                title=CISA_DOMAIN_TITLES[dom],
                domain_number=dom,
                part_label=f"Domain {dom}",
                summary=f"Official ISACA CISA 28th Edition review manual covering {CISA_DOMAIN_TITLES[dom]}.",
                word_count=ch_wc,
                est_read_minutes=max(10, round(ch_wc / 180)),
                sections=sections,
            )
        )
    return book if book.chapters else None


# ===================================================================
# 3. Generic PDF Textbook Extractor (Outline-aware + Heading Heuristic)
# ===================================================================

def flatten_pdf_outline(reader: PdfReader, outline, level: int = 0) -> List[Tuple[int, str, int]]:
    items: List[Tuple[int, str, int]] = []
    if not outline:
        return items
    for entry in outline:
        if isinstance(entry, list):
            items.extend(flatten_pdf_outline(reader, entry, level + 1))
        else:
            try:
                title = getattr(entry, "title", None) or str(entry.get("/Title", ""))
                page_idx = reader.get_destination_page_number(entry)
                if title and page_idx is not None and page_idx >= 0:
                    items.append((level, re.sub(r"\s+", " ", str(title)).strip(), int(page_idx)))
            except Exception:
                continue
    return items


def extract_pdf_book(
    cert_slug: str,
    pdf_paths: List[str],
    title: str,
    author: str,
    edition: str,
    is_primary: bool,
    sort_order: int,
    max_pages_per_pdf: int = 1450,
) -> Optional[ExtractedBook]:
    book = ExtractedBook(
        cert_slug=cert_slug,
        title=title,
        author=author,
        edition=edition,
        source_file=", ".join(os.path.relpath(p, ROOT_DIR) for p in pdf_paths),
        is_primary=is_primary,
        sort_order=sort_order,
    )
    ch_counter = 0

    for pdf_path in pdf_paths:
        if not os.path.exists(pdf_path):
            continue
        try:
            reader = PdfReader(pdf_path)
        except Exception as exc:
            print(f"[WARN] Could not read PDF {pdf_path}: {exc}", file=sys.stderr)
            continue

        total_pages = min(len(reader.pages), max_pages_per_pdf)
        if total_pages == 0:
            continue

        # Try PDF bookmark outline first
        outline_items = []
        try:
            outline_items = flatten_pdf_outline(reader, reader.outline)
        except Exception:
            outline_items = []

        # Keep top-level (level 0 or 1) chapters from outline that have meaningful spans
        top_level = [it for it in outline_items if it[0] == 0]
        if len(top_level) < 3:
            top_level = [it for it in outline_items if it[0] <= 1]

        # Extract page texts once
        page_texts: List[str] = []
        for idx in range(total_pages):
            try:
                txt = reader.pages[idx].extract_text() or ""
            except Exception:
                txt = ""
            page_texts.append(txt)

        total_chars = sum(len(t) for t in page_texts)
        if total_chars < 600:
            print(f"[WARN] Skipped scanned/low-text PDF ({total_chars} chars): {os.path.basename(pdf_path)}", file=sys.stderr)
            continue

        # Filter meaningful top-level outline entries
        usable_chapters: List[Tuple[str, int, int]] = []
        if len(top_level) >= 3:
            filtered_tl = [
                it for it in top_level
                if not any(k in it[1].lower() for k in ("cover", "copyright", "contents", "preface", "dedication", "about the"))
            ]
            if len(filtered_tl) >= 2:
                # Deduplicate identical page starts keeping first
                dedup_tl: List[Tuple[str, int]] = []
                seen_p = set()
                for _, t, pno in sorted(filtered_tl, key=lambda x: x[2]):
                    if pno not in seen_p and pno < total_pages:
                        seen_p.add(pno)
                        dedup_tl.append((t, pno))
                for i, (t, start_p) in enumerate(dedup_tl):
                    end_p = (dedup_tl[i + 1][1] - 1) if i + 1 < len(dedup_tl) else (total_pages - 1)
                    if end_p >= start_p:
                        usable_chapters.append((t, start_p, end_p))

        # Fallback: detect chapter headings or group logically by pages (~14 pages/chapter)
        if not usable_chapters:
            detected: List[Tuple[str, int]] = []
            ch_re = re.compile(
                r"^(?:Chapter|CHAPTER|Domain|DOMAIN|Module|MODULE|Unit|UNIT|Part|PART|Section|SECTION|Article|ARTICLE)\s+(?:[IVXLCDM]+|\d+)[\s:\-–—]+.{3,90}$"
            )
            for p_idx, p_txt in enumerate(page_texts):
                for line in p_txt.splitlines()[:10]:
                    s = re.sub(r"\s+", " ", line).strip()
                    if ch_re.match(s) and not any(x in s.lower() for x in ("table of contents", "....")):
                        if not detected or p_idx - detected[-1][1] >= 2:
                            detected.append((s, p_idx))
                        break
            if len(detected) >= 2:
                for i, (t, sp) in enumerate(detected):
                    ep = (detected[i + 1][1] - 1) if i + 1 < len(detected) else (total_pages - 1)
                    usable_chapters.append((t, sp, ep))
            else:
                base_name = os.path.splitext(os.path.basename(pdf_path))[0].replace("_", " ").strip()
                step = max(8, min(18, total_pages // 4 or total_pages))
                for sp in range(0, total_pages, step):
                    ep = min(total_pages - 1, sp + step - 1)
                    label = f"{base_name[:60]} — Pages {sp + 1}–{ep + 1}" if total_pages > step else base_name[:80]
                    usable_chapters.append((label, sp, ep))

        # Merge adjacent tiny chapters whenever outline OR heading regex produced > 35 micro-chapters
        if len(usable_chapters) > 35:
            merged: List[Tuple[str, int, int]] = []
            for t, sp, ep in usable_chapters:
                if not merged or (merged[-1][2] - merged[-1][1] + 1) >= 16:
                    merged.append((t, sp, ep))
                else:
                    pt, psp, _ = merged[-1]
                    merged[-1] = (pt, psp, ep)
                    outline_items.append((1, t, sp))
            usable_chapters = merged

        # Build chapters + subchapters
        sub_outline_by_page = [it for it in outline_items if it[0] >= 1]
        for ch_title, start_p, end_p in usable_chapters:
            raw_ch_pages = page_texts[start_p : end_p + 1]
            ch_md = clean_pdf_lines("\n\n".join(raw_ch_pages))
            if word_count(ch_md) < 80:
                continue
            ch_counter += 1
            dom_m = re.search(r"domain\s+(\d+)", ch_title + " " + ch_md[:300], re.IGNORECASE)
            dom_num = int(dom_m.group(1)) if dom_m else None

            sections: List[ExtractedSection] = []
            # Check if outline has sub-entries inside [start_p, end_p]
            subs = [it for it in sub_outline_by_page if start_p <= it[2] <= end_p]
            dedup_subs: List[Tuple[str, int]] = []
            seen_sp = set()
            for _, st, spno in sorted(subs, key=lambda x: x[2]):
                if spno not in seen_sp:
                    seen_sp.add(spno)
                    dedup_subs.append((st, spno))

            if len(dedup_subs) >= 2:
                for j, (st, ssp) in enumerate(dedup_subs):
                    sep = (dedup_subs[j + 1][1] - 1) if j + 1 < len(dedup_subs) else end_p
                    sub_md = clean_pdf_lines("\n\n".join(page_texts[ssp : max(ssp, sep) + 1]))
                    if word_count(sub_md) >= 35:
                        sections.extend(split_long_markdown(st, f"{ch_counter}.{j + 1}", sub_md, page_start=ssp + 1, page_end=sep + 1))
            else:
                # Split on detected ## headings or page groups (~4 pages/subchapter)
                heading_blocks = re.split(r"(?m)^(##\s+.+)$", ch_md)
                if sum(1 for b in heading_blocks if b.strip().startswith("## ")) >= 2:
                    cur_t = f"{ch_title[:90]} — Overview"
                    cur_buf: List[str] = []
                    s_idx = 0
                    for blk in heading_blocks:
                        hm = re.match(r"^##\s+(.+)$", blk.strip())
                        if hm and "\n" not in blk.strip():
                            body = clean_text("\n\n".join(cur_buf))
                            if word_count(body) >= 40:
                                s_idx += 1
                                sections.extend(split_long_markdown(cur_t, f"{ch_counter}.{s_idx}", body, page_start=start_p + 1, page_end=end_p + 1))
                            cur_t = hm.group(1).strip()
                            cur_buf = []
                        else:
                            cur_buf.append(blk)
                    body = clean_text("\n\n".join(cur_buf))
                    if word_count(body) >= 40:
                        s_idx += 1
                        sections.extend(split_long_markdown(cur_t, f"{ch_counter}.{s_idx}", body, page_start=start_p + 1, page_end=end_p + 1))
                else:
                    sections = split_long_markdown(ch_title, f"{ch_counter}.1", ch_md, page_start=start_p + 1, page_end=end_p + 1)

            if not sections:
                continue
            ch_wc = sum(word_count(s.content_markdown) for s in sections)
            book.chapters.append(
                ExtractedChapter(
                    chapter_number=ch_counter,
                    title=ch_title[:240],
                    domain_number=dom_num,
                    part_label=f"Chapter {ch_counter}",
                    page_start=start_p + 1,
                    page_end=end_p + 1,
                    word_count=ch_wc,
                    est_read_minutes=max(5, round(ch_wc / 180)),
                    sections=sections,
                )
            )

    return book if book.chapters else None


def extract_markdown_folder_book(
    cert_slug: str,
    folder_glob: str,
    title: str,
    author: str,
    edition: str,
    is_primary: bool,
    sort_order: int,
) -> Optional[ExtractedBook]:
    files = sorted(glob.glob(os.path.join(ROOT_DIR, folder_glob), recursive=True))
    files = [f for f in files if os.path.basename(f).lower() not in ("readme.md", "license")]
    if not files:
        return None
    book = ExtractedBook(
        cert_slug=cert_slug,
        title=title,
        author=author,
        edition=edition,
        source_file=folder_glob,
        is_primary=is_primary,
        sort_order=sort_order,
    )
    grouped: Dict[str, List[Tuple[str, str]]] = {}
    for fp in files:
        with open(fp, encoding="utf-8", errors="ignore") as f:
            txt = clean_text(f.read())
        if word_count(txt) < 20:
            continue
        parent = os.path.basename(os.path.dirname(fp))
        name = os.path.splitext(os.path.basename(fp))[0]
        grouped.setdefault(parent, []).append((name, txt))

    for ch_idx, (folder_name, items) in enumerate(grouped.items(), 1):
        sections: List[ExtractedSection] = []
        for s_idx, (name, txt) in enumerate(items, 1):
            sections.extend(split_long_markdown(name, f"{ch_idx}.{s_idx}", txt))
        if not sections:
            continue
        ch_wc = sum(word_count(s.content_markdown) for s in sections)
        book.chapters.append(
            ExtractedChapter(
                chapter_number=ch_idx,
                title=folder_name,
                part_label=f"Module {ch_idx}",
                word_count=ch_wc,
                est_read_minutes=max(5, round(ch_wc / 180)),
                sections=sections,
            )
        )
    return book if book.chapters else None


def find_one(pattern: str) -> Optional[str]:
    matches = sorted(glob.glob(os.path.join(ROOT_DIR, pattern), recursive=True))
    return matches[0] if matches else None


def find_all(pattern: str) -> List[str]:
    return sorted(glob.glob(os.path.join(ROOT_DIR, pattern), recursive=True))


def find_unicode_pdf(substr: str) -> Optional[str]:
    """Match PDF filenames containing stylized Unicode math bold characters via NFKD normalization."""
    needle = unicodedata.normalize("NFKD", substr).lower()
    base_dir = os.path.join(ROOT_DIR, "my_documents")
    for root, _, files in os.walk(base_dir):
        for fn in sorted(files):
            if fn.lower().endswith(".pdf") and needle in unicodedata.normalize("NFKD", fn).lower():
                return os.path.join(root, fn)
    return None


def synthesize_fallback_book_from_db(cert_slug: str) -> Optional[ExtractedBook]:
    """Fallback for any cert whose local PDF/EPUB is scanned/unreadable: builds structured chapters from knowledge_units & synthesized_lessons."""
    try:
        conn = get_pg_connection()
        cur = conn.cursor()
        cert_code_map = {
            "cisa": "CISA", "cissp": "CISSP", "cism": "CISM", "crisc": "CRISC",
            "ccsp": "CCSP", "cgeit": "CGEIT", "cysa": "CYSA", "comptia-a-plus": "COMPTIA",
            "comptia-network-plus": "NETWORK", "comptia-security-plus": "SECURITY",
            "isc2-cc": "CC", "aws-csaa": "AWS", "nist-grc": "NIST", "grc": "GRC",
            "fifa-agent": "FIFA", "giac-security-leadership": "GSLC",
        }
        code = cert_code_map.get(cert_slug, cert_slug.upper())
        cur.execute(
            """
            SELECT COALESCE(domain_number, 1) AS dn, title, COALESCE(NULLIF(content,''), summary), COALESCE(source_doc,'Study Corpus')
            FROM public.knowledge_units
            WHERE UPPER(cert_code) = UPPER(%s)
            ORDER BY dn, created_at
            LIMIT 250;
            """,
            (code,),
        )
        rows = cur.fetchall()
        conn.close()
        if not rows:
            return None
        by_dom: Dict[int, List[Tuple[str, str, str]]] = {}
        for dn, t, body, src in rows:
            by_dom.setdefault(int(dn or 1), []).append((t or "Topic", body or "", src or "Corpus"))
        book = ExtractedBook(
            cert_slug=cert_slug,
            title=f"{code} Comprehensive Study Compendium",
            author="AxonPass Curated Library",
            edition="2026 Edition",
            source_file="public.knowledge_units",
            is_primary=True,
            sort_order=1,
        )
        for ch_idx, (dn, items) in enumerate(sorted(by_dom.items()), 1):
            sections: List[ExtractedSection] = []
            # Group ~6 knowledge units per readable subchapter
            for g_i in range(0, len(items), 6):
                grp = items[g_i : g_i + 6]
                sec_title = grp[0][0][:120]
                md = "\n\n".join(f"### {t}\n\n{clean_text(b)}" for t, b, _ in grp if b)
                sections.extend(split_long_markdown(sec_title, f"{dn}.{(g_i // 6) + 1}", md))
            if sections:
                wc = sum(word_count(s.content_markdown) for s in sections)
                book.chapters.append(
                    ExtractedChapter(
                        chapter_number=ch_idx,
                        title=f"Domain {dn}: Core Knowledge & Exam Concepts",
                        domain_number=dn,
                        part_label=f"Domain {dn}",
                        word_count=wc,
                        est_read_minutes=max(8, round(wc / 180)),
                        sections=sections,
                    )
                )
        return book if book.chapters else None
    except Exception as exc:
        print(f"[WARN] Fallback DB synthesis failed for {cert_slug}: {exc}", file=sys.stderr)
        return None


def build_all_books(target_cert: str = "all") -> List[ExtractedBook]:
    books: List[ExtractedBook] = []

    def want(slug: str) -> bool:
        return target_cert == "all" or target_cert == slug

    def add_book(b: Optional[ExtractedBook]):
        if b and b.chapters:
            books.append(b)

    # 1. CISA (28th Ed Official + Hemang Doshi Study Guide)
    if want("cisa"):
        print("[EXTRACT] cisa...", flush=True)
        add_book(extract_cisa_28th_book())
        doshi = find_one("my_documents/CISA*Hemang Doshi.pdf")
        if doshi:
            add_book(extract_pdf_book("cisa", [doshi], "CISA Exam Study Guide — Hemang Doshi", "Hemang Doshi", "2nd Edition", False, 2))

    # 2. CISSP (OSG 10th Ed EPUB + CISSP For Dummies EPUB)
    if want("cissp"):
        print("[EXTRACT] cissp...", flush=True)
        osg = find_one("my_documents/ISC2 CISSP*10th Edition.epub")
        if osg:
            add_book(extract_epub_book("cissp", osg, "ISC2 CISSP Official Study Guide (10th Edition)", "Mike Chapple, James M. Stewart, Darril Gibson", "10th Edition (2024)", True, 1))
        dum = find_one("my_documents/CISSP For Dummies*.epub")
        if dum:
            add_book(extract_epub_book("cissp", dum, "CISSP For Dummies", "Peter H. Gregory", "4th Edition", False, 2))

    # 3. CISM (Complete Guide PDF + Original CISM PDF + 16th Ed Exam Topics + Practice Exams EPUB)
    if want("cism"):
        print("[EXTRACT] cism...", flush=True)
        comp = find_one("my_documents/Complete Guide to CISM Certification.pdf")
        orig = find_one("my_documents/Origanl CISM.pdf")
        top16 = find_one("my_documents/CISM - 16th Edition Exam Topics.pdf")
        cert_pdf = find_one("my_documents/ISACA_CISM_Certification_Certified.pdf")
        plist = [p for p in [comp, orig, top16, cert_pdf] if p]
        if plist:
            add_book(extract_pdf_book("cism", plist, "Complete Guide to CISM & 16th Edition Review", "ISACA / CISM Review", "16th Edition Blueprint", True, 1))
        prac_epub = find_one("my_documents/CISM Certified Information Security Manager Practice Exams.epub")
        if prac_epub:
            add_book(extract_epub_book("cism", prac_epub, "CISM Certified Information Security Manager Study & Practice", "CISM Practice Compendium", "2nd Edition", False, 2))

    # 4. CRISC (CRISC Review Manual + Risk IT Framework 2nd Ed)
    if want("crisc"):
        print("[EXTRACT] crisc...", flush=True)
        cr = find_one("my_documents/CRISC Review Manual.pdf")
        if cr:
            add_book(extract_pdf_book("crisc", [cr], "ISACA CRISC Review Manual", "ISACA", "7th Edition", True, 1))
        ri = find_one("my_documents/Risk-IT-Framework-2nd-Edition_fmk_Eng_0620.pdf")
        if ri:
            add_book(extract_pdf_book("crisc", [ri], "ISACA Risk IT Framework (2nd Edition)", "ISACA", "2nd Edition", False, 2))

    # 5. CCSP (Official Practice & Domain Review)
    if want("ccsp"):
        print("[EXTRACT] ccsp...", flush=True)
        ccsp_pdf = find_one("my_documents/ISC2_CCSP_Official_Practice_Test_2nd_Ed_2020.pdf")
        if ccsp_pdf:
            add_book(extract_pdf_book("ccsp", [ccsp_pdf], "ISC2 CCSP Official Practice & Domain Mastery Guide", "Mike Chapple, David Seidl", "2nd Edition", True, 1))

    # 6. CGEIT (CGEIT Guide + COBIT 2019 Framework + Data Governance)
    if want("cgeit"):
        print("[EXTRACT] cgeit...", flush=True)
        cg = find_one("my_documents/CGEIT-Certified-in-the-Governance-of-Enterprise-IT-9usana.pdf")
        if cg:
            add_book(extract_pdf_book("cgeit", [cg], "CGEIT — Certified in the Governance of Enterprise IT Review", "ISACA CGEIT", "8th Edition", True, 1))
        cob = find_one("my_documents/COBIT_2019_Framework_Introduction_and_Methodology_res_eng_1118.pdf")
        dg = find_one("my_documents/Rethinking-Data-Governance-and-Data-Management_whp_Eng_0220.pdf")
        comp_pdfs = [p for p in [cob, dg] if p]
        if comp_pdfs:
            add_book(extract_pdf_book("cgeit", comp_pdfs, "COBIT 2019 Framework & Enterprise Data Governance", "ISACA", "2019 / 2020", False, 2))

    # 7. CompTIA CySA+ (Mike Chapple CS0-003 EPUB + Incident Management Guide)
    if want("cysa"):
        print("[EXTRACT] cysa...", flush=True)
        cy = find_one("my_documents/CompTIA CySA+*Mike Chapple*.epub")
        if cy:
            add_book(extract_epub_book("cysa", cy, "CompTIA CySA+ Study & Practice Guide (Exam CS0-003)", "Mike Chapple", "3rd Edition", True, 1))
        inc = find_one("my_documents/cybersecurity-incident-management-guide-EN.pdf")
        if inc:
            add_book(extract_pdf_book("cysa", [inc], "Cybersecurity Incident Management & SOC Playbook", "ENISA / Incident Response", "Guide", False, 2))

    # 8. CompTIA A+
    if want("comptia-a-plus"):
        print("[EXTRACT] comptia-a-plus...", flush=True)
        ap = find_one("my_documents/*CompTIA A+*.pdf")
        if ap:
            add_book(extract_pdf_book("comptia-a-plus", [ap], "CompTIA A+ CertMike: Prepare, Practice, Pass (220-1101)", "Mike Chapple", "Core 1 & Core 2", True, 1))

    # 9. CompTIA Network+
    if want("comptia-network-plus"):
        print("[EXTRACT] comptia-network-plus...", flush=True)
        np_pdf = find_one("my_documents/*CompTIA Network+*.pdf")
        osi = find_one("my_documents/OSI Layers.pdf")
        plist = [p for p in [np_pdf, osi] if p]
        if plist:
            add_book(extract_pdf_book("comptia-network-plus", plist, "CompTIA Network+ CertMike: Prepare, Practice, Pass (N10-008)", "Mike Chapple", "N10-008 / N10-009", True, 1))

    # 10. CompTIA Security+
    if want("comptia-security-plus"):
        print("[EXTRACT] comptia-security-plus...", flush=True)
        sp = find_one("my_documents/isc2-cc/**/*Security+*.pdf")
        if sp:
            add_book(extract_pdf_book("comptia-security-plus", [sp], "CompTIA Security+ Complete Study Notes & Blueprint Guide", "Security+ Compendium", "SY0-701", True, 1))

    # 11. ISC2 CC
    if want("isc2-cc"):
        print("[EXTRACT] isc2-cc...", flush=True)
        cc_chs = sorted(find_all("my_documents/isc2-cc/**/Chapter*.pdf"))
        cc_course = find_one("my_documents/isc2-cc/**/*self-paced*.pdf")
        cc_prep = find_one("my_documents/isc2-cc/**/Preparation for ISC2 CC.pdf")
        plist = cc_chs + [p for p in [cc_course, cc_prep] if p]
        if plist:
            add_book(extract_pdf_book("isc2-cc", plist, "ISC2 Certified in Cybersecurity (CC) Official Chapters & Self-Paced Guide", "ISC2", "Official Curriculum", True, 1))

    # 12. AWS SAA-C03
    if want("aws-csaa"):
        print("[EXTRACT] aws-csaa...", flush=True)
        wa = find_one("my_documents/aws-csaa/**/wellarchitected-framework.pdf")
        caf = find_one("my_documents/aws-csaa/**/overview-aws-cloud-adoption-framework.pdf")
        dr = find_one("my_documents/aws-csaa/**/disaster-recovery-of-on-premises-applications-to-aws.pdf")
        eg = find_one("my_documents/aws-csaa/**/AWS-Certified-Solutions-Architect-Associate_Exam-Guide.pdf")
        plist = [p for p in [eg, wa, dr, caf] if p]
        if plist:
            add_book(extract_pdf_book("aws-csaa", plist, "AWS Well-Architected Framework & SAA-C03 Official Guide", "Amazon Web Services", "SAA-C03", True, 1))
        add_book(extract_markdown_folder_book("aws-csaa", "my_documents/aws-csaa/**/*.md", "AWS SAA-C03 Core Compute, Storage & Scaling Notes", "AWS Study Guide", "SAA-C03", False, 2))

    # 13. NIST GRC
    if want("nist-grc"):
        print("[EXTRACT] nist-grc...", flush=True)
        n1 = find_one("my_documents/nist-grc/nist1.pdf")
        nai = find_one("my_documents/nist-grc/nist ai 1.pdf")
        nrsk = find_one("my_documents/nist-grc/rsk1.pdf")
        ncswp = find_one("my_documents/NIST.CSWP.29.pdf")
        plist = [p for p in [n1, ncswp, nai, nrsk] if p]
        if plist:
            add_book(extract_pdf_book("nist-grc", plist, "NIST CSF 2.0, NIST AI RMF 1.0 & SP 800-37 Risk Management Framework", "NIST", "CSF 2.0 / AI RMF", True, 1))

    # 14. Enterprise GRC
    if want("grc"):
        print("[EXTRACT] grc...", flush=True)
        g1 = find_one("my_documents/nist-grc/grc1.pdf")
        g2 = find_one("my_documents/nist-grc/grc2.pdf")
        iso = find_one("my_documents/iso_guide_73*.pdf")
        cmm = find_one("my_documents/CMM_Implementation_Guide.pdf")
        plist = [p for p in [g1, g2, iso, cmm] if p]
        if plist:
            add_book(extract_pdf_book("grc", plist, "Enterprise Governance, Risk Management & Compliance (GRC) Manual", "GRC & ISO Guide 73", "Enterprise Edition", True, 1))

    # 15. FIFA Football Agent License
    if want("fifa-agent"):
        print("[EXTRACT] fifa-agent...", flush=True)
        fs = find_one("my_documents/FIFA AGENT LICENSE/20260115_Study Materials*.pdf")
        if fs:
            add_book(extract_pdf_book("fifa-agent", [fs], "FIFA Football Agent Exam Official Study Materials (January 2026)", "FIFA", "January 2026 Edition", True, 1))
        fr = find_one("my_documents/FIFA AGENT LICENSE/FIFA Football Agent Regulations_EN.pdf")
        fe = find_one("my_documents/FIFA AGENT LICENSE/20260113_FINAL CLEAN_FIFA-Football-Agent-Exam-Rules*.pdf")
        plist = [p for p in [fr, fe] if p]
        if plist:
            add_book(extract_pdf_book("fifa-agent", plist, "FIFA Football Agent Regulations & 6th Edition Exam Rules", "FIFA", "Jan 2026 Regulations", False, 2))

    # 16. GIAC Security Leadership (GSLC)
    if want("giac-security-leadership"):
        print("[EXTRACT] giac-security-leadership...", flush=True)
        gs = find_one("my_documents/GIAC (GSLC)*.pdf")
        ce = find_one("my_documents/cyber-exposure-management*.pdf")
        it = find_one("my_documents/IT Audit Manual*.pdf")
        plist = [p for p in [gs, ce, it] if p]
        if plist:
            add_book(extract_pdf_book("giac-security-leadership", plist, "GIAC Security Leadership (GSLC) & Cyber Exposure Management", "GIAC / SANS", "GSLC Gold", True, 1))

    # Guarantee 16/16 parity via DB fallback if any cert produced 0 extracted books
    all_expected = [
        "cisa", "cissp", "cism", "crisc", "ccsp", "cgeit", "cysa",
        "comptia-a-plus", "comptia-network-plus", "comptia-security-plus",
        "isc2-cc", "aws-csaa", "nist-grc", "grc", "fifa-agent", "giac-security-leadership",
    ]
    extracted_slugs = {b.cert_slug for b in books}
    for slug in all_expected:
        if want(slug) and slug not in extracted_slugs:
            print(f"[FALLBACK] Synthesizing book chapters from DB corpus for {slug}...", flush=True)
            add_book(synthesize_fallback_book_from_db(slug))

    return books


def build_extra_books(target_cert: str = "all") -> List[ExtractedBook]:
    """Extracts all remaining distinct non-duplicate instructional books in my_documents/."""
    books: List[ExtractedBook] = []

    def want(slug: str) -> bool:
        return target_cert == "all" or target_cert == slug

    def add_book(b: Optional[ExtractedBook]):
        if b and b.chapters:
            books.append(b)

    # CISA extra books (sort_order 3..10)
    if want("cisa"):
        print("[EXTRACT-EXTRA] cisa...", flush=True)
        greg = find_one("my_documents/Gregory P. CISA*2025.pdf")
        if greg:
            add_book(extract_pdf_book("cisa", [greg], "CISA Certified Information Systems Auditor Study Guide (2025 Edition)", "Peter H. Gregory", "2025 Edition", False, 3))
        cisa27 = find_one("my_documents/CISA Review Manual, 27th Edition by ISACA.epub")
        if cisa27:
            add_book(extract_epub_book("cisa", cisa27, "CISA Review Manual, 27th Edition", "ISACA", "27th Edition (EPUB)", False, 4))
        hd2 = find_one("my_documents/CISA – Certified Information Systems Auditor Study Guide by Hemang Doshi.pdf")
        if hd2:
            add_book(extract_pdf_book("cisa", [hd2], "CISA Study Guide (2nd Edition) — Hemang Doshi", "Hemang Doshi", "2nd Edition", False, 5))
        ita = find_one("my_documents/IT Auditing, Second Edition.pdf")
        if ita:
            add_book(extract_pdf_book("cisa", [ita], "IT Auditing: Using Controls to Protect Information Assets (2nd Edition)", "Chris Davis, Mike Schiller, Kevin Wheeler", "2nd Edition", False, 6))
        casc = find_one("my_documents/Cascarino R. The Complete Guide for CISA Examination Prep. 2020.pdf")
        if casc:
            add_book(extract_pdf_book("cisa", [casc], "The Complete Guide for CISA Examination Prep", "Richard E. Cascarino", "2020 Edition", False, 7))
        dom_pdfs = [
            p for p in [
                find_one("my_documents/CISA Domain 1.pdf"),
                find_one("my_documents/CISA domain 2.pdf"),
                find_one("my_documents/CISA domain 3.pdf"),
                find_one("my_documents/CISA domain 4.pdf"),
                find_one("my_documents/CISA domain 5.pdf"),
            ] if p
        ]
        if dom_pdfs:
            add_book(extract_pdf_book("cisa", dom_pdfs, "CISA 5-Domain Comprehensive Exam Preparation Volumes", "CISA Domain Study Series", "Domains 1–5", False, 8))
        itaf_pdfs = [
            p for p in [
                find_one("my_documents/ITAF-4th-Edition.pdf"),
                find_one("my_documents/IT Assurance Guide_ Using COBIT*.pdf"),
                find_one("my_documents/CISA NOTES.pdf"),
            ] if p
        ]
        if itaf_pdfs:
            add_book(extract_pdf_book("cisa", itaf_pdfs, "ISACA ITAF 4th Edition, COBIT IT Assurance Guide & CISA Study Notes", "ISACA", "ITAF 4th Ed / COBIT", False, 9))
        peter_ep = find_one("my_documents/CISA_Certified_Information_Systems_Auditor_Practice_Exams_by_Peter.epub")
        if peter_ep:
            add_book(extract_epub_book("cisa", peter_ep, "CISA Practice & Concept Explanation Guide", "Peter H. Gregory", "EPUB Edition", False, 10))

    # CISSP extra books (sort_order 3..7)
    if want("cissp"):
        print("[EXTRACT-EXTRA] cissp...", flush=True)
        shon = find_one("my_documents/security-cissp-all-in-one-exam-guide-6th-edition.pdf")
        if shon:
            add_book(extract_pdf_book("cissp", [shon], "CISSP All-in-One Exam Guide (Shon Harris)", "Shon Harris", "6th Edition", False, 3))
        conrad = find_one("my_documents/CISSP - Certified Information Systems Security Professional Study Guide - 3rd Edition.pdf")
        if conrad:
            add_book(extract_pdf_book("cissp", [conrad], "CISSP Study Guide (3rd Edition)", "Eric Conrad, Seth Misenar, Joshua Feldman", "3rd Edition", False, 4))
        ft_ep = find_one("my_documents/VERSAtileReads-CISSPFastTrackMasterCISSPEssentials*.epub")
        if ft_ep:
            add_book(extract_epub_book("cissp", ft_ep, "CISSP Fast Track: Master CISSP Essentials", "VersatileReads", "Fast Track EPUB", False, 5))
        comp_ep = find_one("my_documents/CISSP.Exam.Certification.Companion..epub")
        if comp_ep:
            add_book(extract_epub_book("cissp", comp_ep, "CISSP Exam Certification Companion & Exam Strategies", "CISSP Companion", "2024 EPUB", False, 6))
        cissp_notes = [
            p for p in [
                find_one("my_documents/CISSP (2).pdf"),
                find_one("my_documents/CISSP Study Guide.pdf"),
                find_one("my_documents/CISSP Cheat sheet-1.pdf"),
            ] if p
        ]
        if cissp_notes:
            add_book(extract_pdf_book("cissp", cissp_notes, "CISSP Official Study Guide Master Notes & Quick Reference Compendium", "CISSP Study Reference", "Master Notes", False, 7))

    # CISM extra book (sort_order 3)
    if want("cism"):
        print("[EXTRACT-EXTRA] cism...", flush=True)
        cism15 = find_one("my_documents/pdfcoffee.com_edition-review-manual-pdf-free.pdf")
        if cism15:
            add_book(extract_pdf_book("cism", [cism15], "ISACA CISM Review Manual — 15th Edition Reference", "ISACA", "15th Edition", False, 3))

    # CRISC extra books (sort_order 3..4)
    if want("crisc"):
        print("[EXTRACT-EXTRA] crisc...", flush=True)
        cr16 = find_one("my_documents/CRISC review manual 2016.pdf")
        if cr16:
            add_book(extract_pdf_book("crisc", [cr16], "ISACA CRISC Review Manual (6th Edition)", "ISACA", "6th Edition", False, 3))
        cr_comp = [
            p for p in [
                find_one("my_documents/CRISC Exam Study Guide - Hemang Doshi- Preview.pdf"),
                find_one("my_documents/Risk-IT-Framework-2nd-Edition-Laminate_fmk_Eng_0620.pdf"),
            ] if p
        ]
        if cr_comp:
            add_book(extract_pdf_book("crisc", cr_comp, "CRISC Hemang Doshi Study Guide & Risk IT Practitioner Reference", "Hemang Doshi / ISACA", "Companion", False, 4))

    # CGEIT extra book (sort_order 3)
    if want("cgeit"):
        print("[EXTRACT-EXTRA] cgeit...", flush=True)
        cgeit_cw = find_one("my_documents/null-1.pdf")
        if cgeit_cw:
            add_book(extract_pdf_book("cgeit", [cgeit_cw], "ISACA CGEIT Official Training Courseware (Kit K-314-01)", "Firebrand / ISACA", "Official Courseware", False, 3))

    # CompTIA CySA+ extra book (sort_order 3)
    if want("cysa"):
        print("[EXTRACT-EXTRA] cysa...", flush=True)
        cy17 = find_one("my_documents/CompTIA Cybersecurit 2017.pdf")
        if cy17:
            add_book(extract_pdf_book("cysa", [cy17], "CompTIA Cybersecurity Analyst (CySA+) Comprehensive Study Guide", "CompTIA / Sybex", "Study Guide", False, 3))

    # AWS SAA-C03 extra whitepapers (sort_order 3)
    if want("aws-csaa"):
        print("[EXTRACT-EXTRA] aws-csaa...", flush=True)
        aws_wp = [
            p for p in [
                find_one("my_documents/aws-csaa/**/wellarchitected-cost-optimization-pillar.pdf"),
                find_one("my_documents/aws-csaa/**/security-best-practices-for-manufacturing-ot.pdf"),
            ] if p
        ]
        if aws_wp:
            add_book(extract_pdf_book("aws-csaa", aws_wp, "AWS Well-Architected Cost Optimization Pillar & OT Security Best Practices", "Amazon Web Services", "Official Whitepapers", False, 3))

    # ISC2 CC extra official domain resources (sort_order 2)
    if want("isc2-cc"):
        print("[EXTRACT-EXTRA] isc2-cc...", flush=True)
        last_week = find_all("my_documents/isc2-cc/ISC2-CC-Dump-Questions-Study-Material-main/Last Week Preparations/*.pdf")
        res_dir = "my_documents/isc2-cc/ISC2-CC-Dump-Questions-Study-Material-main/Resources by ISC2"
        res_names = [
            "Access Control Concepts.pdf",
            "Network Security.pdf",
            "Security Operations.pdf",
            "Security Principles.pdf",
            "Security Concepts.pdf",
            "Risk Management.pdf",
            "Outline.pdf",
            "Domain Chapter Map.pdf",
        ]
        res_pdfs = [p for p in (find_one(f"{res_dir}/{rn}") for rn in res_names) if p]
        cc_extra = last_week + res_pdfs
        if cc_extra:
            add_book(extract_pdf_book("isc2-cc", cc_extra, "ISC2 CC Official Domain Resources, IRP/DRP/BCP & Exam Readiness Guide", "ISC2", "Domain Resources", False, 2))

    # NIST GRC extra book (sort_order 2)
    if want("nist-grc"):
        print("[EXTRACT-EXTRA] nist-grc...", flush=True)
        nist_imp = find_one("my_documents/NIST_Cybersecurity_1608371171.pdf")
        if nist_imp:
            add_book(extract_pdf_book("nist-grc", [nist_imp], "NIST Cybersecurity Framework Practitioner Implementation Guide", "NIST Reference", "Implementation Guide", False, 2))

    # Enterprise GRC extra book (sort_order 2)
    if want("grc"):
        print("[EXTRACT-EXTRA] grc...", flush=True)
        board_pdf = find_unicode_pdf("reporting cybersecurity risk to the board")
        if board_pdf:
            add_book(extract_pdf_book("grc", [board_pdf], "Reporting Cybersecurity Risk to the Board of Directors", "Executive GRC Governance", "Board Risk Guide", False, 2))

    # FIFA Football Agent extra books (sort_order 3..4)
    if want("fifa-agent"):
        print("[EXTRACT-EXTRA] fifa-agent...", flush=True)
        fifa_info = [
            p for p in [
                find_one("my_documents/FIFA AGENT LICENSE/20260114_*Licensing-Process*.pdf"),
                find_one("my_documents/FIFA AGENT LICENSE/FIFA Reform Regulatory Framework for Agents_March 2023.pdf"),
                find_one("my_documents/FIFA AGENT LICENSE/Circular 1956_*.pdf"),
            ] if p
        ]
        if fifa_info:
            add_book(extract_pdf_book("fifa-agent", fifa_info, "FIFA Licensing Process, Reform Regulatory Framework & Circular 1956 (2026)", "FIFA", "Official Circulars & Framework", False, 3))
        fifa23 = find_one("my_documents/FIFA AGENT LICENSE/FIFA Football Agent Study Materials (May 2023 edition)*.pdf")
        if fifa23:
            add_book(extract_pdf_book("fifa-agent", [fifa23], "FIFA Football Agent Official Study Materials (May 2023 Reference Edition)", "FIFA", "May 2023 Edition", False, 4))

    # GIAC Security Leadership extra books (sort_order 2)
    if want("giac-security-leadership"):
        print("[EXTRACT-EXTRA] giac-security-leadership...", flush=True)
        gslc_extra = [
            p for p in [
                find_one("my_documents/cybersecurity-predictions-v10_1016105.pdf"),
                find_one("my_documents/cybersecurity.pdf"),
            ] if p
        ]
        if gslc_extra:
            add_book(extract_pdf_book("giac-security-leadership", gslc_extra, "Executive Cybersecurity Leadership, Threat Landscape & Strategic Predictions", "Cybersecurity Leadership", "Executive Briefings", False, 2))

    return books


def get_pg_connection():
    env: Dict[str, str] = {}
    with open(ENV_PATH, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip().strip('"').strip("'")
    raw_dsn = env.get("DIRECT_URL") or env.get("DATABASE_URL")
    u = urlparse(raw_dsn)
    qs = [(k, v) for k, v in parse_qsl(u.query) if k not in ("pgbouncer", "connection_limit")]
    dsn = urlunparse((u.scheme, u.netloc, u.path, u.params, urlencode(qs), u.fragment))
    return psycopg2.connect(dsn)


def sync_books_to_supabase(
    books: List[ExtractedBook],
    max_mb: float,
    append_only: bool = False,
    max_db_mb: float = 280.0,
) -> None:
    conn = get_pg_connection()
    conn.autocommit = False
    cur = conn.cursor()

    cur.execute("SELECT slug, id FROM public.certifications;")
    cert_ids = {row[0]: row[1] for row in cur.fetchall()}

    existing_hashes = set()
    if append_only:
        cur.execute("SELECT content_hash FROM public.textbooks WHERE content_hash IS NOT NULL;")
        existing_hashes = {row[0] for row in cur.fetchall()}
    else:
        # Clear existing textbooks for target certs if re-running so chapters stay crisp and duplicate-free
        target_slugs = sorted({b.cert_slug for b in books})
        if target_slugs:
            cur.execute("DELETE FROM public.textbooks WHERE certification_slug = ANY(%s);", (target_slugs,))
            conn.commit()

    cumulative_raw_bytes = 0
    max_raw_bytes = int(max_mb * 1024 * 1024)
    total_books = 0
    total_chapters = 0
    total_sections = 0
    budget_hit = False

    for b in books:
        if cumulative_raw_bytes >= max_raw_bytes or budget_hit:
            print(f"[BUDGET-GUARD] Reached {max_mb} MB raw text budget; stopping safely.", flush=True)
            break

        b_hash = sha256_str(f"{b.cert_slug}:{b.title}:{b.source_file}")
        if append_only and b_hash in existing_hashes:
            print(f"[SKIP-EXISTS] {b.cert_slug} | {b.title[:60]}", flush=True)
            continue

        cur.execute("SELECT pg_database_size(current_database()) / (1024.0 * 1024.0);")
        live_db_mb = float(cur.fetchone()[0])
        if live_db_mb >= max_db_mb:
            print(f"[DB-GUARD] Live DB reached {live_db_mb:.2f} MB >= {max_db_mb:.2f} MB cap; stopping safely.", flush=True)
            break

        b_words = sum(sum(word_count(s.content_markdown) for s in ch.sections) for ch in b.chapters)
        b_secs = sum(len(ch.sections) for ch in b.chapters)
        est_hours = round(b_words / (180 * 60), 1)
        cur.execute(
            """
            INSERT INTO public.textbooks (
              certification_slug, certification_id, title, author, edition, source_file,
              is_primary, total_chapters, total_sections, total_words, est_read_hours,
              sort_order, content_hash
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id;
            """,
            (
                b.cert_slug, cert_ids.get(b.cert_slug), b.title[:240], b.author[:160],
                b.edition[:100], b.source_file[:400], b.is_primary,
                len(b.chapters), b_secs, b_words, est_hours, b.sort_order, b_hash,
            ),
        )
        book_id = cur.fetchone()[0]
        book_inserted_chapters = 0
        book_inserted_secs = 0
        book_inserted_words = 0

        for ch_idx, ch in enumerate(b.chapters, 1):
            if budget_hit:
                break
            cur.execute(
                """
                INSERT INTO public.textbook_chapters (
                  textbook_id, certification_slug, domain_number, chapter_number,
                  part_label, title, summary, learning_objectives, key_takeaways,
                  page_start, page_end, word_count, est_read_minutes, sort_order
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id;
                """,
                (
                    book_id, b.cert_slug, ch.domain_number, ch.chapter_number,
                    ch.part_label, ch.title[:240], ch.summary,
                    ch.learning_objectives, ch.key_takeaways,
                    ch.page_start, ch.page_end, ch.word_count, ch.est_read_minutes, ch_idx,
                ),
            )
            ch_id = cur.fetchone()[0]
            ch_ins_secs = 0
            ch_ins_words = 0

            for sec_idx, sec in enumerate(ch.sections, 1):
                md_bytes = len(sec.content_markdown.encode("utf-8", errors="ignore"))
                if cumulative_raw_bytes + md_bytes > max_raw_bytes:
                    budget_hit = True
                    break
                wc_sec = word_count(sec.content_markdown)
                s_hash = sha256_str(f"{b.cert_slug}:{sec.content_markdown}")
                cur.execute(
                    """
                    INSERT INTO public.textbook_sections (
                      chapter_id, textbook_id, certification_slug, section_code,
                      title, heading_level, content_markdown, word_count, est_read_minutes,
                      key_terms, exam_tips, page_start, page_end, sort_order, content_hash
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (content_hash) DO NOTHING;
                    """,
                    (
                        ch_id, book_id, b.cert_slug, sec.section_code,
                        sec.title[:240], sec.heading_level, sec.content_markdown,
                        wc_sec, max(3, round(wc_sec / 180)),
                        sec.key_terms, sec.exam_tips, sec.page_start, sec.page_end, sec_idx, s_hash,
                    ),
                )
                if cur.rowcount > 0:
                    cumulative_raw_bytes += md_bytes
                    total_sections += 1
                    ch_ins_secs += 1
                    ch_ins_words += wc_sec

            if ch_ins_secs == 0:
                cur.execute("DELETE FROM public.textbook_chapters WHERE id = %s;", (ch_id,))
            else:
                if ch_ins_words != ch.word_count:
                    cur.execute(
                        "UPDATE public.textbook_chapters SET word_count = %s, est_read_minutes = %s WHERE id = %s;",
                        (ch_ins_words, max(5, round(ch_ins_words / 180)), ch_id),
                    )
                book_inserted_chapters += 1
                book_inserted_secs += ch_ins_secs
                book_inserted_words += ch_ins_words

        if book_inserted_secs == 0:
            conn.rollback()
            print(f"[SKIP-DUP] 0 unique sections left for {b.cert_slug} | {b.title[:60]}", flush=True)
            continue

        cur.execute(
            """
            UPDATE public.textbooks
            SET total_chapters = %s, total_sections = %s, total_words = %s, est_read_hours = %s
            WHERE id = %s;
            """,
            (
                book_inserted_chapters,
                book_inserted_secs,
                book_inserted_words,
                round(book_inserted_words / (180 * 60), 1),
                book_id,
            ),
        )
        conn.commit()
        existing_hashes.add(b_hash)
        total_books += 1
        total_chapters += book_inserted_chapters
        print(
            f"[COMMITTED] {b.cert_slug} | {b.title[:52]} | ch={book_inserted_chapters} sec={book_inserted_secs} words={book_inserted_words:,}",
            flush=True,
        )

    conn.autocommit = True
    cur.execute("VACUUM ANALYZE public.textbooks;")
    cur.execute("VACUUM ANALYZE public.textbook_chapters;")
    cur.execute("VACUUM ANALYZE public.textbook_sections;")
    cur.execute("SELECT pg_size_pretty(pg_database_size(current_database()));")
    db_size = cur.fetchone()[0]
    conn.close()
    print(f"\n[SYNC COMPLETE] books={total_books} chapters={total_chapters} sections={total_sections} raw_mb={cumulative_raw_bytes/(1024*1024):.2f}MB live_db_size={db_size}")


def main():
    parser = argparse.ArgumentParser(description="Extract unabridged book-structured certification content to Supabase")
    parser.add_argument("--cert", default="all", help="Certification slug or 'all'")
    parser.add_argument("--dry-run", action="store_true", help="Extract & report stats without writing to Supabase")
    parser.add_argument("--apply", action="store_true", help="Write extracted books/chapters/sections to Supabase")
    parser.add_argument("--max-mb", type=float, default=180.0, help="Raw extracted text budget cap in MB (Postgres TOAST compresses ~2.5-3x)")
    parser.add_argument("--max-db-mb", type=float, default=280.0, help="Live Postgres database size ceiling in MB (Free Tier is 500 MB)")
    parser.add_argument("--extra-only", action="store_true", help="Extract only remaining distinct non-duplicate books beyond the primary 24")
    parser.add_argument("--include-extra", action="store_true", help="Extract both primary 24 books and all remaining distinct non-duplicate books")
    parser.add_argument("--append-only", action="store_true", help="Skip existing textbooks by content_hash instead of deleting target cert rows")
    args = parser.parse_args()

    if args.extra_only:
        books = build_extra_books(args.cert)
    elif args.include_extra:
        books = build_all_books(args.cert) + build_extra_books(args.cert)
    else:
        books = build_all_books(args.cert)

    print(f"\n{'CERT':<25} {'BOOK':<46} {'CH':>3} {'SEC':>4} {'WORDS':>9} {'RAW_MB':>7}")
    print("-" * 100)
    grand_words = 0
    grand_bytes = 0
    grand_secs = 0
    grand_chs = 0
    certs_seen = set()
    for b in books:
        certs_seen.add(b.cert_slug)
        ch_n = len(b.chapters)
        sec_n = sum(len(c.sections) for c in b.chapters)
        words = sum(sum(word_count(s.content_markdown) for s in c.sections) for c in b.chapters)
        raw_b = sum(sum(len(s.content_markdown.encode("utf-8")) for s in c.sections) for c in b.chapters)
        grand_chs += ch_n
        grand_secs += sec_n
        grand_words += words
        grand_bytes += raw_b
        print(f"{b.cert_slug:<25} {b.title[:45]:<46} {ch_n:>3} {sec_n:>4} {words:>9,} {raw_b/(1024*1024):>6.2f}")

    print("-" * 100)
    print(f"TOTAL: certs={len(certs_seen)}/16 books={len(books)} chapters={grand_chs} sections={grand_secs} words={grand_words:,} raw_mb={grand_bytes/(1024*1024):.2f}MB (est PG TOAST: ~{grand_bytes/(1024*1024)/2.4:.1f}MB)")

    if args.apply:
        sync_books_to_supabase(books, max_mb=args.max_mb, append_only=args.append_only, max_db_mb=args.max_db_mb)


if __name__ == "__main__":
    main()
