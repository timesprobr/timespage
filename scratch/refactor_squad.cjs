const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'Admin.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find and replace the squad section
const startMarker = `{activeTab === 'squad' && (`;
const endMarker = `{activeTab === 'trophies' && (`;

const startIdx = content.indexOf(startMarker);
if (startIdx === -1) {
  console.error('Could not find squad section start');
  process.exit(1);
}

const endIdx = content.indexOf(endMarker, startIdx);
if (endIdx === -1) {
  console.error('Could not find trophies section start');
  process.exit(1);
}

// We need to find the closing of the squad section - go backwards from endIdx to find the line before
// The pattern is: `                )}\r\n\r\n                {activeTab === 'trophies'`
// We need to replace everything from startMarker to just before endMarker

// Find the proper boundary - the line containing startMarker to the blank line before endMarker
let searchBack = endIdx;
while (searchBack > 0 && content[searchBack - 1] !== '\n') searchBack--;
// Now searchBack points to the start of the trophies line - go back one more line (blank line)
searchBack--; // skip \n
while (searchBack > 0 && content[searchBack - 1] !== '\n') searchBack--;

const beforeSquad = content.substring(0, startIdx);
const afterSquad = content.substring(searchBack);

const newSquadSection = `{activeTab === 'squad' && (() => {
                  // Extract unique modalities and categories from loaded data
                  const modalities = [...new Set(players.map(p => p.modality_name).filter(Boolean))] as string[];
                  const categoriesForFilter = [...new Set(players.map(p => p.category_name).filter(Boolean))] as string[];

                  // Apply filters
                  const filtered = players.filter(p => {
                     const matchSearch = !squadSearch || 
                        (p.full_name || '').toLowerCase().includes(squadSearch.toLowerCase()) ||
                        (p.nickname || '').toLowerCase().includes(squadSearch.toLowerCase()) ||
                        (p.position || '').toLowerCase().includes(squadSearch.toLowerCase());
                     const matchModality = squadModalityFilter === 'all' || p.modality_name === squadModalityFilter;
                     const matchCategory = squadCategoryFilter === 'all' || p.category_name === squadCategoryFilter;
                     return matchSearch && matchModality && matchCategory;
                  });

                  // Group by modality > category
                  const grouped: Record<string, Record<string, any[]>> = {};
                  filtered.forEach(p => {
                     const mod = p.modality_name || 'Sem Modalidade';
                     const cat = p.category_name || 'Sem Categoria';
                     if (!grouped[mod]) grouped[mod] = {};
                     if (!grouped[mod][cat]) grouped[mod][cat] = [];
                     grouped[mod][cat].push(p);
                  });

                  const handleSavePlayer = async () => {
                     if (!editingPlayer) return;
                     setSavingPlayer(true);
                     try {
                        const { error } = await supabase.from('athletes').update({
                           nickname: editPlayerForm.nickname,
                           position: editPlayerForm.position,
                           number: editPlayerForm.number ? parseInt(editPlayerForm.number) : null,
                           gender: editPlayerForm.gender,
                        }).eq('id', editingPlayer.id);
                        if (error) throw error;
                        setPlayers(prev => prev.map(p => p.id === editingPlayer.id ? { ...p, ...editPlayerForm, number: editPlayerForm.number ? parseInt(editPlayerForm.number) : p.number } : p));
                        setEditingPlayer(null);
                        setNotification({ message: 'Atleta atualizado com sucesso!', type: 'success' });
                     } catch (err: any) {
                        setNotification({ message: 'Erro ao salvar: ' + err.message, type: 'error' });
                     } finally {
                        setSavingPlayer(false);
                     }
                  };

                  return (
                   <div className="space-y-6">
                      {/* Header */}
                      <div className="flex justify-between items-center">
                         <div>
                            <h3 className="text-xl font-manrope font-extrabold uppercase tracking-tight text-white">Gestão de Elenco</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic mt-1">
                               {players.length} atleta{players.length !== 1 ? 's' : ''} · {modalities.length} modalidade{modalities.length !== 1 ? 's' : ''}
                            </p>
                         </div>
                         {players.length > 0 && (
                            <button className="bg-[#a3e635] text-black px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-lg shadow-saas-primary/20 hover:scale-105">
                               <PlusCircle size={16} strokeWidth={3} /> Adicionar Atleta
                            </button>
                         )}
                      </div>

                      {/* Filters Bar */}
                      {players.length > 0 && (
                         <div className="flex flex-wrap gap-3 p-4 bg-[#121214] border border-white/5 rounded-2xl">
                            {/* Search */}
                            <div className="relative flex-1 min-w-[200px]">
                               <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                               <input
                                  type="text"
                                  placeholder="Buscar atleta..."
                                  value={squadSearch}
                                  onChange={e => setSquadSearch(e.target.value)}
                                  className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-saas-primary/50 transition-colors"
                               />
                            </div>
                            {/* Modality */}
                            <div className="relative">
                               <select
                                  value={squadModalityFilter}
                                  onChange={e => { setSquadModalityFilter(e.target.value); setSquadCategoryFilter('all'); }}
                                  className="appearance-none pl-4 pr-9 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-saas-primary/50 transition-colors cursor-pointer"
                               >
                                  <option value="all" className="bg-zinc-900">Todas Modalidades</option>
                                  {modalities.map(m => <option key={m} value={m} className="bg-zinc-900">{m}</option>)}
                               </select>
                               <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                            </div>
                            {/* Category */}
                            <div className="relative">
                               <select
                                  value={squadCategoryFilter}
                                  onChange={e => setSquadCategoryFilter(e.target.value)}
                                  className="appearance-none pl-4 pr-9 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-saas-primary/50 transition-colors cursor-pointer"
                               >
                                  <option value="all" className="bg-zinc-900">Todas Categorias</option>
                                  {categoriesForFilter
                                     .filter(c => squadModalityFilter === 'all' || players.some(p => p.category_name === c && p.modality_name === squadModalityFilter))
                                     .map(c => <option key={c} value={c} className="bg-zinc-900">{c}</option>)}
                               </select>
                               <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                            </div>
                         </div>
                      )}

                      {players.length === 0 ? (
                         <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-white/5 rounded-[32px] bg-white/5">
                            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                               <ShieldCheck size={24} className="text-zinc-500" />
                            </div>
                            <h4 className="text-xl font-manrope font-extrabold text-white mb-2 uppercase tracking-tight">Nenhum atleta encontrado</h4>
                            <p className="text-sm text-zinc-400 max-w-md mb-8">
                               Se você já possui o plano completo do TimesPro, seus atletas cadastrados no sistema principal aparecerão aqui automaticamente.
                            </p>
                            <button className="bg-[#a3e635] text-black px-8 py-4 rounded-xl font-black text-[12px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-lg shadow-saas-primary/20 hover:scale-105">
                               <PlusCircle size={18} strokeWidth={3} /> Cadastrar Atleta Manualmente
                            </button>
                         </div>
                      ) : filtered.length === 0 ? (
                         <div className="flex flex-col items-center justify-center py-16 text-center">
                            <Search size={32} className="text-zinc-600 mb-4" />
                            <p className="text-zinc-400 text-sm">Nenhum atleta encontrado com os filtros selecionados.</p>
                         </div>
                      ) : (
                         <div className="space-y-10 pb-20">
                            {Object.entries(grouped).map(([modality, cats]) => (
                               <div key={modality}>
                                  {/* Modality Header */}
                                  <div className="flex items-center gap-3 mb-6">
                                     <div className="w-8 h-8 rounded-lg bg-saas-primary/10 flex items-center justify-center">
                                        <ShieldCheck size={16} className="text-saas-primary" />
                                     </div>
                                     <h4 className="text-lg font-manrope font-extrabold uppercase tracking-tight text-white">{modality}</h4>
                                     <div className="flex-1 h-px bg-white/5"></div>
                                  </div>

                                  {Object.entries(cats).map(([category, catPlayers]) => (
                                     <div key={category} className="mb-8">
                                        {/* Category Sub-Header */}
                                        <div className="flex items-center gap-2 mb-4 ml-11">
                                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-saas-primary italic">{category}</span>
                                           <span className="text-[10px] text-zinc-600">({catPlayers.length})</span>
                                        </div>

                                        {/* Player Cards Grid - Vertical Portrait */}
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 ml-11">
                                           {catPlayers.map((p: any) => {
                                              const age = p.birth_date ? calculateAge(new Date(p.birth_date)) : null;
                                              return (
                                                 <div
                                                    key={p.id}
                                                    className="bg-[#121214] border border-white/5 rounded-2xl overflow-hidden group hover:border-saas-primary/30 transition-all hover:shadow-lg hover:shadow-saas-primary/5 cursor-pointer"
                                                 >
                                                    {/* Photo - Portrait */}
                                                    <div className="aspect-[3/4] bg-zinc-900 overflow-hidden relative">
                                                       {p.photo_url ? (
                                                          <img src={p.photo_url} alt={p.nickname || p.full_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                       ) : (
                                                          <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-gradient-to-b from-zinc-800 to-zinc-900">
                                                             <User size={48} strokeWidth={1} />
                                                          </div>
                                                       )}
                                                       {/* Number Badge */}
                                                       <div className="absolute top-2 right-2 min-w-[28px] h-7 flex items-center justify-center px-1.5 bg-black/70 backdrop-blur-sm rounded-lg border border-white/10">
                                                          <span className="text-saas-primary font-black text-sm italic">#{p.number || '00'}</span>
                                                       </div>
                                                       {/* Gradient overlay */}
                                                       <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#121214] to-transparent" />
                                                    </div>

                                                    {/* Info */}
                                                    <div className="p-3 -mt-2 relative">
                                                       <h5 className="font-manrope font-extrabold uppercase text-sm text-white truncate leading-none" title={p.full_name}>
                                                          {p.nickname || p.full_name}
                                                       </h5>
                                                       <p className="text-[9px] font-bold uppercase text-zinc-500 mt-1.5 truncate">
                                                          {p.position || 'Atleta'}
                                                          {age && \` · \${age} anos\`}
                                                       </p>

                                                       {/* Actions */}
                                                       <div className="flex gap-1.5 mt-3">
                                                          <button
                                                             onClick={() => {
                                                                setEditingPlayer(p);
                                                                setEditPlayerForm({
                                                                   nickname: p.nickname || '',
                                                                   position: p.position || '',
                                                                   number: p.number || '',
                                                                   gender: p.gender || '',
                                                                });
                                                             }}
                                                             className="flex-1 py-2 rounded-lg bg-white/5 text-[8px] font-black uppercase text-zinc-400 hover:bg-saas-primary hover:text-black transition-all flex items-center justify-center gap-1.5"
                                                          >
                                                             <Edit3 size={10} /> Editar
                                                          </button>
                                                       </div>
                                                    </div>
                                                 </div>
                                              );
                                           })}
                                        </div>
                                     </div>
                                  ))}
                               </div>
                            ))}
                         </div>
                      )}

                      {/* Edit Player Modal */}
                      {editingPlayer && (
                         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditingPlayer(null)}>
                            <motion.div
                               initial={{ opacity: 0, scale: 0.95, y: 20 }}
                               animate={{ opacity: 1, scale: 1, y: 0 }}
                               className="bg-[#0a0a0b] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
                               onClick={e => e.stopPropagation()}
                            >
                               {/* Modal Header */}
                               <div className="flex items-center gap-4 p-6 border-b border-white/5">
                                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-800 border border-white/10 shrink-0">
                                     {editingPlayer.photo_url ? (
                                        <img src={editingPlayer.photo_url} className="w-full h-full object-cover" />
                                     ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-600"><User size={24} /></div>
                                     )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                     <h4 className="font-manrope font-extrabold text-white uppercase text-base truncate">{editingPlayer.full_name}</h4>
                                     <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                        {editingPlayer.modality_name || 'Sem modalidade'} · {editingPlayer.category_name || 'Sem categoria'}
                                     </p>
                                  </div>
                                  <button onClick={() => setEditingPlayer(null)} className="p-2 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                                     <X size={18} />
                                  </button>
                               </div>

                               {/* Modal Body */}
                               <div className="p-6 space-y-5">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-saas-primary italic">Dados exibidos no Site Oficial</p>

                                  <div className="space-y-4">
                                     {/* Nickname */}
                                     <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Nome do Jogador (apelido)</label>
                                        <input
                                           type="text"
                                           value={editPlayerForm.nickname || ''}
                                           onChange={e => setEditPlayerForm({ ...editPlayerForm, nickname: e.target.value })}
                                           className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-saas-primary/50 transition-colors"
                                           placeholder="Ex: Neymar Jr"
                                        />
                                     </div>

                                     {/* Position */}
                                     <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Posição</label>
                                        <input
                                           type="text"
                                           value={editPlayerForm.position || ''}
                                           onChange={e => setEditPlayerForm({ ...editPlayerForm, position: e.target.value })}
                                           className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-saas-primary/50 transition-colors"
                                           placeholder="Ex: Atacante"
                                        />
                                     </div>

                                     <div className="grid grid-cols-2 gap-4">
                                        {/* Number */}
                                        <div>
                                           <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Nº Camisa</label>
                                           <input
                                              type="number"
                                              value={editPlayerForm.number || ''}
                                              onChange={e => setEditPlayerForm({ ...editPlayerForm, number: e.target.value })}
                                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-saas-primary/50 transition-colors"
                                              placeholder="10"
                                           />
                                        </div>

                                        {/* Gender */}
                                        <div>
                                           <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Gênero</label>
                                           <select
                                              value={editPlayerForm.gender || ''}
                                              onChange={e => setEditPlayerForm({ ...editPlayerForm, gender: e.target.value })}
                                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-saas-primary/50 transition-colors cursor-pointer appearance-none"
                                           >
                                              <option value="" className="bg-zinc-900">Selecionar</option>
                                              <option value="Masculino" className="bg-zinc-900">Masculino</option>
                                              <option value="Feminino" className="bg-zinc-900">Feminino</option>
                                           </select>
                                        </div>
                                     </div>
                                  </div>
                               </div>

                               {/* Modal Footer */}
                               <div className="flex gap-3 p-6 border-t border-white/5">
                                  <button
                                     onClick={() => setEditingPlayer(null)}
                                     className="flex-1 py-3 rounded-xl bg-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-white/10 transition-all"
                                  >
                                     Cancelar
                                  </button>
                                  <button
                                     onClick={handleSavePlayer}
                                     disabled={savingPlayer}
                                     className="flex-1 py-3 rounded-xl bg-[#a3e635] text-black text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50"
                                  >
                                     {savingPlayer ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                                     {savingPlayer ? 'Salvando...' : 'Salvar'}
                                  </button>
                               </div>
                            </motion.div>
                         </div>
                      )}
                   </div>
                  );
                })()}

`;

content = beforeSquad + newSquadSection + afterSquad;

fs.writeFileSync(filePath, content, 'utf8');
console.log('Squad section replaced successfully!');
console.log('New file length:', content.length);
