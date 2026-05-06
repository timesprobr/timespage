const fs = require('fs');
const path = 'c:/Users/Usuario/Documents/Timespage/src/pages/Admin.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add state
content = content.replace('const [isSaving, setIsSaving] = useState(false);', 
    'const [isSaving, setIsSaving] = useState(false);\n  const [isProfileOpen, setIsProfileOpen] = useState(false);');

// Replace header content
const oldHeader = `<div className=\"flex items-center gap-4\">
               <div className=\"flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-800 border border-white/5\">
                  <div className=\"w-2 h-2 rounded-full bg-\\[#a3e635\\] animate-pulse\"><\/div>
                  <span className=\"text-\\[9px\\] font-black uppercase text-zinc-400\">Sistema Ativo<\/span>
               </div>
               <div className=\"w-\\[1px\\] h-6 bg-white\/5 mx-1\" \/>
               <button className=\"bg-red-500\/10 text-red-500 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500\/10\">
                  <LogOut size={18} \/>
               </button>
            <\/div>`;

const newHeader = `<div className="flex items-center gap-4 relative">
               <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 border border-white/5 hover:bg-zinc-700 transition-all group">
                  <MessageCircle size={16} className="text-saas-primary" />
                  <span className="text-[9px] font-bold uppercase text-zinc-400 group-hover:text-white tracking-widest">Suporte</span>
               </button>
               
               <div className="w-[1px] h-6 bg-white/5 mx-1" />
               
               <div className="relative">
                  <button 
                     onClick={() => setIsProfileOpen(!isProfileOpen)}
                     className={\`p-2.5 rounded-xl transition-all border \${isProfileOpen ? 'bg-saas-primary text-black border-saas-primary' : 'bg-zinc-800 text-zinc-400 border-white/5 hover:text-white'}\`}
                  >
                     <User size={18} />
                  </button>

                  {isProfileOpen && (
                     <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                        <div className="absolute right-0 mt-3 w-64 bg-[#121214] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                           <div className="p-5 border-b border-white/5">
                              <p className="text-[8px] font-bold uppercase text-zinc-500 tracking-[0.2em] mb-1.5">Administrador</p>
                              <p className="text-[11px] font-bold text-white truncate">admin@timespro.com.br</p>
                           </div>
                           <div className="p-2">
                              <button 
                                 onClick={() => {
                                    supabase.auth.signOut();
                                    window.location.reload();
                                 }}
                                 className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all group"
                              >
                                 <LogOut size={16} />
                                 <span className="text-[10px] font-bold uppercase tracking-widest">Sair do Sistema</span>
                              </button>
                           </div>
                        </div>
                     </>
                  )}
               </div>
            </div>`;

// Escape special chars in oldHeader for regex if needed, or use simple replace if possible
// The indentation might be tricky. I'll use a simpler match.

content = content.replace(/<div className=\"flex items-center gap-4\">[\s\S]*?<LogOut size=\{18\} \/>[\s\S]*?<\/button>[\s\S]*?<\/div>/, newHeader);

fs.writeFileSync(path, content, 'utf8');
console.log('Header updated successfully');
