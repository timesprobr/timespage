import { useState, useEffect, useContext } from 'react';
import { motion } from 'motion/react';
import { Shield, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ConfigContext } from '../App';

export default function Board() {
  const [boardMembers, setBoardMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const config = useContext(ConfigContext);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const { data, error } = await supabase
          .from('tp_board')
          .select('*')
          .order('name', { ascending: true });

        if (error) throw error;
        setBoardMembers(data || []);
      } catch (e) {
        console.error("Error fetching board:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, []);

  const sections = [
    {
      id: 'executiva',
      title: 'Diretoria executiva',
      description: 'Responsável pela gestão administrativa, operacional e financeira do clube no dia a dia.',
      filter: 'Diretoria executiva'
    },
    {
      id: 'deliberativo',
      title: 'Conselho deliberativo',
      description: 'Órgão de deliberação e consulta, responsável por zelar pelo cumprimento do estatuto e decisões estratégicas.',
      filter: 'Conselho deliberativo'
    },
    {
      id: 'fiscal',
      title: 'Conselho Fiscal',
      description: 'Responsável pela fiscalização contábil e auditoria das contas da instituição.',
      filter: 'Conselho Fiscal'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Reduced Header - Keep Dark */}
      <section className="relative h-[25vh] flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundColor: config.colors.primary }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            <span style={{ color: config.colors.primary }} className="font-black uppercase text-[10px] tracking-[0.4em]">{config.name}</span>
            <h1 className="text-3xl md:text-5xl font-manrope font-extrabold text-white uppercase tracking-tight leading-none">
              Diretoria <span style={{ color: config.colors.primary }}>Institucional</span>
            </h1>
            <p className="text-gray-400 font-medium text-sm max-w-xl">
              Liderança e governança dedicada à excelência do {config.shortName}.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : sections.map((section, sIdx) => {
          const members = boardMembers.filter(m => m.category === section.filter);
          if (members.length === 0) return null;

          return (
            <div key={section.id} className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-manrope font-extrabold text-black uppercase tracking-tight whitespace-nowrap">
                    {section.title}
                  </h2>
                  <div className="h-px w-full" style={{ backgroundColor: `${config.colors.primary}33` }}></div>
                </div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{section.description}</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {members.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <div className="bg-gray-50 border border-gray-100 p-4 transition-all text-center shadow-sm h-full hover:border-[var(--hover-color)]" style={{ '--hover-color': `${config.colors.primary}66` } as any}>
                      <div className="aspect-square bg-gray-200 rounded-full mb-4 mx-auto overflow-hidden border-2 border-white group-hover:border-[var(--hover-color)] transition-colors flex items-center justify-center" style={{ '--hover-color': `${config.colors.primary}4d` } as any}>
                         {member.photoUrl ? (
                           <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                         ) : (
                           <User size={32} className="text-gray-400 group-hover:text-[var(--hover-color)] transition-colors" style={{ '--hover-color': config.colors.primary } as any} />
                         )}
                      </div>
                      <h3 className="text-xs font-black text-black uppercase italic tracking-tight leading-tight">{member.name}</h3>
                      <p className="text-[10px] font-bold uppercase mt-1 tracking-tight" style={{ color: config.colors.primary }}>{member.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
