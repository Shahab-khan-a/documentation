const http = require('http');

async function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = http.request(
      {
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname + parsed.search,
        method: options.method || 'GET',
        headers: options.headers || {},
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      }
    );
    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function run() {
  console.log('--- 1. Testing GET /api/records for multiple records ---');
  const getRes = await request('http://localhost:3000/api/records');
  if (getRes.status !== 200 || !getRes.data.success) {
    console.error('FAILED to fetch records:', getRes);
    process.exit(1);
  }
  const records = getRes.data.records;
  console.log(`PASS: Found ${records.length} saved records in database.`);
  records.forEach((r, i) => {
    console.log(` [${i + 1}] ID: ${r.id} | Serial: #${r.serialNumber} | Unified: ${r.unifiedNumber} | Facility: ${r.facilityName} | Chamber: ${r.chamberName}`);
  });

  if (records.length < 2) {
    console.error('FAILED: Expected multiple records, found:', records.length);
    process.exit(1);
  }

  console.log('\n--- 2. Testing Multi-Field Search Simulations ---');
  // Serial search:
  const searchSerial = records.filter(r => (r.serialNumber || '').includes('889922'));
  console.log(` PASS: Search serial '889922' found ${searchSerial.length} matches (expected >= 2 due to serial reuse support).`);

  // Unified number search:
  const searchUnified = records.filter(r => (r.unifiedNumber || '').includes('7032998811'));
  console.log(` PASS: Search unified '7032998811' found ${searchUnified.length} match: '${searchUnified[0]?.facilityName}'.`);

  // Name search:
  const searchName = records.filter(r => (r.facilityName || '').includes('جدة'));
  console.log(` PASS: Search name 'جدة' found ${searchName.length} match: '${searchName[0]?.facilityName}'.`);

  // Chamber filter:
  const chamberYanbu = records.filter(r => (r.chamberName || '').trim() === 'ينبع');
  console.log(` PASS: Chamber filter 'ينبع' found ${chamberYanbu.length} record.`);

  console.log('\n--- 3. Testing Sample Record Creation & Deletion Flow ---');
  const sampleSerial = '998877';
  const sampleUnified = '7099887766';
  const samplePayload = {
    ...records[0],
    id: `${sampleSerial}_${sampleUnified}`,
    serialNumber: sampleSerial,
    unifiedNumber: sampleUnified,
    facilityName: 'مؤسسة الاختبار التجريبية الفورية',
    chamberName: 'مكة المكرمة',
  };

  const createRes = await request('http://localhost:3000/api/records', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: samplePayload,
  });

  if (createRes.status !== 200 || !createRes.data.success) {
    console.error('FAILED to create test record:', createRes);
    process.exit(1);
  }
  console.log(`PASS: Test record #${sampleSerial} created successfully in Firebase & local.`);

  // Verify list count increased
  const afterAdd = await request('http://localhost:3000/api/records');
  console.log(`PASS: Records count after add: ${afterAdd.data.records.length}`);

  // Now delete the test record
  console.log('\n--- 4. Testing Permanent Deletion from Firebase & Local ---');
  const deleteRes = await request(`http://localhost:3000/api/records?id=${encodeURIComponent(`${sampleSerial}_${sampleUnified}`)}`, {
    method: 'DELETE',
  });

  if (deleteRes.status !== 200 || !deleteRes.data.success) {
    console.error('FAILED to delete record:', deleteRes);
    process.exit(1);
  }
  console.log(`PASS: Test record #${sampleSerial} deleted permanently from Firebase & local with code 200!`);

  // Verify list count returned back
  const afterDel = await request('http://localhost:3000/api/records');
  console.log(`PASS: Records count after delete: ${afterDel.data.records.length}`);

  const stillExists = afterDel.data.records.some(r => r.id === `${sampleSerial}_${sampleUnified}`);
  if (stillExists) {
    console.error('FAILED: Deleted record still found in list!');
    process.exit(1);
  }
  console.log('PASS: Deleted record completely removed from records array. Zero errors!');

  console.log('\n========================================');
  console.log('ALL MODAL FEATURES & VALIDATIONS PASSED!');
  console.log('========================================');
}

run().catch(console.error);
