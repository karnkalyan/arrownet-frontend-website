import { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { X } from 'lucide-react';

export default function AnnouncementBar() {
  const { cms } = useStore();
  const announcements = cms.announcements;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
    const interval = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % announcements.length);
        setShow(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  if (dismissed) return null;

  return (
    <div className="announcement-bar relative overflow-hidden" style={{ minHeight: 40, background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }}>
      <div className="absolute inset-0 opacity-20"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
        }}
      />
      <div className="container mx-auto px-4 flex items-center justify-between h-10">
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <div
            className="text-center text-sm font-bold transition-all duration-500 uppercase tracking-wide"
            style={{
              color: '#ffffff',
              opacity: show ? 1 : 0,
              transform: show ? 'translateY(0)' : 'translateY(-10px)',
            }}
          >
            {announcements[currentIndex]}
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="ml-3 hover:text-white/80 transition-colors flex-shrink-0"
          style={{ color: 'rgba(255,255,255,0.8)' }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

