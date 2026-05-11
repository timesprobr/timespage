const fs = require('fs');
const path = 'c:/Users/Usuario/Documents/Timespage/src/pages/Admin.tsx';
let content = fs.readFileSync(path, 'utf8');

// Use regex for imports
if (!content.includes('MessageCircle')) {
    content = content.replace(/MessageSquare,/, 'MessageSquare,\n  MessageCircle,');
}

if (!content.includes('User,')) {
    content = content.replace(/UserPlus,/, 'UserPlus,\n  User,');
}

// Fix 400 error again (just in case)
content = content.replace(/registrationsQuery\.order\(['"]createdAt['"]/, "registrationsQuery.order('created_at'");
content = content.replace(/socioLeadsQuery\.order\(['"]createdAt['"]/, "socioLeadsQuery.order('created_at'");

fs.writeFileSync(path, content, 'utf8');
console.log('Final check: MessageCircle in content?', fs.readFileSync(path, 'utf8').includes('MessageCircle'));
