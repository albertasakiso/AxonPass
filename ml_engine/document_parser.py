#!/usr/bin/env python3
"""
===================================================================
APILIGU LEARNING PASS — Universal Document Ingestion & Semantic Chunking Engine
100% Free, Open-Source Universal Parser for PDF, DOCX, EPUB, MD, and TXT
===================================================================
"""

import os
import re
import sys
import zipfile
import hashlib
from typing import List, Dict, Any, Generator
from html.parser import HTMLParser

try:
    from pypdf import PdfReader
except ImportError:
    PdfReader = None

try:
    import docx
except ImportError:
    docx = None


class HTMLTextExtractor(HTMLParser):
    """Clean text extractor from HTML/XHTML nodes in EPUB files."""
    def __init__(self):
        super().__init__()
        self.text_parts = []
        self.skip_tags = {'script', 'style', 'head', 'meta', 'link'}
        self.current_skip = False

    def handle_starttag(self, tag, attrs):
        if tag.lower() in self.skip_tags:
            self.current_skip = True
        elif tag.lower() in ('p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'br', 'tr'):
            self.text_parts.append('\n')

    def handle_endtag(self, tag):
        if tag.lower() in self.skip_tags:
            self.current_skip = False
        elif tag.lower() in ('p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'tr'):
            self.text_parts.append('\n')

    def handle_data(self, data):
        if not self.current_skip and data:
            self.text_parts.append(data)

    def get_text(self) -> str:
        return "".join(self.text_parts)


def clean_text(text: str) -> str:
    """Normalizes whitespace and removes spurious characters."""
    if not text:
        return ""
    # Normalize unicode whitespace
    text = text.replace('\xa0', ' ').replace('\u200b', '').replace('\ufeff', '')
    # Normalize carriage returns
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    # Collapse 3+ consecutive newlines to 2
    text = re.sub(r'\n{3,}', '\n\n', text)
    # Collapse multiple spaces
    text = re.sub(r'[ \t]{2,}', ' ', text)
    return text.strip()


def detect_certification(file_path: str, filename: str) -> str:
    """Infers certification code based on folder hierarchy and filename."""
    lower_path = (file_path + " " + filename).lower()
    
    if "cisa" in lower_path:
        return "CISA"
    elif "cism" in lower_path:
        return "CISM"
    elif "crisc" in lower_path:
        return "CRISC"
    elif "cgeit" in lower_path:
        return "CGEIT"
    elif "cissp" in lower_path:
        return "CISSP"
    elif "ccsp" in lower_path:
        return "CCSP"
    elif "isc2-cc" in lower_path or "isc2 cc" in lower_path or "isc2_cc" in lower_path:
        return "CC"
    elif "cysa" in lower_path:
        return "CYSA+"
    elif "network+" in lower_path or "network plus" in lower_path or "n10-008" in lower_path:
        return "NETWORK+"
    elif "a+" in lower_path or "comptia a" in lower_path or "220-1101" in lower_path or "220-1102" in lower_path:
        return "A+"
    elif "gslc" in lower_path or "giac" in lower_path:
        return "GSLC"
    elif "nist" in lower_path:
        return "NIST"
    elif "grc" in lower_path or "risk-it" in lower_path or "cobit" in lower_path or "itaf" in lower_path:
        return "GRC"
    elif "aws" in lower_path or "saa-c03" in lower_path or "solutions-architect" in lower_path:
        return "SAA-C03"
    elif "fifa" in lower_path:
        return "FIFA-AGENT"
    
    return "GENERAL"


def detect_domain_number(text: str, filename: str) -> int:
    """Extracts domain number from title/context if present."""
    combined = (filename + " " + text[:500]).lower()
    match = re.search(r'\b(?:domain|chapter|module)\s*([1-5])\b', combined)
    if match:
        return int(match.group(1))
    return 1


class UniversalDocumentParser:
    def __init__(self, chunk_size: int = 700, chunk_overlap: int = 120):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def parse_pdf(self, file_path: str) -> List[Dict[str, Any]]:
        """Extracts text pages from PDF documents."""
        if not PdfReader:
            raise ImportError("pypdf is required to parse PDF documents.")
        
        pages_content = []
        try:
            reader = PdfReader(file_path)
            total_pages = len(reader.pages)
            for idx, page in enumerate(reader.pages):
                try:
                    text = page.extract_text() or ""
                    clean = clean_text(text)
                    if len(clean) > 30:  # Skip blank/nearly empty pages
                        pages_content.append({
                            "page_num": idx + 1,
                            "total_pages": total_pages,
                            "text": clean
                        })
                except Exception as page_err:
                    continue
        except Exception as e:
            print(f"  [WARN] Failed to parse PDF {os.path.basename(file_path)}: {e}")
        
        return pages_content

    def parse_docx(self, file_path: str) -> List[Dict[str, Any]]:
        """Extracts paragraphs and tables from Word DOCX documents."""
        if not docx:
            raise ImportError("python-docx is required to parse DOCX documents.")
        
        text_blocks = []
        try:
            doc = docx.Document(file_path)
            for p in doc.paragraphs:
                txt = clean_text(p.text)
                if len(txt) > 10:
                    text_blocks.append(txt)
            for table in doc.tables:
                for row in table.rows:
                    row_txt = " | ".join([clean_text(cell.text) for cell in row.cells if clean_text(cell.text)])
                    if row_txt:
                        text_blocks.append(row_txt)
        except Exception as e:
            print(f"  [WARN] Failed to parse DOCX {os.path.basename(file_path)}: {e}")
        
        full_text = "\n\n".join(text_blocks)
        if full_text:
            return [{"page_num": 1, "total_pages": 1, "text": full_text}]
        return []

    def parse_epub(self, file_path: str) -> List[Dict[str, Any]]:
        """Extracts XHTML chapter texts from EPUB (ZIP) files."""
        chapters = []
        try:
            with zipfile.ZipFile(file_path, 'r') as z:
                html_files = [f for f in z.namelist() if f.lower().endswith(('.xhtml', '.html', '.htm'))]
                html_files.sort()
                for idx, fname in enumerate(html_files):
                    try:
                        raw_bytes = z.read(fname)
                        html_str = raw_bytes.decode('utf-8', errors='ignore')
                        parser = HTMLTextExtractor()
                        parser.feed(html_str)
                        txt = clean_text(parser.get_text())
                        if len(txt) > 50:
                            chapters.append({
                                "chapter_file": fname,
                                "page_num": idx + 1,
                                "total_pages": len(html_files),
                                "text": txt
                            })
                    except Exception:
                        continue
        except Exception as e:
            print(f"  [WARN] Failed to parse EPUB {os.path.basename(file_path)}: {e}")
        
        return chapters

    def parse_text(self, file_path: str) -> List[Dict[str, Any]]:
        """Extracts text from plaintext and markdown files."""
        text = ""
        for encoding in ('utf-8', 'utf-8-sig', 'latin-1', 'cp1252'):
            try:
                with open(file_path, 'r', encoding=encoding) as f:
                    text = f.read()
                break
            except UnicodeDecodeError:
                continue
        
        clean = clean_text(text)
        if clean:
            return [{"page_num": 1, "total_pages": 1, "text": clean}]
        return []

    def chunk_text(self, text: str) -> List[str]:
        """Splits text into overlapping semantic chunks."""
        if not text or len(text) <= self.chunk_size:
            return [text] if text else []

        chunks = []
        start = 0
        text_len = len(text)

        while start < text_len:
            end = start + self.chunk_size
            if end >= text_len:
                chunk = text[start:].strip()
                if chunk:
                    chunks.append(chunk)
                break

            # Find optimal natural boundary (. \n \n\n ; , space)
            segment = text[start:end]
            split_pos = -1
            for separator in ('\n\n', '\n', '. ', '? ', '! ', '; ', ', ', ' '):
                idx = segment.rfind(separator)
                if idx != -1 and idx > self.chunk_overlap:
                    split_pos = idx + len(separator)
                    break

            if split_pos == -1:
                split_pos = self.chunk_size

            chunk = text[start:start + split_pos].strip()
            if chunk:
                chunks.append(chunk)

            # Advance by step size minus overlap
            start += max(split_pos - self.chunk_overlap, 1)

        return chunks

    def process_file(self, file_path: str, base_dir: str) -> List[Dict[str, Any]]:
        """Parses a single file and returns structured chunks with metadata."""
        filename = os.path.basename(file_path)
        rel_path = os.path.relpath(file_path, base_dir).replace('\\', '/')
        ext = os.path.splitext(filename)[1].lower()
        cert_code = detect_certification(rel_path, filename)

        extracted_sections = []
        if ext == '.pdf':
            extracted_sections = self.parse_pdf(file_path)
        elif ext in ('.docx', '.doc'):
            extracted_sections = self.parse_docx(file_path)
        elif ext == '.epub':
            extracted_sections = self.parse_epub(file_path)
        elif ext in ('.md', '.txt', '.text'):
            extracted_sections = self.parse_text(file_path)
        else:
            return []

        chunks_data = []
        chunk_counter = 0

        for section in extracted_sections:
            sec_text = section.get("text", "")
            page_num = section.get("page_num", 1)
            domain_num = detect_domain_number(sec_text, filename)

            raw_chunks = self.chunk_text(sec_text)
            for c_text in raw_chunks:
                if len(c_text) < 40:  # Skip ultra-short noisy chunks
                    continue

                content_hash = hashlib.sha256(c_text.encode('utf-8')).hexdigest()[:16]
                
                chunk_item = {
                    "document_name": filename,
                    "document_path": rel_path,
                    "certification_code": cert_code,
                    "domain_number": domain_num,
                    "chunk_index": chunk_counter,
                    "chunk_text": c_text,
                    "char_count": len(c_text),
                    "token_estimate": len(c_text.split()),
                    "content_hash": content_hash,
                    "metadata": {
                        "page_num": page_num,
                        "file_type": ext,
                        "file_size": os.path.getsize(file_path),
                        "total_pages": section.get("total_pages", 1)
                    }
                }
                chunks_data.append(chunk_item)
                chunk_counter += 1

        return chunks_data


if __name__ == '__main__':
    parser = UniversalDocumentParser()
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    docs_dir = os.path.join(root_dir, 'my_documents')
    
    print("Testing parser on a sample document...")
    # Find first pdf
    for root, dirs, files in os.walk(docs_dir):
        for f in files:
            if f.endswith('.pdf') or f.endswith('.docx') or f.endswith('.md'):
                test_file = os.path.join(root, f)
                chunks = parser.process_file(test_file, docs_dir)
                print(f"File: {f}")
                print(f"Extracted {len(chunks)} chunks.")
                if chunks:
                    print(f"Sample chunk 0:\n{chunks[0]['chunk_text'][:200]}...")
                break
        break
