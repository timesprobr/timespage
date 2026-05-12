import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useContext } from 'react';
import { ConfigContext } from '../../App';

interface Campaign {
  id: string;
  type: string;
  image: string;
  destinationUrl: string;
  title?: string;
  active: boolean;
  clicks?: number;
}

export default function CampaignPopup() {
  const config = useContext(ConfigContext);
  const [isOpen, setIsOpen] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        if (!config.orgId) return;

        const { data: docs, error } = await supabase
          .from('tp_campanhas')
          .select('*')
          .eq('org_id', config.orgId)
          .eq('active', true);

        if (docs && docs.length > 0) {
          // Filtra popups e pega o mais recente
          const popups = docs.filter(c => c.type === 'popup');
          if (popups.length > 0) {
            const latest = popups.sort((a: any, b: any) => {
              const dateA = new Date(a.created_at || a.createdAt || 0).getTime();
              const dateB = new Date(b.created_at || b.createdAt || 0).getTime();
              return dateB - dateA;
            })[0];
            
            setCampaign(latest);
            
            // Show after 1.5 seconds delay
            setTimeout(() => setIsOpen(true), 1500);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar campanha:', error);
      }
    };

    fetchCampaign();
  }, []);

  const closePopup = () => {
    setIsOpen(false);
  };

  const handlePopupClick = async () => {
    if (!campaign) return;
    try {
      await supabase
        .from('tp_campanhas')
        .update({ clicks: (campaign.clicks || 0) + 1 })
        .eq('id', campaign.id);
    } catch (e) {
      console.error('Erro ao registrar clique popup:', e);
    }
  };

  if (!campaign) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-black rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-6 right-6 z-50 w-10 h-10 bg-black/50 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all border border-white/10 backdrop-blur-md"
            >
              <X size={20} />
            </button>

            {/* Content Area - Fixed Square Format */}
            <div className="relative aspect-square w-full overflow-hidden">
               {/* Clickable Area */}
               <a 
                 href={campaign.destinationUrl || '#'} 
                 target={campaign.destinationUrl?.startsWith('http') ? '_blank' : '_self'}
                 rel="noopener noreferrer"
                 onClick={() => { handlePopupClick(); closePopup(); }}
                 className="block w-full h-full"
               >
                  <img 
                    src={campaign.image} 
                    alt={campaign.title || `Campanha ${config.shortName}`} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  
               </a>
            </div>
            
            {/* Bottom Glow Bar */}
            <div className="h-2 w-full bg-gradient-to-r from-red-950 via-red-600 to-red-950"></div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
