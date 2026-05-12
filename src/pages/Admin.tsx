import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
   LayoutDashboard,
   Trophy,
   FileText,
   Trash2,
   Edit3,
   X,
   PlusCircle,
   Download,
   FileImage,
   Sun,
   Moon,
   Upload,
   Eye,
   Users,
   ShieldCheck,
   LogOut,
   Plus,
   Palette,
   Globe,
   Image as ImageIcon,
   ChevronLeft,
   ChevronRight,
   TrendingUp,
   Activity,
   ArrowUpRight,
   Zap,
   RefreshCw,
   Target,
   Tag,
   MessageSquare,
   MessageCircle,
   UserPlus,
   User,
   MousePointer2,
   Calendar,
   ExternalLink,
   Home,
   Search,
   Filter,
   Save,
   ChevronDown
} from 'lucide-react';
import {
   AreaChart,
   Area,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer
} from 'recharts';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { CLUB_CONFIG as STATIC_CONFIG } from '../config/club';

const ACTIVE_CONFIG = STATIC_CONFIG;

export default function Admin() {

   const navigate = useNavigate();
   const [loading, setLoading] = useState(true);
   const [activeTab, setActiveTab] = useState<'dashboard' | 'home' | 'news' | 'trophies' | 'transparency' | 'campaign' | 'squad' | 'leads' | 'board' | 'users' | 'identity' | 'conversion'>('dashboard');
   const [theme, setTheme] = useState<'light' | 'dark'>('light');
   const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
   const [session, setSession] = useState<any>(null);
   const [email, setEmail] = useState('');
   const [isEmailSent, setIsEmailSent] = useState(false);
   const [authError, setAuthError] = useState('');
   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
   const [orgName, setOrgName] = useState<string>('');
   const [currentOrgId, setCurrentOrgId] = useState<string | null>(null);

   const calculateAge = (birthDate: Date) => {
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      return age;
   };

   const [news, setNews] = useState<any[]>([]);
   const [trophies, setTrophies] = useState<any[]>([]);
   const [campaigns, setCampaigns] = useState<any[]>([]);
   const [boardMembers, setBoardMembers] = useState<any[]>([]);
   const [reports, setReports] = useState<any[]>([]);
   const [registrations, setRegistrations] = useState<any[]>([]);
   const [socioLeads, setSocioLeads] = useState<any[]>([]);
   const [players, setPlayers] = useState<any[]>([]);
   const [users, setUsers] = useState<any[]>([]);
   const [demographics, setDemographics] = useState<any>({ gender: [], age: [] });

   // Squad filters & edit
   const [squadSearch, setSquadSearch] = useState('');
   const [squadModalityFilter, setSquadModalityFilter] = useState('all');
   const [squadCategoryFilter, setSquadCategoryFilter] = useState('all');
   const [editingPlayer, setEditingPlayer] = useState<any>(null);
   const [editPlayerForm, setEditPlayerForm] = useState<any>({});
   const [savingPlayer, setSavingPlayer] = useState(false);

   const [analyticsData, setAnalyticsData] = useState<any[]>([]);
   const [locationStats, setLocationStats] = useState<any[]>([]);
   const [totalVisits, setTotalVisits] = useState(0);
   const [pageStats, setPageStats] = useState<any[]>([]);
   const [clickMapData, setClickMapData] = useState<any[]>([]);

   const [isAddingNews, setIsAddingNews] = useState(false);
   const [editingNews, setEditingNews] = useState<any>(null);
   const [newsForm, setNewsForm] = useState({
      title: '',
      content: '',
      category: 'Notícias',
      image: '',
      summary: ''
   });

   const [isAddingCampaign, setIsAddingCampaign] = useState(false);
   const [editingCampaign, setEditingCampaign] = useState<any>(null);
   const [campaignForm, setCampaignForm] = useState({
      title: '',
      headline: '',
      subtitle: '',
      buttonText: 'Saiba Mais',
      image_url: '',
      destinationUrl: '',
      type: 'Card',
      active: true,
      mkt_copy: '',
      social_instagram: '',
      responsible_whatsapp: '',
      social_facebook: ''
   });

   const [clubIdentity, setClubIdentity] = useState({
      name: '',
      tp_primary_color: '#a3e635',
      tp_secondary_color: '#000000',
      tp_logo_url: '',
      tp_favicon_url: '',
      tp_email: '',
      tp_phone: '',
      tp_whatsapp: '',
      tp_address: '',
      tp_instagram: '',
      tp_facebook: '',
      tp_twitter_x: '',
      tp_linkedin: '',
      tp_youtube: '',
      tp_active: false,
      tp_short_name: ''
   });

   const [isSaving, setIsSaving] = useState(false);
   const [isProfileOpen, setIsProfileOpen] = useState(false);

   const handleLogin = async (e: FormEvent) => {
      e.preventDefault();
      try {
         setIsSaving(true);
         setAuthError('');
         const { error } = await supabase.auth.signInWithOtp({ 
            email,
            options: {
               emailRedirectTo: `${window.location.origin}/admin`
            }
         });
         if (error) throw error;
         setIsEmailSent(true);
         showNotification('Link de acesso enviado!', 'success');
      } catch (err: any) {
         setAuthError(err.message || 'Erro ao realizar login');
      } finally {
         setIsSaving(false);
      }
   };

   const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 4000);
   };

   const handleFileUpload = async (file: File, bucketName: string = 'noticias') => {
      try {
         const fileExt = file.name.split('.').pop();
         const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
         const filePath = `${fileName}`;

         const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file);

         if (uploadError) {
            console.error(`Erro no bucket ${bucketName}:`, uploadError);
            showNotification(`Erro no upload: ${uploadError.message}`, 'error');
            return null;
         }

         const { data } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

         return data.publicUrl;
      } catch (error) {
         console.error('Erro crítico no upload:', error);
         showNotification('Erro ao processar imagem', 'error');
         return null;
      }
   };

  const fetchData = async (orgId: string | null) => {
      try {
         let newsQuery = supabase.from('news').select('*');
         let trophiesQuery = supabase.from('trophies').select('*');
         let campaignsQuery = supabase.from('campaigns').select('*');
         let boardQuery = supabase.from('board').select('*');
         let transparencyQuery = supabase.from('transparency').select('*');
         let playersQuery = supabase.from('athletes').select('*, athlete_categories(id, name), athlete_modalities(id, name)');
         let viewsQuery = supabase.from('page_views').select('*');
         let usersQuery = supabase.from('profiles').select('*');
         let registrationsQuery = supabase.from('registrations').select('*');
         let socioLeadsQuery = supabase.from('socio_leads').select('*');

         if (orgId) {
            newsQuery = newsQuery.eq('org_id', orgId);
            trophiesQuery = trophiesQuery.eq('org_id', orgId);
            campaignsQuery = campaignsQuery.eq('org_id', orgId);
            boardQuery = boardQuery.eq('org_id', orgId);
            transparencyQuery = transparencyQuery.eq('org_id', orgId);
            registrationsQuery = registrationsQuery.eq('org_id', orgId);
            socioLeadsQuery = socioLeadsQuery.eq('org_id', orgId);
            playersQuery = playersQuery.eq('organization_id', orgId);
            viewsQuery = viewsQuery.eq('org_id', orgId);
         }

         const [
            { data: newsData },
            { data: trophiesData },
            { data: campaignsData },
            { data: boardData },
            { data: reportsData },
            { data: regData },
            { data: socioData },
            { data: playersData },
            { data: viewsData },
            { data: usersData }
         ] = await Promise.all([
            newsQuery.order('createdAt', { ascending: false }),
            trophiesQuery.order('year', { ascending: false }),
            campaignsQuery.order('createdAt', { ascending: false }),
            boardQuery.order('name', { ascending: true }),
            transparencyQuery.order('year', { ascending: false }),
            registrationsQuery.order('created_at', { ascending: false }),
            socioLeadsQuery.order('created_at', { ascending: false }),
            playersQuery.order('full_name', { ascending: true }),
            viewsQuery.order('created_at', { ascending: true }),
            usersQuery
         ]);

         setNews(newsData || []);
         setTrophies(trophiesData || []);
         setCampaigns(campaignsData || []);
         setBoardMembers(boardData || []);
         setReports(reportsData || []);
         setRegistrations(regData || []);
         setSocioLeads(socioData || []);
         // Map relations into flat fields for easier access
         const mappedPlayers = (playersData || []).map((p: any) => ({
            ...p,
            category_name: p.athlete_categories?.name || null,
            modality_name: p.athlete_modalities?.name || null,
         }));
         setPlayers(mappedPlayers);
         setUsers(usersData || []);

         if (viewsData) {
            setTotalVisits(viewsData.length);
            
            // Gráfico de acessos por dia
            const grouped = viewsData.reduce((acc: any, view: any) => {
               const date = new Date(view.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
               acc[date] = (acc[date] || 0) + 1;
               return acc;
            }, {});
            setAnalyticsData(Object.entries(grouped).map(([name, value]) => ({ name, value })));

            // Estatísticas por página
            const pageGroups = viewsData.reduce((acc: any, view: any) => {
               const url = view.url || '/';
               if (!acc[url]) acc[url] = { url, visits: 0, totalDuration: 0, clicks: 0 };
               acc[url].visits += 1;
               acc[url].totalDuration += (view.duration_seconds || 0);
               acc[url].clicks += (view.click_data?.length || 0);
               return acc;
            }, {});

            setPageStats(Object.values(pageGroups).sort((a: any, b: any) => b.visits - a.visits));

            // Mapa de Cliques Agregado
            const allClicks = viewsData.flatMap((v: any) => v.click_data || []);
            setClickMapData(allClicks);

            const locs = viewsData.reduce((acc: any, view: any) => {
               const key = view.city && view.region ? `${view.city}, ${view.region}` : 'Desconhecido';
               acc[key] = (acc[key] || 0) + 1;
               return acc;
            }, {});
            setLocationStats(Object.entries(locs).map(([name, value]) => ({ name, value })).sort((a, b) => (b.value as number) - (a.value as number)));
         }

         const allLeads = [...(regData || []), ...(socioData || [])];
         if (allLeads.length > 0) {
            const genderCounts = allLeads.reduce((acc: any, lead: any) => {
               const g = lead.gender || 'Não Informado';
               acc[g] = (acc[g] || 0) + 1;
               return acc;
            }, {});

            const ageCounts = allLeads.reduce((acc: any, lead: any) => {
               if (!lead.birth_date) return acc;
               const age = calculateAge(new Date(lead.birth_date));
               let bracket = '45+';
               if (age < 25) bracket = '18-24';
               else if (age < 35) bracket = '25-34';
               else if (age < 45) bracket = '35-44';
               acc[bracket] = (acc[bracket] || 0) + 1;
               return acc;
            }, { '18-24': 0, '25-34': 0, '35-44': 0, '45+': 0 });

            setDemographics({
               gender: Object.entries(genderCounts).map(([name, value]) => ({ name, value })),
               age: Object.entries(ageCounts).map(([name, value]) => ({ name, value }))
            });
         }
      } catch (e) {
         console.error('Erro ao carregar dados:', e);
      }
   };

   const handleSaveNews = async (e: FormEvent) => {
      e.preventDefault();
      try {
         setIsSaving(true);
         const orgId = currentOrgId || 'dc1f5d6a-4714-46b2-92cc-5ff423c2b3ed';

         const newsData = {
            ...newsForm,
            org_id: orgId,
            date: new Date().toLocaleDateString('pt-BR'),
            views: editingNews ? editingNews.views : 0
         };

         let result;
         if (editingNews) {
            result = await supabase.from('news').update(newsData).eq('id', editingNews.id);
         } else {
            result = await supabase.from('news').insert([newsData]);
         }

         if (!result.error) {
            showNotification(editingNews ? 'Matéria atualizada com sucesso!' : 'Matéria publicada com sucesso!', 'success');
            setIsAddingNews(false);
            setEditingNews(null);
            setNewsForm({ title: '', content: '', category: 'Notícias', image: '', summary: '' });
            fetchData(currentOrgId);
         } else {
            console.error('Erro Supabase:', result.error);
            showNotification(`Erro ao salvar: ${result.error.message}`, 'error');
         }
      } catch (err) {
         console.error('Erro crítico no salvamento:', err);
         showNotification('Erro interno ao processar a publicação', 'error');
      } finally {
         setIsSaving(false);
      }
   };

   const handleSaveCampaign = async (e: FormEvent) => {
      e.preventDefault();
      try {
         setIsSaving(true);
         const orgId = currentOrgId || 'dc1f5d6a-4714-46b2-92cc-5ff423c2b3ed';

         const campaignData = {
            ...campaignForm,
            organization_id: orgId
         };

         let result;
         if (editingCampaign) {
            result = await supabase.from('campaigns').update(campaignData).eq('id', editingCampaign.id);
         } else {
            result = await supabase.from('campaigns').insert([campaignData]);
         }

         if (!result.error) {
            showNotification(editingCampaign ? 'Campanha atualizada!' : 'Campanha criada!', 'success');
            setIsAddingCampaign(false);
            setEditingCampaign(null);
            setCampaignForm({
               title: '',
               headline: '',
               subtitle: '',
               buttonText: 'Saiba Mais',
               image_url: '',
               destinationUrl: '',
               type: 'Card',
               active: true,
               mkt_copy: '',
               social_instagram: '',
               responsible_whatsapp: '',
               social_facebook: ''
            });
            fetchData(orgId);
         } else {
            showNotification(`Erro: ${result.error.message}`, 'error');
         }
      } catch (err) {
         showNotification('Erro ao salvar campanha', 'error');
      } finally {
         setIsSaving(false);
      }
   };

   const handleDeleteCampaign = async (id: string) => {
      if (!confirm('Deseja realmente excluir esta campanha?')) return;
      try {
         const { error } = await supabase.from('campaigns').delete().eq('id', id);
         if (!error) {
            showNotification('Campanha excluída!');
            fetchData(currentOrgId);
         }
      } catch (err) {
         showNotification('Erro ao excluir', 'error');
      }
   };

   useEffect(() => {
      document.title = "TimesPage - Construa seu site";
      
      let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (!favicon) {
         favicon = document.createElement('link');
         favicon.rel = 'icon';
         document.head.appendChild(favicon);
      }
      favicon.href = '/icon%20timespro.jpg';

      // Verificar sessão e carregar organização
      const initializeAdmin = async () => {
         const { data: { session: currentSession } } = await supabase.auth.getSession();
         setSession(currentSession);
         
         const params = new URLSearchParams(window.location.search);
         let targetOrgId = params.get('orgId');

         if (currentSession?.user) {
            // Tenta pegar do banco de dados caso seja um login fresco
            const { data: profile } = await supabase
               .from('profiles')
               .select('organization_id')
               .eq('id', currentSession.user.id)
               .single();

            if (profile?.organization_id) {
               targetOrgId = profile.organization_id;
               
               // Se a URL não tiver o orgId, vamos adicionar para manter consistência
               if (!params.get('orgId')) {
                  const url = new URL(window.location.href);
                  url.searchParams.set('orgId', targetOrgId);
                  window.history.replaceState({}, '', url);
               }
            }
         }

         if (targetOrgId) {
            setCurrentOrgId(targetOrgId);
            // Busca o nome do clube e identidade
            supabase.from('organizations').select('*').eq('id', targetOrgId).single().then(({ data }) => {
               if (data) {
                  setOrgName(data.name);
                  document.title = `Admin - ${data.name}`;
                  setClubIdentity({
                     name: data.name || '',
                     tp_primary_color: data.tp_primary_color || '#a3e635',
                     tp_secondary_color: data.tp_secondary_color || '#000000',
                     tp_logo_url: data.tp_logo_url || data.logo_url || '',
                     tp_favicon_url: data.tp_favicon_url || data.logo_url || '',
                     tp_email: data.tp_email || '',
                     tp_phone: data.tp_phone || '',
                     tp_whatsapp: data.tp_whatsapp || '',
                     tp_address: data.tp_address || '',
                     tp_instagram: data.tp_instagram || '',
                     tp_facebook: data.tp_facebook || '',
                     tp_twitter_x: data.tp_twitter_x || '',
                     tp_linkedin: data.tp_linkedin || '',
                     tp_youtube: data.tp_youtube || '',
                     tp_active: data.tp_active || false,
                     tp_short_name: data.tp_short_name || '',
                     tp_hero_image_url: data.tp_hero_image_url || '',
                     tp_hero_phrase: data.tp_hero_phrase || '',
                     tp_instagram_handle: data.tp_instagram_handle || '',
                     tp_instagram_link: data.tp_instagram_link || '',
                     tp_instagram_photos: data.tp_instagram_photos || [],
                     tp_contact_phone: data.tp_contact_phone || '',
                     tp_whatsapp_channel: data.tp_whatsapp_channel || '',
                  });
               }
            });
            fetchData(targetOrgId);
         } else {
            fetchData(null);
         }

         setLoading(false);
      };
      initializeAdmin();

      // Escutar mudanças de autenticação
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        if (_event === 'SIGNED_IN') {
           initializeAdmin();
        }
      });

      // Forçar Light Mode para alinhar com o sistema principal
      setTheme('light');

      return () => {
         subscription.unsubscribe();
      };
      setLoading(false);
   }, []);

   if (loading) {
      return (
         <div className="h-screen bg-[#09090b] flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-saas-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-saas-primary animate-pulse">Autenticando...</p>
         </div>
      );
   }

   if (!session) {
      return (
         <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-saas-primary/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-saas-primary/5 blur-[120px] rounded-full"></div>
            
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="w-full max-w-md relative z-10"
            >
               <div className="bg-[#121214] border border-white/5 p-10 rounded-[32px] shadow-2xl">
                  <div className="flex flex-col items-center mb-10">
                     <div className="w-16 h-16 rounded-full border border-white/10 mb-4 shadow-xl overflow-hidden bg-black flex items-center justify-center">
                        <img src="/icon%20timespro.jpg" alt="Logo TimesPage" className="w-full h-full object-cover" />
                     </div>
                     <h1 className="text-2xl font-manrope font-extrabold uppercase tracking-tight text-white">TimesPage</h1>
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-saas-primary mt-2 italic text-center">Construtor de Site para Times</p>
                  </div>

                  {isEmailSent ? (
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center text-center space-y-4 py-4"
                     >
                        <div className="w-16 h-16 rounded-full bg-saas-primary/10 flex items-center justify-center border border-saas-primary/20">
                           <Zap size={24} className="text-saas-primary animate-pulse" />
                        </div>
                        <h2 className="text-white font-bold uppercase tracking-tight">Verifique seu e-mail</h2>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
                           Enviamos um link de acesso para <span className="text-white">{email}</span>.<br/>Clique no link para entrar no sistema.
                        </p>
                        <button 
                           onClick={() => setIsEmailSent(false)}
                           className="text-[9px] font-black uppercase tracking-[0.2em] text-saas-primary hover:underline mt-4"
                        >
                           Tentar outro e-mail
                        </button>
                     </motion.div>
                  ) : (
                     <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] ml-1">E-mail de Acesso</label>
                           <div className="relative">
                              <input 
                                 type="email" 
                                 required
                                 value={email}
                                 onChange={e => setEmail(e.target.value)}
                                 className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 pl-12 text-sm font-bold text-white outline-none focus:border-saas-primary/50 transition-all"
                                 placeholder="seu-email@exemplo.com"
                              />
                              <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                           </div>
                           <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-tight ml-1 italic">* Use o mesmo e-mail utilizado na compra.</p>
                        </div>

                        {authError && (
                           <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-tight"
                           >
                              {authError}
                           </motion.div>
                        )}

                        <button 
                           type="submit" 
                           disabled={isSaving}
                           className="w-full bg-saas-primary text-black font-black uppercase tracking-[0.3em] text-[11px] py-4 rounded-2xl shadow-[0_10px_30px_rgba(163,230,53,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                           {isSaving ? 'Enviando Link...' : 'Receber Link de Acesso'}
                        </button>
                     </form>
                  )}
               </div>

               <div className="mt-8 flex flex-col items-center gap-4">
                  <a 
                     href="https://www.timespro.com.br" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="group flex flex-col items-center gap-2"
                  >
                     <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 group-hover:bg-saas-primary/10 group-hover:border-saas-primary/30 transition-all">
                        <img src="/icon%20timespro.jpg" alt="TimesPro Logo" className="w-3 h-3 rounded-full object-cover" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-saas-primary">TimesPro</span>
                        <div className="w-[1px] h-3 bg-white/10"></div>
                        <span className="text-[9px] font-bold text-zinc-500 group-hover:text-white transition-colors">www.timespro.com.br</span>
                        <ArrowUpRight size={10} className="text-zinc-600 group-hover:text-saas-primary transition-colors" />
                     </div>
                     <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-tight">Conheça a solução completa para a gestão do seu clube</p>
                  </a>
               </div>
            </motion.div>
         </div>
      );
   }

   return (
      <div className="min-h-screen flex bg-[#09090b] text-white font-sans overflow-hidden">
         {notification && (
            <div className={`fixed bottom-8 right-8 z-[500] flex items-center gap-4 px-8 py-5 border shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-300 ${notification.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-[#a3e635]/20 border-[#a3e635]/30 text-white'} rounded-[24px]`}>
               <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notification.type === 'error' ? 'bg-red-500/20' : 'bg-[#a3e635] text-black shadow-[0_0_15px_rgba(163,230,53,0.5)]'}`}>
                  {notification.type === 'error' ? <X size={14} strokeWidth={3} /> : <Zap size={14} strokeWidth={3} fill="currentColor" />}
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 italic">Notificação do Sistema</span>
                  <p className="text-xs font-bold uppercase tracking-tight">{notification.message}</p>
               </div>
            </div>
         )}

         {/* Sidebar - Premium Sports Dark */}
         <aside
            style={{ width: isSidebarCollapsed ? 80 : 280 }}
            className="h-screen bg-[#121214] border-r border-white/5 sticky top-0 flex flex-col transition-all duration-300 z-50 shadow-2xl"
         >
            <div className="p-6 h-24 flex items-center gap-3">
               {!isSidebarCollapsed ? (
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 flex items-center justify-center bg-zinc-800 rounded-xl p-1.5 shadow-inner border border-white/5">
                        <img src={clubIdentity.tp_logo_url || ACTIVE_CONFIG.logo.main} alt="Club Logo" className="w-full h-full object-contain" />
                     </div>
                     <div className="flex flex-col">
                        <span className="font-manrope font-bold uppercase tracking-tight text-sm leading-none text-white">{orgName || ACTIVE_CONFIG.shortName}</span>
                     </div>
                  </div>
               ) : (
                  <div className="w-10 h-10 flex items-center justify-center bg-zinc-800 rounded-xl p-1.5 mx-auto border border-white/5 shadow-inner">
                     <img src={clubIdentity.tp_logo_url || ACTIVE_CONFIG.logo.main} alt="Club Logo" className="w-full h-full object-contain" />
                  </div>
               )}
            </div>

            <button
               onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
               className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#121214] border border-white/10 flex items-center justify-center transition-all z-[60] text-zinc-500 shadow-xl hover:text-white"
            >
               {isSidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
            </button>

            <nav className="flex-1 p-3 space-y-4 overflow-y-auto custom-scrollbar">
               <div>
                  {!isSidebarCollapsed && <span className="px-4 text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-600 italic mb-2 block">Analytics</span>}
                  <div className="space-y-1">
                     {[
                        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
                        
                        { id: 'leads', label: 'Leads & CRM', icon: Users },
                     ].map((item) => (
                        <button
                           key={item.id}
                           onClick={() => setActiveTab(item.id as any)}
                           className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all relative group ${activeTab === item.id ? 'bg-[#a3e635] text-black shadow-[0_0_20px_rgba(163,230,53,0.3)]' : 'text-zinc-500 hover:bg-white/5 hover:text-white'} ${isSidebarCollapsed ? 'justify-center' : ''}`}
                        >
                           <item.icon size={18} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                           {!isSidebarCollapsed && <span className="text-[7px] font-bold uppercase tracking-wider">{item.label}</span>}
                        </button>
                     ))}
                  </div>
               </div>

               <div>
                  {!isSidebarCollapsed && <span className="px-4 text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-600 italic mb-2 block">Conteúdo</span>}
                  <div className="space-y-1">
                     {[
                        { id: 'home', label: 'Home', icon: Home },
                        { id: 'news', label: 'Notícias', icon: FileText },
                        { id: 'squad', label: 'Elenco', icon: ShieldCheck },
                        { id: 'trophies', label: 'Títulos', icon: Trophy },
                        { id: 'campaign', label: 'Campanhas', icon: FileImage },
                     ].map((item) => (
                        <button
                           key={item.id}
                           onClick={() => setActiveTab(item.id as any)}
                           className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all relative group ${activeTab === item.id ? 'bg-[#a3e635] text-black shadow-[0_0_20px_rgba(163,230,53,0.3)]' : 'text-zinc-500 hover:bg-white/5 hover:text-white'} ${isSidebarCollapsed ? 'justify-center' : ''}`}
                        >
                           <item.icon size={18} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                           {!isSidebarCollapsed && <span className="text-[7px] font-bold uppercase tracking-wider">{item.label}</span>}
                        </button>
                     ))}
                  </div>
               </div>

               <div>
                  {!isSidebarCollapsed && <span className="px-4 text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-600 italic mb-2 block">Gestão</span>}
                  <div className="space-y-1">
                     {[
                        { id: 'transparency', label: 'Transparência', icon: FileText },
                        { id: 'board', label: 'Diretoria', icon: Users },
                        { id: 'identity', label: 'Marca & Visual', icon: Palette },
                        { id: 'users', label: 'Controle de Acesso', icon: ShieldCheck },
                     ].map((item) => (
                        <button
                           key={item.id}
                           onClick={() => setActiveTab(item.id as any)}
                           className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all relative group ${activeTab === item.id ? 'bg-[#a3e635] text-black shadow-[0_0_20px_rgba(163,230,53,0.3)]' : 'text-zinc-500 hover:bg-white/5 hover:text-white'} ${isSidebarCollapsed ? 'justify-center' : ''}`}
                        >
                           <item.icon size={18} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                           {!isSidebarCollapsed && <span className="text-[7px] font-bold uppercase tracking-wider">{item.label}</span>}
                        </button>
                     ))}
                  </div>
               </div>
            </nav>

            <div className="p-3 border-t border-white/5">
               <button
                  onClick={() => {
                     window.open(currentOrgId ? `/?orgId=${currentOrgId}` : '/', '_blank');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all border border-white/5 bg-white/5 hover:bg-white/10 group"
               >
                  <Globe size={18} className="text-saas-primary" />
                  {!isSidebarCollapsed && (
                     <div className="flex flex-col items-start">
                        <span className="text-[9px] font-manrope font-bold uppercase tracking-tight text-white">Visitar Site</span>
                        <span className="text-[8px] font-bold uppercase text-zinc-500">Online Now</span>
                     </div>
                  )}
               </button>
            </div>
         </aside>

         {/* Main Content */}
         <main className="flex-1 flex flex-col h-screen overflow-hidden">
            <header className="h-20 bg-[#121214] border-b border-white/5 flex items-center justify-between px-8 shrink-0 relative">
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic text-center">Ecossistema</span>
                  <span className="text-white/10">/</span>
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-saas-primary italic">{activeTab}</span>
               </div>

               <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-800 border border-white/5 shadow-inner">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Builder do Site Oficial</span>
                  <div className="w-[1px] h-3 bg-white/10 mx-1" />
                  <span className="text-[10px] font-black uppercase tracking-tight text-white">{orgName || ACTIVE_CONFIG.shortName}</span>
               </div>

               <div className="flex items-center gap-4 relative">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 border border-white/5 hover:bg-zinc-700 transition-all group">
                     <MessageCircle size={16} className="text-saas-primary" />
                     <span className="text-[9px] font-bold uppercase text-zinc-400 group-hover:text-white tracking-widest">Suporte</span>
                  </button>

                  <div className="w-[1px] h-6 bg-white/5 mx-1" />

                  <div className="relative">
                     <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className={`p-2.5 rounded-xl transition-all border ${isProfileOpen ? 'bg-saas-primary text-black border-saas-primary' : 'bg-zinc-800 text-zinc-400 border-white/5 hover:text-white'}`}
                     >
                        <User size={18} />
                     </button>

                     {isProfileOpen && (
                        <>
                           <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                           <div className="absolute right-0 mt-3 w-64 bg-[#121214] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                              <div className="p-5 border-b border-white/5">
                                 <p className="text-[8px] font-bold uppercase text-zinc-500 tracking-[0.2em] mb-1.5">Administrador</p>
                                 <p className="text-[11px] font-bold text-white truncate">{session?.user?.email}</p>
                              </div>
                              <div className="p-2">
                                 <button
                                    onClick={async () => {
                                       await supabase.auth.signOut();
                                       setSession(null);
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
               </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#09090b]">
               {activeTab === 'dashboard' && (
                  <div className="space-y-8 pb-12">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                           <h1 className="text-xl font-manrope font-extrabold uppercase tracking-tight text-white">Dashboard</h1>
                           <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 mt-1">Gestão Analítica de Alta Performance</p>
                        </div>
                     </div>

                     {/* Hyper-Compact Stat Grid */}
                     <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        {[
                           { label: 'Total de visitas', value: totalVisits, icon: TrendingUp, color: 'text-saas-primary', bg: 'bg-saas-primary/10', trend: '+14%' },
                           { label: 'Notícias ativas', value: news.length, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10', trend: 'Portal' },
                           { label: 'Total de leitura', value: news.reduce((acc, curr) => acc + (curr.views || 0), 0), icon: Eye, color: 'text-emerald-400', bg: 'bg-emerald-400/10', trend: 'Leituras' },
                           { label: 'Cadastros recebidos', value: registrations.length + socioLeads.length, icon: UserPlus, color: 'text-purple-400', bg: 'bg-purple-400/10', trend: 'Leads' },
                           { label: 'Cliques campanhas', value: campaigns.reduce((acc, curr) => acc + (curr.clicks || 0), 0), icon: MousePointer2, color: 'text-orange-400', bg: 'bg-orange-400/10', trend: 'Conversão' },
                        ].map((stat, i) => (
                           <div key={i} className="p-4 bg-[#121214] border border-white/5 rounded-2xl shadow-xl hover:border-saas-primary/40 transition-all group flex items-center gap-4">
                              <div className={`w-12 h-12 shrink-0 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center border border-white/5`}>
                                 <stat.icon size={20} strokeWidth={2.5} />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <div className="flex items-center justify-between gap-2 mb-0.5">
                                    <h3 className="text-xl font-manrope font-extrabold leading-none text-white tracking-tight truncate">{stat.value}</h3>
                                    <span className="text-[8px] font-bold text-saas-primary uppercase tracking-widest">{stat.trend}</span>
                                 </div>
                                 <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-zinc-500 truncate">{stat.label}</p>
                              </div>
                           </div>
                        ))}
                     </div>



                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Evolução de Tráfego */}
                        <div className="lg:col-span-2 p-6 bg-[#121214] border border-white/5 rounded-2xl shadow-xl relative overflow-hidden">
                           <div className="flex items-center justify-between mb-8">
                              <div>
                                 <h3 className="text-lg font-manrope font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
                                    <TrendingUp size={18} className="text-saas-primary" /> Evolução de Tráfego
                                 </h3>
                                 <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mt-1">Monitoramento de acessos em tempo real</p>
                              </div>
                           </div>
                           <div className="h-[350px] w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart data={analyticsData.length > 0 ? analyticsData : [{ name: 'Sem Dados', value: 0 }]}>
                                    <defs>
                                       <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#a3e635" stopOpacity={0.2} />
                                          <stop offset="95%" stopColor="#a3e635" stopOpacity={0} />
                                       </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#52525b' }} dy={10} />
                                    <YAxis hide />
                                    <Tooltip
                                       contentStyle={{ backgroundColor: '#121214', borderRadius: '16px', border: '1px solid rgba(163,230,53,0.1)', color: '#fff' }}
                                       itemStyle={{ color: '#a3e635', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase' }}
                                       labelStyle={{ color: '#52525b', fontWeight: 900, fontSize: '10px', marginBottom: '4px' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#a3e635" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                                 </AreaChart>
                              </ResponsiveContainer>
                           </div>
                        </div>

                        {/* Top Páginas Widget */}
                        <div className="p-4 bg-[#121214] border border-white/5 rounded-2xl shadow-xl flex flex-col">
                           <div className="flex items-center justify-between mb-4">
                              <h3 className="text-sm font-manrope font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
                                 <Globe size={16} className="text-saas-primary" /> Páginas Mais Visitadas
                              </h3>
                              
                           </div>
                           <div className="space-y-3 flex-1">
                              {pageStats.slice(0, 8).map((page, i) => (
                                 <div key={i} className="flex items-center justify-between group p-2 rounded-xl hover:bg-white/5 transition-all">
                                    <div className="flex flex-col min-w-0">
                                       <span className="text-[10px] font-extrabold text-white truncate uppercase tracking-tight group-hover:text-saas-primary transition-colors cursor-pointer">{page.url}</span>
                                       <div className="flex items-center gap-2 mt-0.5">
                                          <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                                             <Activity size={8} /> {Math.round(page.totalDuration / page.visits)}s de permanência
                                          </span>
                                       </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                       <span className="text-[10px] font-black text-white">{page.visits}</span>
                                       <span className="text-[7px] font-bold text-zinc-600 uppercase">Visitas</span>
                                    </div>
                                 </div>
                              ))}
                              {pageStats.length === 0 && (
                                 <div className="flex flex-col items-center justify-center h-full py-10 text-zinc-600 gap-2 opacity-50">
                                    <Activity size={24} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Sem dados de acesso</span>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>

                     {/* Nova Sessão de Conversão Rápida */}
                     <div className="p-4 bg-[#121214] border border-white/5 rounded-2xl shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                           <h3 className="text-sm font-manrope font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
                              <Target size={16} className="text-saas-primary" /> Conversão & Performance
                           </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                           <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Taxa de Conversão</span>
                              <div className="text-xl font-manrope font-extrabold text-white mt-1">4.2%</div>
                           </div>
                           <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Tempo Médio Site</span>
                              <div className="text-xl font-manrope font-extrabold text-saas-primary mt-1">2m 45s</div>
                           </div>
                           <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Cliques no Whatsapp</span>
                              <div className="text-xl font-manrope font-extrabold text-white mt-1">128</div>
                           </div>
                           <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Novos Sócios (Hoje)</span>
                              <div className="text-xl font-manrope font-extrabold text-saas-primary mt-1">+12</div>
                           </div>
                        </div>
                     </div>


                  </div>
               )}

                {activeTab === 'news' && (
                  <div className="space-y-4">
                     <div className="flex justify-between items-center bg-[#121214] p-4 rounded-2xl border border-white/5">
                        <div>
                           <h3 className="text-[20px] font-manrope font-extrabold uppercase tracking-tight text-white leading-none">Notícias</h3>
                           <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 italic mt-1">Conteúdo do Portal</p>
                        </div>
                        <button 
                           onClick={() => { setEditingNews(null); setNewsForm({ title: '', content: '', category: 'Notícias', image: '', summary: '' }); setIsAddingNews(true); }}
                           className="bg-[#a3e635] text-black px-4 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-2 transition-all shadow-lg shadow-saas-primary/20 hover:scale-105 active:scale-95"
                        >
                           <PlusCircle size={14} strokeWidth={3} /> Criar Matéria
                        </button>
                     </div>
                     <div className="grid grid-cols-1 gap-2 pb-20">
                        {news.length === 0 ? (
                           <div className="bg-[#121214] border border-white/5 rounded-[24px] p-12 flex flex-col items-center justify-center text-center">
                              <FileText size={32} className="text-zinc-700 mb-4" />
                              <h4 className="text-sm font-black text-white uppercase italic tracking-tight">Sem publicações</h4>
                           </div>
                        ) : (
                           news.map(n => (
                              <div key={n.id} className="group bg-[#121214] border border-white/5 rounded-[16px] p-3 hover:border-saas-primary/30 transition-all flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/5 bg-zinc-800 shrink-0">
                                       <img src={n.image || 'https://via.placeholder.com/400x400'} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                       <div className="absolute top-0.5 left-0.5">
                                          <span className="px-1.5 py-0.5 rounded bg-saas-primary text-black text-[6px] font-black uppercase tracking-widest">
                                             {n.category}
                                          </span>
                                       </div>
                                    </div>
                                    <div className="flex flex-col">
                                       <div className="flex items-center gap-2 mb-0.5">
                                          <div className="flex items-center gap-1 text-zinc-500">
                                             <Calendar size={10} />
                                             <span className="text-[7px] font-bold uppercase tracking-widest">{new Date(n.created_at).toLocaleDateString('pt-BR')}</span>
                                          </div>
                                          <div className="flex items-center gap-1 text-zinc-500">
                                             <Eye size={10} />
                                             <span className="text-[7px] font-bold uppercase tracking-widest">{n.views || 0} LEITURAS</span>
                                          </div>
                                       </div>
                                       <h4 className="text-[13px] font-bold text-white uppercase italic tracking-tight line-clamp-1 leading-tight group-hover:text-saas-primary transition-colors">{n.title}</h4>
                                       <p className="text-[9px] text-zinc-500 line-clamp-1 opacity-60 font-medium italic">{n.summary || 'Sem resumo disponível...'}</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <a href={`/noticias/${n.id}`} target="_blank" className="p-2 rounded-lg bg-white/5 text-zinc-500 hover:text-white transition-all">
                                       <Eye size={14} />
                                    </a>
                                    <button 
                                       onClick={() => {
                                          setEditingNews(n);
                                          setNewsForm({ title: n.title, content: n.content, category: n.category, image: n.image, summary: n.summary || '' });
                                          setIsAddingNews(true);
                                       }}
                                       className="p-2 rounded-lg bg-white/5 text-zinc-500 hover:text-saas-primary transition-all"
                                    >
                                       <Edit3 size={14} />
                                    </button>
                                 </div>
                              </div>
                           ))
                        )}
                     </div>
                  </div>
               )}

               {activeTab === 'home' && (
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
                                             <img src={photo} className="w-full h-full object-cover" alt={`Foto ${i + 1}`} />
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
                                          placeholder={`URL foto ${i + 1}`}
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

               {activeTab === 'squad' && (() => {
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
                                                          {age && ` · ${age} anos`}
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


               {activeTab === 'trophies' && (
                  <div className="space-y-6">
                     <div className="flex justify-between items-center">
                        <div>
                           <h3 className="text-xl font-manrope font-extrabold uppercase tracking-tight text-white">Galeria de Títulos</h3>
                           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic mt-1">A história vitoriosa do clube</p>
                        </div>
                        <button className="bg-[#a3e635] text-black px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-lg shadow-saas-primary/20 hover:scale-105">
                           <PlusCircle size={16} strokeWidth={3} /> Novo Título
                        </button>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-20">
                        {trophies.map(t => (
                           <div key={t.id} className="bg-[#121214] border border-white/5 rounded-[32px] p-6 group hover:border-saas-primary/30 transition-all text-center">
                              <div className="w-20 h-20 bg-saas-primary/10 rounded-full flex items-center justify-center text-saas-primary mx-auto mb-6 border border-saas-primary/10 group-hover:scale-110 transition-transform">
                                 <Trophy size={32} strokeWidth={2.5} />
                              </div>
                              <span className="text-[10px] font-black text-saas-primary italic uppercase tracking-widest">{t.year}</span>
                              <h4 className="font-manrope font-extrabold uppercase text-xl text-white mt-2 leading-tight">{t.title}</h4>
                              <p className="text-[9px] font-black uppercase text-zinc-500 mt-4 italic leading-relaxed">{t.description}</p>
                              <div className="flex gap-2 mt-8">
                                 <button className="flex-1 py-3 rounded-xl bg-white/5 text-[9px] font-black uppercase text-zinc-400 hover:bg-saas-primary hover:text-black transition-all">Editar</button>
                                 <button className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

                {activeTab === 'campaign' && (
                   <div className="space-y-4">
                      <div className="flex justify-between items-center bg-[#121214] p-4 rounded-2xl border border-white/5">
                         <div>
                            <h3 className="text-[20px] font-manrope font-extrabold uppercase tracking-tight text-white leading-none">Campanhas</h3>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 italic mt-1">Marketing e Conversão</p>
                         </div>
                         <button 
                            onClick={() => {
                               setEditingCampaign(null);
                               setCampaignForm({
                                  title: '',
                                  headline: '',
                                  subtitle: '',
                                  buttonText: 'Saiba Mais',
                                  image_url: '',
                                  destinationUrl: '',
                                  type: 'card',
                                  active: true,
                                  mkt_copy: '',
                                  social_instagram: '',
                                  responsible_whatsapp: '',
                                  social_facebook: ''
                               });
                               setIsAddingCampaign(true);
                            }} 
                            className="bg-[#a3e635] text-black px-4 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-2 transition-all shadow-lg shadow-saas-primary/20 hover:scale-105 active:scale-95"
                         >
                            <PlusCircle size={14} strokeWidth={3} /> Nova Campanha
                         </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                         {campaigns.length === 0 ? (
                            <div className="col-span-full bg-[#121214] border border-white/5 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                               <Target size={48} className="text-zinc-700 mb-4" />
                               <h4 className="text-sm font-black text-white uppercase italic tracking-tight">Sem campanhas ativas</h4>
                               <p className="text-[10px] text-zinc-500 uppercase mt-2">Crie sua primeira campanha para começar a converter</p>
                            </div>
                         ) : (
                            campaigns.map(c => (
                               <div key={c.id} className="group bg-[#121214] border border-white/5 rounded-[32px] overflow-hidden hover:border-saas-primary/50 transition-all flex flex-col shadow-2xl relative">
                                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                                     <img src={c.image_url || c.image || 'https://via.placeholder.com/1200x800'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                     <div className="absolute top-4 left-4">
                                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl ${c.type?.toLowerCase() === 'popup' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'}`}>
                                           {c.type}
                                        </span>
                                     </div>
                                     <div className="absolute top-4 right-4">
                                        <div className={`w-3 h-3 rounded-full border-2 border-[#121214] shadow-lg ${c.active ? 'bg-saas-primary animate-pulse' : 'bg-zinc-700'}`}></div>
                                     </div>
                                     <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent opacity-60"></div>
                                  </div>
                                  
                                  <div className="p-6 flex-1 flex flex-col">
                                     <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-black text-saas-primary uppercase italic tracking-[0.2em]">{c.title?.split(' ')[0] || 'CAMPANHA'}</span>
                                        <span className="text-white/10 text-[10px]">|</span>
                                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                                           <Calendar size={10} /> {new Date(c.createdAt || c.created_at).toLocaleDateString('pt-BR')}
                                        </span>
                                     </div>
                                     
                                     <h4 className="text-lg font-extrabold text-white uppercase italic tracking-tight line-clamp-2 leading-[1.1] mb-4 group-hover:text-saas-primary transition-colors">{c.headline}</h4>
                                     
                                     <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex flex-col">
                                           <span className="text-[10px] font-black text-white">{c.clicks || 0}</span>
                                           <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Interações</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                           <button 
                                              onClick={() => {
                                                 setEditingCampaign(c);
                                                 setCampaignForm({
                                                    title: c.title,
                                                    headline: c.headline,
                                                    subtitle: c.subtitle,
                                                    buttonText: c.buttonText,
                                                    image_url: c.image_url || c.image,
                                                    destinationUrl: c.destinationUrl,
                                                    type: c.type,
                                                    active: c.active,
                                                    mkt_copy: c.mkt_copy || '',
                                                    social_instagram: c.social_instagram || '',
                                                    responsible_whatsapp: c.responsible_whatsapp || '',
                                                    social_facebook: c.social_facebook || ''
                                                 });
                                                 setIsAddingCampaign(true);
                                              }}
                                              className="p-3 rounded-xl bg-white/5 text-zinc-400 hover:text-saas-primary hover:bg-saas-primary/10 transition-all border border-white/5"
                                           >
                                              <Edit3 size={16} />
                                           </button>
                                           <button 
                                              onClick={() => handleDeleteCampaign(c.id)}
                                              className="p-3 rounded-xl bg-white/5 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all border border-white/5"
                                           >
                                              <Trash2 size={16} />
                                           </button>
                                        </div>
                                     </div>
                                  </div>
                               </div>
                            ))
                         )}
                      </div>

                   </div>
                )}

               {activeTab === 'conversion' && (
                  <div className="space-y-8 pb-12">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                           <h1 className="text-lg font-manrope font-extrabold uppercase tracking-tight text-white">Análise de Conversão</h1>
                           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 mt-1">Entenda o comportamento e a jornada do usuário</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Páginas Mais Visitadas */}
                        <div className="bg-[#121214] border border-white/5 rounded-[32px] overflow-hidden flex flex-col">
                           <div className="p-6 border-b border-white/5 flex items-center justify-between">
                              <h3 className="text-sm font-manrope font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
                                 <FileText size={16} className="text-saas-primary" /> Páginas Mais Visitadas
                              </h3>
                           </div>
                           <div className="flex-1 overflow-x-auto">
                              <table className="w-full text-left">
                                 <thead>
                                    <tr className="bg-white/2 border-b border-white/5">
                                       <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-zinc-500">URL / Página</th>
                                       <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-zinc-500 text-center">Acessos</th>
                                       <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-zinc-500 text-center">Tempo Médio</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-white/5">
                                    {pageStats.slice(0, 8).map((page, i) => (
                                       <tr key={i} className="hover:bg-white/2 transition-colors">
                                          <td className="px-6 py-4">
                                             <span className="text-[10px] font-bold text-white uppercase tracking-tight">{page.url}</span>
                                          </td>
                                          <td className="px-6 py-4 text-center">
                                             <span className="text-[10px] font-black text-saas-primary">{page.visits}</span>
                                          </td>
                                          <td className="px-6 py-4 text-center">
                                             <span className="text-[10px] font-black text-zinc-400">
                                                {Math.round(page.totalDuration / page.visits)}s
                                             </span>
                                          </td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>
                        </div>

                        {/* Mapa de Cliques (Simulação Visual) */}
                        <div className="bg-[#121214] border border-white/5 rounded-[32px] p-6 flex flex-col">
                           <div className="flex items-center justify-between mb-6">
                              <h3 className="text-sm font-manrope font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
                                 <MousePointer2 size={16} className="text-saas-primary" /> Intensidade de Cliques
                              </h3>
                              <span className="text-[9px] font-black uppercase text-zinc-500 italic">Mapa de Calor</span>
                           </div>
                           
                           <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center group">
                              {/* Visualização abstrata do heatmap */}
                              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(163,230,53,0.3)_0%,transparent_70%)]"></div>
                              
                              {clickMapData.slice(0, 100).map((click, i) => (
                                 <div 
                                    key={i}
                                    className="absolute w-2 h-2 rounded-full bg-saas-primary/30 blur-[2px]"
                                    style={{ 
                                       left: `${click.x}%`, 
                                       top: `${click.y}%`,
                                       transform: 'translate(-50%, -50%)'
                                    }}
                                 />
                              ))}

                              <div className="relative z-10 text-center p-8">
                                 <div className="w-16 h-16 bg-saas-primary/10 rounded-full flex items-center justify-center text-saas-primary mx-auto mb-4 border border-saas-primary/20">
                                    <Activity size={32} />
                                 </div>
                                 <p className="text-[10px] font-black uppercase text-white tracking-widest mb-1">{clickMapData.length} Interações</p>
                                 <p className="text-[9px] text-zinc-500 uppercase font-medium">Pontos de maior retenção identificados</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'leads' && (
                  <div className="space-y-6">
                     <div className="flex justify-between items-center">
                        <div>
                           <h3 className="text-xl font-manrope font-extrabold uppercase tracking-tight text-white">Cadastros e Leads</h3>
                           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic mt-1">Atletas e Sócios captados pelo portal</p>
                        </div>
                        <button className="bg-white/5 text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all border border-white/5 hover:bg-white/10">
                           <Download size={16} /> Exportar CSV
                        </button>
                     </div>

                     <div className="bg-[#121214] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                           <table className="w-full text-left">
                              <thead>
                                 <tr className="bg-white/2 border-b border-white/5">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Nome Completo</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Contato</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Tipo</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Data</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Ações</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                 {registrations.map(r => (
                                    <tr key={r.id} className="hover:bg-white/2 transition-colors group">
                                       <td className="px-8 py-6">
                                          <div className="flex flex-col">
                                             <span className="text-sm font-manrope font-extrabold text-white uppercase tracking-tight">{r.fullName || r.name}</span>
                                             <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{r.email}</span>
                                          </div>
                                       </td>
                                       <td className="px-8 py-6">
                                          <span className="text-[10px] font-black text-zinc-400 uppercase italic">{r.whatsapp || r.phone}</span>
                                       </td>
                                       <td className="px-8 py-6">
                                          <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase italic rounded-full border border-blue-500/10 tracking-widest">Avaliação</span>
                                       </td>
                                       <td className="px-8 py-6">
                                          <span className="text-[10px] font-black text-zinc-500 uppercase italic">{new Date(r.createdAt).toLocaleDateString('pt-BR')}</span>
                                       </td>
                                       <td className="px-8 py-6">
                                          <button className="p-3 rounded-xl bg-zinc-800 text-zinc-500 hover:text-saas-primary hover:bg-saas-primary/10 transition-all"><Eye size={16} /></button>
                                       </td>
                                    </tr>
                                 ))}
                                 {socioLeads.map(s => (
                                    <tr key={s.id} className="hover:bg-white/2 transition-colors group">
                                       <td className="px-8 py-6">
                                          <div className="flex flex-col">
                                             <span className="text-sm font-manrope font-extrabold text-white uppercase tracking-tight">{s.name}</span>
                                             <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{s.email}</span>
                                          </div>
                                       </td>
                                       <td className="px-8 py-6">
                                          <span className="text-[10px] font-black text-zinc-400 uppercase italic">{s.phone}</span>
                                       </td>
                                       <td className="px-8 py-6">
                                          <span className="px-3 py-1 bg-saas-primary/10 text-saas-primary text-[8px] font-black uppercase italic rounded-full border border-saas-primary/10 tracking-widest">Sócio</span>
                                       </td>
                                       <td className="px-8 py-6">
                                          <span className="text-[10px] font-black text-zinc-500 uppercase italic">{new Date(s.createdAt).toLocaleDateString('pt-BR')}</span>
                                       </td>
                                       <td className="px-8 py-6">
                                          <button className="p-3 rounded-xl bg-zinc-800 text-zinc-500 hover:text-saas-primary hover:bg-saas-primary/10 transition-all"><Eye size={16} /></button>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'board' && (
                  <div className="space-y-6">
                     <div className="flex justify-between items-center">
                        <div>
                           <h3 className="text-xl font-manrope font-extrabold uppercase tracking-tight text-white">Corpo Diretivo</h3>
                           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic mt-1">Gestão da liderança do clube</p>
                        </div>
                        <button className="bg-[#a3e635] text-black px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-lg shadow-saas-primary/20 hover:scale-105">
                           <PlusCircle size={16} strokeWidth={3} /> Novo Diretor
                        </button>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-20">
                        {boardMembers.map(b => (
                           <div key={b.id} className="bg-[#121214] border border-white/5 rounded-[32px] p-8 group hover:border-saas-primary/30 transition-all text-center">
                              <div className="w-24 h-24 bg-zinc-800 rounded-3xl mx-auto mb-6 border border-white/5 shadow-inner overflow-hidden relative">
                                 {b.imageUrl ? <img src={b.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-700"><User size={40} /></div>}
                              </div>
                              <h4 className="font-manrope font-extrabold uppercase text-xl text-white leading-tight">{b.name}</h4>
                              <p className="text-[9px] font-black uppercase text-saas-primary mt-2 italic tracking-widest">{b.role}</p>
                              <div className="flex gap-2 mt-8">
                                 <button className="flex-1 py-3 rounded-xl bg-white/5 text-[9px] font-black uppercase text-zinc-400 hover:bg-saas-primary hover:text-black transition-all">Editar</button>
                                 <button className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {activeTab === 'transparency' && (
                  <div className="space-y-6">
                     <div className="flex justify-between items-center">
                        <div>
                           <h3 className="text-xl font-manrope font-extrabold uppercase tracking-tight text-white">Portal da Transparência</h3>
                           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic mt-1">Documentos e relatórios oficiais</p>
                        </div>
                        <button className="bg-[#a3e635] text-black px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-lg shadow-saas-primary/20 hover:scale-105">
                           <Upload size={16} strokeWidth={3} /> Upload Documento
                        </button>
                     </div>
                     <div className="grid grid-cols-1 gap-4 pb-20">
                        {reports.map(r => (
                           <div key={r.id} className="p-6 flex justify-between items-center bg-[#121214] border border-white/5 rounded-[32px] group hover:border-saas-primary/30 transition-all">
                              <div className="flex items-center gap-6">
                                 <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 group-hover:text-saas-primary transition-colors border border-white/5">
                                    <FileText size={24} />
                                 </div>
                                 <div>
                                    <h4 className="font-manrope font-extrabold uppercase text-xl text-white leading-none">{r.title}</h4>
                                    <div className="flex items-center gap-4 mt-3">
                                       <span className="text-[9px] text-zinc-500 uppercase font-black italic">{r.year}</span>
                                       <span className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">{r.type}</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <a href={r.fileUrl} target="_blank" className="p-3 rounded-xl bg-zinc-800 text-zinc-500 hover:text-white transition-all"><Download size={18} /></a>
                                 <button className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {activeTab === 'users' && (
                  <div className="space-y-6">
                     <div className="flex justify-between items-center">
                        <div>
                           <h3 className="text-xl font-manrope font-extrabold uppercase tracking-tight text-white">Usuários do Sistema</h3>
                           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic mt-1">Gestão de acessos administrativos</p>
                        </div>
                        <button className="bg-[#a3e635] text-black px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-lg shadow-saas-primary/20 hover:scale-105">
                           <PlusCircle size={16} strokeWidth={3} /> Convidar Usuário
                        </button>
                     </div>
                     <div className="bg-[#121214] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                           <table className="w-full text-left">
                              <thead>
                                 <tr className="bg-white/2 border-b border-white/5">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Usuário</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Permissão</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Ações</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                 {users.map(u => (
                                    <tr key={u.id} className="hover:bg-white/2 transition-colors">
                                       <td className="px-8 py-6">
                                          <div className="flex items-center gap-4">
                                             <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 border border-white/5">
                                                <User size={18} />
                                             </div>
                                             <div className="flex flex-col">
                                                <span className="text-sm font-black text-white uppercase italic tracking-tight">{u.email.split('@')[0]}</span>
                                                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{u.email}</span>
                                             </div>
                                          </div>
                                       </td>
                                       <td className="px-8 py-6">
                                          <span className="text-[10px] font-black text-zinc-400 uppercase italic">Administrador</span>
                                       </td>
                                       <td className="px-8 py-6">
                                          <div className="flex items-center gap-2">
                                             <div className="w-1.5 h-1.5 rounded-full bg-saas-primary animate-pulse"></div>
                                             <span className="text-[10px] font-black text-saas-primary uppercase italic">Ativo</span>
                                          </div>
                                       </td>
                                       <td className="px-8 py-6">
                                          <button className="p-3 rounded-xl bg-zinc-800 text-zinc-500 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'identity' && (
                  <div className="space-y-8 pb-20">
                     <div className="p-8 bg-[#121214] border border-white/5 rounded-[40px] shadow-2xl">
                        <div className="flex justify-between items-center mb-10">
                           <div>
                              <h3 className="text-xl font-manrope font-extrabold uppercase tracking-tight text-white">Marca & Presença Digital</h3>
                              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic mt-1">Configure como o clube aparece no Timespage</p>
                           </div>
                           <div className="flex items-center gap-3 px-6 py-3 bg-zinc-800 rounded-2xl border border-white/5">
                              <span className="text-[10px] font-black uppercase text-zinc-400">Status do Site:</span>
                              <button 
                                 onClick={() => setClubIdentity({...clubIdentity, tp_active: !clubIdentity.tp_active})}
                                 className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${clubIdentity.tp_active ? 'bg-saas-primary text-black' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
                              >
                                 {clubIdentity.tp_active ? 'Ativo' : 'Inativo'}
                              </button>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
                           {/* Coluna 0: Nome do Clube */}
                           <div className="lg:col-span-2">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-500 italic tracking-widest">Nome Oficial do Clube</label>
                                 <input 
                                    type="text" 
                                    value={clubIdentity.name} 
                                    onChange={e => setClubIdentity({ ...clubIdentity, name: e.target.value })} 
                                    placeholder="Ex: Santos Futebol Clube"
                                    className="w-full p-5 rounded-[20px] bg-zinc-800 border border-white/5 text-sm font-black text-white outline-none focus:border-saas-primary transition-all shadow-inner" 
                                 />
                                 <p className="text-[9px] text-zinc-500 font-bold uppercase mt-2 italic">Este nome será exibido em todo o site e nos metadados (SEO).</p>
                              </div>
                           </div>

                           <div className="lg:col-span-1">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-500 italic tracking-widest">Nome Curto (Apelido)</label>
                                 <input 
                                    type="text" 
                                    value={clubIdentity.tp_short_name} 
                                    onChange={e => setClubIdentity({ ...clubIdentity, tp_short_name: e.target.value })} 
                                    placeholder="Ex: Santos"
                                    className="w-full p-5 rounded-[20px] bg-zinc-800 border border-white/5 text-sm font-black text-white outline-none focus:border-saas-primary transition-all shadow-inner" 
                                 />
                                 <p className="text-[9px] text-zinc-500 font-bold uppercase mt-2 italic">Usado em menus e rodapés compactos.</p>
                              </div>
                           </div>

                           {/* Coluna 1: Logos com Upload */}
                           <div className="space-y-8">
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black uppercase text-zinc-500 italic flex items-center gap-2 tracking-widest"><ImageIcon size={12} /> Escudo Oficial</label>
                                 <div className="w-full h-48 bg-zinc-800 rounded-3xl flex flex-col items-center justify-center p-8 border border-white/5 shadow-inner relative group overflow-hidden cursor-pointer hover:border-saas-primary/30 transition-all">
                                    {clubIdentity.tp_logo_url ? (
                                       <img src={clubIdentity.tp_logo_url} className="w-full h-full object-contain relative z-10 transition-transform group-hover:scale-110" />
                                    ) : (
                                       <div className="flex flex-col items-center gap-3 text-zinc-500 group-hover:text-saas-primary">
                                          <Upload size={32} />
                                          <span className="text-[10px] font-black uppercase">Clique para Upload</span>
                                       </div>
                                    )}
                                    <input 
                                       type="file" 
                                       className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                                       accept="image/*"
                                       onChange={async (e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                             setIsSaving(true);
                                             const url = await handleFileUpload(file, 'logos');
                                             if (url) setClubIdentity({...clubIdentity, tp_logo_url: url});
                                             setIsSaving(false);
                                          }
                                       }}
                                    />
                                    <div className="absolute inset-0 bg-saas-primary/5 blur-3xl"></div>
                                 </div>
                                 <p className="text-[9px] text-zinc-500 font-bold uppercase text-center">Tamanho recomendado: 512x512px (.png ou .svg)</p>
                              </div>

                              <div className="space-y-3">
                                 <label className="text-[10px] font-black uppercase text-zinc-500 italic flex items-center gap-2 tracking-widest">Favicon (Ícone do Navegador)</label>
                                 <div className="flex gap-4 items-center">
                                    <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center p-4 border border-white/5 shadow-inner relative overflow-hidden group">
                                       <img src={clubIdentity.tp_favicon_url || clubIdentity.tp_logo_url || ACTIVE_CONFIG.logo.main} className="w-6 h-6 relative z-10" />
                                       <input 
                                          type="file" 
                                          className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                                          accept="image/*"
                                          onChange={async (e) => {
                                             const file = e.target.files?.[0];
                                             if (file) {
                                                setIsSaving(true);
                                                const url = await handleFileUpload(file, 'favicons');
                                                if (url) setClubIdentity({...clubIdentity, tp_favicon_url: url});
                                                setIsSaving(false);
                                             }
                                          }}
                                       />
                                    </div>
                                    <div className="flex-1">
                                       <button className="text-[10px] font-black uppercase text-zinc-400 bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:text-white transition-all">Alterar Ícone</button>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           {/* Coluna 2: Cores e Contato */}
                           <div className="space-y-8">
                              <div className="grid grid-cols-2 gap-6">
                                 <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest italic">Cor Primária</label>
                                    <div className="flex gap-4 items-center bg-zinc-800 p-2 rounded-2xl border border-white/5 focus-within:border-saas-primary transition-all">
                                       <div className="relative w-10 h-10 shrink-0 overflow-hidden rounded-xl border border-white/10">
                                          <input 
                                             type="color" 
                                             value={clubIdentity.tp_primary_color} 
                                             onChange={e => setClubIdentity({ ...clubIdentity, tp_primary_color: e.target.value })} 
                                             className="absolute inset-[-8px] w-[200%] h-[200%] cursor-pointer bg-transparent border-none" 
                                          />
                                       </div>
                                       <input 
                                          type="text" 
                                          value={clubIdentity.tp_primary_color} 
                                          onChange={e => setClubIdentity({ ...clubIdentity, tp_primary_color: e.target.value })} 
                                          className="flex-1 bg-transparent text-[11px] font-mono font-black text-white outline-none uppercase" 
                                          placeholder="#000000"
                                       />
                                    </div>
                                 </div>
                                 <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest italic">Cor Secundária</label>
                                    <div className="flex gap-4 items-center bg-zinc-800 p-2 rounded-2xl border border-white/5 focus-within:border-saas-primary transition-all">
                                       <div className="relative w-10 h-10 shrink-0 overflow-hidden rounded-xl border border-white/10">
                                          <input 
                                             type="color" 
                                             value={clubIdentity.tp_secondary_color} 
                                             onChange={e => setClubIdentity({ ...clubIdentity, tp_secondary_color: e.target.value })} 
                                             className="absolute inset-[-8px] w-[200%] h-[200%] cursor-pointer bg-transparent border-none" 
                                          />
                                       </div>
                                       <input 
                                          type="text" 
                                          value={clubIdentity.tp_secondary_color} 
                                          onChange={e => setClubIdentity({ ...clubIdentity, tp_secondary_color: e.target.value })} 
                                          className="flex-1 bg-transparent text-[11px] font-mono font-black text-white outline-none uppercase" 
                                          placeholder="#000000"
                                       />
                                    </div>
                                 </div>
                              </div>

                              <div className="space-y-4">
                                 <span className="text-[10px] font-black uppercase text-zinc-600 italic tracking-widest block border-b border-white/5 pb-2">Informações de Contato</span>
                                 <div className="space-y-4">
                                    <div className="relative">
                                       <input type="email" value={clubIdentity.tp_email} onChange={e => setClubIdentity({...clubIdentity, tp_email: e.target.value})} placeholder="E-mail de Contato" className="w-full p-4 pl-12 rounded-xl bg-zinc-800 border border-white/5 text-xs font-bold text-white outline-none focus:border-saas-primary" />
                                       <FileText size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                    </div>
                                    <div className="relative">
                                       <input type="text" value={clubIdentity.tp_phone} onChange={e => setClubIdentity({...clubIdentity, tp_phone: e.target.value})} placeholder="Telefone Fixo" className="w-full p-4 pl-12 rounded-xl bg-zinc-800 border border-white/5 text-xs font-bold text-white outline-none focus:border-saas-primary" />
                                       <MessageSquare size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                    </div>
                                    <div className="relative">
                                       <input type="text" value={clubIdentity.tp_whatsapp} onChange={e => setClubIdentity({...clubIdentity, tp_whatsapp: e.target.value})} placeholder="WhatsApp (DDD + Número)" className="w-full p-4 pl-12 rounded-xl bg-zinc-800 border border-white/5 text-xs font-bold text-white outline-none focus:border-saas-primary" />
                                       <MessageCircle size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-saas-primary" />
                                    </div>
                                 </div>
                              </div>
                           </div>

                           {/* Coluna 3: Redes Sociais */}
                           <div className="space-y-6">
                              <span className="text-[10px] font-black uppercase text-zinc-600 italic tracking-widest block border-b border-white/5 pb-2">Links de Redes Sociais</span>
                              <div className="grid grid-cols-1 gap-4">
                                 {[
                                    { key: 'tp_instagram', label: 'Instagram', icon: 'Instagram', placeholder: 'https://instagram.com/...' },
                                    { key: 'tp_facebook', label: 'Facebook', icon: 'Facebook', placeholder: 'https://facebook.com/...' },
                                    { key: 'tp_twitter_x', label: 'X (Antigo Twitter)', icon: 'Twitter', placeholder: 'https://x.com/...' },
                                    { key: 'tp_linkedin', label: 'LinkedIn', icon: 'Linkedin', placeholder: 'https://linkedin.com/...' },
                                    { key: 'tp_youtube', label: 'YouTube', icon: 'Youtube', placeholder: 'https://youtube.com/...' },
                                 ].map((social) => (
                                    <div key={social.key} className="space-y-2">
                                       <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">{social.label}</label>
                                       <input 
                                          type="text" 
                                          value={(clubIdentity as any)[social.key]} 
                                          onChange={e => setClubIdentity({ ...clubIdentity, [social.key]: e.target.value })} 
                                          placeholder={social.placeholder}
                                          className="w-full p-3 rounded-xl bg-zinc-800 border border-white/5 text-[10px] font-medium text-white outline-none focus:border-saas-primary transition-all" 
                                       />
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>

                        {/* Live Preview Card */}
                        <div className="mb-12">
                           <label className="text-[10px] font-black uppercase text-zinc-500 italic tracking-widest block mb-4">Pré-visualização em Tempo Real</label>
                           <div className="bg-[#09090b] border border-white/10 rounded-[40px] p-8 relative overflow-hidden group shadow-2xl">
                              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent"></div>
                              <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                                 {/* Shield Preview */}
                                 <div className="relative group">
                                    <div className="w-32 h-32 md:w-48 md:h-48 flex items-center justify-center p-4 rounded-full bg-white/[0.03] border border-white/5 shadow-inner transition-transform duration-700 group-hover:scale-110">
                                       <img 
                                          src={clubIdentity.tp_logo_url || ACTIVE_CONFIG.logo.main} 
                                          className="w-full h-full object-contain [filter:drop-shadow(0_0_15px_rgba(255,255,255,0.1))]" 
                                       />
                                    </div>
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-saas-primary text-black text-[8px] font-black uppercase tracking-widest rounded-full shadow-xl">
                                       Escudo Oficial
                                    </div>
                                 </div>

                                 {/* Branding Info Preview */}
                                 <div className="flex-1 space-y-6 text-center md:text-left">
                                    <div>
                                       <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white leading-none">
                                          {clubIdentity.tp_short_name || clubIdentity.name.split(' ')[0] || 'MEU CLUBE'}
                                       </h3>
                                       <p className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-[0.4em] mt-3 italic">
                                          Identidade Visual Dinâmica
                                       </p>
                                    </div>

                                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                       <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/5">
                                          <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: clubIdentity.tp_primary_color }}></div>
                                          <span className="text-[10px] font-black text-white uppercase tracking-widest">Primária</span>
                                       </div>
                                       <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/5">
                                          <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: clubIdentity.tp_secondary_color }}></div>
                                          <span className="text-[10px] font-black text-white uppercase tracking-widest">Secundária</span>
                                       </div>
                                    </div>
                                    
                                    <div className="pt-4 flex items-center justify-center md:justify-start gap-4 opacity-40">
                                       {clubIdentity.tp_instagram && <Instagram size={16} />}
                                       {clubIdentity.tp_facebook && <Facebook size={16} />}
                                       {clubIdentity.tp_youtube && <Youtube size={16} />}
                                       {clubIdentity.tp_whatsapp && <MessageCircle size={16} />}
                                    </div>
                                 </div>
                              </div>
                              
                              {/* Abstract Brand Background */}
                              <div 
                                 className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full blur-[120px] opacity-20 transition-colors duration-1000"
                                 style={{ backgroundColor: clubIdentity.tp_primary_color }}
                              ></div>
                           </div>
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button onClick={async () => {
                               setIsSaving(true);
                               const params = new URLSearchParams(window.location.search);
                               const orgId = params.get('orgId');
                               if (orgId) {
                                  const updateData: any = {};
                                  Object.keys(clubIdentity).forEach(key => {
                                     if (key.startsWith('tp_') || key === 'name') {
                                        updateData[key] = (clubIdentity as any)[key];
                                     }
                                  });

                                  const { error } = await supabase.from('organizations').update(updateData).eq('id', orgId);
                                  
                                  if (!error) { 
                                     showNotification('Identidade Visual Sincronizada!'); 
                                     setTimeout(() => window.location.reload(), 1000);
                                  } else { 
                                     showNotification(`Erro ao salvar: ${error.message}`, 'error'); 
                                  }
                               }
                               setIsSaving(false);
                            }} disabled={isSaving} className="w-full bg-[#a3e635] text-black py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-saas-primary/20 hover:scale-[1.01] active:scale-95 transition-all">
                               {isSaving ? 'Sincronizando...' : 'Salvar Alterações'}
                            </button>
                            <a 
                               href={`/?orgId=${currentOrgId}`} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="w-full bg-white/5 text-white border border-white/10 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
                            >
                               <ExternalLink size={14} />
                               Visualizar Site Ao Vivo
                            </a>
                         </div>
                     </div>
                  </div>
               )}
            </div>
         </main>

         {isAddingNews && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
               <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsAddingNews(false)}></div>
               
               <div className="relative w-full max-w-5xl h-[85vh] overflow-hidden rounded-[32px] border border-white/10 bg-[#121214] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-300">
                  
                  {/* Modal Header */}
                  <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-[#18181b]/50 backdrop-blur-md shrink-0">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#a3e635]/10 rounded-xl flex items-center justify-center text-saas-primary border border-saas-primary/20">
                           {editingNews ? <Edit3 size={20} /> : <Plus size={20} strokeWidth={3} />}
                        </div>
                        <div>
                           <h2 className="text-xl font-manrope font-extrabold uppercase tracking-tight leading-none text-white">
                              {editingNews ? 'Editar Notícia' : 'Publicar Conteúdo'}
                           </h2>
                           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 mt-1 italic">
                              Interface de Edição Premium
                           </p>
                        </div>
                     </div>
                     <button 
                        onClick={() => setIsAddingNews(false)} 
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                     >
                        <X size={18} />
                     </button>
                  </div>

                  <div className="flex-1 flex overflow-hidden">
                     {/* Form Side */}
                     <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                        <form onSubmit={handleSaveNews} className="space-y-8 max-w-2xl mx-auto lg:mx-0">
                           <div className="grid grid-cols-1 gap-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] ml-1">Título da Matéria</label>
                                 <input 
                                    type="text" 
                                    required 
                                    value={newsForm.title} 
                                    onChange={e => setNewsForm({ ...newsForm, title: e.target.value })} 
                                    placeholder="Ex: Reforço de peso chega ao clube..." 
                                    className="w-full p-4 rounded-2xl bg-zinc-900/50 border border-white/5 text-sm font-bold text-white outline-none focus:border-saas-primary/50 focus:bg-zinc-800/80 transition-all placeholder:text-zinc-700" 
                                 />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] ml-1">Categoria</label>
                                    <div className="relative">
                                       <input 
                                          type="text" 
                                          required 
                                          value={newsForm.category} 
                                          onChange={e => setNewsForm({ ...newsForm, category: e.target.value })} 
                                          placeholder="Ex: Futebol, Clube..."
                                          className="w-full p-4 pl-12 rounded-2xl bg-zinc-900/50 border border-white/5 text-[10px] font-black uppercase text-white outline-none focus:border-saas-primary/50 transition-all placeholder:text-zinc-700" 
                                       />
                                       <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                                    </div>
                                 </div>
                                 <div className="space-y-2">
                                     <div className="flex justify-between items-end ml-1">
                                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">Capa da Notícia</label>
                                        <span className="text-[8px] font-bold text-saas-primary uppercase italic tracking-widest opacity-60">Ideal: 1200x630px</span>
                                     </div>
                                    <div className="flex gap-3">
                                       <div className="relative flex-1">
                                          <input 
                                             type="text" 
                                             required 
                                             value={newsForm.image} 
                                             onChange={e => setNewsForm({ ...newsForm, image: e.target.value })} 
                                             placeholder="URL da imagem ou faça upload..."
                                             className="w-full p-4 pl-12 rounded-2xl bg-zinc-900/50 border border-white/5 text-[10px] font-bold text-white outline-none focus:border-saas-primary/50 transition-all placeholder:text-zinc-700" 
                                          />
                                          <ImageIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                                       </div>
                                       <div className="relative group">
                                          <button type="button" className="h-full px-5 rounded-2xl bg-zinc-800 border border-white/5 text-zinc-400 hover:text-saas-primary hover:border-saas-primary/30 transition-all flex items-center justify-center gap-2">
                                             <Upload size={16} />
                                             <span className="text-[9px] font-black uppercase tracking-widest hidden md:block">Upload</span>
                                          </button>
                                          <input 
                                             type="file" 
                                             accept="image/*"
                                             className="absolute inset-0 opacity-0 cursor-pointer"
                                             onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                   try {
                                                      setIsSaving(true);
                                                      const url = await handleFileUpload(file, 'noticias');
                                                      if (url) {
                                                         setNewsForm(prev => ({ ...prev, image: url }));
                                                         showNotification('Imagem carregada com sucesso!', 'success');
                                                      }
                                                   } catch (err) {
                                                      showNotification('Falha ao processar arquivo', 'error');
                                                   } finally {
                                                      setIsSaving(false);
                                                   }
                                                }
                                             }}
                                          />
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] ml-1">Resumo Curto (SEO)</label>
                                 <textarea 
                                    rows={2}
                                    value={newsForm.summary} 
                                    onChange={e => setNewsForm({ ...newsForm, summary: e.target.value })} 
                                    placeholder="Uma breve descrição para atrair cliques..."
                                    className="w-full p-4 rounded-2xl bg-zinc-900/50 border border-white/5 text-[10px] font-medium text-white outline-none focus:border-saas-primary/50 transition-all resize-none placeholder:text-zinc-700"
                                 />
                              </div>

                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] ml-1">Conteúdo da Notícia</label>
                                 <div className="rounded-2xl border border-white/5 overflow-hidden bg-zinc-900/50 focus-within:border-saas-primary/30 transition-all shadow-inner">
                                    <ReactQuill 
                                       theme="snow" 
                                       value={newsForm.content} 
                                       onChange={content => setNewsForm({ ...newsForm, content })} 
                                       className="premium-quill" 
                                    />
                                 </div>
                              </div>
                           </div>

                           <div className="pt-4 sticky bottom-0 bg-[#09090b]/80 backdrop-blur-md pb-4 border-t border-white/5">
                              <button 
                                 type="submit" 
                                 disabled={isSaving} 
                                 className="w-full bg-[#a3e635] text-black py-4 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] shadow-[0_10px_30px_rgba(163,230,53,0.2)] hover:shadow-[0_15px_40px_rgba(163,230,53,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
                              >
                                 {isSaving ? (
                                    <div className="flex items-center justify-center gap-2">
                                       <RefreshCw size={14} className="animate-spin" />
                                       <span>Sincronizando...</span>
                                    </div>
                                 ) : (
                                    <div className="flex items-center justify-center gap-2">
                                       {editingNews ? <RefreshCw size={14} /> : <Zap size={14} />}
                                       <span>{editingNews ? 'Salvar Alterações' : 'Publicar Agora'}</span>
                                    </div>
                                 )}
                              </button>
                           </div>
                        </form>
                     </div>

                     {/* Preview Side - More polished */}
                     <div className="hidden lg:block w-[400px] bg-[#09090b] border-l border-white/5 overflow-y-auto custom-scrollbar">
                        <div className="p-8">
                           <div className="flex items-center justify-between mb-6">
                              <label className="text-[10px] font-black uppercase text-saas-primary italic flex items-center gap-2 tracking-[0.2em]">
                                 <Eye size={14} /> Live Preview
                              </label>
                              <div className="flex gap-1">
                                 <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                                 <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                                 <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                              </div>
                           </div>

                           <div className="rounded-[24px] border border-white/5 bg-[#121214] overflow-hidden shadow-2xl">
                              <div className="aspect-video bg-zinc-800 overflow-hidden relative">
                                 {newsForm.image ? (
                                    <img src={newsForm.image} className="w-full h-full object-cover" alt="Preview" />
                                 ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 gap-2">
                                       <ImageIcon size={32} />
                                       <span className="text-[8px] font-black uppercase tracking-widest">Sem Imagem</span>
                                    </div>
                                 )}
                                 <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 rounded-full bg-[#a3e635] text-black text-[8px] font-black uppercase italic shadow-lg">
                                       {newsForm.category}
                                    </span>
                                 </div>
                              </div>
                              <div className="p-6">
                                 <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-3 italic">
                                    Publicado em {new Date().toLocaleDateString('pt-BR')}
                                 </div>
                                 <h1 className="text-xl font-manrope font-extrabold uppercase tracking-tight text-white mb-4 leading-tight">
                                    {newsForm.title || 'Seu título impactante aparecerá aqui'}
                                 </h1>
                                 <div 
                                    className="prose prose-invert prose-xs max-w-none text-zinc-400 text-[11px] leading-relaxed line-clamp-6 news-preview-content" 
                                    dangerouslySetInnerHTML={{ __html: newsForm.content || '<p>O conteúdo da sua notícia será renderizado aqui com toda a formatação premium...</p>' }} 
                                 />
                              </div>
                           </div>
                           
                           <div className="mt-8 p-6 rounded-2xl bg-saas-primary/5 border border-saas-primary/10">
                              <p className="text-[9px] font-bold text-saas-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                                 <Target size={12} /> Dica de Engajamento
                              </p>
                              <p className="text-[10px] text-zinc-400 leading-relaxed italic">
                                 Use títulos curtos e imagens de alta resolução para aumentar a taxa de cliques em até 40%.
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {isAddingCampaign && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
               <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsAddingCampaign(false)}></div>
               
               <div className="relative w-full max-w-5xl h-[85vh] overflow-hidden rounded-[32px] border border-white/10 bg-[#121214] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-300">
                  
                  {/* Modal Header */}
                  <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-[#18181b]/50 backdrop-blur-md shrink-0">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#a3e635]/10 rounded-xl flex items-center justify-center text-saas-primary border border-saas-primary/20">
                           {editingCampaign ? <Edit3 size={20} /> : <Plus size={20} strokeWidth={3} />}
                        </div>
                        <div>
                           <h2 className="text-xl font-manrope font-extrabold uppercase tracking-tight leading-none text-white">
                              {editingCampaign ? 'Editar Campanha' : 'Nova Campanha'}
                           </h2>
                           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 mt-1 italic">
                              Marketing & Conversão Premium
                           </p>
                        </div>
                     </div>
                     <button 
                        onClick={() => setIsAddingCampaign(false)} 
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                     >
                        <X size={18} />
                     </button>
                  </div>

                  <div className="flex-1 flex overflow-hidden">
                     {/* Form Side */}
                     <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                        <form onSubmit={handleSaveCampaign} className="space-y-8 max-w-2xl mx-auto lg:mx-0">
                           <div className="grid grid-cols-1 gap-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] ml-1">Título Interno</label>
                                    <input 
                                       type="text" 
                                       required 
                                       value={campaignForm.title} 
                                       onChange={e => setCampaignForm({ ...campaignForm, title: e.target.value })} 
                                       placeholder="Ex: Campanha Sócios 2024" 
                                       className="w-full p-4 rounded-2xl bg-zinc-900/50 border border-white/5 text-sm font-bold text-white outline-none focus:border-saas-primary/50 transition-all placeholder:text-zinc-700" 
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] ml-1">Tipo de Campanha</label>
                                    <select 
                                       value={campaignForm.type} 
                                       onChange={e => setCampaignForm({ ...campaignForm, type: e.target.value as any })} 
                                       className="w-full p-4 rounded-2xl bg-zinc-900/50 border border-white/5 text-[10px] font-black uppercase text-white outline-none focus:border-saas-primary/50 transition-all"
                                    >
                                       <option value="Card">Card no Feed</option>
                                       <option value="Popup">Popup ao Entrar</option>
                                    </select>
                                 </div>
                              </div>

                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] ml-1">Headline (Título Visível)</label>
                                 <input 
                                    type="text" 
                                    required 
                                    value={campaignForm.headline} 
                                    onChange={e => setCampaignForm({ ...campaignForm, headline: e.target.value })} 
                                    placeholder="Ex: SEJA O PRÓXIMO CRAQUE!" 
                                    className="w-full p-4 rounded-2xl bg-zinc-900/50 border border-white/5 text-sm font-bold text-white outline-none focus:border-saas-primary/50 transition-all placeholder:text-zinc-700" 
                                 />
                              </div>

                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] ml-1">Subheadline</label>
                                 <input 
                                    type="text" 
                                    value={campaignForm.subtitle} 
                                    onChange={e => setCampaignForm({ ...campaignForm, subtitle: e.target.value })} 
                                    placeholder="Ex: Clique abaixo e faça sua inscrição agora mesmo" 
                                    className="w-full p-4 rounded-2xl bg-zinc-900/50 border border-white/5 text-xs font-medium text-zinc-400 outline-none focus:border-saas-primary/50 transition-all placeholder:text-zinc-700" 
                                 />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="space-y-2">
                                    <div className="flex justify-between items-end ml-1">
                                       <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">Imagem de Capa</label>
                                       <span className="text-[8px] font-bold text-saas-primary uppercase italic tracking-widest opacity-60">Ideal: 1200x800px</span>
                                    </div>
                                    <div className="flex gap-3">
                                       <div className="relative flex-1">
                                          <input 
                                             type="text" 
                                             value={campaignForm.image_url} 
                                             onChange={e => setCampaignForm({ ...campaignForm, image_url: e.target.value })} 
                                             placeholder="URL ou Upload..."
                                             className="w-full p-4 pl-12 rounded-2xl bg-zinc-900/50 border border-white/5 text-[10px] font-bold text-white outline-none focus:border-saas-primary/50 transition-all" 
                                          />
                                          <ImageIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                                       </div>
                                       <div className="relative group">
                                          <button type="button" className="h-full px-5 rounded-2xl bg-zinc-800 border border-white/5 text-zinc-400 hover:text-saas-primary transition-all flex items-center justify-center">
                                             <Upload size={16} />
                                          </button>
                                          <input 
                                             type="file" 
                                             accept="image/*"
                                             className="absolute inset-0 opacity-0 cursor-pointer"
                                             onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                   setIsSaving(true);
                                                   const url = await handleFileUpload(file, 'campanhas');
                                                   if (url) setCampaignForm({ ...campaignForm, image_url: url });
                                                   setIsSaving(false);
                                                }
                                             }}
                                          />
                                       </div>
                                    </div>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] ml-1">Texto do Botão</label>
                                    <input 
                                       type="text" 
                                       value={campaignForm.buttonText} 
                                       onChange={e => setCampaignForm({ ...campaignForm, buttonText: e.target.value })} 
                                       placeholder="Ex: QUERO ME INSCREVER" 
                                       className="w-full p-4 rounded-2xl bg-zinc-900/50 border border-white/5 text-[10px] font-black uppercase text-white outline-none focus:border-saas-primary/50 transition-all" 
                                    />
                                 </div>
                              </div>

                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] ml-1">Link de Redirecionamento (CTA)</label>
                                 <input 
                                    type="text" 
                                    value={campaignForm.destinationUrl} 
                                    onChange={e => setCampaignForm({ ...campaignForm, destinationUrl: e.target.value })} 
                                    placeholder="https://..." 
                                    className="w-full p-4 rounded-2xl bg-zinc-900/50 border border-white/5 text-[10px] font-bold text-zinc-400 outline-none focus:border-saas-primary/50 transition-all" 
                                 />
                              </div>

                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] ml-1">Marketing Copy</label>
                                 <textarea 
                                    rows={3}
                                    value={campaignForm.mkt_copy} 
                                    onChange={e => setCampaignForm({ ...campaignForm, mkt_copy: e.target.value })} 
                                    placeholder="Escreva um texto curto e persuasivo..."
                                    className="w-full p-4 rounded-2xl bg-zinc-900/50 border border-white/5 text-xs font-medium text-white outline-none focus:border-saas-primary/50 transition-all resize-none"
                                 />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest ml-1">Instagram (@)</label>
                                    <input type="text" value={campaignForm.social_instagram} onChange={e => setCampaignForm({ ...campaignForm, social_instagram: e.target.value })} className="w-full p-3 rounded-xl bg-zinc-900/50 border border-white/5 text-[10px] text-white outline-none focus:border-saas-primary/50" placeholder="@perfil" />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest ml-1">WhatsApp (DDD+Número)</label>
                                    <input type="text" value={campaignForm.responsible_whatsapp} onChange={e => setCampaignForm({ ...campaignForm, responsible_whatsapp: e.target.value })} className="w-full p-3 rounded-xl bg-zinc-900/50 border border-white/5 text-[10px] text-white outline-none focus:border-saas-primary/50" placeholder="55..." />
                                 </div>
                              </div>
                           </div>

                           <div className="pt-4 sticky bottom-0 bg-[#09090b]/80 backdrop-blur-md pb-4 border-t border-white/5">
                              <button 
                                 type="submit" 
                                 disabled={isSaving} 
                                 className="w-full bg-[#a3e635] text-black py-4 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] shadow-[0_10px_30px_rgba(163,230,53,0.2)] hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50"
                              >
                                 {isSaving ? 'Sincronizando...' : (editingCampaign ? 'Salvar Alterações' : 'Publicar Campanha')}
                              </button>
                           </div>
                        </form>
                     </div>

                     {/* Preview Side */}
                     <div className="hidden lg:flex w-80 bg-zinc-900/30 border-l border-white/5 flex-col overflow-hidden">
                        <div className="p-6 border-b border-white/5 bg-white/2">
                           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Prévia da Campanha</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                           <div className="space-y-3">
                              <span className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.2em] block">Como ficará no site:</span>
                              <div className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                                 {campaignForm.image_url ? (
                                    <img src={campaignForm.image_url} className="w-full h-32 object-cover" />
                                 ) : (
                                    <div className="w-full h-32 bg-zinc-800 flex items-center justify-center text-zinc-600">
                                       <ImageIcon size={24} />
                                    </div>
                                 )}
                                 <div className="p-4">
                                    <h4 className="text-xs font-black text-white uppercase italic mb-1">{campaignForm.headline || 'Título Exemplo'}</h4>
                                    <p className="text-[9px] text-zinc-500 font-medium mb-3 line-clamp-2">{campaignForm.subtitle || 'Subtítulo da campanha...'}</p>
                                    <button className="w-full py-2.5 rounded-xl bg-saas-primary text-black text-[8px] font-black uppercase tracking-widest">
                                       {campaignForm.buttonText || 'SAIBA MAIS'}
                                    </button>
                                 </div>
                              </div>
                           </div>
                           
                           <div className="p-4 rounded-2xl bg-zinc-800/50 border border-white/5">
                              <div className="flex items-center justify-between">
                                 <span className="text-[9px] font-bold text-zinc-500 uppercase">Status</span>
                                 <button 
                                    onClick={() => setCampaignForm({...campaignForm, active: !campaignForm.active})}
                                    className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${campaignForm.active ? 'bg-saas-primary text-black' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
                                 >
                                    {campaignForm.active ? 'Ativa' : 'Pausada'}
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
