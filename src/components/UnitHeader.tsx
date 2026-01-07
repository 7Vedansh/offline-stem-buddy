import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Unit } from '@/lib/mockData';

interface UnitHeaderProps {
  unit: Unit;
  unitNumber: number;
  onGuidebook?: () => void;
}

export function UnitHeader({ unit, unitNumber, onGuidebook }: UnitHeaderProps) {
  return (
    <motion.div 
      className="bg-primary rounded-2xl p-4 shadow-lg"
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="flex items-center justify-between">
        <div className="text-white">
          <motion.h2 
            className="font-black text-lg"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            Unit {unitNumber}
          </motion.h2>
          <motion.p 
            className="text-primary-foreground/90 text-sm font-medium"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {unit.name}
          </motion.p>
        </div>
        
        {onGuidebook && (
          <motion.button
            onClick={onGuidebook}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <BookOpen className="w-4 h-4" />
            GUIDEBOOK
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
