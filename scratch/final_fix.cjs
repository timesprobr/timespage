const fs = require('fs');
const path = 'c:/Users/Usuario/Documents/Timespage/src/pages/Admin.tsx';
let content = fs.readFileSync(path, 'utf8');

// Ensure MessageCircle is in imports
if (!content.includes('MessageCircle')) {
    content = content.replace('MessageSquare,', 'MessageSquare,\n  MessageCircle,');
    console.log('Added MessageCircle to imports');
}

// Ensure User is in imports
if (!content.includes('User,')) {
    content = content.replace('UserPlus,', 'UserPlus,\n  User,');
    console.log('Added User to imports');
}

// Fix 400 Bad Request: change createdAt to created_at for registrations and socio_leads
// I'll try changing them in the order calls
content = content.replace("registrationsQuery.order('createdAt'", "registrationsQuery.order('created_at'");
content = content.replace("socioLeadsQuery.order('createdAt'", "socioLeadsQuery.order('created_at'");

fs.writeFileSync(path, content, 'utf8');
console.log('Fixes applied');
