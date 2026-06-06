const fs = require('fs');
['d:/smart-queue-system/student-dashboard.html', 'd:/smart-queue-system/staff-dashboard.html', 'd:/smart-queue-system/student-token.html'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\\\$/g, '$');
  content = content.replace(/\\`/g, '`');
  fs.writeFileSync(file, content);
});
