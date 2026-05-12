import { motion } from 'motion/react';
import { useState, useEffect, useRef, useContext } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Calendar, User, ArrowLeft, Share2, Facebook, Instagram, Eye } from 'lucide-react';
import { ConfigContext } from '../App';

function NewsContent({ html, primaryColor }: { html: string, primaryColor: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const shadow = container.shadowRoot || container.attachShadow({ mode: 'open' });
      
      const baseStyle = `
        :host { display: block; width: 100%; }
        .article-body {
          font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
          color: #1a1a1a;
          line-height: 1.8;
          font-size: 1.15rem;
          word-wrap: break-word;
          overflow-wrap: break-word;
          word-break: break-word;
          max-width: 100%;
        }
        img { max-width: 100%; height: auto; display: block; margin: 2.5rem auto; border-radius: 1rem; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
        h1, h2, h3 { color: #000; margin-top: 2.5rem; margin-bottom: 1.5rem; font-weight: 800; text-transform: uppercase; font-style: italic; }
        p { margin-bottom: 1.8rem; }
        a { color: ${primaryColor}; font-weight: bold; text-decoration: none; border-bottom: 2px solid transparent; transition: all 0.3s; }
        a:hover { border-bottom-color: ${primaryColor}; }
        ul, ol { margin-bottom: 2rem; padding-left: 1.5rem; }
        li { margin-bottom: 0.5rem; }
        blockquote { border-left: 4px solid ${primaryColor}; padding-left: 1.5rem; margin: 2rem 0; font-style: italic; color: #4b5563; }
      `;

      shadow.innerHTML = `
        <style>${baseStyle}</style>
        <div class="article-body">${html}</div>
      `;
    }
  }, [html, primaryColor]);

  return <div ref={containerRef} />;
}

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

export default function NewsDetail() {
  const { id } = useParams();
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const config = useContext(ConfigContext);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orgId = params.get('orgId') || config.orgId;

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (data) {
           setItem(data as NewsItem);
           // Incrementar contador de visualizações
           await supabase.rpc('increment_news_views', { news_id: id });
        }
      } catch (error) {
        console.error("Error fetching news detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${config.colors.primary} transparent ${config.colors.primary} ${config.colors.primary}` }}></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-6">
        <h2 className="text-3xl font-black text-black uppercase italic">Notícia não encontrada</h2>
        <Link to={`/noticias${orgId ? `?orgId=${orgId}` : ''}`} className="bg-black text-white px-8 py-3 font-bold uppercase text-xs tracking-widest">Voltar para notícias</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Image Section */}
      <section className="relative h-[40vh] overflow-hidden bg-black">
        <img 
          src={(item as any).image || item.imageUrl || 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1920&auto=format&fit=crop'} 
          alt={item.title} 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
        
        <div className="absolute inset-0 flex flex-col justify-end pb-12">
          <div className="max-w-6xl mx-auto px-4 w-full">
            <Link to={`/noticias${orgId ? `?orgId=${orgId}` : ''}`} className="inline-flex items-center gap-2 text-black/80 hover:text-saas-primary font-black uppercase text-[10px] tracking-widest mb-8 transition-colors drop-shadow-sm" style={{ '--hover-color': config.colors.primary } as any}>
              <ArrowLeft size={16} /> Voltar para Notícias
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <span style={{ backgroundColor: config.colors.primary }} className="text-black px-4 py-1 font-black text-xs uppercase tracking-widest shadow-2xl">
                {item.category || 'Geral'}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-black uppercase italic tracking-tighter leading-[0.9] drop-shadow-sm">
                {item.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-12 border-b border-gray-100 mb-12">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Calendar size={18} style={{ color: config.colors.primary }} />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-gray-400">Publicado em</span>
                <span className="text-sm font-bold text-black">
                   {item.date?.toDate ? item.date.toDate().toLocaleDateString('pt-BR') : (item.date || 'Recent')}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User size={18} style={{ color: config.colors.primary }} />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-gray-400">Escrito por</span>
                <span className="text-sm font-bold text-black">{item.author || config.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Eye size={18} style={{ color: config.colors.primary }} />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-gray-400">Visualizações</span>
                <span className="text-sm font-bold text-black">{item.views || 0}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black uppercase text-gray-400 mr-2">Compartilhar:</span>
             <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all">
                <Facebook size={18} />
             </button>
             <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all">
                <Instagram size={18} />
             </button>
             <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all">
                <Share2 size={18} />
             </button>
          </div>
        </div>

        <div className="max-w-none pb-20">
          <NewsContent html={item.content} primaryColor={config.colors.primary} />
        </div>

        {/* Tags / Footer */}
        <div className="mt-20 pt-12 border-t border-gray-100">
           <div className="bg-gray-50 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2 text-center md:text-left">
                 <h4 className="text-xl font-black uppercase italic text-black">Mais Notícias?</h4>
                 <p className="text-gray-500 font-medium text-sm">Acompanhe o {config.name} em tempo real.</p>
              </div>
               <Link to={`/noticias${orgId ? `?orgId=${orgId}` : ''}`} style={{ backgroundColor: config.colors.primary }} className="text-black px-10 py-4 font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all shadow-xl">
                  Ver todas as matérias
               </Link>
           </div>
        </div>
      </section>
    </div>
  );
}
