const fs = require('fs');
const path = 'c:/Users/Usuario/Documents/Timespage/src/pages/Admin.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Compact nav padding and spacing
content = content.replace(/<nav className=\"flex-1 p-4 space-y-8/, '<nav className="flex-1 p-3 space-y-4');

// 2. Compact section labels margins
content = content.replace(/italic mb-4 block/g, 'italic mb-2 block');

// 3. Compact nav buttons padding
content = content.replace(/px-4 py-3 rounded-xl transition-all relative/g, 'px-4 py-2 rounded-xl transition-all relative');

// 4. Compact bottom Visit Site area
content = content.replace(/<div className=\"p-4 border-t border-white\/5\">/, '<div className="p-3 border-t border-white/5">');
content = content.replace(/px-4 py-4 rounded-2xl transition-all border border-white\/5/, 'px-4 py-2.5 rounded-2xl transition-all border border-white/5');

fs.writeFileSync(path, content, 'utf8');
console.log('Sidebar compacted successfully');
