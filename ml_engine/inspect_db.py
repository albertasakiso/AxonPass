import os
import re
import psycopg2

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(ROOT_DIR, '.env')

with open(ENV_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

direct_url = ''
for line in content.splitlines():
    trimmed = line.strip()
    if trimmed.startswith('DIRECT_URL='):
        direct_url = trimmed.replace('DIRECT_URL=', '').strip('\'"')
        break

conn = psycopg2.connect(direct_url)
cur = conn.cursor()

# Check extensions
cur.execute("SELECT extname FROM pg_extension;")
extensions = [r[0] for r in cur.fetchall()]
print("Installed extensions:", extensions)

# Check tables
cur.execute("""
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
""")
tables = [r[0] for r in cur.fetchall()]
print("Public tables:", tables)

# Check questions count
cur.execute("SELECT count(*) FROM questions;")
print("Total questions in DB:", cur.fetchone()[0])

# Questions per certification
cur.execute("""
    SELECT c.code, count(q.id) 
    FROM certifications c 
    LEFT JOIN questions q ON q.certification_id = c.id 
    GROUP BY c.code 
    ORDER BY c.code;
""")
for row in cur.fetchall():
    print(f"Cert: {row[0]}, Questions: {row[1]}")

cur.close()
conn.close()
