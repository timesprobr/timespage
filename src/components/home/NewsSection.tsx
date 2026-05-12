import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function NewsSection() {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await supabase
          .from('tp_news')
          .select('*')
          .order('createdAt', { ascending: false })
          .limit(5); // 1 main + 4 list

        if (error) throw error;
        setNews(data || []);
      } catch (e) {
        console.error('Erro ao buscar notícias:', e);
      }
    };
    fetchNews();
  }, []);

  if (!news || news.length === 0) return null;

  const mainNews = news[0];
  const listNews = news.slice(1);

  return (
    <section className="py-16 bg-[#e5e5e5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-5xl font-black text-black leading-tight uppercase italic tracking-tighter">
            Últimas <span className="text-primary">Notícias</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Main News Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[24px] p-6 shadow-xl flex flex-col h-full"
          >
            <Link to={`/noticias/${mainNews.id}`} className="group flex flex-col h-full">
              {/* Cover */}
              <div className="w-full aspect-[16/9] bg-black rounded-xl overflow-hidden mb-6 relative border border-black/5">
                <img 
                  src={mainNews.image || mainNews.imageUrl || 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop'} 
                  alt={mainNews.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Text Content */}
              <div className="flex-1 flex flex-col">
                <span className="text-primary font-black uppercase text-[10px] tracking-widest mb-2 block">{mainNews.date || 'Destaque'}</span>
                <h3 className="text-2xl md:text-3xl font-black text-black uppercase tracking-tighter leading-tight mb-4 group-hover:text-primary transition-colors">
                  {mainNews.title}
                </h3>
                <p className="text-black/70 text-sm md:text-base font-medium line-clamp-3 mb-8">
                  {mainNews.summary || 'Clique para ler os detalhes da notícia...'}
                </p>

                {/* Button */}
                <div className="mt-auto">
                  <div className="bg-black text-white text-center rounded-xl py-4 px-6 uppercase font-black text-sm tracking-[0.2em] group-hover:bg-primary transition-colors w-full">
                    Ver Notícia
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* List News */}
          <div className="flex flex-col gap-4">
            {listNews.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-[24px] p-4 shadow-xl flex-1 flex flex-col justify-center"
              >
                <Link to={`/noticias/${item.id}`} className="group flex gap-4 items-center h-full">
                  <div className="w-[100px] h-[100px] md:w-[140px] md:h-full bg-black rounded-xl overflow-hidden flex-shrink-0 relative border border-black/5">
                    <img 
                      src={item.image || item.imageUrl || 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=400&auto=format&fit=crop'} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-col justify-center flex-1 py-2">
                    <span className="text-primary font-black text-[10px] uppercase tracking-widest mb-1 block">{item.date || 'Recente'}</span>
                    <h4 className="text-sm md:text-base font-black text-black uppercase tracking-tighter leading-tight line-clamp-2 group-hover:text-primary transition-colors mb-2">
                      {item.title}
                    </h4>
                    <p className="text-black/60 text-[10px] md:text-xs line-clamp-2">
                      {item.summary || 'Clique para ler mais...'}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}

            {listNews.length === 0 && (
              <div className="text-center p-12 bg-white rounded-[24px] shadow-xl">
                <p className="text-black/50 font-bold uppercase text-xs tracking-widest">Nenhuma outra notícia recente.</p>
              </div>
            )}

            <Link to="/noticias" className="block text-center border-2 border-black hover:bg-black hover:text-white text-black font-black uppercase text-xs tracking-[0.2em] py-3 rounded-xl transition-colors w-full mt-2">
              Ver Todas as Notícias
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
