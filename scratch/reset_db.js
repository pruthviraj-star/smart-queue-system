const https = require('https');

function getJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function request(url, method, payload) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      method: method,
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });
    
    req.on('error', reject);
    if (payload) {
      req.write(JSON.stringify(payload));
    }
    req.end();
  });
}

async function resetDB() {
  const projectId = 'smart-queue-system-4610f';
  const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
  
  const queues = ['admissions', 'fees_counter', 'scholarship'];
  
  for (const queueId of queues) {
    console.log(`Resetting queue: ${queueId}`);
    
    // 1. Update queue document fields: currentCounter = 0, lastToken = 0
    try {
      const queueUrl = `${baseUrl}/queues/${queueId}?updateMask.fieldPaths=currentCounter&updateMask.fieldPaths=lastToken`;
      const updatePayload = {
        fields: {
          currentCounter: { integerValue: '0' },
          lastToken: { integerValue: '0' }
        }
      };
      await request(queueUrl, 'PATCH', updatePayload);
      console.log(`  - Counters reset to 0`);
    } catch (e) {
      console.error(`  - Failed to reset counters:`, e.message);
    }
    
    // 2. Fetch and delete all tokens in the subcollection
    try {
      const tokensUrl = `${baseUrl}/queues/${queueId}/tokens`;
      const tokensData = await getJSON(tokensUrl);
      if (tokensData.documents && tokensData.documents.length > 0) {
        console.log(`  - Deleting ${tokensData.documents.length} tokens...`);
        for (const tokenDoc of tokensData.documents) {
          const deleteUrl = `https://firestore.googleapis.com/v1/${tokenDoc.name}`;
          await request(deleteUrl, 'DELETE');
        }
        console.log(`  - Tokens deleted successfully`);
      } else {
        console.log(`  - No tokens found to delete`);
      }
    } catch (e) {
      console.error(`  - Failed to delete tokens:`, e.message);
    }
  }
  
  console.log('\nFirebase database reset complete.');
}

resetDB();
