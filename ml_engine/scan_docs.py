import os
from pathlib import Path

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS_DIR = os.path.join(ROOT_DIR, 'my_documents')

file_stats = {}
total_files = 0
total_size = 0

for root, dirs, files in os.walk(DOCS_DIR):
    for f in files:
        ext = os.path.splitext(f)[1].lower()
        full_path = os.path.join(root, f)
        size = os.path.getsize(full_path)
        file_stats[ext] = file_stats.get(ext, 0) + 1
        total_files += 1
        total_size += size

print(f"Total files in my_documents: {total_files}")
print(f"Total size: {total_size / (1024*1024):.2f} MB")
print("File breakdown by extension:")
for ext, count in sorted(file_stats.items(), key=lambda x: x[1], reverse=True):
    print(f"  {ext or '[no ext]'}: {count} files")
