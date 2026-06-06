const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\lenovo\\.gemini\\antigravity\\brain\\290f078a-beb8-4b7d-aba4-415bff09c69f\\.system_generated\\logs\\transcript.jsonl';

try {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n');
  let matchCount = 0;
  
  lines.forEach((line, index) => {
    if (line.toLowerCase().includes('version 2') || line.toLowerCase().includes('\"v2\"')) {
      matchCount++;
      console.log(`Line ${index + 1}:`);
      // Try to parse the json line
      try {
        const obj = JSON.parse(line);
        console.log(`  Source: ${obj.source}`);
        console.log(`  Type: ${obj.type}`);
        console.log(`  Content: ${obj.content ? obj.content.substring(0, 300) : '(no content)'}`);
      } catch (e) {
        console.log(`  Raw: ${line.substring(0, 300)}`);
      }
    }
  });
  
  console.log(`\nFound ${matchCount} matching lines.`);
} catch (error) {
  console.error('Error reading log file:', error);
}
