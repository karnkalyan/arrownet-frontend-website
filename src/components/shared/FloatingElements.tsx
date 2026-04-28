import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Wifi, Server, Globe, Cpu, Zap, Signal, Shield, Radio } from 'lucide-react';

const icons = [
  { Icon: Wifi, color: '#E30613' },
  { Icon: Server, color: '#ef4444' },
  { Icon: Globe, color: '#3b82f6' },
  { Icon: Cpu, color: '#a855f7' },
  { Icon: Zap, color: '#eab308' },
  { Icon: Signal, color: '#22c55e' },
  { Icon: Shield, color: '#f43f5e' },
  { Icon: Radio, color: '#6366f1' },
];

export default function FloatingElements({ count = 8 }) {
  const elements = useMemo(() => 
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      iconIndex: i % icons.length,
      x: Math.random() * 90 + 5,
      y: Math.random() * 90 + 5,
      size: 20 + Math.random() * 40,
      duration: 15 + Math.random() * 25,
      delay: Math.random() * 5,
    })), [count]
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {elements.map((el) => {
        const { Icon, color } = icons[el.iconIndex];
        return (
          <motion.div
            key={el.id}
            className="absolute"
            initial={{ 
              left: `${el.x}%`, 
              top: `${el.y}%`,
              opacity: 0,
              scale: 0.5
            }}
            animate={{ 
              left: [`${el.x}%`, `${el.x + (Math.random() * 4 - 2)}%`, `${el.x}%`],
              top: [`${el.y}%`, `${el.y + (Math.random() * 4 - 2)}%`, `${el.y}%`],
              rotate: [0, 45, -45, 0],
              opacity: [0, 0.08, 0.08, 0],
              scale: [0.5, 1, 1, 0.5]
            }}
            transition={{ 
              duration: el.duration,
              repeat: Infinity,
              delay: el.delay,
              ease: "easeInOut"
            }}
            style={{ color, position: 'absolute' }}
          >
            <Icon size={el.size} strokeWidth={1.5} />
          </motion.div>
        );
      })}
    </div>
  );
}
