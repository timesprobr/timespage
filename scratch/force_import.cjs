const fs = require('fs');
const path = 'c:/Users/Usuario/Documents/Timespage/src/pages/Admin.tsx';
let content = fs.readFileSync(path, 'utf8');

// Loose replace for MessageCircle
content = content.replace(/MessageSquare,/, 'MessageSquare,\n  MessageCircle,');

fs.writeFileSync(path, content, 'utf8');
console.log('Import added');
