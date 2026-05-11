import { motion } from 'motion/react';
import { History, Target, Shield, Users } from 'lucide-react';
import { useContext } from 'react';
import { ConfigContext } from '../App';

export default function About() {
  const config = useContext(ConfigContext);
  return (
    <div className="bg-white min-h-screen text-black">
      {/* Header Section */}
      <section className="relative py-24 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0 opacity-30">
           <img 
            src="/RACING ANTIGO.jpg" 
            alt="Historical Racing FC" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <span style={{ color: config.colors.primary }} className="font-black uppercase text-xs tracking-[0.4em] mb-4 block">Nossa História</span>
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4 leading-none text-white">
              {config.name.split(' ').slice(0, -1).join(' ')} <span style={{ color: config.colors.primary }}>{config.name.split(' ').pop()}</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-3xl font-medium leading-relaxed">
              Tradição, paixão e glória. A história do {config.name} é escrita com dedicação e amor ao esporte.
            </p>
          </motion.div>
        </div>
      </section>

      {/* History Content */}
      <section className="py-24 bg-white text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 text-white px-4 py-2 font-bold uppercase text-xs tracking-widest" style={{ backgroundColor: config.colors.primary }}>
                <History size={16} /> Origem
              </div>
              <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-tight">
                UMA HISTÓRIA DE <span style={{ color: config.colors.primary }}>SUPERAÇÃO</span>
              </h2>
              <div className="space-y-6 text-gray-700 font-medium leading-relaxed text-lg">
                <p>
                  O {config.name} nasceu do desejo de desportistas locais de criar uma equipe que representasse a garra e a técnica do futebol de nossa região. O clube rapidamente se tornou uma referência de dedicação e espírito esportivo.
                </p>
                <p>
                  Adotando suas cores tradicionais, o {config.shortName} conquistou corações e se tornou conhecido pela sua entrega em campo. Durante décadas, foi um dos pilares do esporte local, unindo a comunidade em torno de uma só paixão.
                </p>
                <p>
                  Cada vitória e cada desafio superado reforçam o compromisso do {config.shortName} com a excelência e com sua torcida, buscando sempre um futebol vibrante que encanta todos os que acompanham o clube.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-zinc-100 overflow-hidden shadow-2xl relative">
                <img 
                  src="https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=800&auto=format&fit=crop" 
                  alt="Ancient football photo style" 
                  className="w-full h-full object-cover grayscale opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 border-[20px] border-black/20"></div>
              </div>
              {/* Floating Stat Card */}
              <div className="absolute -bottom-10 -left-10 bg-black text-white p-10 hidden lg:block shadow-2xl border-l-8" style={{ borderLeftColor: config.colors.primary }}>
                <span className="text-6xl font-black italic block mb-2">{config.shortName}</span>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: config.colors.primary }}>Tradição e Glória</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values/Pillars */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Target,
                title: 'Nossa Missão',
                desc: 'Fomentar o esporte e a cultura em Vitória, formando cidadãos através do futebol e honrando nossas cores em cada competição.'
              },
              {
                icon: Shield,
                title: 'Nossa Visão',
                desc: 'Ser reconhecido como o maior formador de talentos do Espírito Santo, unindo tradição histórica com modernidade administrativa.'
              },
              {
                icon: Users,
                title: 'Nossos Valores',
                desc: 'Ética, transparência, superação e o respeito incondicional à nossa apaixonada torcida rubro-negra.'
              }
            ].map((item, i) => (
              <div key={i} className="p-10 bg-white border border-gray-200 transition-all group shadow-sm hover:border-[var(--hover-color)]" style={{ '--hover-color': `${config.colors.primary}66` } as any}>
                <item.icon size={48} className="mb-8 transform group-hover:scale-110 transition-transform" style={{ color: config.colors.primary }} />
                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">{item.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">IDENTIDADE <span style={{ color: config.colors.primary }}>VISUAL</span></h2>
           </div>
           
           <div className="relative space-y-12">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block"></div>
              
              {[
                { year: 'Escudo', title: 'Nossa Marca', desc: 'O símbolo que carregamos no peito e defendemos com honra.' },
                { year: 'Cores', title: 'Nossa Identidade', desc: 'As cores que representam nossa história e nossa paixão.' },
                { year: 'Torcida', title: 'Nossa Força', desc: 'O maior patrimônio do clube, que nos empurra para a vitória.' },
                { year: 'Futuro', title: 'Nossa Meta', desc: 'Trabalho contínuo para elevar o patamar do clube.' }
              ].map((step, i) => (
                <div key={i} className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                   <div className="flex-1 text-center md:text-right px-4">
                      {i % 2 === 0 && (
                        <>
                          <h4 className="font-black text-3xl mb-2" style={{ color: config.colors.primary }}>{step.year}</h4>
                          <h5 className="text-xl font-bold uppercase italic tracking-tighter mb-2">{step.title}</h5>
                          <p className="text-gray-500 font-medium">{step.desc}</p>
                        </>
                      )}
                   </div>
                   <div className="w-12 h-12 rounded-full border-4 border-white relative z-10 hidden md:flex items-center justify-center shadow-lg" style={{ backgroundColor: config.colors.primary }}></div>
                   <div className="flex-1 text-center md:text-left px-4">
                      {i % 2 !== 0 && (
                        <>
                          <h4 className="font-black text-3xl mb-2" style={{ color: config.colors.primary }}>{step.year}</h4>
                          <h5 className="text-xl font-bold uppercase italic tracking-tighter mb-2">{step.title}</h5>
                          <p className="text-gray-500 font-medium">{step.desc}</p>
                        </>
                      )}
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
}
