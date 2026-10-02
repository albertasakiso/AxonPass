import os
import psycopg2

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(ROOT_DIR, '.env')

with open(ENV_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

direct_url = ''
for line in content.splitlines():
    if line.strip().startswith('DIRECT_URL='):
        direct_url = line.strip().replace('DIRECT_URL=', '').strip('\'"')

conn = psycopg2.connect(direct_url)
cur = conn.cursor()

try:
    cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
    conn.commit()
    print("SUCCESS: pgvector extension enabled!")
except Exception as e:
    conn.rollback()
    print("pgvector notice:", e)

cur.execute("SELECT extname FROM pg_extension;")
print("Installed extensions:", [r[0] for r in cur.fetchall()])

cur.close()
conn.close()
