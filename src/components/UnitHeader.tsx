import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Unit } from '@/lib/mockData';

interface UnitHeaderProps {
  unit: Unit;
  unitNumber: number;
  onGuidebook?: () => void;
}

export function UnitHeader({ unit, unitNumber, onGuidebook }: UnitHeaderProps) {
  return (
    <div className="bg-primary rounded-2xl p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="text-white">
          <h2 className="font-black text-lg">Unit {unitNumber}</h2>
          <p className="text-primary-foreground/90 text-sm font-medium">{unit.name}</p>
        </div>
        
        {onGuidebook && (
          <button
            onClick={onGuidebook}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            GUIDEBOOK
          </button>
        )}
      </div>
    </div>
  );
}
