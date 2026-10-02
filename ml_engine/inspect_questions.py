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

cur.execute("""
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'questions'
    ORDER BY ordinal_position;
""")
cols = cur.fetchall()
print("Questions table columns:")
for c in cols:
    print(f"  {c[0]} ({c[1]})")

cur.execute("""
    SELECT q.id, c.code, q.question_text, q.options, q.correct_option_index, q.explanation, q.domain_id, q.topic_id
    FROM questions q
    JOIN certifications c ON c.id = q.certification_id
    LIMIT 3;
""")
samples = cur.fetchall()
print("\nSample questions:")
for s in samples:
    print(f"ID: {s[0]}, Cert: {s[1]}, Text: {s[2][:100]}..., Correct: {s[4]}")
    print(f"Explanation: {s[5][:100] if s[5] else 'None'}")

cur.close()
conn.close()
