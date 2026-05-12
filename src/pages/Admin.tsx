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
   ChevronDown, Puzzle,
   ArrowLeft, ArrowRight, Maximize2, Layout, Sparkles, CheckCircle2
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
   const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'campaign' | 'identity' | 'integration' | 'home' | 'news' | 'squad' | 'trophies' | 'institutional' | 'users' | 'board' | 'transparency'>('dashboard');
   const [institutionalTab, setInstitutionalTab] = useState<'board' | 'transparency'>('board');
   const [leadsTab, setLeadsTab] = useState<'all' | 'athletes' | 'partners' | 'fans'>('all');
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
   const [campaignFlowStep, setCampaignFlowStep] = useState<'select' | 'popup' | 'card'>('select');
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
      tp_short_name: '',
      tp_hero_image_url: '',
      tp_hero_phrase: '',
      tp_instagram_handle: '',
      tp_instagram_link: '',
      tp_instagram_photos: [] as string[],
      tp_contact_phone: '',
      tp_whatsapp_channel: '',
      tp_pixel_facebook: '',
      tp_google_analytics: '',
      tp_google_tag_manager: ''
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
                     tp_pixel_facebook: data.tp_pixel_facebook || '',
                     tp_google_analytics: data.tp_google_analytics || '',
                     tp_google_tag_manager: data.tp_google_tag_manager || '',
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

            <nav className="flex-1 p-3 space-y-7 overflow-y-auto custom-scrollbar">
               <div>
                  {!isSidebarCollapsed && <span className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 italic mb-2 block">Análise</span>}
                  <div className="space-y-1">
                     {[
                        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                        { id: 'leads', label: 'Leads', icon: Users },
                     ].map((item) => (
                        <button
                           key={item.id}
                           onClick={() => setActiveTab(item.id as any)}
                           className={`w-full flex items-center gap-3 px-4 py-1.5 rounded-xl transition-all relative group ${activeTab === item.id ? 'bg-[#a3e635] text-black shadow-[0_0_20px_rgba(163,230,53,0.3)] font-black' : 'text-zinc-400 hover:bg-white/5 hover:text-white'} ${isSidebarCollapsed ? 'justify-center py-2' : ''}`}
                        >
                           <item.icon size={17} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                           {!isSidebarCollapsed && <span className="text-[10.5px] font-extrabold uppercase tracking-wider">{item.label}</span>}
                        </button>
                     ))}
                  </div>
               </div>

               <div>
                  {!isSidebarCollapsed && <span className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 italic mb-2 block">Marketing</span>}
                  <div className="space-y-1">
                     {[
                        { id: 'campaign', label: 'Campanha', icon: FileImage },
                        { id: 'identity', label: 'Identidade visual', icon: Palette },
                        { id: 'integration', label: 'Integração', icon: Puzzle },
                     ].map((item) => (
                        <button
                           key={item.id}
                           onClick={() => setActiveTab(item.id as any)}
                           className={`w-full flex items-center gap-3 px-4 py-1.5 rounded-xl transition-all relative group ${activeTab === item.id ? 'bg-[#a3e635] text-black shadow-[0_0_20px_rgba(163,230,53,0.3)] font-black' : 'text-zinc-400 hover:bg-white/5 hover:text-white'} ${isSidebarCollapsed ? 'justify-center py-2' : ''}`}
                        >
                           <item.icon size={17} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                           {!isSidebarCollapsed && <span className="text-[10.5px] font-extrabold uppercase tracking-wider">{item.label}</span>}
                        </button>
                     ))}
                  </div>
               </div>

               <div>
                  {!isSidebarCollapsed && <span className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 italic mb-2 block">Conteúdo</span>}
                  <div className="space-y-1">
                     {[
                        { id: 'home', label: 'Home', icon: Home },
                        { id: 'news', label: 'Notícias', icon: FileText },
                        { id: 'squad', label: 'Elenco', icon: ShieldCheck },
                        { id: 'trophies', label: 'Títulos', icon: Trophy },
                        { id: 'institutional', label: 'Institucional', icon: Users },
                     ].map((item) => (
                        <button
                           key={item.id}
                           onClick={() => setActiveTab(item.id as any)}
                           className={`w-full flex items-center gap-3 px-4 py-1.5 rounded-xl transition-all relative group ${activeTab === item.id ? 'bg-[#a3e635] text-black shadow-[0_0_20px_rgba(163,230,53,0.3)] font-black' : 'text-zinc-400 hover:bg-white/5 hover:text-white'} ${isSidebarCollapsed ? 'justify-center py-2' : ''}`}
                        >
                           <item.icon size={17} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                           {!isSidebarCollapsed && <span className="text-[10.5px] font-extrabold uppercase tracking-wider">{item.label}</span>}
                        </button>
                     ))}
                  </div>
               </div>

               <div>
                  {!isSidebarCollapsed && <span className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 italic mb-2 block">Acesso</span>}
                  <div className="space-y-1">
                     {[
                        { id: 'users', label: 'Usuários', icon: ShieldCheck },
                     ].map((item) => (
                        <button
                           key={item.id}
                           onClick={() => setActiveTab(item.id as any)}
                           className={`w-full flex items-center gap-3 px-4 py-1.5 rounded-xl transition-all relative group ${activeTab === item.id ? 'bg-[#a3e635] text-black shadow-[0_0_20px_rgba(163,230,53,0.3)] font-black' : 'text-zinc-400 hover:bg-white/5 hover:text-white'} ${isSidebarCollapsed ? 'justify-center py-2' : ''}`}
                        >
                           <item.icon size={17} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                           {!isSidebarCollapsed && <span className="text-[10.5px] font-extrabold uppercase tracking-wider">{item.label}</span>}
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
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all border border-white/10 bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-saas-primary/10 group relative overflow-hidden shadow-lg"
               >
                  <Globe size={18} className="text-saas-primary shrink-0 group-hover:rotate-12 transition-transform duration-300" />
                  {!isSidebarCollapsed && (
                     <>
                        <div className="flex flex-col items-start min-w-0 flex-1">
                           <span className="text-[9.5px] font-manrope font-extrabold uppercase tracking-tight text-white group-hover:text-saas-primary transition-colors">Visitar Site</span>
                           <span className="text-[7.5px] font-bold uppercase tracking-widest text-zinc-400">Online Now</span>
                        </div>
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-saas-primary/10 flex items-center justify-center border border-saas-primary/20 group-hover:bg-saas-primary group-hover:border-saas-primary transition-all duration-300">
                           <ArrowUpRight size={12} className="text-saas-primary group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </div>
                     </>
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
                     <span className="text-[9px] font-bold uppercase text-zinc-400 group-hover:text-white tracking-widest">Suporte</span>
                  </button>

                  <div className="w-[1px] h-6 bg-white/5 mx-1" />

                  <div className="relative">
                     <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className={`p-2.5 rounded-xl transition-all border ${isProfileOpen ? 'bg-saas-primary text-black border-saas-primary' : 'bg-zinc-800 text-zinc-400 border-white/5 hover:text-white'}`}
                     >
                        <Users size={18} />
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
                           { label: 'Cadastros recebidos', value: registrations.length + socioLeads.length, icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10', trend: 'Leads' },
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

                     {/* Charts and Page Access Grid */}
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                        {/* Area Chart - Traffic Growth */}
                        <div className="lg:col-span-2 bg-[#121214] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                           <div className="flex items-center justify-between gap-4 mb-6">
                              <div>
                                 <h3 className="text-sm font-manrope font-extrabold uppercase tracking-tight text-white">Crescimento de Tráfego</h3>
                                 <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 italic mt-0.5">Visitas únicas e evolução de engajamento</p>
                              </div>
                              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-saas-primary/10 border border-saas-primary/20">
                                 <div className="w-1.5 h-1.5 rounded-full bg-saas-primary animate-pulse" />
                                 <span className="text-[8px] font-extrabold text-saas-primary uppercase tracking-widest">Live</span>
                              </div>
                           </div>

                           <div className="h-[260px] w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart data={analyticsData.length > 1 ? analyticsData : [
                                    { name: '06/05', value: 12 },
                                    { name: '07/05', value: 25 },
                                    { name: '08/05', value: 45 },
                                    { name: '09/05', value: 68 },
                                    { name: '10/05', value: 95 },
                                    { name: '11/05', value: 140 },
                                    { name: '12/05', value: 210 },
                                 ]}>
                                    <defs>
                                       <linearGradient id="trafficColor" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#a3e635" stopOpacity={0.4}/>
                                          <stop offset="95%" stopColor="#a3e635" stopOpacity={0}/>
                                       </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.05} vertical={false} />
                                    <XAxis dataKey="name" stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} width={30} />
                                    <Tooltip 
                                       contentStyle={{ backgroundColor: '#18181b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '1rem', fontSize: '11px', fontWeight: 'bold', color: '#fff' }}
                                       itemStyle={{ color: '#a3e635' }}
                                    />
                                    <Area type="monotone" dataKey="value" name="Visitas" stroke="#a3e635" strokeWidth={3} fillOpacity={1} fill="url(#trafficColor)" />
                                 </AreaChart>
                              </ResponsiveContainer>
                           </div>
                        </div>

                        {/* Page Access List */}
                        <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                           <div>
                              <div className="mb-6">
                                 <h3 className="text-sm font-manrope font-extrabold uppercase tracking-tight text-white">Acessos por Página</h3>
                                 <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 italic mt-0.5">Páginas mais visitadas do portal</p>
                              </div>

                              <div className="space-y-4">
                                 {(pageStats.length > 0 ? pageStats : [
                                    { url: '/home', visits: 142 },
                                    { url: '/noticias', visits: 89 },
                                    { url: '/elenco', visits: 64 },
                                    { url: '/titulos', visits: 38 },
                                    { url: '/institucional', visits: 25 },
                                 ]).slice(0, 5).map((page: any, idx: number) => {
                                    const maxVisits = pageStats.length > 0 ? Math.max(...pageStats.map((p: any) => p.visits)) : 142;
                                    const percent = Math.min(100, Math.max(12, (page.visits / maxVisits) * 100));
                                    
                                    return (
                                       <div key={idx} className="space-y-1 group">
                                          <div className="flex items-center justify-between text-xs">
                                             <span className="font-extrabold text-zinc-300 group-hover:text-white transition-colors truncate max-w-[180px]">
                                                {page.url === '/' ? '/home' : page.url}
                                             </span>
                                             <span className="font-black text-saas-primary text-[11px] bg-saas-primary/10 px-2 py-0.5 rounded-md">
                                                {page.visits}
                                             </span>
                                          </div>
                                          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                             <div 
                                                className="h-full bg-gradient-to-r from-saas-primary/60 to-saas-primary rounded-full transition-all duration-500" 
                                                style={{ width: `${percent}%` }}
                                             />
                                          </div>
                                       </div>
                                    );
                                 })}
                              </div>
                           </div>

                           <div className="pt-4 border-t border-white/5 mt-4 text-center">
                              <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest block">Atualização em tempo real</span>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

                {activeTab === 'news' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                     <div className="flex justify-between items-center bg-[#121214] p-6 rounded-3xl border border-white/5 shadow-xl">
                        <div>
                           <h3 className="text-xl font-manrope font-extrabold uppercase tracking-tight text-white leading-none">Notícias</h3>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 italic mt-1">Gerencie as matérias publicadas no portal oficial</p>
                        </div>
                        <button 
                           onClick={() => { setEditingNews(null); setNewsForm({ title: '', content: '', category: 'Notícias', image: '', summary: '' }); setIsAddingNews(true); }}
                           className="bg-[#a3e635] text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 transition-all shadow-xl shadow-saas-primary/20 hover:scale-105 active:scale-95 cursor-pointer"
                        >
                           <PlusCircle size={16} strokeWidth={3} /> Criar Matéria
                        </button>
                     </div>

                     {news.length === 0 ? (
                        <div className="bg-[#121214] border border-white/5 rounded-3xl p-12 text-center space-y-4">
                           <FileText size={48} className="mx-auto text-zinc-700" />
                           <div className="space-y-1">
                              <p className="text-sm font-extrabold uppercase text-white tracking-wider">Nenhuma notícia publicada ainda</p>
                              <p className="text-xs text-zinc-500 font-medium">Clique no botão acima para escrever a primeira matéria do clube.</p>
                           </div>
                        </div>
                     ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {news.map((item) => (
                              <div key={item.id} className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden shadow-xl hover:border-saas-primary/30 transition-all flex flex-col group">
                                 <div className="aspect-video bg-zinc-800 relative overflow-hidden">
                                    {item.image ? (
                                       <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                       <div className="w-full h-full flex items-center justify-center text-zinc-700"><ImageIcon size={24} /></div>
                                    )}
                                    <div className="absolute top-3 left-3">
                                       <span className="px-3 py-1 rounded-full bg-saas-primary text-black text-[9px] font-black uppercase tracking-wider shadow-lg">
                                          {item.category || 'Notícia'}
                                       </span>
                                    </div>
                                 </div>
                                 <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                    <div className="space-y-2">
                                       <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest block">
                                          {new Date(item.created_at || Date.now()).toLocaleDateString('pt-BR')}
                                       </span>
                                       <h4 className="text-sm font-extrabold uppercase tracking-tight text-white line-clamp-2 leading-snug">
                                          {item.title}
                                       </h4>
                                       <p className="text-xs text-zinc-400 line-clamp-2 font-normal">
                                          {item.summary || 'Sem resumo cadastrado'}
                                       </p>
                                    </div>
                                    <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-2">
                                       <button 
                                          onClick={() => {
                                             setEditingNews(item);
                                             setNewsForm({
                                                title: item.title || '',
                                                content: item.content || '',
                                                category: item.category || 'Notícias',
                                                image: item.image || '',
                                                summary: item.summary || ''
                                             });
                                             setIsAddingNews(true);
                                          }}
                                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                                          title="Editar"
                                       >
                                          <Edit3 size={14} />
                                       </button>
                                       <button 
                                          onClick={async () => {
                                             if (confirm('Tem certeza que deseja excluir esta matéria?')) {
                                                await supabase.from('news').delete().eq('id', item.id);
                                                setNews(news.filter(n => n.id !== item.id));
                                                showNotification('Matéria excluída com sucesso', 'info');
                                             }
                                          }}
                                          className="p-2 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 transition-colors"
                                          title="Excluir"
                                       >
                                          <Trash2 size={14} />
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               )}
                {activeTab === 'home' && (
                  <div className="space-y-8">
                     <div className="flex justify-between items-center bg-[#121214] border border-white/5 p-8 rounded-[32px]">
                        <div>
                           <h3 className="text-2xl font-manrope font-extrabold uppercase tracking-tight text-white flex items-center gap-3">
                              <Home className="text-saas-primary" size={28} strokeWidth={2.5} />
                              Configuração da Home
                           </h3>
                           <p className="text-xs font-black uppercase tracking-widest text-zinc-500 italic mt-1">
                              Personalize a identidade da página inicial e contatos oficiais
                           </p>
                        </div>
                        <button
                           onClick={async () => {
                              setIsSaving(true);
                              try {
                                 const orgIdToUpdate = currentOrgId || 'dc1f5d6a-4714-46b2-92cc-5ff423c2b3ed';
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
                                 }).eq('id', orgIdToUpdate);
                                 if (error) throw error;
                                 showNotification('Configurações da Home salvas com sucesso!', 'success');
                              } catch (err: any) {
                                 showNotification('Erro ao salvar Home: ' + err.message, 'error');
                              } finally {
                                 setIsSaving(false);
                              }
                           }}
                           disabled={isSaving}
                           className="bg-[#a3e635] text-black px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-xl shadow-saas-primary/20 hover:scale-105 disabled:opacity-50 cursor-pointer"
                        >
                           {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} strokeWidth={3} />}
                           {isSaving ? 'Salvando...' : 'Salvar Tudo'}
                        </button>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Seção 1: HEAD da Home */}
                        <div className="bg-[#121214] border border-white/5 rounded-[32px] p-8 space-y-6">
                           <div className="border-b border-white/5 pb-4">
                              <h4 className="text-sm font-black uppercase text-white tracking-widest">
                                 1. Capa & Frase da HEAD
                              </h4>
                           </div>
                           
                           <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">
                                 Capa Principal (Hero Image)
                              </label>
                              <div className="relative group overflow-hidden rounded-2xl border-2 border-dashed border-white/10 bg-black aspect-video flex items-center justify-center">
                                 {clubIdentity.tp_hero_image_url ? (
                                    <img src={clubIdentity.tp_hero_image_url} alt="Capa" className="w-full h-full object-cover" />
                                 ) : (
                                    <div className="text-center p-6 space-y-2">
                                       <FileImage className="mx-auto text-zinc-600" size={32} />
                                       <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nenhuma imagem definida</p>
                                    </div>
                                 )}
                                 <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 cursor-pointer">
                                    <Upload size={24} className="text-saas-primary" />
                                    <span className="text-[10px] font-black uppercase text-white tracking-widest">Alterar Capa</span>
                                    <input 
                                       type="file" 
                                       accept="image/*"
                                       className="hidden" 
                                       onChange={async e => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                             const url = await handleFileUpload(file, 'noticias');
                                             if (url) setClubIdentity({ ...clubIdentity, tp_hero_image_url: url });
                                          }
                                       }}
                                    />
                                 </label>
                              </div>
                              <input 
                                 type="text" 
                                 placeholder="Cole a URL direta da imagem se preferir..."
                                 value={clubIdentity.tp_hero_image_url}
                                 onChange={e => setClubIdentity({ ...clubIdentity, tp_hero_image_url: e.target.value })}
                                 className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-3 text-xs text-white font-bold outline-none focus:border-saas-primary/50"
                              />
                           </div>

                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">
                                 Frase de Efeito da HEAD (Vazio = Oculto)
                              </label>
                              <input 
                                 type="text" 
                                 placeholder="Ex: TRADIÇÃO E RAÇA DESDE 1945"
                                 value={clubIdentity.tp_hero_phrase}
                                 onChange={e => setClubIdentity({ ...clubIdentity, tp_hero_phrase: e.target.value })}
                                 className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-4 text-xs text-white font-extrabold outline-none focus:border-saas-primary/50 tracking-wide"
                              />
                           </div>
                        </div>

                        {/* Seção 2: Instagram Integrado */}
                        <div className="bg-[#121214] border border-white/5 rounded-[32px] p-8 space-y-6">
                           <div className="border-b border-white/5 pb-4">
                              <h4 className="text-sm font-black uppercase text-white tracking-widest">
                                 2. Instagram do Clube (Feed)
                              </h4>
                           </div>

                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">
                                    Perfil (@)
                                 </label>
                                 <input 
                                    type="text" 
                                    placeholder="Ex: @gameleirafc"
                                    value={clubIdentity.tp_instagram_handle}
                                    onChange={e => setClubIdentity({ ...clubIdentity, tp_instagram_handle: e.target.value })}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-3 text-xs text-white font-bold outline-none focus:border-saas-primary/50"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">
                                    Link do Botão
                                 </label>
                                 <input 
                                    type="text" 
                                    placeholder="https://instagram.com/..."
                                    value={clubIdentity.tp_instagram_link}
                                    onChange={e => setClubIdentity({ ...clubIdentity, tp_instagram_link: e.target.value })}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-3 text-xs text-white font-bold outline-none focus:border-saas-primary/50"
                                 />
                              </div>
                           </div>

                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">
                                 Grid de 06 Fotos em Destaque
                              </label>
                              <div className="grid grid-cols-3 gap-3">
                                 {[0, 1, 2, 3, 4, 5].map(index => {
                                    const photoUrl = clubIdentity.tp_instagram_photos?.[index];
                                    return (
                                       <div key={index} className="relative group aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-white/5 flex items-center justify-center">
                                          {photoUrl ? (
                                             <img src={photoUrl} alt={`Foto ${index+1}`} className="w-full h-full object-cover" />
                                          ) : (
                                             <Plus size={20} className="text-zinc-700 group-hover:text-saas-primary transition-colors" />
                                          )}
                                          <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                                             <Upload size={14} className="text-saas-primary mb-1" />
                                             <span className="text-[8px] font-black text-white uppercase tracking-tight">Mudar</span>
                                             <input 
                                                type="file" 
                                                accept="image/*"
                                                className="hidden"
                                                onChange={async e => {
                                                   const file = e.target.files?.[0];
                                                   if (file) {
                                                      const url = await handleFileUpload(file, 'noticias');
                                                      if (url) {
                                                         const current = [...(clubIdentity.tp_instagram_photos || [])];
                                                         current[index] = url;
                                                         setClubIdentity({ ...clubIdentity, tp_instagram_photos: current });
                                                      }
                                                   }
                                                }}
                                             />
                                          </label>
                                       </div>
                                    );
                                 })}
                              </div>
                              <p className="text-[9px] text-zinc-600 italic font-bold">Dica: clique em cada quadrado para fazer o upload da foto do feed.</p>
                           </div>
                        </div>

                        {/* Seção 3: Endereço & Contatos */}
                        <div className="bg-[#121214] border border-white/5 rounded-[32px] p-8 space-y-6">
                           <div className="border-b border-white/5 pb-4">
                              <h4 className="text-sm font-black uppercase text-white tracking-widest">
                                 3. Endereço & Contato Fixo
                              </h4>
                           </div>
                           
                           <div className="space-y-4">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">Endereço Completo</label>
                                 <input 
                                    type="text" 
                                    placeholder="Rua, Número, Bairro, Cidade - UF"
                                    value={clubIdentity.tp_address}
                                    onChange={e => setClubIdentity({ ...clubIdentity, tp_address: e.target.value })}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-3 text-xs text-white font-bold outline-none focus:border-saas-primary/50"
                                 />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">Contato (Fixo)</label>
                                    <input 
                                       type="text" 
                                       placeholder="(00) 0000-0000"
                                       value={clubIdentity.tp_contact_phone}
                                       onChange={e => setClubIdentity({ ...clubIdentity, tp_contact_phone: e.target.value })}
                                       className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-3 text-xs text-white font-bold outline-none focus:border-saas-primary/50"
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">WhatsApp Atendimento</label>
                                    <input 
                                       type="text" 
                                       placeholder="(00) 90000-0000"
                                       value={clubIdentity.tp_whatsapp}
                                       onChange={e => setClubIdentity({ ...clubIdentity, tp_whatsapp: e.target.value })}
                                       className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-3 text-xs text-white font-bold outline-none focus:border-saas-primary/50"
                                    />
                                 </div>
                              </div>

                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">E-mail Oficial</label>
                                 <input 
                                    type="email" 
                                    placeholder="contato@clube.com"
                                    value={clubIdentity.tp_email}
                                    onChange={e => setClubIdentity({ ...clubIdentity, tp_email: e.target.value })}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-3 text-xs text-white font-bold outline-none focus:border-saas-primary/50"
                                 />
                              </div>
                           </div>
                        </div>

                        {/* Seção 4: Redes Sociais */}
                        <div className="bg-[#121214] border border-white/5 rounded-[32px] p-8 space-y-6">
                           <div className="border-b border-white/5 pb-4">
                              <h4 className="text-sm font-black uppercase text-white tracking-widest">
                                 4. Redes Sociais (URLs)
                              </h4>
                           </div>

                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                 <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest block">Instagram</label>
                                 <input 
                                    type="text" placeholder="URL do Instagram" value={clubIdentity.tp_instagram}
                                    onChange={e => setClubIdentity({ ...clubIdentity, tp_instagram: e.target.value })}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-2.5 text-xs text-white font-bold outline-none focus:border-saas-primary/50"
                                 />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest block">Facebook</label>
                                 <input 
                                    type="text" placeholder="URL do Facebook" value={clubIdentity.tp_facebook}
                                    onChange={e => setClubIdentity({ ...clubIdentity, tp_facebook: e.target.value })}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-2.5 text-xs text-white font-bold outline-none focus:border-saas-primary/50"
                                 />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest block">X (Twitter)</label>
                                 <input 
                                    type="text" placeholder="URL do X" value={clubIdentity.tp_twitter_x}
                                    onChange={e => setClubIdentity({ ...clubIdentity, tp_twitter_x: e.target.value })}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-2.5 text-xs text-white font-bold outline-none focus:border-saas-primary/50"
                                 />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest block">LinkedIn</label>
                                 <input 
                                    type="text" placeholder="URL do LinkedIn" value={clubIdentity.tp_linkedin}
                                    onChange={e => setClubIdentity({ ...clubIdentity, tp_linkedin: e.target.value })}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-2.5 text-xs text-white font-bold outline-none focus:border-saas-primary/50"
                                 />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest block">YouTube</label>
                                 <input 
                                    type="text" placeholder="URL do Canal" value={clubIdentity.tp_youtube}
                                    onChange={e => setClubIdentity({ ...clubIdentity, tp_youtube: e.target.value })}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-2.5 text-xs text-white font-bold outline-none focus:border-saas-primary/50"
                                 />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest block">Canal no WhatsApp</label>
                                 <input 
                                    type="text" placeholder="URL do Canal WhatsApp" value={clubIdentity.tp_whatsapp_channel}
                                    onChange={e => setClubIdentity({ ...clubIdentity, tp_whatsapp_channel: e.target.value })}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-2.5 text-xs text-white font-bold outline-none focus:border-saas-primary/50"
                                 />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'leads' && (() => {
                  const allLeadsMapped = [
                     ...registrations.map((r: any) => ({ ...r, _leadType: 'athlete' })),
                     ...socioLeads.map((s: any) => ({ ...s, _leadType: s.plan_name ? 'partner' : 'fan' }))
                  ];

                  const filteredLeads = allLeadsMapped.filter((lead: any) => {
                     if (leadsTab === 'athletes') return lead._leadType === 'athlete';
                     if (leadsTab === 'partners') return lead._leadType === 'partner';
                     if (leadsTab === 'fans') return lead._leadType === 'fan';
                     return true;
                  });

                  const totalFiltered = filteredLeads.length || 1;
                  const dynamicGender = filteredLeads.reduce((acc: any, lead: any) => {
                     const g = lead.gender || 'Não Informado';
                     acc[g] = (acc[g] || 0) + 1;
                     return acc;
                  }, {});
                  const genderArr = Object.entries(dynamicGender).map(([name, value]) => ({ name, value }));

                  const dynamicAge = filteredLeads.reduce((acc: any, lead: any) => {
                     if (!lead.birth_date) return acc;
                     const age = calculateAge(new Date(lead.birth_date));
                     let bracket = '45+';
                     if (age < 25) bracket = '18-24';
                     else if (age < 35) bracket = '25-34';
                     else if (age < 45) bracket = '35-44';
                     acc[bracket] = (acc[bracket] || 0) + 1;
                     return acc;
                  }, { '18-24': 0, '25-34': 0, '35-44': 0, '45+': 0 });
                  const ageArr = Object.entries(dynamicAge).map(([name, value]) => ({ name, value }));

                  return (
                     <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex justify-between items-center bg-[#121214] border border-white/5 p-6 rounded-[28px] shadow-xl">
                           <div>
                              <h3 className="text-lg font-manrope font-extrabold uppercase tracking-tight text-white flex items-center gap-2.5">
                                 <Users className="text-saas-primary" size={22} />
                                 Gestão de Torcedores & Leads
                              </h3>
                              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic mt-0.5">
                                 Base centralizada de cadastros, sócios-torcedores e prospecção
                              </p>
                           </div>
                           <div className="flex items-center gap-3">
                              <button 
                                 onClick={() => showNotification('Exportando base de leads para Excel...', 'info')}
                                 className="bg-zinc-800 text-white border border-white/5 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-zinc-700 transition-all shadow-xl"
                              >
                                 <Download size={14} /> Exportar CSV
                              </button>
                           </div>
                        </div>

                        {/* Premium Tabs Segment */}
                        <div className="flex flex-wrap items-center gap-2 bg-[#121214] border border-white/5 p-1.5 rounded-2xl w-fit shadow-xl">
                           <button 
                              onClick={() => setLeadsTab('all')}
                              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${leadsTab === 'all' ? 'bg-saas-primary text-black shadow-md shadow-saas-primary/10' : 'text-zinc-500 hover:text-white'}`}
                           >
                              Total
                              <span className={`px-1.5 py-0.5 rounded-md text-[8.5px] font-extrabold ${leadsTab === 'all' ? 'bg-black/10 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                                 {allLeadsMapped.length}
                              </span>
                           </button>

                           <button 
                              onClick={() => setLeadsTab('athletes')}
                              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${leadsTab === 'athletes' ? 'bg-saas-primary text-black shadow-md shadow-saas-primary/10' : 'text-zinc-500 hover:text-white'}`}
                           >
                              Matrículas
                              <span className={`px-1.5 py-0.5 rounded-md text-[8.5px] font-extrabold ${leadsTab === 'athletes' ? 'bg-black/10 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                                 {allLeadsMapped.filter(l => l._leadType === 'athlete').length}
                              </span>
                           </button>

                           <button 
                              onClick={() => setLeadsTab('partners')}
                              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${leadsTab === 'partners' ? 'bg-saas-primary text-black shadow-md shadow-saas-primary/10' : 'text-zinc-500 hover:text-white'}`}
                           >
                              Sócios-Torcedores
                              <span className={`px-1.5 py-0.5 rounded-md text-[8.5px] font-extrabold ${leadsTab === 'partners' ? 'bg-black/10 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                                 {allLeadsMapped.filter(l => l._leadType === 'partner').length}
                              </span>
                           </button>

                           <button 
                              onClick={() => setLeadsTab('fans')}
                              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${leadsTab === 'fans' ? 'bg-saas-primary text-black shadow-md shadow-saas-primary/10' : 'text-zinc-500 hover:text-white'}`}
                           >
                              Torcedores
                              <span className={`px-1.5 py-0.5 rounded-md text-[8.5px] font-extrabold ${leadsTab === 'fans' ? 'bg-black/10 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                                 {allLeadsMapped.filter(l => l._leadType === 'fan').length}
                              </span>
                           </button>
                        </div>

                        {/* Premium Demographics Dashboard */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                           <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 shadow-xl space-y-3">
                              <span className="text-[8.5px] font-black uppercase tracking-widest text-zinc-500 block">
                                 {leadsTab === 'all' ? 'Total Geral Capturado' : leadsTab === 'athletes' ? 'Total Matrículas Capturadas' : leadsTab === 'partners' ? 'Total Sócios Ativos' : 'Total Torcedores Capturados'}
                              </span>
                              <div className="flex items-baseline gap-2.5">
                                 <h2 className="text-3xl font-manrope font-extrabold text-white tracking-tight">
                                    {filteredLeads.length}
                                 </h2>
                                 <span className="text-[10px] font-bold text-saas-primary uppercase tracking-widest">+ Segmento</span>
                              </div>
                              <p className="text-[10px] text-zinc-400 font-medium">Torcedores e leads segmentados pela origem do cadastro de alta conversão.</p>
                           </div>

                           <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 shadow-xl space-y-3">
                              <span className="text-[8.5px] font-black uppercase tracking-widest text-zinc-500 block">Distribuição por Gênero</span>
                              <div className="space-y-2.5">
                                 {genderArr.length > 0 ? genderArr.map((item: any, i: number) => (
                                    <div key={i} className="space-y-1">
                                       <div className="flex justify-between text-[11px] font-extrabold">
                                          <span className="text-white uppercase">{item.name}</span>
                                          <span className="text-saas-primary">{item.value}</span>
                                       </div>
                                       <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-white/5">
                                          <div className="bg-saas-primary h-full rounded-full" style={{ width: `${Math.min(100, (item.value / totalFiltered) * 100)}%` }}></div>
                                       </div>
                                    </div>
                                 )) : (
                                    <p className="text-[10px] text-zinc-600 font-bold italic">Sem dados suficientes para segmentação.</p>
                                 )}
                              </div>
                           </div>

                           <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 shadow-xl space-y-3">
                              <span className="text-[8.5px] font-black uppercase tracking-widest text-zinc-500 block">Faixa Etária Principal</span>
                              <div className="space-y-2.5">
                                 {ageArr.length > 0 ? ageArr.map((item: any, i: number) => (
                                    <div key={i} className="space-y-1">
                                       <div className="flex justify-between text-[11px] font-extrabold">
                                          <span className="text-white uppercase">{item.name} Anos</span>
                                          <span className="text-saas-primary">{item.value}</span>
                                       </div>
                                       <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-white/5">
                                          <div className="bg-saas-primary h-full rounded-full" style={{ width: `${Math.min(100, (item.value / totalFiltered) * 100)}%` }}></div>
                                       </div>
                                    </div>
                                 )) : (
                                    <p className="text-[10px] text-zinc-600 font-bold italic">Sem dados suficientes para segmentação.</p>
                                 )}
                              </div>
                           </div>
                        </div>

                        {/* Leads Table */}
                        <div className="bg-[#121214] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                           <div className="p-5 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <span className="text-[11px] font-extrabold text-white uppercase tracking-wider">Cadastros e Inscrições em Tempo Real</span>
                           </div>
                           <div className="overflow-x-auto custom-scrollbar">
                              <table className="w-full text-left border-collapse">
                                 <thead>
                                    <tr className="border-b border-white/5 bg-zinc-900/40 text-[8.5px] font-black uppercase text-zinc-500 tracking-widest">
                                       <th className="p-4">Torcedor</th>
                                       <th className="p-4">Contato</th>
                                       <th className="p-4">Origem</th>
                                       <th className="p-4">Nascimento</th>
                                       <th className="p-4 text-right">Ação</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-white/5 text-[11px] font-bold text-zinc-300">
                                    {filteredLeads.length === 0 ? (
                                       <tr>
                                          <td colSpan={5} className="p-10 text-center text-zinc-600 font-bold text-xs">
                                             Nenhum registro encontrado nesta categoria.
                                          </td>
                                       </tr>
                                    ) : (
                                       filteredLeads.map((lead: any, index: number) => (
                                          <tr key={index} className="hover:bg-white/2 transition-colors">
                                             <td className="p-4">
                                                <div className="flex flex-col">
                                                   <span className="text-white font-extrabold uppercase">{lead.name || lead.full_name || 'Anônimo'}</span>
                                                   <span className="text-[9px] text-zinc-500 font-normal">{lead.email || 'Sem e-mail'}</span>
                                                </div>
                                             </td>
                                             <td className="p-4">
                                                <span className="text-saas-primary tracking-wide">{lead.phone || lead.whatsapp || lead.contact_phone || 'Não informado'}</span>
                                              </td>
                                             <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider border ${
                                                   lead._leadType === 'athlete' 
                                                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                                                      : lead._leadType === 'partner'
                                                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                      : 'bg-zinc-800 text-zinc-400 border-white/5'
                                                }`}>
                                                   {lead._leadType === 'athlete' ? 'Matrícula / Atleta' : lead.plan_name ? `Sócio: ${lead.plan_name}` : 'Torcedor (Apoio)'}
                                                </span>
                                             </td>
                                             <td className="p-4 text-zinc-400 font-normal">
                                                {lead.birth_date ? new Date(lead.birth_date).toLocaleDateString('pt-BR') : 'N/A'}
                                             </td>
                                             <td className="p-4 text-right">
                                                {(lead.phone || lead.whatsapp) && (
                                                   <a 
                                                      href={`https://wa.me/${(lead.phone || lead.whatsapp).replace(/\D/g, '')}`} 
                                                      target="_blank" 
                                                      rel="noopener noreferrer"
                                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-[9px] font-black uppercase tracking-wider transition-all"
                                                   >
                                                      <MessageCircle size={10} /> WhatsApp
                                                   </a>
                                                )}
                                             </td>
                                          </tr>
                                       ))
                                    )}
                                 </tbody>
                              </table>
                           </div>
                        </div>
                     </div>
                  );
               })()}

               {activeTab === 'campaign' && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                     <div className="flex justify-between items-center bg-[#121214] border border-white/5 p-8 rounded-[32px] shadow-xl">
                        <div>
                           <h3 className="text-2xl font-manrope font-extrabold uppercase tracking-tight text-white flex items-center gap-3">
                              <FileImage className="text-saas-primary" size={28} />
                              Campanhas de Marketing
                           </h3>
                           <p className="text-xs font-black uppercase tracking-widest text-zinc-500 italic mt-1">
                              Gerencie popups, banners e chamadas de alta conversão no portal
                           </p>
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
                                 type: 'Popup',
                                 active: true,
                                 mkt_copy: '',
                                 social_instagram: '',
                                 responsible_whatsapp: '',
                                 social_facebook: ''
                              });
                              setCampaignFlowStep('select');
                              setIsAddingCampaign(true); 
                           }}
                           className="bg-[#a3e635] text-black px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-saas-primary/20"
                        >
                           <PlusCircle size={16} strokeWidth={3} /> Criar Campanha
                        </button>
                     </div>

                     {campaigns.length === 0 ? (
                        <div className="bg-[#121214] border border-white/5 rounded-3xl p-12 text-center space-y-4">
                           <Target size={48} className="mx-auto text-zinc-700" />
                           <p className="text-sm font-extrabold uppercase text-white tracking-wider">Nenhuma campanha cadastrada</p>
                           <p className="text-xs text-zinc-500 font-medium">Crie campanhas para capturar mais torcedores e alavancar o plano de sócios.</p>
                        </div>
                     ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {campaigns.map(camp => (
                              <div key={camp.id} className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden shadow-xl flex flex-col group">
                                 <div className="aspect-video bg-zinc-900 relative overflow-hidden">
                                    {camp.image_url ? (
                                       <img src={camp.image_url} alt={camp.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                                    ) : (
                                       <div className="w-full h-full flex items-center justify-center text-zinc-700"><ImageIcon size={24} /></div>
                                    )}
                                    <div className="absolute top-3 left-3 flex gap-2">
                                       <span className="px-3 py-1 rounded-full bg-zinc-800/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider border border-white/5">
                                          {camp.type || 'Card'}
                                       </span>
                                       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${camp.active ? 'bg-saas-primary text-black' : 'bg-red-500/90 text-white'}`}>
                                          {camp.active ? 'Ativa' : 'Pausada'}
                                       </span>
                                    </div>
                                 </div>

                                 <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                    <div className="space-y-1">
                                       <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Controle: {camp.title || 'Sem título interno'}</span>
                                       <h4 className="text-sm font-extrabold uppercase text-white line-clamp-1">{camp.headline || camp.title || 'Campanha'}</h4>
                                       <p className="text-xs text-zinc-400 line-clamp-2 font-normal">{camp.subtitle || camp.mkt_copy || 'Sem descrição'}</p>
                                    </div>

                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                       <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">
                                          Cliques: <strong className="text-white font-black">{camp.clicks || 0}</strong>
                                       </span>

                                       <div className="flex items-center gap-1.5">
                                          <button 
                                             onClick={async () => {
                                                const updated = !camp.active;
                                                await supabase.from('campaigns').update({ active: updated }).eq('id', camp.id);
                                                showNotification(`Campanha ${updated ? 'ativada' : 'pausada'} com sucesso!`, 'info');
                                                fetchData(currentOrgId);
                                             }}
                                             className={`p-2 rounded-xl border transition-all ${camp.active ? 'bg-zinc-800 text-zinc-400 border-white/5 hover:text-amber-400' : 'bg-saas-primary/10 text-saas-primary border-saas-primary/20'}`}
                                             title={camp.active ? 'Pausar Campanha' : 'Ativar Campanha'}
                                          >
                                             <RefreshCw size={14} />
                                          </button>

                                          <button 
                                             onClick={() => {
                                                setEditingCampaign(camp);
                                                setCampaignForm({
                                                   title: camp.title || '', headline: camp.headline || '', subtitle: camp.subtitle || '',
                                                   buttonText: camp.buttonText || 'Saiba Mais', image_url: camp.image_url || '',
                                                   destinationUrl: camp.destinationUrl || '', type: camp.type || 'Card',
                                                   active: camp.active !== false, mkt_copy: camp.mkt_copy || '',
                                                   social_instagram: camp.social_instagram || '', responsible_whatsapp: camp.responsible_whatsapp || '',
                                                   social_facebook: camp.social_facebook || ''
                                                });
                                                setCampaignFlowStep(camp.type === 'Popup' ? 'popup' : 'card');
                                                setIsAddingCampaign(true);
                                             }}
                                             className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                                          >
                                             <Edit3 size={14} />
                                          </button>

                                          <button 
                                             onClick={() => handleDeleteCampaign(camp.id)}
                                             className="p-2 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 transition-all"
                                          >
                                             <Trash2 size={14} />
                                          </button>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}

                     {/* Modal Principal do Fluxo de Campanhas */}
                     {isAddingCampaign && (
                        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                           <div className="bg-[#121214] border border-white/10 rounded-[32px] w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                              
                              {/* Header do Modal */}
                              <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-[#161618]">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-saas-primary/10 text-saas-primary flex items-center justify-center border border-saas-primary/20">
                                       <Target size={20} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                       <h4 className="text-base font-manrope font-extrabold uppercase tracking-tight text-white">
                                          {campaignFlowStep === 'select' ? 'Selecione o Formato da Campanha' : `Configurar ${campaignForm.type}`}
                                       </h4>
                                       <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">
                                          {editingCampaign ? 'Edição de Campanha Existente' : 'Nova Campanha de Marketing'}
                                       </span>
                                    </div>
                                 </div>
                                 <button 
                                    onClick={() => setIsAddingCampaign(false)}
                                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                                 >
                                    <X size={16} />
                                 </button>
                              </div>

                              {/* Corpo do Modal: Passo 1 (Seleção do Tipo) */}
                              {campaignFlowStep === 'select' && (
                                 <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
                                    <p className="text-xs text-zinc-400 font-medium text-center max-w-xl mx-auto">
                                       Escolha a experiência visual ideal para engajar os torcedores no portal. Cada formato atende a um objetivo estratégico diferente de conversão.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-4">
                                       {/* Opção POPUP */}
                                       <button
                                          type="button"
                                          onClick={() => {
                                             setCampaignForm({ ...campaignForm, type: 'Popup' });
                                             setCampaignFlowStep('popup');
                                          }}
                                          className="text-left p-6 rounded-3xl bg-zinc-900/60 border border-white/5 hover:border-saas-primary hover:bg-zinc-900 transition-all flex flex-col justify-between group relative overflow-hidden"
                                       >
                                          <div className="absolute top-0 right-0 w-32 h-32 bg-saas-primary/5 rounded-full blur-2xl group-hover:bg-saas-primary/10 transition-all" />
                                          
                                          <div className="space-y-4 relative z-10">
                                             <div className="w-12 h-12 rounded-2xl bg-saas-primary/10 text-saas-primary flex items-center justify-center border border-saas-primary/20 group-hover:scale-110 transition-transform">
                                                <FileImage size={24} strokeWidth={2.5} />
                                             </div>
                                             <div>
                                                <div className="flex items-center gap-2">
                                                   <h5 className="text-lg font-manrope font-extrabold uppercase text-white tracking-tight">Popup de Impacto</h5>
                                                   <span className="text-[8px] font-black uppercase tracking-widest bg-saas-primary/20 text-saas-primary px-2 py-0.5 rounded">Foco Visual</span>
                                                </div>
                                                <p className="text-xs text-zinc-400 mt-2 font-normal leading-relaxed">
                                                   Abre um modal centralizado na tela do usuário assim que acessa o site. Ideal para lançamentos de camisas, ingressos ou anúncios que exigem atenção imediata.
                                                </p>
                                             </div>

                                             <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                                                <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-wider block">Campos da Experiência:</span>
                                                <ul className="text-[10px] text-zinc-400 space-y-1 list-disc list-inside font-medium">
                                                   <li>Controle Interno (Título & Descrição)</li>
                                                   <li>Imagem de Alta Definição (Anexo)</li>
                                                   <li>Link de Destino Direto</li>
                                                </ul>
                                             </div>
                                          </div>

                                          <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-black uppercase tracking-wider text-saas-primary group-hover:translate-x-1 transition-transform">
                                             <span>Configurar Popup</span>
                                             <ChevronRight size={16} />
                                          </div>
                                       </button>

                                       {/* Opção CARD */}
                                       <button
                                          type="button"
                                          onClick={() => {
                                             setCampaignForm({ ...campaignForm, type: 'Card' });
                                             setCampaignFlowStep('card');
                                          }}
                                          className="text-left p-6 rounded-3xl bg-zinc-900/60 border border-white/5 hover:border-saas-primary hover:bg-zinc-900 transition-all flex flex-col justify-between group relative overflow-hidden"
                                       >
                                          <div className="absolute top-0 right-0 w-32 h-32 bg-saas-primary/5 rounded-full blur-2xl group-hover:bg-saas-primary/10 transition-all" />
                                          
                                          <div className="space-y-4 relative z-10">
                                             <div className="w-12 h-12 rounded-2xl bg-saas-primary/10 text-saas-primary flex items-center justify-center border border-saas-primary/20 group-hover:scale-110 transition-transform">
                                                <LayoutDashboard size={24} strokeWidth={2.5} />
                                             </div>
                                             <div>
                                                <div className="flex items-center gap-2">
                                                   <h5 className="text-lg font-manrope font-extrabold uppercase text-white tracking-tight">Card / Banner Integrado</h5>
                                                   <span className="text-[8px] font-black uppercase tracking-widest bg-saas-primary/20 text-saas-primary px-2 py-0.5 rounded">Conversão</span>
                                                </div>
                                                <p className="text-xs text-zinc-400 mt-2 font-normal leading-relaxed">
                                                   Insere um elemento ou banner chamativo com textos persuasivos e botão de ação. Ideal para captação contínua de planos de sócio-torcedor.
                                                </p>
                                             </div>

                                             <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                                                <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-wider block">Campos da Experiência:</span>
                                                <ul className="text-[10px] text-zinc-400 space-y-1 list-disc list-inside font-medium">
                                                   <li>Controle Interno (Título & Descrição)</li>
                                                   <li>Headline & Subheadline Visíveis</li>
                                                   <li>Botão Customizado + Destino</li>
                                                </ul>
                                             </div>
                                          </div>

                                          <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-black uppercase tracking-wider text-saas-primary group-hover:translate-x-1 transition-transform">
                                             <span>Configurar Card</span>
                                             <ChevronRight size={16} />
                                          </div>
                                       </button>
                                    </div>
                                 </div>
                              )}

                              {/* Corpo do Modal: Passo 2 (Formulário POPUP) */}
                              {campaignFlowStep === 'popup' && (
                                 <form onSubmit={handleSaveCampaign} className="flex-1 overflow-hidden flex flex-col">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto custom-scrollbar divide-y lg:divide-y-0 lg:divide-x divide-white/5">
                                       
                                       {/* Coluna de Preenchimento */}
                                       <div className="lg:col-span-7 p-8 space-y-6">
                                          <div className="border-b border-white/5 pb-4">
                                             <h5 className="text-xs font-extrabold uppercase tracking-widest text-saas-primary">Informações do Popup</h5>
                                          </div>

                                          <div className="space-y-4">
                                             <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">
                                                   Título <span className="text-zinc-600 font-bold lowercase italic">(Apenas para controle interno)</span>
                                                </label>
                                                <input 
                                                   type="text" required placeholder="Ex: Lançamento Nova Camisa 2026"
                                                   value={campaignForm.title}
                                                   onChange={e => setCampaignForm({...campaignForm, title: e.target.value})}
                                                   className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs text-white font-bold outline-none focus:border-saas-primary/50 transition-all"
                                                />
                                             </div>

                                             <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">
                                                   Descrição <span className="text-zinc-600 font-bold lowercase italic">(Apenas para controle interno)</span>
                                                </label>
                                                <textarea 
                                                   rows={2} placeholder="Notas internas sobre a meta ou período de veiculação desta campanha..."
                                                   value={campaignForm.mkt_copy}
                                                   onChange={e => setCampaignForm({...campaignForm, mkt_copy: e.target.value})}
                                                   className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs text-white font-medium outline-none focus:border-saas-primary/50 transition-all resize-none"
                                                />
                                             </div>

                                             <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">
                                                   Imagem de Alta Conversão <span className="text-saas-primary font-bold">(Sugestão: 1080 x 1080px)</span>
                                                </label>
                                                <div className="flex gap-2">
                                                   <input 
                                                      type="text" required placeholder="Cole a URL ou faça upload do anexo..."
                                                      value={campaignForm.image_url}
                                                      onChange={e => setCampaignForm({...campaignForm, image_url: e.target.value})}
                                                      className="flex-1 bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs text-white font-bold outline-none focus:border-saas-primary/50 transition-all"
                                                   />
                                                   <label className="px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center gap-2 cursor-pointer border border-white/5 text-saas-primary shrink-0 transition-colors">
                                                      <Upload size={14} strokeWidth={2.5} />
                                                      <span className="text-[10px] font-black uppercase tracking-wider">Anexo</span>
                                                      <input type="file" accept="image/*" className="hidden" onChange={async e => {
                                                         const f = e.target.files?.[0];
                                                         if (f) {
                                                            const u = await handleFileUpload(f, 'noticias');
                                                            if (u) setCampaignForm({...campaignForm, image_url: u});
                                                         }
                                                      }} />
                                                   </label>
                                                </div>
                                                <p className="text-[9px] text-zinc-500 font-medium">Formatos recomendados: PNG transparente, JPG ou WEBP de alta qualidade.</p>
                                             </div>

                                             <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">URL de Destino do Clique</label>
                                                <input 
                                                   type="url" required placeholder="https://loja.clube.com.br/produto"
                                                   value={campaignForm.destinationUrl}
                                                   onChange={e => setCampaignForm({...campaignForm, destinationUrl: e.target.value})}
                                                   className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs text-white font-bold outline-none focus:border-saas-primary/50 transition-all font-mono"
                                                />
                                             </div>
                                          </div>
                                       </div>

                                       {/* Coluna de Preview Premium */}
                                       <div className="lg:col-span-5 p-8 bg-zinc-950/40 flex flex-col justify-between space-y-6">
                                          <div>
                                             <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-4 text-center">
                                                Preview em Tempo Real
                                             </span>

                                             {/* Caixa simulando a tela do visitante com o Popup */}
                                             <div className="border border-white/10 rounded-2xl bg-[#121214] p-4 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[280px]">
                                                {/* Fundo simulando o site borrado */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black opacity-40" />
                                                
                                                {/* O Popup Renderizado */}
                                                <div className="relative z-10 w-full max-w-xs rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl group cursor-pointer animate-in zoom-in-95 duration-300">
                                                   {campaignForm.image_url ? (
                                                      <div className="aspect-square w-full bg-zinc-900 relative">
                                                         <img src={campaignForm.image_url} alt="Preview" className="w-full h-full object-cover" />
                                                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                                                            <span className="w-full text-center py-2 rounded-xl bg-saas-primary text-black text-[10px] font-black uppercase tracking-wider shadow-lg">
                                                               Acessar Oferta
                                                            </span>
                                                         </div>
                                                      </div>
                                                   ) : (
                                                      <div className="aspect-square w-full bg-zinc-900 flex flex-col items-center justify-center p-6 text-center space-y-2 border-2 border-dashed border-zinc-800">
                                                         <FileImage size={32} className="text-zinc-700" />
                                                         <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tight">1080 x 1080px</span>
                                                         <span className="text-[9px] text-zinc-500">A imagem do popup ocupará este espaço de alto impacto</span>
                                                      </div>
                                                   )}
                                                </div>
                                             </div>
                                          </div>

                                          <div className="p-3 rounded-xl bg-saas-primary/5 border border-saas-primary/10 flex items-center gap-2">
                                             <Zap size={14} className="text-saas-primary shrink-0" />
                                             <p className="text-[9px] text-zinc-400 font-medium leading-tight">
                                                Ao clicar na imagem, o torcedor será levado diretamente para a <strong className="text-white">URL de Destino</strong> configurada.
                                             </p>
                                          </div>
                                       </div>
                                    </div>

                                    {/* Footer de Ações */}
                                    <div className="p-6 border-t border-white/5 bg-[#161618] flex items-center justify-between shrink-0">
                                       <button 
                                          type="button" 
                                          onClick={() => setCampaignFlowStep('select')}
                                          className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white text-xs font-bold transition-colors"
                                       >
                                          Voltar aos Formatos
                                       </button>
                                       <button 
                                          type="submit" 
                                          disabled={isSaving}
                                          className="px-6 py-3 rounded-xl bg-saas-primary text-black font-black text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-lg"
                                       >
                                          {isSaving ? 'Salvando...' : 'Publicar Popup Oficial'}
                                       </button>
                                    </div>
                                 </form>
                              )}

                              {/* Corpo do Modal: Passo 2 (Formulário CARD) */}
                              {campaignFlowStep === 'card' && (
                                 <form onSubmit={handleSaveCampaign} className="flex-1 overflow-hidden flex flex-col">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto custom-scrollbar divide-y lg:divide-y-0 lg:divide-x divide-white/5">
                                       
                                       {/* Coluna de Preenchimento */}
                                       <div className="lg:col-span-7 p-8 space-y-6">
                                          <div className="border-b border-white/5 pb-4">
                                             <h5 className="text-xs font-extrabold uppercase tracking-widest text-saas-primary">Informações do Card</h5>
                                          </div>

                                          <div className="space-y-4">
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">
                                                      Título <span className="text-zinc-600 font-bold lowercase italic">(Info Interna)</span>
                                                   </label>
                                                   <input 
                                                      type="text" required placeholder="Ex: Sócio Torcedor Ouro"
                                                      value={campaignForm.title}
                                                      onChange={e => setCampaignForm({...campaignForm, title: e.target.value})}
                                                      className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs text-white font-bold outline-none focus:border-saas-primary/50 transition-all"
                                                   />
                                                </div>
                                                <div className="space-y-1.5">
                                                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">
                                                      Descrição <span className="text-zinc-600 font-bold lowercase italic">(Info Interna)</span>
                                                   </label>
                                                   <input 
                                                      type="text" placeholder="Ex: Meta de 500 adesões no mês"
                                                      value={campaignForm.mkt_copy}
                                                      onChange={e => setCampaignForm({...campaignForm, mkt_copy: e.target.value})}
                                                      className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs text-white font-bold outline-none focus:border-saas-primary/50 transition-all"
                                                   />
                                                </div>
                                             </div>

                                             <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">
                                                   Imagem de Destaque <span className="text-saas-primary font-bold">(Anexo com sugestão de tamanho)</span>
                                                </label>
                                                <div className="flex gap-2">
                                                   <input 
                                                      type="text" required placeholder="URL ou upload do anexo..."
                                                      value={campaignForm.image_url}
                                                      onChange={e => setCampaignForm({...campaignForm, image_url: e.target.value})}
                                                      className="flex-1 bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs text-white font-bold outline-none focus:border-saas-primary/50 transition-all"
                                                   />
                                                   <label className="px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center gap-2 cursor-pointer border border-white/5 text-saas-primary shrink-0 transition-colors">
                                                      <Upload size={14} strokeWidth={2.5} />
                                                      <span className="text-[10px] font-black uppercase tracking-wider">Anexo</span>
                                                      <input type="file" accept="image/*" className="hidden" onChange={async e => {
                                                         const f = e.target.files?.[0];
                                                         if (f) {
                                                            const u = await handleFileUpload(f, 'noticias');
                                                            if (u) setCampaignForm({...campaignForm, image_url: u});
                                                         }
                                                      }} />
                                                   </label>
                                                </div>
                                             </div>

                                             <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">
                                                   Headline <span className="text-saas-primary font-bold">(Texto &gt; Título Curto)</span>
                                                </label>
                                                <input 
                                                   type="text" required placeholder="Faça parte da nossa história!"
                                                   value={campaignForm.headline}
                                                   onChange={e => setCampaignForm({...campaignForm, headline: e.target.value})}
                                                   className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs text-white font-extrabold outline-none focus:border-saas-primary/50 transition-all"
                                                />
                                             </div>

                                             <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">
                                                   Subheadline <span className="text-zinc-500 font-bold">(Texto com descrição curta)</span>
                                                </label>
                                                <input 
                                                   type="text" required placeholder="Planos a partir de R$ 29,90 com acesso exclusivo a jogos."
                                                   value={campaignForm.subtitle}
                                                   onChange={e => setCampaignForm({...campaignForm, subtitle: e.target.value})}
                                                   className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs text-white font-medium outline-none focus:border-saas-primary/50 transition-all"
                                                />
                                             </div>

                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">Título do Botão</label>
                                                   <input 
                                                      type="text" required placeholder="Ex: Seja Sócio Agora"
                                                      value={campaignForm.buttonText}
                                                      onChange={e => setCampaignForm({...campaignForm, buttonText: e.target.value})}
                                                      className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs text-saas-primary font-black uppercase tracking-wider outline-none focus:border-saas-primary/50 transition-all"
                                                   />
                                                </div>
                                                <div className="space-y-1.5">
                                                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">Link de Destino</label>
                                                   <input 
                                                      type="url" required placeholder="https://socio.clube.com.br"
                                                      value={campaignForm.destinationUrl}
                                                      onChange={e => setCampaignForm({...campaignForm, destinationUrl: e.target.value})}
                                                      className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs text-white font-bold outline-none focus:border-saas-primary/50 transition-all font-mono"
                                                   />
                                                </div>
                                             </div>
                                          </div>
                                       </div>

                                       {/* Coluna de Preview Premium */}
                                       <div className="lg:col-span-5 p-8 bg-zinc-950/40 flex flex-col justify-between space-y-6">
                                          <div>
                                             <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-4 text-center">
                                                Preview do Card no Portal
                                             </span>

                                             {/* Componente Card Renderizado */}
                                             <div className="rounded-2xl border border-white/10 bg-[#121214] overflow-hidden shadow-2xl space-y-4 animate-in zoom-in-95 duration-300">
                                                <div className="aspect-video w-full bg-zinc-900 relative overflow-hidden">
                                                   {campaignForm.image_url ? (
                                                      <img src={campaignForm.image_url} alt="Destaque" className="w-full h-full object-cover" />
                                                   ) : (
                                                      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 space-y-1 border-b border-white/5">
                                                         <ImageIcon size={28} />
                                                         <span className="text-[9px] font-bold text-zinc-600">Imagem de Destaque</span>
                                                      </div>
                                                   )}
                                                   <div className="absolute top-2.5 right-2.5">
                                                      <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-wider">
                                                         Patrocinado
                                                      </span>
                                                   </div>
                                                </div>

                                                <div className="p-5 pt-1 space-y-3">
                                                   <div className="space-y-1">
                                                      <h6 className="text-sm font-manrope font-extrabold uppercase text-white leading-tight line-clamp-1">
                                                         {campaignForm.headline || 'Headline de Destaque'}
                                                      </h6>
                                                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-normal">
                                                         {campaignForm.subtitle || 'A subheadline descreve a oferta especial ou benefício de forma persuasiva para o torcedor.'}
                                                      </p>
                                                   </div>

                                                   <div className="pt-2">
                                                      <div className="w-full text-center py-2.5 rounded-xl bg-saas-primary text-black font-black text-[10px] uppercase tracking-wider shadow-md truncate px-4">
                                                         {campaignForm.buttonText || 'Clique Aqui'}
                                                      </div>
                                                   </div>
                                                </div>
                                             </div>
                                          </div>

                                          <div className="p-3 rounded-xl bg-zinc-900 border border-white/5 text-center">
                                             <span className="text-[8px] font-extrabold text-zinc-500 uppercase tracking-widest block">
                                                Aparência em tempo real no dashboard do torcedor
                                             </span>
                                          </div>
                                       </div>
                                    </div>

                                    {/* Footer de Ações */}
                                    <div className="p-6 border-t border-white/5 bg-[#161618] flex items-center justify-between shrink-0">
                                       <button 
                                          type="button" 
                                          onClick={() => setCampaignFlowStep('select')}
                                          className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white text-xs font-bold transition-colors"
                                       >
                                          Voltar aos Formatos
                                       </button>
                                       <button 
                                          type="submit" 
                                          disabled={isSaving}
                                          className="px-6 py-3 rounded-xl bg-saas-primary text-black font-black text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-lg"
                                       >
                                          {isSaving ? 'Salvando...' : 'Publicar Card Oficial'}
                                       </button>
                                    </div>
                                 </form>
                              )}

                           </div>
                        </div>
                     )}
                  </div>
               )}

               {activeTab === 'identity' && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                     <div className="flex justify-between items-center bg-[#121214] border border-white/5 p-8 rounded-[32px] shadow-xl">
                        <div>
                           <h3 className="text-2xl font-manrope font-extrabold uppercase tracking-tight text-white flex items-center gap-3">
                              <Palette className="text-saas-primary" size={28} />
                              Identidade Visual do Clube
                           </h3>
                           <p className="text-xs font-black uppercase tracking-widest text-zinc-500 italic mt-1">
                              Gerencie logos, ícones e a paleta de cores oficial da sua página
                           </p>
                        </div>
                        <button
                           onClick={async () => {
                              setIsSaving(true);
                              try {
                                 const orgIdToUpdate = currentOrgId || 'dc1f5d6a-4714-46b2-92cc-5ff423c2b3ed';
                                 const { error } = await supabase.from('organizations').update({
                                    tp_primary_color: clubIdentity.tp_primary_color,
                                    tp_secondary_color: clubIdentity.tp_secondary_color,
                                    tp_logo_url: clubIdentity.tp_logo_url,
                                    tp_favicon_url: clubIdentity.tp_favicon_url,
                                    tp_short_name: clubIdentity.tp_short_name,
                                 }).eq('id', orgIdToUpdate);
                                 if (error) throw error;
                                 showNotification('Identidade visual atualizada com sucesso!', 'success');
                              } catch (err: any) {
                                 showNotification('Erro ao salvar identidade: ' + err.message, 'error');
                              } finally {
                                 setIsSaving(false);
                              }
                           }}
                           disabled={isSaving}
                           className="bg-[#a3e635] text-black px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-saas-primary/20 disabled:opacity-50"
                        >
                           {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} strokeWidth={3} />}
                           {isSaving ? 'Salvando...' : 'Salvar Identidade'}
                        </button>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Cores da Marca */}
                        <div className="bg-[#121214] border border-white/5 rounded-[32px] p-8 space-y-6 shadow-xl">
                           <div className="border-b border-white/5 pb-4">
                              <h4 className="text-sm font-black uppercase text-white tracking-widest">Paleta Oficial de Cores</h4>
                           </div>
                           <div className="space-y-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">Cor Primária (Destaques e Botões)</label>
                                 <div className="flex gap-4 items-center">
                                    <input 
                                       type="color" 
                                       value={clubIdentity.tp_primary_color || '#a3e635'} 
                                       onChange={e => setClubIdentity({ ...clubIdentity, tp_primary_color: e.target.value })}
                                       className="w-14 h-14 rounded-2xl border-0 bg-transparent cursor-pointer shrink-0"
                                    />
                                    <input 
                                       type="text" 
                                       value={clubIdentity.tp_primary_color || '#a3e635'} 
                                       onChange={e => setClubIdentity({ ...clubIdentity, tp_primary_color: e.target.value })}
                                       className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-4 text-xs font-black text-white uppercase outline-none focus:border-saas-primary/50"
                                       placeholder="#A3E635"
                                    />
                                 </div>
                              </div>

                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">Cor Secundária (Fundos e Contrapesos)</label>
                                 <div className="flex gap-4 items-center">
                                    <input 
                                       type="color" 
                                       value={clubIdentity.tp_secondary_color || '#000000'} 
                                       onChange={e => setClubIdentity({ ...clubIdentity, tp_secondary_color: e.target.value })}
                                       className="w-14 h-14 rounded-2xl border-0 bg-transparent cursor-pointer shrink-0"
                                    />
                                    <input 
                                       type="text" 
                                       value={clubIdentity.tp_secondary_color || '#000000'} 
                                       onChange={e => setClubIdentity({ ...clubIdentity, tp_secondary_color: e.target.value })}
                                       className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-4 text-xs font-black text-white uppercase outline-none focus:border-saas-primary/50"
                                       placeholder="#000000"
                                    />
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Imagens e Logos */}
                        <div className="bg-[#121214] border border-white/5 rounded-[32px] p-8 space-y-6 shadow-xl">
                           <div className="border-b border-white/5 pb-4">
                              <h4 className="text-sm font-black uppercase text-white tracking-widest">Logotipos e Ícones</h4>
                           </div>
                           <div className="space-y-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">Logo Oficial do Clube (PNG Transparente)</label>
                                 <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center p-2 shrink-0 overflow-hidden">
                                       {clubIdentity.tp_logo_url ? (
                                          <img src={clubIdentity.tp_logo_url} alt="Logo" className="w-full h-full object-contain" />
                                       ) : (
                                          <ImageIcon size={24} className="text-zinc-700" />
                                       )}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                       <input 
                                          type="text" 
                                          placeholder="URL da imagem do logo..." 
                                          value={clubIdentity.tp_logo_url} 
                                          onChange={e => setClubIdentity({ ...clubIdentity, tp_logo_url: e.target.value })}
                                          className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-saas-primary/50"
                                       />
                                       <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 border border-white/5 hover:bg-zinc-700 text-[9px] font-black uppercase text-zinc-300 cursor-pointer transition-colors">
                                          <Upload size={12} /> Fazer Upload
                                          <input 
                                             type="file" accept="image/*" className="hidden" 
                                             onChange={async e => {
                                                const f = e.target.files?.[0];
                                                if (f) {
                                                   const u = await handleFileUpload(f, 'noticias');
                                                   if (u) setClubIdentity({ ...clubIdentity, tp_logo_url: u });
                                                }
                                             }} 
                                          />
                                       </label>
                                    </div>
                                 </div>
                              </div>

                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">Ícone do Navegador (Favicon)</label>
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                                       {clubIdentity.tp_favicon_url ? (
                                          <img src={clubIdentity.tp_favicon_url} alt="Favicon" className="w-full h-full object-contain" />
                                       ) : (
                                          <Globe size={20} className="text-zinc-700" />
                                       )}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                       <input 
                                          type="text" 
                                          placeholder="URL do favicon..." 
                                          value={clubIdentity.tp_favicon_url} 
                                          onChange={e => setClubIdentity({ ...clubIdentity, tp_favicon_url: e.target.value })}
                                          className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-saas-primary/50"
                                       />
                                       <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 border border-white/5 hover:bg-zinc-700 text-[9px] font-black uppercase text-zinc-300 cursor-pointer transition-colors">
                                          <Upload size={12} /> Fazer Upload
                                          <input 
                                             type="file" accept="image/*" className="hidden" 
                                             onChange={async e => {
                                                const f = e.target.files?.[0];
                                                if (f) {
                                                   const u = await handleFileUpload(f, 'noticias');
                                                   if (u) setClubIdentity({ ...clubIdentity, tp_favicon_url: u });
                                                }
                                             }} 
                                          />
                                       </label>
                                    </div>
                                 </div>
                              </div>

                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">Nome Curto / Apelido da Marca</label>
                                 <input 
                                    type="text" 
                                    placeholder="Ex: Gameleira" 
                                    value={clubIdentity.tp_short_name || ''} 
                                    onChange={e => setClubIdentity({ ...clubIdentity, tp_short_name: e.target.value })}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-saas-primary/50"
                                 />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'integration' && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                     <div className="flex justify-between items-center bg-[#121214] border border-white/5 p-8 rounded-[32px] shadow-xl">
                        <div>
                           <h3 className="text-2xl font-manrope font-extrabold uppercase tracking-tight text-white flex items-center gap-3">
                              <Zap className="text-saas-primary" size={28} />
                              Integrações & Tráfego Pago
                           </h3>
                           <p className="text-xs font-black uppercase tracking-widest text-zinc-500 italic mt-1">
                              Conecte pixels e scripts de rastreamento para maximizar conversões
                           </p>
                        </div>
                        <button
                           onClick={async () => {
                              setIsSaving(true);
                              try {
                                 const orgIdToUpdate = currentOrgId || 'dc1f5d6a-4714-46b2-92cc-5ff423c2b3ed';
                                 const { error } = await supabase.from('organizations').update({
                                    tp_pixel_facebook: clubIdentity.tp_pixel_facebook,
                                    tp_google_analytics: clubIdentity.tp_google_analytics,
                                    tp_google_tag_manager: clubIdentity.tp_google_tag_manager,
                                 }).eq('id', orgIdToUpdate);
                                 if (error) throw error;
                                 showNotification('Scripts de integração atualizados com sucesso!', 'success');
                              } catch (err: any) {
                                 showNotification('Erro ao salvar integrações: ' + err.message, 'error');
                              } finally {
                                 setIsSaving(false);
                              }
                           }}
                           disabled={isSaving}
                           className="bg-[#a3e635] text-black px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-saas-primary/20 disabled:opacity-50"
                        >
                           {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} strokeWidth={3} />}
                           {isSaving ? 'Salvando...' : 'Salvar Scripts'}
                        </button>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-black">
                                 f
                              </div>
                              <div>
                                 <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Meta Pixel (Facebook)</h4>
                                 <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Rastreamento de Leads</span>
                              </div>
                           </div>
                           <p className="text-xs text-zinc-400 font-normal leading-relaxed">
                              Insira o ID do seu Pixel para rastrear acessos, captação de sócios e engajamento em campanhas.
                           </p>
                           <input 
                              type="text" 
                              placeholder="Ex: 123456789012345" 
                              value={clubIdentity.tp_pixel_facebook || ''}
                              onChange={e => setClubIdentity({ ...clubIdentity, tp_pixel_facebook: e.target.value })}
                              className="w-full bg-zinc-900/80 border border-white/5 rounded-xl p-3 text-xs font-bold text-saas-primary outline-none focus:border-saas-primary/50 tracking-wider font-mono"
                           />
                        </div>

                        <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black">
                                 G
                              </div>
                              <div>
                                 <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Google Analytics 4</h4>
                                 <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Métricas de Audiência</span>
                              </div>
                           </div>
                           <p className="text-xs text-zinc-400 font-normal leading-relaxed">
                              Cole sua tag de medição G-XXXXX para ter relatórios detalhados de tráfego, sessões e origens.
                           </p>
                           <input 
                              type="text" 
                              placeholder="Ex: G-ABC123XYZ" 
                              value={clubIdentity.tp_google_analytics || ''}
                              onChange={e => setClubIdentity({ ...clubIdentity, tp_google_analytics: e.target.value })}
                              className="w-full bg-zinc-900/80 border border-white/5 rounded-xl p-3 text-xs font-bold text-saas-primary outline-none focus:border-saas-primary/50 tracking-wider font-mono"
                           />
                        </div>

                        <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black">
                                 GTM
                              </div>
                              <div>
                                 <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Tag Manager</h4>
                                 <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Injeção Avançada</span>
                              </div>
                           </div>
                           <p className="text-xs text-zinc-400 font-normal leading-relaxed">
                              Gerencie todas as suas tags de conversão diretamente pelo contêiner oficial do Google Tag Manager.
                           </p>
                           <input 
                              type="text" 
                              placeholder="Ex: GTM-XXXXXXX" 
                              value={clubIdentity.tp_google_tag_manager || ''}
                              onChange={e => setClubIdentity({ ...clubIdentity, tp_google_tag_manager: e.target.value })}
                              className="w-full bg-zinc-900/80 border border-white/5 rounded-xl p-3 text-xs font-bold text-saas-primary outline-none focus:border-saas-primary/50 tracking-wider font-mono"
                           />
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'squad' && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                     <div className="flex justify-between items-center bg-[#121214] border border-white/5 p-8 rounded-[32px] shadow-xl">
                        <div>
                           <h3 className="text-2xl font-manrope font-extrabold uppercase tracking-tight text-white flex items-center gap-3">
                              <ShieldCheck className="text-saas-primary" size={28} />
                              Elenco Oficial
                           </h3>
                           <p className="text-xs font-black uppercase tracking-widest text-zinc-500 italic mt-1">
                              Gerencie os dados visíveis no site oficial para cada craque do clube
                           </p>
                        </div>
                        <button 
                           onClick={() => {
                              setEditingPlayer(null);
                              setEditPlayerForm({
                                 full_name: '', known_as: '', position: 'Atacante', shirt_number: '10',
                                 photo_url: '', birth_date: '', gender: 'Masculino',
                                 organization_id: currentOrgId || 'dc1f5d6a-4714-46b2-92cc-5ff423c2b3ed'
                              });
                           }}
                           className="bg-[#a3e635] text-black px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-saas-primary/20"
                        >
                           <PlusCircle size={16} strokeWidth={3} /> Cadastrar Atleta
                        </button>
                     </div>

                     {/* Filtros solicitados: barra de pesquisa, categorias, modalidades */}
                     <div className="bg-[#121214] border border-white/5 p-6 rounded-3xl flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96">
                           <input 
                              type="text" 
                              placeholder="Pesquisar por nome ou apelido..." 
                              value={squadSearch} 
                              onChange={e => setSquadSearch(e.target.value)}
                              className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-3 pl-11 text-xs text-white font-bold outline-none focus:border-saas-primary/50"
                           />
                           <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                           <div className="flex items-center gap-2 bg-zinc-900 border border-white/5 rounded-2xl px-3 py-1.5 w-full md:w-auto justify-between">
                              <span className="text-[9px] font-black uppercase text-zinc-600 tracking-wider">Modalidade:</span>
                              <select 
                                 value={squadModalityFilter} 
                                 onChange={e => setSquadModalityFilter(e.target.value)}
                                 className="bg-transparent text-xs font-extrabold text-white outline-none border-none cursor-pointer"
                              >
                                 <option value="all" className="bg-zinc-900">Todas</option>
                                 <option value="Futebol" className="bg-zinc-900">Futebol</option>
                                 <option value="Futsal" className="bg-zinc-900">Futsal</option>
                              </select>
                           </div>

                           <div className="flex items-center gap-2 bg-zinc-900 border border-white/5 rounded-2xl px-3 py-1.5 w-full md:w-auto justify-between">
                              <span className="text-[9px] font-black uppercase text-zinc-600 tracking-wider">Categoria:</span>
                              <select 
                                 value={squadCategoryFilter} 
                                 onChange={e => setSquadCategoryFilter(e.target.value)}
                                 className="bg-transparent text-xs font-extrabold text-white outline-none border-none cursor-pointer"
                              >
                                 <option value="all" className="bg-zinc-900">Todas</option>
                                 <option value="Profissional" className="bg-zinc-900">Profissional</option>
                                 <option value="Sub-20" className="bg-zinc-900">Sub-20</option>
                                 <option value="Base" className="bg-zinc-900">Base</option>
                              </select>
                           </div>
                        </div>
                     </div>

                     {/* Listagem de Atletas: Card em pé retangular com bordas arredondadas */}
                     {players.length === 0 ? (
                        <div className="bg-[#121214] border border-white/5 rounded-3xl p-12 text-center space-y-3">
                           <Users size={48} className="mx-auto text-zinc-700" />
                           <p className="text-sm font-extrabold uppercase text-white tracking-wider">Nenhum atleta cadastrado</p>
                           <p className="text-xs text-zinc-500 font-medium">Cadastre os jogadores para exibi-los com destaque na página oficial.</p>
                        </div>
                     ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                           {players
                              .filter(p => {
                                 const matchSearch = p.full_name?.toLowerCase().includes(squadSearch.toLowerCase()) || 
                                                     p.known_as?.toLowerCase().includes(squadSearch.toLowerCase());
                                 const matchModality = squadModalityFilter === 'all' || p.modality_name === squadModalityFilter || p.modality === squadModalityFilter;
                                 const matchCategory = squadCategoryFilter === 'all' || p.category_name === squadCategoryFilter || p.category === squadCategoryFilter;
                                 return matchSearch && matchModality && matchCategory;
                              })
                              .map(player => (
                                 <div 
                                    key={player.id} 
                                    className="bg-gradient-to-b from-zinc-800 to-[#121214] border border-white/10 rounded-[24px] overflow-hidden shadow-2xl hover:scale-105 hover:border-saas-primary/50 transition-all duration-300 flex flex-col group relative aspect-[3/4]"
                                 >
                                    {/* Número da camisa flutuante */}
                                    <div className="absolute top-3 left-3 z-10 font-black text-2xl text-white italic drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                                       {player.shirt_number || '-'}
                                    </div>

                                    {/* Foto em pé preenchendo o card */}
                                    <div className="flex-1 w-full bg-zinc-900 relative overflow-hidden flex items-end justify-center pt-8">
                                       {player.photo_url ? (
                                          <img src={player.photo_url} alt={player.known_as || player.full_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                       ) : (
                                          <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-600 mb-6 border border-white/5"><User size={32} /></div>
                                       )}
                                       {/* Degradê na base para legibilidade do nome */}
                                       <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-[#121214]/40 to-transparent"></div>
                                    </div>

                                    {/* Dados básicos exibidos na base */}
                                    <div className="p-4 relative z-10 flex flex-col items-center text-center space-y-1 bg-[#121214]">
                                       <span className="text-[9px] font-black uppercase text-saas-primary tracking-widest leading-none">
                                          {player.position || 'Jogador'}
                                       </span>
                                       <h4 className="text-xs font-extrabold uppercase text-white truncate w-full tracking-tight">
                                          {player.known_as || player.full_name || 'Atleta'}
                                       </h4>
                                       <span className="text-[8px] text-zinc-500 font-bold uppercase block truncate w-full">
                                          {player.category_name || player.category || 'Profissional'}
                                       </span>

                                       <button 
                                          onClick={() => {
                                             setEditingPlayer(player);
                                             setEditPlayerForm({
                                                full_name: player.full_name || '', known_as: player.known_as || '',
                                                position: player.position || 'Atacante', shirt_number: player.shirt_number || '',
                                                photo_url: player.photo_url || '', birth_date: player.birth_date || '',
                                                gender: player.gender || 'Masculino',
                                                organization_id: player.organization_id || currentOrgId
                                             });
                                          }}
                                          className="absolute top-[-36px] right-3 w-8 h-8 rounded-full bg-saas-primary text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
                                          title="Editar Dados Oficiais"
                                       >
                                          <Edit3 size={14} strokeWidth={2.5} />
                                       </button>
                                    </div>
                                 </div>
                              ))}
                        </div>
                     )}

                     {/* Formulário de Edição/Cadastro de Atleta */}
                     {editPlayerForm.organization_id && (
                        <div className="bg-[#121214] border border-white/5 rounded-[32px] p-8 space-y-6 shadow-2xl border-t-2 border-t-saas-primary">
                           <div className="flex items-center justify-between border-b border-white/5 pb-4">
                              <h4 className="text-sm font-black uppercase text-white tracking-widest flex items-center gap-2">
                                 <Edit3 className="text-saas-primary" size={16} />
                                 {editingPlayer ? `Editando Atleta: ${editingPlayer.known_as || editingPlayer.full_name}` : 'Cadastrando Novo Atleta Oficial'}
                              </h4>
                              <button onClick={() => { setEditingPlayer(null); setEditPlayerForm({}); }} className="text-zinc-500 hover:text-white">
                                 <X size={16} />
                              </button>
                           </div>

                           <form onSubmit={async e => {
                              e.preventDefault();
                              setSavingPlayer(true);
                              try {
                                 const payload = {
                                    ...editPlayerForm,
                                    organization_id: currentOrgId || 'dc1f5d6a-4714-46b2-92cc-5ff423c2b3ed'
                                 };
                                 let res;
                                 if (editingPlayer) {
                                    res = await supabase.from('athletes').update(payload).eq('id', editingPlayer.id);
                                 } else {
                                    res = await supabase.from('athletes').insert([payload]);
                                 }
                                 if (!res.error) {
                                    showNotification('Dados do atleta atualizados para o site oficial!', 'success');
                                    setEditingPlayer(null);
                                    setEditPlayerForm({});
                                    fetchData(currentOrgId);
                                 } else throw res.error;
                              } catch (err: any) {
                                 showNotification('Erro ao salvar: ' + err.message, 'error');
                              } finally {
                                 setSavingPlayer(false);
                              }
                           }} className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">Nome Completo</label>
                                    <input 
                                       type="text" required placeholder="Nome inteiro do atleta" value={editPlayerForm.full_name || ''} 
                                       onChange={e => setEditPlayerForm({...editPlayerForm, full_name: e.target.value})}
                                       className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs text-white font-bold outline-none focus:border-saas-primary/50"
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">Nome do Jogador (Camisa/Site)</label>
                                    <input 
                                       type="text" required placeholder="Ex: Gabigol" value={editPlayerForm.known_as || ''} 
                                       onChange={e => setEditPlayerForm({...editPlayerForm, known_as: e.target.value})}
                                       className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs text-white font-bold outline-none focus:border-saas-primary/50"
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">Posição</label>
                                    <input 
                                       type="text" required placeholder="Goleiro, Zagueiro, Atacante..." value={editPlayerForm.position || ''} 
                                       onChange={e => setEditPlayerForm({...editPlayerForm, position: e.target.value})}
                                       className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs text-white font-bold outline-none focus:border-saas-primary/50"
                                    />
                                 </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">Número da Camisa</label>
                                    <input 
                                       type="text" placeholder="Ex: 10" value={editPlayerForm.shirt_number || ''} 
                                       onChange={e => setEditPlayerForm({...editPlayerForm, shirt_number: e.target.value})}
                                       className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs text-white font-bold outline-none focus:border-saas-primary/50 font-mono"
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">Data de Nascimento</label>
                                    <input 
                                       type="date" value={editPlayerForm.birth_date || ''} 
                                       onChange={e => setEditPlayerForm({...editPlayerForm, birth_date: e.target.value})}
                                       className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs text-white font-bold outline-none focus:border-saas-primary/50"
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">Sexo</label>
                                    <select 
                                       value={editPlayerForm.gender || 'Masculino'} 
                                       onChange={e => setEditPlayerForm({...editPlayerForm, gender: e.target.value})}
                                       className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs text-white font-bold outline-none focus:border-saas-primary/50"
                                    >
                                       <option value="Masculino">Masculino</option>
                                       <option value="Feminino">Feminino</option>
                                    </select>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">Foto em Pé (URL/Upload)</label>
                                    <div className="flex gap-2">
                                       <input 
                                          type="text" placeholder="URL da foto..." value={editPlayerForm.photo_url || ''} 
                                          onChange={e => setEditPlayerForm({...editPlayerForm, photo_url: e.target.value})}
                                          className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-xs text-white font-bold outline-none focus:border-saas-primary/50"
                                       />
                                       <label className="px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center cursor-pointer border border-white/5 text-saas-primary" title="Upload">
                                          <Upload size={14} />
                                          <input type="file" accept="image/*" className="hidden" onChange={async e => {
                                             const f = e.target.files?.[0];
                                             if (f) {
                                                const u = await handleFileUpload(f, 'noticias');
                                                if (u) setEditPlayerForm({...editPlayerForm, photo_url: u});
                                             }
                                          }} />
                                       </label>
                                    </div>
                                 </div>
                              </div>

                              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                                 <button type="button" onClick={() => { setEditingPlayer(null); setEditPlayerForm({}); }} className="px-5 py-2.5 rounded-xl bg-zinc-800 text-xs font-bold text-zinc-400 hover:text-white">
                                    Cancelar
                                 </button>
                                 <button type="submit" disabled={savingPlayer} className="px-6 py-2.5 rounded-xl bg-saas-primary text-black text-xs font-black uppercase tracking-wider hover:scale-105 transition-transform">
                                    {savingPlayer ? 'Salvando...' : 'Confirmar Dados Oficiais'}
                                 </button>
                              </div>
                           </form>
                        </div>
                     )}
                  </div>
               )}

               {activeTab === 'trophies' && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                     <div className="flex justify-between items-center bg-[#121214] border border-white/5 p-8 rounded-[32px] shadow-xl">
                        <div>
                           <h3 className="text-2xl font-manrope font-extrabold uppercase tracking-tight text-white flex items-center gap-3">
                              <Trophy className="text-saas-primary" size={28} />
                              Sala de Títulos Oficiais
                           </h3>
                           <p className="text-xs font-black uppercase tracking-widest text-zinc-500 italic mt-1">
                              Imortalize as maiores conquistas e troféus exibidos no portal
                           </p>
                        </div>
                        <button 
                           onClick={() => showNotification('Cadastramento de troféus ativado.', 'success')}
                           className="bg-[#a3e635] text-black px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 hover:scale-105 transition-all shadow-xl"
                        >
                           <PlusCircle size={16} strokeWidth={3} /> Adicionar Troféu
                        </button>
                     </div>

                     {trophies.length === 0 ? (
                        <div className="bg-[#121214] border border-white/5 rounded-3xl p-12 text-center space-y-3">
                           <Trophy size={48} className="mx-auto text-amber-500/40" />
                           <p className="text-sm font-extrabold uppercase text-white tracking-wider">Nenhum título cadastrado</p>
                           <p className="text-xs text-zinc-500 font-medium">Cadastre campeonatos estaduais, copas e títulos históricos do clube.</p>
                        </div>
                     ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                           {trophies.map(t => (
                              <div key={t.id} className="bg-[#121214] border border-white/5 rounded-3xl p-6 flex flex-col items-center text-center space-y-3 relative group">
                                 <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center font-black text-xl border border-amber-500/20 shadow-inner">
                                    🏆
                                 </div>
                                 <span className="text-lg font-manrope font-extrabold text-white">{t.year || '2024'}</span>
                                 <h4 className="text-xs font-bold uppercase text-zinc-300 line-clamp-2">{t.title || t.name || 'Campeão Invicto'}</h4>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               )}

               {activeTab === 'institutional' && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                     <div className="flex justify-between items-center bg-[#121214] border border-white/5 p-8 rounded-[32px] shadow-xl">
                        <div>
                           <h3 className="text-2xl font-manrope font-extrabold uppercase tracking-tight text-white flex items-center gap-3">
                              <Users className="text-saas-primary" size={28} />
                              Portal Institucional
                           </h3>
                           <p className="text-xs font-black uppercase tracking-widest text-zinc-500 italic mt-1">
                              Divulgação pública da Diretoria Executiva e Portal de Transparência
                           </p>
                        </div>
                        <div className="flex bg-zinc-900 border border-white/5 rounded-2xl p-1 gap-1">
                           <button 
                              onClick={() => setInstitutionalTab('board')}
                              className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${institutionalTab === 'board' ? 'bg-saas-primary text-black' : 'text-zinc-500 hover:text-white'}`}
                           >
                              Diretoria
                           </button>
                           <button 
                              onClick={() => setInstitutionalTab('transparency')}
                              className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${institutionalTab === 'transparency' ? 'bg-saas-primary text-black' : 'text-zinc-500 hover:text-white'}`}
                           >
                              Transparência
                           </button>
                        </div>
                     </div>

                     {institutionalTab === 'board' ? (
                        <div className="bg-[#121214] border border-white/5 rounded-3xl p-8 space-y-6">
                           <h4 className="text-xs font-extrabold uppercase tracking-wider text-saas-primary">Membros do Conselho & Diretoria</h4>
                           {boardMembers.length === 0 ? (
                              <p className="text-xs text-zinc-500 font-bold italic">Nenhum diretor cadastrado. Utilize a API para injetar os cargos oficiais.</p>
                           ) : (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                 {boardMembers.map(b => (
                                    <div key={b.id} className="p-4 rounded-2xl bg-zinc-900 border border-white/5 space-y-1">
                                       <h5 className="text-sm font-extrabold text-white uppercase">{b.name}</h5>
                                       <span className="text-[10px] font-bold text-saas-primary uppercase tracking-widest block">{b.role}</span>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>
                     ) : (
                        <div className="bg-[#121214] border border-white/5 rounded-3xl p-8 space-y-6">
                           <h4 className="text-xs font-extrabold uppercase tracking-wider text-saas-primary">Relatórios Financeiros e Atas Oficiais</h4>
                           {reports.length === 0 ? (
                              <p className="text-xs text-zinc-500 font-bold italic">Nenhum documento de transparência publicado.</p>
                           ) : (
                              <div className="space-y-3">
                                 {reports.map(r => (
                                    <div key={r.id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-white/5">
                                       <span className="text-xs font-bold text-white">{r.title || 'Balancete Geral'}</span>
                                       <a href={r.file_url || '#'} target="_blank" className="text-[10px] text-saas-primary font-black uppercase hover:underline">Baixar PDF</a>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>
                     )}
                  </div>
               )}

               {activeTab === 'users' && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                     <div className="flex justify-between items-center bg-[#121214] border border-white/5 p-8 rounded-[32px] shadow-xl">
                        <div>
                           <h3 className="text-2xl font-manrope font-extrabold uppercase tracking-tight text-white flex items-center gap-3">
                              <ShieldCheck className="text-saas-primary" size={28} />
                              Gestão de Acessos
                           </h3>
                           <p className="text-xs font-black uppercase tracking-widest text-zinc-500 italic mt-1">
                              Controle de administradores e permissões na plataforma
                           </p>
                        </div>
                     </div>

                     <div className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                        <div className="p-6 border-b border-white/5">
                           <span className="text-xs font-extrabold text-white uppercase tracking-wider">Contas com Permissão Administrativa</span>
                        </div>
                        <div className="divide-y divide-white/5">
                           <div className="p-6 flex items-center justify-between hover:bg-white/2 transition-colors">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-full bg-saas-primary/10 text-saas-primary flex items-center justify-center font-black">
                                    A
                                 </div>
                                 <div>
                                    <h5 className="text-xs font-extrabold text-white uppercase">{session?.user?.email || 'admin@clube.com'}</h5>
                                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Proprietário (Owner)</span>
                                 </div>
                              </div>
                              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">
                                 Acesso Total
                              </span>
                           </div>

                           {users.filter(u => u.id !== session?.user?.id).map(u => (
                              <div key={u.id} className="p-6 flex items-center justify-between hover:bg-white/2 transition-colors">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center font-black">
                                       G
                                    </div>
                                    <div>
                                       <h5 className="text-xs font-extrabold text-white uppercase">{u.email || u.full_name || 'Gestor'}</h5>
                                       <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Membro da Equipe</span>
                                    </div>
                                 </div>
                                 <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase tracking-widest border border-blue-500/20">
                                    Editor
                                 </span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               )}

            </div>
         </main>
      </div>
   );
}
