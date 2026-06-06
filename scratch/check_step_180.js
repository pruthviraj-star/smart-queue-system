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
      if (stepIndex === 180) {
        console.log(`Step 180 details:`);
        if (obj.tool_calls) {
          obj.tool_calls.forEach(tc => {
            console.log(`  Tool: ${tc.name}`);
            const args = tc.args || {};
            const code = args.CodeContent;
            if (code) {
              console.log(`  CodeContent Length: ${code.length}`);
              const hasTruncation = code.includes('<truncated') || code.includes('...');
              console.log(`  Has truncation string: ${hasTruncation}`);
              console.log(`  Start: ${code.substring(0, 300)}`);
              console.log(`  End: ${code.substring(code.length - 300)}`);
            }
          });
        }
      }
    } catch (e) {}
  });
} catch (error) {
  console.error('Error:', error);
}
