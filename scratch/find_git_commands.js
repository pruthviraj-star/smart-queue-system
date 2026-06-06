const fs = require('fs');
const logPath = 'C:\\Users\\lenovo\\.gemini\\antigravity\\brain\\290f078a-beb8-4b7d-aba4-415bff09c69f\\.system_generated\\logs\\transcript.jsonl';

try {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach((line) => {
    if (!line) return;
    try {
      const obj = JSON.parse(line);
      if (obj.tool_calls) {
        obj.tool_calls.forEach(tc => {
          if (tc.name === 'run_command') {
            const cmd = String(tc.args.CommandLine);
            if (cmd.includes('git')) {
              console.log(`Step ${obj.step_index}: ${cmd}`);
            }
          }
        });
      }
    } catch (e) {}
  });
} catch (error) {
  console.error('Error:', error);
}
