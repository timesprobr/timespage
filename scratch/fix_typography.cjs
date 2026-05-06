const fs = require('fs');
const path = 'c:/Users/Usuario/Documents/Timespage/src/pages/Admin.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace Dashboard title
content = content.replace(/<h1 className=\"text-2xl font-barlow font-black uppercase italic tracking-tighter text-white\">Dashboard<\/h1>/, 
    '<h1 className="text-xl font-barlow font-bold uppercase tracking-[0.25em] text-white">Dashboard</h1>');

// Replace Dashboard subtitle
content = content.replace(/<p className=\"text-\[10px\] font-black uppercase tracking-\[0.2em\] text-zinc-500 italic mt-1\">Gestão Analítica de Alto Nível<\/p>/, 
    '<p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 mt-1">Gestão Analítica de Alta Performance</p>');

fs.writeFileSync(path, content, 'utf8');
console.log('Typography updated');
