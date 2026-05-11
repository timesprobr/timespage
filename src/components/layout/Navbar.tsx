import { Menu, X, Instagram, Youtube, ChevronDown, Lock, Search, Facebook, Twitter } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfigContext } from '../../App';
import { supabase } from '../../lib/supabase';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const config = useContext(ConfigContext);

  // Rastreamento de Visitas (Analytics)
  useEffect(() => {
    const trackView = async () => {
      try {
        const sessionKey = `viewed_${location.pathname}`;
        if (sessionStorage.getItem(sessionKey)) return;

        // Capturar Localização via IP
        let geoData = { city: 'Desconhecido', region: 'Desconhecido', country_name: 'Brasil' };
        try {
          const geoResponse = await fetch('https://ipapi.co/json/');
          geoData = await geoResponse.json();
        } catch (e) {
          console.warn('Geo API Error:', e);
        }

        const { error } = await supabase.from('page_views').insert({
          org_id: config.orgId || 'default',
          url: window.location.href,
          referrer: document.referrer || 'Direto',
          city: geoData.city || 'Desconhecido',
          region: geoData.region || 'Desconhecido',
          country: geoData.country_name || 'Brasil',
          device: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
          browser: navigator.userAgent
        });

        if (!error) {
          sessionStorage.setItem(sessionKey, 'true');
        }
      } catch (err) {
        console.error('Analytics Error:', err);
      }
    };

    if (config.orgId) {
      trackView();
    }
  }, [location.pathname, config.orgId]);

  const topLinks = [
    { name: 'Seja Sócio-Torcedor', href: '/socio' },
    { name: 'Notícias', href: '/noticias' },
  ];

  const mainLinks = [
    { name: 'Matrículas', href: '/matriculas' },
    { 
      name: 'Elenco', 
      href: '#', 
      hasDropdown: true, 
      subItems: [
        'Profissional', 'Sub 7', 'Sub 9', 'Sub 11', 'Sub 13', 
        'Sub 15', 'Sub 17', 'Sub 21', '+40', '+50'
      ] 
    },
    { name: 'Sócio-Torcedor', href: '/socio' },
    { name: 'Títulos', href: '/trofeus' },
    { name: 'Transparência', href: '/transparencia' },
    { 
      name: 'Institucional', 
      href: '#', 
      hasDropdown: true, 
      subItems: ['Diretoria', 'Estatuto'] 
    },
    { name: 'Clube', href: '/o-clube' },
    { name: 'Kit de Marca', href: '/kit-de-marca' },
  ];

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <header className="relative w-full z-50 shadow-2xl">
      {/* --- DESKTOP VIEW --- */}
      <div className="hidden lg:block">
        {/* Top Bar - Branding Tier */}
        <div className="bg-primary h-20 flex items-center relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
            {/* Logo / Shield - Overlapping */}
            <div className="relative w-40 h-full flex-shrink-0">
              <Link to={config.orgId ? `/?orgId=${config.orgId}` : "/"} className="absolute -top-12 left-0 z-50 group">
                <img 
                  src={config.logo.main} 
                  alt={`${config.shortName} Shield`} 
                  className="w-40 h-48 object-contain transition-transform group-hover:scale-105 [filter:drop-shadow(2px_0_0_white)_drop-shadow(-2px_0_0_white)_drop-shadow(0_2px_0_white)_drop-shadow(0_-2px_0_white)]" 
                />
              </Link>
            </div>

            {/* Center Actions */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-4">
              {topLinks.map((link) => (
                <Link
                  key={link.name}
                  to={config.orgId ? `${link.href}?orgId=${config.orgId}` : link.href}
                  className="bg-primary-fg/10 hover:bg-primary-fg text-primary-fg hover:text-primary px-5 py-2 rounded-sm font-black uppercase text-[10px] tracking-widest transition-all border border-primary-fg/20"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-6 text-primary-fg/90">
              {config.social.instagram && (
                <a href={config.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary-fg transition-colors">
                  <Instagram size={18} />
                </a>
              )}
              {config.social.facebook && (
                <a href={config.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-primary-fg transition-colors">
                  <Facebook size={18} />
                </a>
              )}
              {config.social.youtube && (
                <a href={config.social.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-primary-fg transition-colors">
                  <Youtube size={18} />
                </a>
              )}
              {config.social.twitter && (
                <a href={config.social.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-primary-fg transition-colors">
                  <Twitter size={18} />
                </a>
              )}
              <div className="h-4 w-[1px] bg-primary-fg/20 mx-2" />
              <Link to={config.orgId ? `/admin?orgId=${config.orgId}` : "/admin"} className="text-primary-fg/40 hover:text-primary-fg transition-colors">
                <Lock size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Dynamic Secondary Tier */}
        <div className="bg-secondary h-12 flex items-center border-b border-white/5 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center">
            <div className="ml-44 flex items-center space-x-8">
              {mainLinks.map((link) => (
                <div key={link.name} className="relative group/nav">
                  <Link
                    to={config.orgId ? `${link.href}${link.href.includes('?') ? '&' : '?'}orgId=${config.orgId}` : link.href}
                    className="text-secondary-fg hover:opacity-80 uppercase text-[11px] font-black tracking-[0.1em] transition-all flex items-center gap-1 py-4"
                  >
                    {link.name}
                    {link.hasDropdown && <ChevronDown size={12} className="group-hover/nav:rotate-180 transition-transform" />}
                  </Link>

                  {link.subItems && (
                    <div className="absolute top-full left-0 bg-card border border-border min-w-[180px] opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200 shadow-2xl z-50">
                      <div className="py-2">
                        {link.subItems.map((sub) => {
                          const subHref = link.name === 'Elenco' 
                            ? `/elenco/${sub.toLowerCase().replace(' ', '-')}`
                            : `/${sub.toLowerCase().replace(' ', '-')}`;
                          return (
                            <Link
                              key={sub}
                              to={config.orgId ? `${subHref}?orgId=${config.orgId}` : subHref}
                              className="block px-4 py-2 text-[10px] font-bold text-text-muted hover:text-primary-fg hover:bg-primary uppercase tracking-wider transition-colors"
                            >
                              {sub}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- MOBILE VIEW --- */}
      <div className="lg:hidden flex flex-col">
        {/* Top Bar - Branding */}
        <div className="bg-primary h-16 flex items-center justify-between px-4 relative z-50">
          <div className="flex items-center gap-4">
            {config.social.instagram && (
              <a href={config.social.instagram} target="_blank" rel="noopener noreferrer" className="text-primary-fg/80">
                <Instagram size={20} />
              </a>
            )}
            {config.social.youtube && (
              <a href={config.social.youtube} target="_blank" rel="noopener noreferrer" className="text-primary-fg/80">
                <Youtube size={20} />
              </a>
            )}
          </div>

          {/* Centered Shield */}
          <div className="absolute left-1/2 -translate-x-1/2 top-2 z-50">
            <Link to={config.orgId ? `/?orgId=${config.orgId}` : "/"} onClick={() => setIsOpen(false)}>
              <img 
                src={config.logo.main} 
                alt={`${config.shortName} Shield`} 
                className="h-24 w-auto drop-shadow-2xl [filter:drop-shadow(1px_1px_0_white)_drop-shadow(-1px_-1px_0_white)]" 
              />
            </Link>
          </div>

          <Link to={config.orgId ? `/admin?orgId=${config.orgId}` : "/admin"} className="text-primary-fg/40 p-2">
            <Lock size={20} />
          </Link>
        </div>

        {/* Bottom Bar - Black */}
        <div className="bg-bg h-12 flex items-center justify-between px-4 border-b border-border relative z-40">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-text flex items-center gap-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Menu</span>
          </button>
          
          <button className="text-text p-2">
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden absolute top-[112px] left-0 right-0 bg-bg/98 backdrop-blur-xl border-b border-border z-40 overflow-hidden shadow-2xl"
          >
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {mainLinks.map((link) => (
                <div key={link.name} className="space-y-4">
                  <div 
                    onClick={() => link.hasDropdown ? toggleDropdown(link.name) : setIsOpen(false)}
                    className="flex items-center justify-between group"
                  >
                    <Link
                      to={config.orgId ? `${link.href}${link.href.includes('?') ? '&' : '?'}orgId=${config.orgId}` : link.href}
                      className="text-xl font-black uppercase tracking-tighter text-text group-hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                    {link.hasDropdown && (
                      <ChevronDown 
                        size={20} 
                        className={`text-text-muted transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''}`} 
                      />
                    )}
                  </div>

                  {/* Mobile Dropdown Items */}
                  <AnimatePresence>
                    {link.subItems && activeDropdown === link.name && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="grid grid-cols-2 gap-3 pl-4 border-l border-border"
                      >
                        {link.subItems.map((sub) => {
                          const subHref = link.name === 'Elenco' 
                            ? `/elenco/${sub.toLowerCase().replace(' ', '-')}`
                            : `/${sub.toLowerCase().replace(' ', '-')}`;
                          return (
                            <Link
                              key={sub}
                              to={config.orgId ? `${subHref}?orgId=${config.orgId}` : subHref}
                              onClick={() => setIsOpen(false)}
                              className="text-[10px] font-bold text-text-muted hover:text-text uppercase tracking-widest py-2"
                            >
                              {sub}
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              
              <div className="pt-6 border-t border-border space-y-3">
                {topLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={config.orgId ? `${link.href}?orgId=${config.orgId}` : link.href}
                    onClick={() => setIsOpen(false)}
                    className="block w-full bg-primary text-primary-fg py-4 rounded-sm font-black uppercase tracking-widest text-[10px] text-center hover:bg-primary-dark transition-all"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
