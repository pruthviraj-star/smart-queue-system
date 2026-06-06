const fs = require('fs');
const logPath = 'C:\\Users\\lenovo\\.gemini\\antigravity\\brain\\290f078a-beb8-4b7d-aba4-415bff09c69f\\.system_generated\\logs\\transcript.jsonl';

try {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach((line) => {
    if (!line) return;
    try {
      const obj = JSON.parse(line);
      const stepIndex = obj.step_index;
      if (stepIndex >= 300 && stepIndex <= 308) {
        console.log(`Step ${stepIndex}: Source: ${obj.source}, Type: ${obj.type}, Status: ${obj.status || ''}`);
        if (obj.content) {
          console.log(`  Content: ${obj.content.substring(0, 500)}`);
        }
        if (obj.tool_calls) {
          obj.tool_calls.forEach(tc => {
            console.log(`  Tool call: ${tc.name}`);
            console.log(`  Args: ${JSON.stringify(tc.args).substring(0, 500)}`);
          });
        }
      }
    } catch (e) {}
  });
} catch (error) {
  console.error('Error:', error);
}
