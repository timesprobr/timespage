import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Trophies from './pages/Trophies';
import Transparency from './pages/Transparency';
import Admin from './pages/Admin';
import { CLUB_CONFIG as STATIC_CONFIG } from './config/club';
import { supabase } from './lib/supabase';

import Squad from './pages/Squad';
import Board from './pages/Board';
import Statute from './pages/Statute';
import Socio from './pages/Socio';
import Registration from './pages/Registration';
import NewsList from './pages/NewsList';
import NewsDetail from './pages/NewsDetail';
import BrandKit from './pages/BrandKit';
import CampaignPopup from './components/layout/CampaignPopup';

import { createContext, useContext } from 'react';

// Criamos o Contexto para a Identidade Visual
export const ConfigContext = createContext<any>(STATIC_CONFIG);

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [activeConfig, setActiveConfig] = useState(STATIC_CONFIG);

  useEffect(() => {
    const fetchOrgData = async () => {
      const params = new URLSearchParams(window.location.search);
      let orgId = params.get('orgId');

      if (!orgId) {
        orgId = localStorage.getItem('lastOrgId');
      } else {
        localStorage.setItem('lastOrgId', orgId);
      }

      // Função para escurecer uma cor HEX
      const darkenColor = (hex: string, percent: number) => {
        try {
          let r = parseInt(hex.slice(1, 3), 16);
          let g = parseInt(hex.slice(3, 5), 16);
          let b = parseInt(hex.slice(5, 7), 16);
          r = Math.floor(r * (1 - percent / 100));
          g = Math.floor(g * (1 - percent / 100));
          b = Math.floor(b * (1 - percent / 100));
          return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        } catch (e) {
          return hex;
        }
      };

      // Função para determinar cor de contraste (preto ou branco)
      const getContrastFG = (hex: string) => {
        try {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          const yiq = (r * 299 + g * 587 + b * 114) / 1000;
          return yiq >= 128 ? '#000000' : '#ffffff';
        } catch (e) {
          return '#ffffff';
        }
      };

      if (orgId) {
        try {
          const { data, error } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', orgId)
            .single();

          if (data && !error) {
            const newConfig = {
              ...STATIC_CONFIG,
              name: data.name,
              shortName: data.tp_short_name || data.name.split(' ')[0],
              colors: {
                primary: data.tp_primary_color || data.primary_color || STATIC_CONFIG.colors.primary,
                secondary: data.tp_secondary_color || data.secondary_color || STATIC_CONFIG.colors.secondary,
              },
              logo: {
                main: data.tp_logo_url || data.logo_url || STATIC_CONFIG.logo.main,
                white: data.tp_logo_url || data.logo_url || STATIC_CONFIG.logo.white,
              },
              social: {
                instagram: data.tp_instagram || STATIC_CONFIG.social.instagram,
                facebook: data.tp_facebook || STATIC_CONFIG.social.facebook,
                twitter: data.tp_twitter_x || STATIC_CONFIG.social.twitter,
                youtube: data.tp_youtube || STATIC_CONFIG.social.youtube,
                whatsapp: data.tp_whatsapp || '',
              },
              address: data.tp_address || data.address || STATIC_CONFIG.address,
              hero: {
                image_url: data.tp_hero_image_url || null,
                phrase: data.tp_hero_phrase || null,
              },
              orgId: orgId
            };

            setActiveConfig(newConfig);

            if (!window.location.pathname.startsWith('/admin')) {
              document.title = data.name;
            }
            let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
            if (!favicon) {
              favicon = document.createElement('link');
              favicon.rel = 'icon';
              document.head.appendChild(favicon);
            }
            favicon.href = data.tp_favicon_url || data.tp_logo_url || data.logo_url || '/favicon.ico';
            
            // Injetar Meta Tags de Cor
            let themeColor = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
            if (!themeColor) {
              themeColor = document.createElement('meta');
              themeColor.name = 'theme-color';
              document.head.appendChild(themeColor);
            }
            themeColor.content = data.tp_primary_color || '#000000';

            // Injetar Tokens White Label (CSS Variables)
            const root = document.documentElement;
            const p = newConfig.colors.primary;
            const s = newConfig.colors.secondary;

            root.style.setProperty('--brand-primary', p);
            root.style.setProperty('--brand-primary-dark', darkenColor(p, 20));
            root.style.setProperty('--brand-primary-fg', getContrastFG(p));
            
            root.style.setProperty('--brand-secondary', s);
            root.style.setProperty('--brand-secondary-dark', darkenColor(s, 20));
            root.style.setProperty('--brand-secondary-fg', getContrastFG(s));
          }
        } catch (err) {
          console.error('Erro ao carregar dados da organização:', err);
        }
      }

      setIsReady(true);
    };

    fetchOrgData();
  }, []);

  if (!isReady) return null;

  return (
    <ConfigContext.Provider value={activeConfig}>
      <Router>
        <AppContent />
      </Router>
    </ConfigContext.Provider>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  const config = useContext(ConfigContext);

  return (
    <div className={`min-h-screen font-sans selection:bg-primary selection:text-white ${isAdmin ? 'bg-admin-bg' : 'bg-black'}`}>
      <ScrollToTop />
      <AnalyticsTracker />
      {!isAdmin && <Navbar />}
      {!isAdmin && <CampaignPopup />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/matriculas" element={<Registration />} />
          <Route path="/o-clube" element={<About />} />
          <Route path="/elenco" element={<Squad />} />
          <Route path="/elenco/:category" element={<Squad />} />
          <Route path="/noticias" element={<NewsList />} />
          <Route path="/noticias/:id" element={<NewsDetail />} />
          <Route path="/socio" element={<Socio />} />
          <Route path="/diretoria" element={<Board />} />
          <Route path="/estatuto" element={<Statute />} />
          <Route path="/trofeus" element={<Trophies />} />
          <Route path="/transparencia" element={<Transparency />} />
          <Route path="/kit-de-marca" element={<BrandKit />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

function AnalyticsTracker() {
  const location = useLocation();
  const [currentViewId, setCurrentViewId] = useState<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const clicksRef = useRef<{ x: number, y: number, element: string }[]>([]);
  
  useEffect(() => {
    const trackView = async () => {
      try {
        if (location.pathname.startsWith('/admin')) return;

        const params = new URLSearchParams(window.location.search);
        const orgId = params.get('orgId') || 'default';

        // Tentar obter dados de geolocalização (IP Público)
        let geoData = { ip: '', city: '', region: '', country_name: '' };
        try {
          const geoResponse = await fetch('https://ipapi.co/json/');
          geoData = await geoResponse.json();
        } catch (e) {
          console.log('Geo tracking blocked or failed');
        }

        const device = /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
        
        const { data, error } = await supabase.from('tp_page_views').insert({
          org_id: orgId,
          url: location.pathname,
          referrer: document.referrer,
          ip: geoData.ip,
          city: geoData.city,
          region: geoData.region,
          country: geoData.country_name,
          device: device,
          user_agent: navigator.userAgent,
          duration_seconds: 0,
          click_data: []
        }).select('id').single();

        if (data && !error) {
          setCurrentViewId(data.id);
          startTimeRef.current = Date.now();
          clicksRef.current = [];
        }
      } catch (err) {
        console.error('Analytics error:', err);
      }
    };

    trackView();

    // Reset for next page
    return () => {
      if (currentViewId) {
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
        supabase.from('tp_page_views')
          .update({ 
            duration_seconds: duration,
            click_data: clicksRef.current 
          })
          .eq('id', currentViewId)
          .then();
      }
    };
  }, [location.pathname]);

  // Click listener
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (location.pathname.startsWith('/admin')) return;
      
      const clickInfo = {
        x: Math.round((e.pageX / window.innerWidth) * 100), // Percentagem para ser responsivo
        y: Math.round((e.pageY / document.documentElement.scrollHeight) * 100),
        element: (e.target as HTMLElement).tagName + ( (e.target as HTMLElement).id ? `#${(e.target as HTMLElement).id}` : '' )
      };
      
      clicksRef.current.push(clickInfo);
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [location.pathname]);

  return null;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
