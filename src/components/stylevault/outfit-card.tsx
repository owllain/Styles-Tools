'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LABELS } from '@/data/types';

interface GarmentDetail {
  id: string;
  nombre: string;
  emoji: string;
  color: string;
  colorHex: string;
}

export interface Suggestion {
  outfit: {
    id: string;
    nombre: string;
    descripcion: string;
    ocasion: string[];
    momento: string[];
    clima: string[];
    estilo: string[];
    paletaColores: string[];
  };
  score: number;
  matchDetails: {
    ocasion: boolean;
    momento: boolean;
    clima: boolean;
    estilo: boolean;
  };
  garments: GarmentDetail[];
}

export function OutfitCard({
  suggestion,
  rank,
  selected,
  onSelect,
}: {
  suggestion: Suggestion;
  rank: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const { outfit, garments, matchDetails } = suggestion;

  return (
    <TooltipProvider>
      <Card
        className={`bg-white/[0.03] border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer group ${
          selected
            ? 'border-amber-500/30 shadow-lg shadow-amber-900/10'
            : 'border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04]'
        }`}
        onClick={onSelect}
      >
        <CardContent className="p-0">
          <div className="p-5 pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    rank === 1 ? 'bg-amber-500/20 text-amber-400' :
                    rank === 2 ? 'bg-white/10 text-white/50' :
                    rank === 3 ? 'bg-orange-500/15 text-orange-400' :
                    'bg-white/[0.04] text-white/30'
                  }`}>
                    #{rank}
                  </span>
                  <h3 className="text-sm font-semibold text-white/90 truncate">
                    {outfit.nombre}
                  </h3>
                </div>
                <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">
                  {outfit.descripcion}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-3">
              <span className="text-[10px] text-white/25 mr-1">Paleta:</span>
              {outfit.paletaColores.map((color, i) => (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <div
                      className="w-5 h-5 rounded-full border border-white/10 shadow-inner transition-transform hover:scale-125"
                      style={{ backgroundColor: color }}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="text-[10px]">{color}</TooltipContent>
                </Tooltip>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {matchDetails.ocasion && (
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] px-2 py-0">
                  {LABELS.ocasion[outfit.ocasion[0] as keyof typeof LABELS.ocasion]}
                </Badge>
              )}
              {matchDetails.momento && (
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px] px-2 py-0">
                  {LABELS.momento[outfit.momento[0] as keyof typeof LABELS.momento]}
                </Badge>
              )}
              {matchDetails.clima && (
                <Badge variant="secondary" className="bg-orange-500/10 text-orange-400 border-orange-500/20 text-[10px] px-2 py-0">
                  {LABELS.clima[outfit.clima[0] as keyof typeof LABELS.clima]}
                </Badge>
              )}
              {matchDetails.estilo && (
                <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[10px] px-2 py-0">
                  {LABELS.estilo[outfit.estilo[0] as keyof typeof LABELS.estilo]}
                </Badge>
              )}
            </div>
          </div>

          {selected && (
            <div className="border-t border-white/[0.06] bg-white/[0.02] p-5">
              <h4 className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-3">
                Prendas del Outfit
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {garments.map((g) => (
                  <div
                    key={g.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04]"
                  >
                    <span className="text-lg">{g.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/80 truncate">{g.nombre}</p>
                      <p className="text-[10px] text-white/30">{g.color}</p>
                    </div>
                    <div
                      className="w-4 h-4 rounded-full border border-white/10 flex-shrink-0"
                      style={{ backgroundColor: g.colorHex }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
