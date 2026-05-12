const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'Admin.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add 'home' to activeTab type
content = content.replace(
  `'dashboard' | 'news' | 'trophies' | 'transparency' | 'campaign' | 'squad' | 'leads' | 'board' | 'users' | 'identity' | 'conversion'`,
  `'dashboard' | 'home' | 'news' | 'trophies' | 'transparency' | 'campaign' | 'squad' | 'leads' | 'board' | 'users' | 'identity' | 'conversion'`
);

// 2. Add Home icon import (Home icon from lucide)
content = content.replace(
  `   ExternalLink,\n   Search,`,
  `   ExternalLink,\n   Search,\n   Home,`
);

// 3. Add new state fields for home config in clubIdentity
content = content.replace(
  `      tp_short_name: ''\n   });`,
  `      tp_short_name: '',\n      tp_hero_image_url: '',\n      tp_hero_phrase: '',\n      tp_instagram_handle: '',\n      tp_instagram_link: '',\n      tp_instagram_photos: [],\n      tp_contact_phone: '',\n      tp_whatsapp_channel: ''\n   });`
);

// 4. Add "Home" menu item in sidebar above "Notícias"
content = content.replace(
  `                         { id: 'news', label: 'Notícias', icon: FileText },`,
  `                         { id: 'home', label: 'Home', icon: Home },\n                         { id: 'news', label: 'Notícias', icon: FileText },`
);

// 5. Insert the Home tab content. Find the squad section and insert before it
const squadMarker = `{activeTab === 'squad' && (() => {`;
const squadIdx = content.indexOf(squadMarker);

if (squadIdx === -1) {
  console.error('Could not find squad section');
  process.exit(1);
}

// Find the proper indentation point - go back to find the previous line
let insertIdx = squadIdx;
// We want to insert right before the squad section
// The pattern is: whitespace + {activeTab === 'squad'
// We need to find the start of that line
while (insertIdx > 0 && content[insertIdx - 1] !== '\n') insertIdx--;

const homeTabContent = `               {activeTab === 'home' && (
                  <div className="space-y-8">
                     {/* Header */}
                     <div className="flex justify-between items-center">
                        <div>
                           <h3 className="text-xl font-manrope font-extrabold uppercase tracking-tight text-white">Configuração da Home</h3>
                           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic mt-1">Personalize a página inicial do site oficial</p>
                        </div>
                        <button
                           onClick={async () => {
                              setIsSaving(true);
                              try {
                                 const { error } = await supabase.from('organizations').update({
                                    tp_hero_image_url: clubIdentity.tp_hero_image_url,
                                    tp_hero_phrase: clubIdentity.tp_hero_phrase,
                                    tp_instagram_handle: clubIdentity.tp_instagram_handle,
                                    tp_instagram_link: clubIdentity.tp_instagram_link,
                                    tp_instagram_photos: clubIdentity.tp_instagram_photos,
                                    tp_email: clubIdentity.tp_email,
                                    tp_phone: clubIdentity.tp_phone,
                                    tp_contact_phone: clubIdentity.tp_contact_phone,
                                    tp_whatsapp: clubIdentity.tp_whatsapp,
                                    tp_address: clubIdentity.tp_address,
                                    tp_instagram: clubIdentity.tp_instagram,
                                    tp_facebook: clubIdentity.tp_facebook,
                                    tp_twitter_x: clubIdentity.tp_twitter_x,
                                    tp_linkedin: clubIdentity.tp_linkedin,
                                    tp_youtube: clubIdentity.tp_youtube,
                                    tp_whatsapp_channel: clubIdentity.tp_whatsapp_channel,
                                 }).eq('id', currentOrgId);
                                 if (error) throw error;
                                 setNotification({ message: 'Configurações salvas com sucesso!', type: 'success' });
                              } catch (err: any) {
                                 setNotification({ message: 'Erro ao salvar: ' + err.message, type: 'error' });
                              } finally {
                                 setIsSaving(false);
                              }
                           }}
                           disabled={isSaving}
                           className="bg-[#a3e635] text-black px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-lg shadow-saas-primary/20 hover:scale-105 disabled:opacity-50"
                        >
                           {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} strokeWidth={3} />}
                           {isSaving ? 'Salvando...' : 'Salvar Tudo'}
                        </button>
                     </div>

                     {/* HERO / CAPA */}
                     <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 space-y-5">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="w-8 h-8 rounded-lg bg-saas-primary/10 flex items-center justify-center">
                              <ImageIcon size={16} className="text-saas-primary" />
                           </div>
                           <h4 className="font-manrope font-extrabold text-white uppercase text-sm tracking-tight">Capa Principal (Hero)</h4>
                        </div>
                        
                        {/* Hero Image Preview */}
                        <div className="relative aspect-[21/9] bg-zinc-900 rounded-xl overflow-hidden border border-white/10 group">
                           {clubIdentity.tp_hero_image_url ? (
                              <img src={clubIdentity.tp_hero_image_url} className="w-full h-full object-cover" alt="Capa" />
                           ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                 <ImageIcon size={48} strokeWidth={1} />
                              </div>
                           )}
                           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-xs font-bold uppercase tracking-widest">Alterar Imagem</span>
                           </div>
                        </div>
                        
                        <div>
                           <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">URL da Imagem de Capa</label>
                           <input
                              type="text"
                              value={clubIdentity.tp_hero_image_url || ''}
                              onChange={e => setClubIdentity({ ...clubIdentity, tp_hero_image_url: e.target.value })}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-saas-primary/50 transition-colors"
                              placeholder="https://exemplo.com/imagem-capa.jpg"
                           />
                        </div>

                        <div>
                           <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Frase da Capa (opcional)</label>
                           <input
                              type="text"
                              value={clubIdentity.tp_hero_phrase || ''}
                              onChange={e => setClubIdentity({ ...clubIdentity, tp_hero_phrase: e.target.value })}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-saas-primary/50 transition-colors"
                              placeholder="Ex: Uma vez Gameleira, Sempre Gameleira..."
                           />
                           <p className="text-[9px] text-zinc-600 mt-1 italic">Deixe vazio para não exibir frase na capa.</p>
                        </div>
                     </div>

                     {/* INSTAGRAM */}
                     <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 space-y-5">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-yellow-400/20 via-red-500/20 to-purple-600/20 flex items-center justify-center">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-400"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                           </div>
                           <h4 className="font-manrope font-extrabold text-white uppercase text-sm tracking-tight">Instagram do Clube</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">@ do Instagram</label>
                              <div className="relative">
                                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-saas-primary font-bold text-sm">@</span>
                                 <input
                                    type="text"
                                    value={clubIdentity.tp_instagram_handle || ''}
                                    onChange={e => setClubIdentity({ ...clubIdentity, tp_instagram_handle: e.target.value.replace('@', '') })}
                                    className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-saas-primary/50 transition-colors"
                                    placeholder="gameleirafc"
                                 />
                              </div>
                           </div>
                           <div>
                              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Link do Instagram (botão)</label>
                              <input
                                 type="text"
                                 value={clubIdentity.tp_instagram_link || ''}
                                 onChange={e => setClubIdentity({ ...clubIdentity, tp_instagram_link: e.target.value })}
                                 className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-saas-primary/50 transition-colors"
                                 placeholder="https://instagram.com/gameleirafc"
                              />
                           </div>
                        </div>

                        {/* 6 Photos */}
                        <div>
                           <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3 block">6 Fotos do Feed</label>
                           <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                              {Array.from({ length: 6 }).map((_, i) => {
                                 const photos = clubIdentity.tp_instagram_photos || [];
                                 const photo = photos[i] || '';
                                 return (
                                    <div key={i} className="space-y-1.5">
                                       <div className="aspect-square bg-zinc-900 rounded-lg overflow-hidden border border-white/10 relative group">
                                          {photo ? (
                                             <img src={photo} className="w-full h-full object-cover" alt={\`Foto \${i + 1}\`} />
                                          ) : (
                                             <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                                <Plus size={20} />
                                             </div>
                                          )}
                                       </div>
                                       <input
                                          type="text"
                                          value={photo}
                                          onChange={e => {
                                             const newPhotos = [...(clubIdentity.tp_instagram_photos || Array(6).fill(''))];
                                             while (newPhotos.length < 6) newPhotos.push('');
                                             newPhotos[i] = e.target.value;
                                             setClubIdentity({ ...clubIdentity, tp_instagram_photos: newPhotos });
                                          }}
                                          className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-[9px] focus:outline-none focus:border-saas-primary/50 transition-colors"
                                          placeholder={\`URL foto \${i + 1}\`}
                                       />
                                    </div>
                                 );
                              })}
                           </div>
                        </div>
                     </div>

                     {/* CONTATO */}
                     <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 space-y-5">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="w-8 h-8 rounded-lg bg-saas-primary/10 flex items-center justify-center">
                              <MessageCircle size={16} className="text-saas-primary" />
                           </div>
                           <h4 className="font-manrope font-extrabold text-white uppercase text-sm tracking-tight">Contato & Localização</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Endereço</label>
                              <input
                                 type="text"
                                 value={clubIdentity.tp_address || ''}
                                 onChange={e => setClubIdentity({ ...clubIdentity, tp_address: e.target.value })}
                                 className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-saas-primary/50 transition-colors"
                                 placeholder="Rua dos Esportes, 100 - Centro"
                              />
                           </div>
                           <div>
                              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Telefone Fixo</label>
                              <input
                                 type="text"
                                 value={clubIdentity.tp_contact_phone || ''}
                                 onChange={e => setClubIdentity({ ...clubIdentity, tp_contact_phone: e.target.value })}
                                 className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-saas-primary/50 transition-colors"
                                 placeholder="(11) 3333-4444"
                              />
                           </div>
                           <div>
                              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">E-mail</label>
                              <input
                                 type="email"
                                 value={clubIdentity.tp_email || ''}
                                 onChange={e => setClubIdentity({ ...clubIdentity, tp_email: e.target.value })}
                                 className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-saas-primary/50 transition-colors"
                                 placeholder="contato@gameleirafc.com"
                              />
                           </div>
                           <div>
                              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">WhatsApp</label>
                              <input
                                 type="text"
                                 value={clubIdentity.tp_whatsapp || ''}
                                 onChange={e => setClubIdentity({ ...clubIdentity, tp_whatsapp: e.target.value })}
                                 className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-saas-primary/50 transition-colors"
                                 placeholder="(11) 99999-9999"
                              />
                           </div>
                        </div>
                     </div>

                     {/* REDES SOCIAIS */}
                     <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 space-y-5">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="w-8 h-8 rounded-lg bg-saas-primary/10 flex items-center justify-center">
                              <Globe size={16} className="text-saas-primary" />
                           </div>
                           <h4 className="font-manrope font-extrabold text-white uppercase text-sm tracking-tight">Redes Sociais</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Instagram</label>
                              <input
                                 type="text"
                                 value={clubIdentity.tp_instagram || ''}
                                 onChange={e => setClubIdentity({ ...clubIdentity, tp_instagram: e.target.value })}
                                 className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-saas-primary/50 transition-colors"
                                 placeholder="https://instagram.com/seuperfil"
                              />
                           </div>
                           <div>
                              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Facebook</label>
                              <input
                                 type="text"
                                 value={clubIdentity.tp_facebook || ''}
                                 onChange={e => setClubIdentity({ ...clubIdentity, tp_facebook: e.target.value })}
                                 className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-saas-primary/50 transition-colors"
                                 placeholder="https://facebook.com/seuperfil"
                              />
                           </div>
                           <div>
                              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">X (Twitter)</label>
                              <input
                                 type="text"
                                 value={clubIdentity.tp_twitter_x || ''}
                                 onChange={e => setClubIdentity({ ...clubIdentity, tp_twitter_x: e.target.value })}
                                 className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-saas-primary/50 transition-colors"
                                 placeholder="https://x.com/seuperfil"
                              />
                           </div>
                           <div>
                              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">LinkedIn</label>
                              <input
                                 type="text"
                                 value={clubIdentity.tp_linkedin || ''}
                                 onChange={e => setClubIdentity({ ...clubIdentity, tp_linkedin: e.target.value })}
                                 className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-saas-primary/50 transition-colors"
                                 placeholder="https://linkedin.com/company/seuperfil"
                              />
                           </div>
                           <div>
                              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">YouTube</label>
                              <input
                                 type="text"
                                 value={clubIdentity.tp_youtube || ''}
                                 onChange={e => setClubIdentity({ ...clubIdentity, tp_youtube: e.target.value })}
                                 className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-saas-primary/50 transition-colors"
                                 placeholder="https://youtube.com/@seucanal"
                              />
                           </div>
                           <div>
                              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Canal no WhatsApp</label>
                              <input
                                 type="text"
                                 value={clubIdentity.tp_whatsapp_channel || ''}
                                 onChange={e => setClubIdentity({ ...clubIdentity, tp_whatsapp_channel: e.target.value })}
                                 className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-saas-primary/50 transition-colors"
                                 placeholder="https://whatsapp.com/channel/xxx"
                              />
                           </div>
                        </div>
                     </div>
                  </div>
               )}

`;

content = content.substring(0, insertIdx) + homeTabContent + content.substring(insertIdx);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Home tab added successfully!');
console.log('File length:', content.length);
