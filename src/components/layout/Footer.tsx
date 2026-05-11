import { Instagram, Youtube, ArrowRight, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ConfigContext } from '../../App';

export default function Footer() {
  const config = useContext(ConfigContext);

  return (
    <footer className="bg-black text-white pt-24 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          {/* Brand/About */}
          <div className="md:col-span-4 space-y-8">
            <Link to={config.orgId ? `/?orgId=${config.orgId}` : "/"} className="flex items-center gap-3 group">
              <div className="w-14 h-14 flex items-center justify-center transition-transform group-hover:scale-105">
                <img src={config.logo.main} alt={`${config.shortName} Shield`} className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-black tracking-tighter italic uppercase">{config.shortName}</span>
            </Link>
            <p className="text-gray-400 font-medium leading-relaxed max-w-sm">
              Mais que um clube, uma paixão que move multidões. O {config.name} é tradição, garra e glória desde a sua fundação.
            </p>
            <div className="flex gap-4">
              {config.social.instagram && (
                <a href={config.social.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-primary hover:border-primary transition-all">
                  <Instagram size={18} />
                </a>
              )}
              {config.social.facebook && (
                <a href={config.social.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-primary hover:border-primary transition-all">
                  <Facebook size={18} />
                </a>
              )}
              {config.social.twitter && (
                <a href={config.social.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-primary hover:border-primary transition-all">
                  <Twitter size={18} />
                </a>
              )}
              {config.social.youtube && (
                <a href={config.social.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-primary hover:border-primary transition-all">
                  <Youtube size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-6">
             <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary">O Clube</h4>
             <ul className="space-y-4">
                <li><Link to={config.orgId ? `/elenco/profissional?orgId=${config.orgId}` : "/elenco/profissional"} className="text-gray-400 hover:text-white transition-colors font-medium text-sm">Atletas</Link></li>
                <li><Link to={config.orgId ? `/o-clube?orgId=${config.orgId}` : "/o-clube"} className="text-gray-400 hover:text-white transition-colors font-medium text-sm">História</Link></li>
                <li><Link to={config.orgId ? `/trofeus?orgId=${config.orgId}` : "/trofeus"} className="text-gray-400 hover:text-white transition-colors font-medium text-sm">Títulos</Link></li>
                <li><Link to={config.orgId ? `/noticias?orgId=${config.orgId}` : "/noticias"} className="text-gray-400 hover:text-white transition-colors font-medium text-sm">Notícias</Link></li>
             </ul>
          </div>

          <div className="md:col-span-2 space-y-6">
             <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Institucional</h4>
             <ul className="space-y-4">
                <li><Link to={config.orgId ? `/transparencia?orgId=${config.orgId}` : "/transparencia"} className="text-gray-400 hover:text-white transition-colors font-medium text-sm">Transparência</Link></li>
                <li><Link to={config.orgId ? `/diretoria?orgId=${config.orgId}` : "/diretoria"} className="text-gray-400 hover:text-white transition-colors font-medium text-sm">Diretoria</Link></li>
                <li><Link to={config.orgId ? `/estatuto?orgId=${config.orgId}` : "/estatuto"} className="text-gray-400 hover:text-white transition-colors font-medium text-sm">Estatuto</Link></li>
             </ul>
          </div>

          {/* Address */}
          <div className="md:col-span-4 space-y-6">
             <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Sede Social</h4>
             <p className="text-gray-400 font-medium text-sm leading-relaxed max-w-[280px]">
               {config.address}
             </p>
          </div>
        </div>

        <div className="mb-12 text-center">
          <span className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">
            © 2026 {config.name}. Todos os direitos reservados.
          </span>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col items-center justify-center">
          <a 
            href="https://auramvp.online" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-4 md:gap-10 bg-white/5 hover:bg-white text-gray-400 hover:text-black px-6 py-3.5 md:px-12 md:py-6 rounded-full border border-white/10 transition-all duration-500 group shadow-2xl"
          >
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <img src="/aura.png" alt="Aura Logo" className="h-4 md:h-7 w-auto grayscale group-hover:grayscale-0 transition-all duration-500" />
              <div className="hidden md:flex flex-col -space-y-1 border-l border-white/10 group-hover:border-black/10 pl-4">
                <span className="text-[11px] font-black uppercase tracking-tighter text-gray-400 group-hover:text-black transition-colors">Aura</span>
                <span className="text-[7px] font-bold uppercase tracking-widest text-gray-600 group-hover:text-black/60 transition-colors whitespace-nowrap">Desenvolvemos Sites, Sistemas, Aplicativos</span>
              </div>
            </div>

            {/* Separator */}
            <div className="h-4 md:h-6 w-[1px] bg-white/10 group-hover:bg-black/10 transition-colors" />

            {/* CTA */}
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex flex-col -space-y-1">
                <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.1em] md:tracking-[0.25em]">Quero um site</span>
                <span className="text-[8px] md:text-[10px] font-bold opacity-40 group-hover:opacity-60 transition-opacity">auramvp.online</span>
              </div>
              <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-white/10 group-hover:bg-black/10 flex items-center justify-center text-white group-hover:text-black transition-all border border-white/10 group-hover:border-black/10">
                <ArrowRight size={12} className="md:w-4 md:h-4" />
              </div>
            </div>
          </a>
        </div>
      </div>
    </footer>
  );
}
