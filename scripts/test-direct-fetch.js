const url = process.env.VITE_SUPABASE_URL || 'https://ntegjiuktzmdbjxocqhz.supabase.co';
const publishableKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '';
const secretKey = process.env.SUPABASE_SECRET_KEY || '';

async function testDirectFetch() {
  console.log('--- TEST 1: fetch with apikey header (publishableKey) ---');
  try {
    const res = await fetch(`${url}/auth/v1/settings`, {
      headers: {
        'apikey': publishableKey,
        'Authorization': `Bearer ${publishableKey}`
      }
    });
    console.log('/auth/v1/settings status:', res.status);
    const text = await res.text();
    console.log('response:', text);
  } catch (e) {
    console.error(e);
  }

  console.log('\n--- TEST 2: fetch /rest/v1/ with publishableKey ---');
  try {
    const res = await fetch(`${url}/rest/v1/certifications?select=*`, {
      headers: {
        'apikey': publishableKey,
        'Authorization': `Bearer ${publishableKey}`
      }
    });
    console.log('/rest/v1/ status:', res.status);
    const text = await res.text();
    console.log('response:', text);
  } catch (e) {
    console.error(e);
  }

  console.log('\n--- TEST 3: fetch with secretKey ---');
  try {
    const res = await fetch(`${url}/auth/v1/settings`, {
      headers: {
        'apikey': secretKey,
        'Authorization': `Bearer ${secretKey}`
      }
    });
    console.log('secretKey /auth/v1/settings status:', res.status);
    const text = await res.text();
    console.log('response:', text);
  } catch (e) {
    console.error(e);
  }
}

testDirectFetch();
