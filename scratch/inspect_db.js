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

async function inspect() {
  const projectId = 'smart-queue-system-4610f';
  const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
  
  try {
    console.log('Fetching queues...');
    const queuesData = await getJSON(`${baseUrl}/queues`);
    if (!queuesData.documents) {
      console.log('No queues found.');
      return;
    }
    
    for (const queueDoc of queuesData.documents) {
      const parts = queueDoc.name.split('/');
      const queueId = parts[parts.length - 1];
      const fields = queueDoc.fields || {};
      const deptName = fields.deptName ? fields.deptName.stringValue : 'N/A';
      const currentCounter = fields.currentCounter ? fields.currentCounter.integerValue : 'N/A';
      const lastToken = fields.lastToken ? fields.lastToken.integerValue : 'N/A';
      
      console.log(`\n========================================`);
      console.log(`Queue: ${deptName} (${queueId})`);
      console.log(`- currentCounter: ${currentCounter}`);
      console.log(`- lastToken: ${lastToken}`);
      console.log(`----------------------------------------`);
      
      console.log(`Fetching tokens for ${deptName}...`);
      const tokensData = await getJSON(`${baseUrl}/queues/${queueId}/tokens`);
      if (!tokensData.documents || tokensData.documents.length === 0) {
        console.log('  No tokens found.');
      } else {
        tokensData.documents.forEach((tokenDoc) => {
          const tFields = tokenDoc.fields || {};
          const tokenNumber = tFields.tokenNumber ? tFields.tokenNumber.integerValue : 'N/A';
          const studentName = tFields.studentName ? tFields.studentName.stringValue : 'N/A';
          const studentId = tFields.studentId ? tFields.studentId.stringValue : 'N/A';
          const status = tFields.status ? tFields.status.stringValue : 'N/A';
          console.log(`  Token #${tokenNumber} - ${studentName} (${studentId}) - Status: ${status}`);
        });
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

inspect();
