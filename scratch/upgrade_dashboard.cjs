const fs = require('fs');
const path = 'c:/Users/Usuario/Documents/Timespage/src/pages/Admin.tsx';
let content = fs.readFileSync(path, 'utf8');

const replacement = `                  {/* High-Fidelity Stat Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                     {[
                        { label: 'Fluxo Global', value: totalVisits, icon: TrendingUp, color: 'text-saas-primary', bg: 'bg-saas-primary/10', trend: 'Performance Crítica' },
                        { label: 'Mídia & Social', value: news.length, icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-400/10', trend: 'Engajamento Ativo' },
                        { label: 'Campanhas', value: campaigns.length, icon: Target, color: 'text-orange-400', bg: 'bg-orange-400/10', trend: 'Conversão CRM' },
                        { label: 'Base de Dados', value: registrations.length + socioLeads.length, icon: UserPlus, color: 'text-purple-400', bg: 'bg-purple-400/10', trend: 'Leads Captados' },
                     ].map((stat, i) => (
                        <div key={i} className="p-10 bg-[#121214] border border-white/5 rounded-[48px] shadow-2xl hover:border-saas-primary/40 transition-all group relative overflow-hidden flex flex-col items-center text-center">
                           <div className="absolute inset-0 bg-gradient-to-b from-white/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                           <div className={\`w-20 h-20 rounded-[28px] \${stat.bg} \${stat.color} flex items-center justify-center mb-8 shadow-2xl border border-white/5 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500\`}>
                              <stat.icon size={32} strokeWidth={2.5} />
                           </div>
                           <div className=\"flex flex-col items-center\">
                              <h3 className=\"text-6xl font-barlow font-black italic mb-2 leading-none text-white tracking-tighter\">{stat.value}</h3>
                              <p className=\"text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-6\">{stat.label}</p>
                              <div className=\"px-4 py-1.5 rounded-full bg-zinc-900 text-[9px] font-black italic text-saas-primary border border-white/5 uppercase tracking-widest group-hover:bg-saas-primary group-hover:text-black transition-all\">
                                 {stat.trend}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>`;

// Replace the stats grid using a regex that is flexible with indentation and characters
const regex = /<div className=\"grid grid-cols-1 md:grid-cols-4 gap-4\">[\s\S]+?\.map\(\(stat, i\) => \([\s\S]+?<\/div>\s+\)\)}\s+<\/div>/;

if (regex.test(content)) {
    const newContent = content.replace(regex, replacement);
    fs.writeFileSync(path, newContent, 'utf8');
    console.log('Success!');
} else {
    console.log('Regex match failed');
}
