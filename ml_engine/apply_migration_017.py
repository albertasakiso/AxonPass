import os
import psycopg2

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(ROOT_DIR, '.env')
MIGRATION_PATH = os.path.join(ROOT_DIR, 'supabase', 'migrations', '017_document_vectors_and_rag.sql')

with open(ENV_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

direct_url = ''
for line in content.splitlines():
    if line.strip().startswith('DIRECT_URL='):
        direct_url = line.strip().replace('DIRECT_URL=', '').strip('\'"')

with open(MIGRATION_PATH, 'r', encoding='utf-8') as f:
    sql = f.read()

conn = psycopg2.connect(direct_url)
conn.autocommit = True
cur = conn.cursor()

print("Applying migration 017...")
cur.execute(sql)
print("SUCCESS: Migration 017 applied successfully!")

# Verify table
cur.execute("""
    SELECT column_name, data_type, udt_name 
    FROM information_schema.columns 
    WHERE table_name = 'document_chunks';
""")
for c in cur.fetchall():
    print(f"  {c[0]} ({c[1]}, {c[2]})")

cur.close()
conn.close()
