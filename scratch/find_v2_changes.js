const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\lenovo\\.gemini\\antigravity\\brain\\290f078a-beb8-4b7d-aba4-415bff09c69f\\.system_generated\\logs\\transcript.jsonl';

try {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n');
  
  console.log('--- File Modifications before Step 291 ---');
  lines.forEach((line, index) => {
    if (!line) return;
    try {
      const obj = JSON.parse(line);
      const stepIndex = obj.step_index;
      if (stepIndex >= 291) return;
      
      if (obj.tool_calls) {
        obj.tool_calls.forEach(tc => {
          if (tc.name === 'replace_file_content' || tc.name === 'write_to_file' || tc.name === 'multi_replace_file_content') {
            console.log(`Step ${stepIndex}: Tool = ${tc.name}`);
            const args = tc.args || {};
            console.log(`  File: ${args.TargetFile || args.Target}`);
            console.log(`  Desc: ${args.Description || args.Instruction || ''}`);
          }
        });
      }
    } catch (e) {
      // Ignored
    }
  });
} catch (error) {
  console.error('Error reading log file:', error);
}
