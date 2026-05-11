const fs = require('fs');
const path = 'c:/Users/Usuario/Documents/Timespage/src/pages/Admin.tsx';
let content = fs.readFileSync(path, 'utf8');

// Wrap Analytics title
content = content.replace(/<span className=\"px-4 text-\[9px\] font-black uppercase tracking-\[0.2em\] text-zinc-600 italic mb-2 block\">Analytics<\/span>/, 
    "{!isSidebarCollapsed && <span className=\"px-4 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 italic mb-2 block\">Analytics</span>}");

// Wrap Conteúdo title
content = content.replace(/<span className=\"px-4 text-\[9px\] font-black uppercase tracking-\[0.2em\] text-zinc-600 italic mb-2 block\">Conteúdo<\/span>/, 
    "{!isSidebarCollapsed && <span className=\"px-4 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 italic mb-2 block\">Conteúdo</span>}");

// Wrap Gestão title
content = content.replace(/<span className=\"px-4 text-\[9px\] font-black uppercase tracking-\[0.2em\] text-zinc-600 italic mb-2 block\">Gestão<\/span>/, 
    "{!isSidebarCollapsed && <span className=\"px-4 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 italic mb-2 block\">Gestão</span>}");

fs.writeFileSync(path, content, 'utf8');
console.log('Sidebar titles hidden when collapsed');
