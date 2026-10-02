import os
from supabase import create_client

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(ROOT_DIR, '.env')

with open(ENV_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

supabase_url = ''
supabase_key = ''

for line in content.splitlines():
    trimmed = line.strip()
    if trimmed.startswith('SUPABASE_URL='):
        supabase_url = trimmed.replace('SUPABASE_URL=', '').strip('\'"')
    elif trimmed.startswith('SUPABASE_SECRET_KEY='):
        supabase_key = trimmed.replace('SUPABASE_SECRET_KEY=', '').strip('\'"')

client = create_client(supabase_url, supabase_key)

try:
    buckets = client.storage.list_buckets()
    print("Storage buckets:", buckets)
except Exception as e:
    print("Storage list error:", e)
