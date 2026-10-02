import pypdf
import re
import json
import os

PDF_PATH = 'my_documents/CISA Official Review Manual, 28th Edition 2024 by ISACA .pdf'
OUTPUT_DIR = 'scripts/cisa_28th_extracted'

os.makedirs(OUTPUT_DIR, exist_ok=True)

reader = pypdf.PdfReader(PDF_PATH)
total_pages = len(reader.pages)
print(f"Total pages in PDF: {total_pages}")

# Page ranges based on our scan:
# Domain 1: p26 - p88
# Domain 2: p89 - p165
# Domain 3: p166 - p246
# Domain 4: p247 - p342
# Domain 5: p343 - p547
# Glossary: p555 - p577

domain_ranges = {
    "domain_1": (26, 88, "Information System Auditing Process", 18.0),
    "domain_2": (89, 165, "Governance and Management of IT", 18.0),
    "domain_3": (166, 246, "IS Acquisition, Development, and Implementation", 12.0),
    "domain_4": (247, 342, "IS Operations and Business Resilience", 26.0),
    "domain_5": (343, 547, "Protection of Information Assets", 26.0),
    "glossary": (555, 577, "Glossary and Acronyms", 0.0)
}

for key, (start_p, end_p, title, weight) in domain_ranges.items():
    print(f"Extracting {title} (Pages {start_p}-{end_p})...")
    pages_text = []
    for p in range(start_p - 1, min(end_p, total_pages)):
        txt = reader.pages[p].extract_text() or ""
        pages_text.append(f"--- PAGE {p+1} ---\n" + txt)
    
    full_text = "\n\n".join(pages_text)
    out_file = os.path.join(OUTPUT_DIR, f"{key}.txt")
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(full_text)
    print(f"Saved {key}.txt ({len(full_text)} characters)")

print("\nExtraction complete. Ready for curriculum synthesis.")
