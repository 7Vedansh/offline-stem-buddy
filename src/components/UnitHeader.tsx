import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Unit } from '@/lib/mockData';

interface UnitHeaderProps {
  unit: Unit;
  unitNumber: number;
  onGuidebook?: () => void;
}

export function UnitHeader({ unit, unitNumber, onGuidebook }: UnitHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Card className="gradient-primary text-primary-foreground p-7 relative overflow-hidden border-0 shadow-lg">
        {/* Background decorations */}
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-primary-foreground/10 rounded-full blur-sm" />
        <div className="absolute right-12 top-12 w-20 h-20 bg-primary-foreground/10 rounded-full" />
        
        <div className="relative z-10">
          {/* Unit badge */}
          <div className="inline-block bg-primary-foreground/15 backdrop-blur-sm rounded-xl px-4 py-1.5 mb-4">
            <span className="text-sm font-bold tracking-wide">Unit {unitNumber}</span>
          </div>
          
          {/* Title */}
          <motion.h1 
            className="text-2xl font-extrabold mb-2 tracking-tight"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            {unit.title}
          </motion.h1>
          
          {/* Description */}
          <motion.p 
            className="text-primary-foreground/85 text-base font-medium mb-6 leading-relaxed"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.4 }}
          >
            {unit.description}
          </motion.p>
          
          {/* Guidebook button */}
          {onGuidebook && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                variant="outline" 
                size="sm"
                className="bg-primary-foreground/15 border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/25 hover:text-primary-foreground font-semibold"
                onClick={onGuidebook}
              >
                <BookOpen className="w-4 h-4" />
                <span>Guidebook</span>
              </Button>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
