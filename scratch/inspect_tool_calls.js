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
      if (stepIndex > 290) return;
      
      if (obj.tool_calls) {
        obj.tool_calls.forEach(tc => {
          if (tc.name === 'replace_file_content' || tc.name === 'write_to_file' || tc.name === 'multi_replace_file_content') {
            console.log(`Step ${stepIndex}: Tool = ${tc.name}`);
            const args = tc.args || {};
            const keys = Object.keys(args);
            keys.forEach(k => {
              const val = String(args[k]);
              if (val.includes('<truncated') || val.includes('...')) {
                console.log(`  WARNING: Argument '${k}' has potential truncation. Length: ${val.length}, Start: ${val.substring(0, 100)}`);
              } else {
                console.log(`  Arg '${k}': Length: ${val.length}`);
              }
            });
          }
        });
      }
    } catch (e) {}
  });
} catch (error) {
  console.error('Error:', error);
}
