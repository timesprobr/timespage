import { motion } from 'motion/react';
import { useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, User, ArrowRight, Newspaper, Eye } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ConfigContext } from '../App';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  date: any;
  author: string;
  category: string;
  views: number;
}

export default function NewsList() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const config = useContext(ConfigContext);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orgId = params.get('orgId') || config.orgId;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        let query = supabase.from('news').select('*');
        
        if (orgId) {
          query = query.eq('org_id', orgId);
        }

        const { data, error } = await query.order('createdAt', { ascending: false });

        if (error) throw error;
        setNews(data as NewsItem[]);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [orgId]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Keep Dark */}
      <section className="relative h-[30vh] flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundColor: config.colors.primary }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            <span style={{ color: config.colors.primary }} className="font-black uppercase text-[10px] tracking-[0.4em]">{config.name}</span>
            <h1 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
               Notícias <span style={{ color: config.colors.primary }}>do Clube</span>
            </h1>
            <p className="text-gray-400 font-medium text-sm max-w-xl">
              Fique por dentro de tudo o que acontece no cotidiano do {config.shortName}.
            </p>
          </motion.div>
        </div>
      </section>

      {/* News Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${config.colors.primary} transparent ${config.colors.primary} ${config.colors.primary}` }}></div>
          </div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {news.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group flex flex-col h-full bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-all overflow-hidden"
              >
                <Link to={`/noticias/${item.id}${orgId ? `?orgId=${orgId}` : ''}`} className="relative aspect-video overflow-hidden bg-zinc-100">
                  <img 
                    src={(item as any).image || (item as any).imageUrl || 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop'} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span style={{ backgroundColor: config.colors.primary }} className="text-black px-3 py-1 font-black text-[10px] uppercase tracking-widest shadow-xl">
                      {item.category || 'Geral'}
                    </span>
                  </div>
                </Link>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} style={{ color: config.colors.primary }} />
                      {item.date?.toDate ? item.date.toDate().toLocaleDateString('pt-BR') : (item.date || 'Recent')}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User size={12} style={{ color: config.colors.primary }} />
                      {item.author || config.shortName}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Eye size={12} style={{ color: config.colors.primary }} />
                      {item.views || 0}
                    </div>
                  </div>

                  <h2 className="text-[18px] md:text-[20px] font-black text-black uppercase italic tracking-tighter mb-3 leading-tight transition-colors" style={{ '--hover-color': config.colors.primary } as any}>
                    <Link to={`/noticias/${item.id}${orgId ? `?orgId=${orgId}` : ''}`} className="hover:text-[var(--hover-color)] transition-colors">{item.title}</Link>
                  </h2>

                  <p className="text-gray-600 font-medium text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                    {(item as any).subtitle || item.summary || item.content?.substring(0, 150) + '...'}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-1.5 text-gray-400 font-bold text-[9px] uppercase tracking-widest">
                       <Eye size={12} className="text-gray-300" />
                       {item.views || 0} Leituras
                    </div>
                    
                    <Link 
                      to={`/noticias/${item.id}${orgId ? `?orgId=${orgId}` : ''}`}
                      className="inline-flex items-center gap-2 text-black font-black uppercase text-[10px] tracking-widest group/btn"
                    >
                      Ler Matéria 
                      <ArrowRight size={14} style={{ color: config.colors.primary }} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 space-y-6">
            <Newspaper size={64} className="mx-auto text-gray-100" />
            <h2 className="text-3xl font-black text-black uppercase italic tracking-tighter">Nenhuma Notícia Publicada</h2>
            <p className="text-gray-400 font-medium">Fique atento, em breve traremos as novidades do clube.</p>
          </div>
        )}
      </section>
    </div>
  );
}
