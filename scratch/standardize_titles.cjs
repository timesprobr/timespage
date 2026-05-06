const fs = require('fs');
const path = 'c:/Users/Usuario/Documents/Timespage/src/pages/Admin.tsx';
let content = fs.readFileSync(path, 'utf8');

// Pattern for H3 features
const h3Pattern = /<h3 className=\"text-3xl font-barlow font-black uppercase italic tracking-tighter text-white\">([^<]+)<\/h3>\s+<p className=\"text-\[10px\] font-black uppercase tracking-widest text-zinc-500 italic mt-1\">([^<]+)<\/p>/g;

content = content.replace(h3Pattern, (match, title, subtitle) => {
    return `<h3 className="text-xl font-barlow font-bold uppercase tracking-[0.25em] text-white">${title}</h3>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mt-1">${subtitle}</p>`;
});

// Fix Identity Visual specifically if it has different classes
content = content.replace(/<h3 className=\"text-2xl font-barlow font-black uppercase italic tracking-tighter text-white mb-10\">Configuração de Identidade Visual<\/h3>/,
    '<h3 className="text-xl font-barlow font-bold uppercase tracking-[0.25em] text-white mb-8">Identidade Visual</h3>');

fs.writeFileSync(path, content, 'utf8');
console.log('All titles standardized');
