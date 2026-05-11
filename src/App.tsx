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

// Exportamos o config ativo para ser usado em outros componentes
export let ACTIVE_CONFIG = STATIC_CONFIG;

export default function App() {
  const [isReady, setIsReady] = useState(false);

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
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        r = Math.floor(r * (1 - percent / 100));
        g = Math.floor(g * (1 - percent / 100));
        b = Math.floor(b * (1 - percent / 100));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      };

      // Função para determinar cor de contraste (preto ou branco)
      const getContrastFG = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 128 ? '#000000' : '#ffffff';
      };

      if (orgId) {
        try {
          const { data, error } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', orgId)
            .single();

          if (data && !error) {
            // Atualizar a Configuração Ativa com campos Timespage (tp_)
            ACTIVE_CONFIG.name = data.name;
            ACTIVE_CONFIG.shortName = data.name.split(' ')[0];
            ACTIVE_CONFIG.colors = {
                primary: data.tp_primary_color || data.primary_color || STATIC_CONFIG.colors.primary,
                secondary: data.tp_secondary_color || data.secondary_color || STATIC_CONFIG.colors.secondary,
            };
            ACTIVE_CONFIG.logo = {
                main: data.tp_logo_url || data.logo_url || STATIC_CONFIG.logo.main,
                white: data.tp_logo_url || data.logo_url || STATIC_CONFIG.logo.white,
            };
            ACTIVE_CONFIG.social = {
                instagram: data.tp_instagram || STATIC_CONFIG.social.instagram,
                facebook: data.tp_facebook || STATIC_CONFIG.social.facebook,
                twitter: data.tp_twitter_x || STATIC_CONFIG.social.twitter,
                youtube: data.tp_youtube || STATIC_CONFIG.social.youtube,
                whatsapp: data.tp_whatsapp || '',
            };
            ACTIVE_CONFIG.address = data.tp_address || data.address || STATIC_CONFIG.address;

            document.title = data.name;
            let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
            if (!favicon) {
              favicon = document.createElement('link');
              favicon.rel = 'icon';
              document.head.appendChild(favicon);
            }
            favicon.href = data.tp_favicon_url || data.tp_logo_url || data.logo_url || '/favicon.ico';

            // Injetar Tokens White Label (CSS Variables)
            const root = document.documentElement;
            const p = data.tp_primary_color || data.primary_color || STATIC_CONFIG.colors.primary;
            const s = data.tp_secondary_color || data.secondary_color || STATIC_CONFIG.colors.secondary;

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
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

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
        
        const { data, error } = await supabase.from('page_views').insert({
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
        supabase.from('page_views')
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
