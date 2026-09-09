'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LABELS } from '@/data/types';
import { Heart, ChevronDown, ChevronUp } from 'lucide-react';

interface GarmentDetail {
  id: string; nombre: string; emoji: string; color: string; colorHex: string;
}

export interface Suggestion {
  outfit: { id: string; nombre: string; descripcion: string; ocasion: string[]; momento: string[]; clima: string[]; estilo: string[]; paletaColores: string[] };
  score: number; matchDetails: { ocasion: boolean; momento: boolean; clima: boolean; estilo: boolean };
  garments: GarmentDetail[];
}

function getScoreColor(score: number) {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-amber-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-white/40';
}

function getScoreBg(score: number) {
  if (score >= 80) return 'bg-emerald-500/10 border-emerald-500/20';
  if (score >= 60) return 'bg-amber-500/10 border-amber-500/20';
  if (score >= 40) return 'bg-orange-500/10 border-orange-500/20';
  return 'bg-white/[0.04] border-white/[0.08]';
}

export function OutfitCard({ suggestion, rank, selected, onSelect, isFav, onToggleFav }: {
  suggestion: Suggestion; rank: number; selected: boolean; onSelect: () => void;
  isFav?: boolean; onToggleFav?: () => void;
}) {
  const { outfit, garments, matchDetails, score } = suggestion;
  const matchCount = [matchDetails.ocasion, matchDetails.momento, matchDetails.clima, matchDetails.estilo].filter(Boolean).length;

  return (
    <TooltipProvider>
      <Card className={`bg-white/[0.025] border rounded-2xl overflow-hidden transition-all duration-300 group ${
        selected
          ? 'border-amber-500/25 shadow-[0_0_30px_-5px_rgba(245,158,11,0.08)]'
          : 'border-white/[0.05] hover:border-white/[0.1] hover:shadow-lg hover:shadow-black/20'
      }`}>
        <CardContent className="p-0">
          {/* Top bar with rank + score + fav */}
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <div className="flex items-center gap-2.5">
              <span className={`text-[11px] font-black tabular-nums w-8 h-8 rounded-lg flex items-center justify-center border ${
                rank === 1 ? 'bg-gradient-to-br from-amber-500/25 to-amber-700/15 border-amber-500/30 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)]' :
                rank === 2 ? 'bg-white/[0.06] border-white/[0.1] text-white/50' :
                rank === 3 ? 'bg-orange-500/10 border-orange-500/15 text-orange-400' :
                'bg-white/[0.03] border-white/[0.06] text-white/25'
              }`}>#{rank}</span>
              <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getScoreBg(score)} ${getScoreColor(score)}`}>
                {Math.round(score)}%
              </div>
              <span className="text-[10px] text-white/20">{matchCount}/4</span>
            </div>
            <div className="flex items-center gap-1">
              {onToggleFav && (
                <Button variant="ghost" size="sm" className={`h-7 w-7 p-0 rounded-lg transition-all duration-200 ${isFav ? 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10' : 'text-white/15 hover:text-rose-400 hover:bg-rose-500/5'}`} onClick={(e) => { e.stopPropagation(); onToggleFav(); }}>
                  <Heart className={`h-3.5 w-3.5 transition-all ${isFav ? 'fill-rose-400 scale-110' : ''}`} />
                </Button>
              )}
              <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-transform duration-300 text-white/15 ${selected ? 'rotate-180' : ''}`}>
                <ChevronDown className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          <button onClick={onSelect} className="w-full text-left px-5 pb-4">
            <h3 className="text-[15px] font-semibold text-white/85 group-hover:text-amber-200 transition-colors leading-tight">{outfit.nombre}</h3>
            <p className="text-xs text-white/35 mt-1.5 line-clamp-2 leading-relaxed">{outfit.descripcion}</p>

            {/* Color palette strip */}
            <div className="flex items-center gap-2 mt-4">
              <div className="flex -space-x-1">
                {outfit.paletaColores.map((color, i) => (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <div className="w-7 h-7 rounded-full border-2 border-[#0a0a0b] shadow-md transition-transform hover:scale-125 hover:z-10 relative" style={{ backgroundColor: color, zIndex: outfit.paletaColores.length - i }} />
                    </TooltipTrigger>
                    <TooltipContent className="text-[10px] bg-white/10 border-white/10 text-white/80">{color}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
              <div className="flex-1" />
              {/* Match tags */}
              <div className="flex flex-wrap gap-1">
                {matchDetails.ocasion && <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400/90 border-emerald-500/15 text-[10px] px-2 py-0 h-5 font-medium">{LABELS.ocasion[outfit.ocasion[0] as keyof typeof LABELS.ocasion]}</Badge>}
                {matchDetails.momento && <Badge variant="secondary" className="bg-sky-500/10 text-sky-400/90 border-sky-500/15 text-[10px] px-2 py-0 h-5 font-medium">{LABELS.momento[outfit.momento[0] as keyof typeof LABELS.momento]}</Badge>}
                {matchDetails.clima && <Badge variant="secondary" className="bg-orange-500/10 text-orange-400/90 border-orange-500/15 text-[10px] px-2 py-0 h-5 font-medium">{LABELS.clima[outfit.clima[0] as keyof typeof LABELS.clima]}</Badge>}
                {matchDetails.estilo && <Badge variant="secondary" className="bg-violet-500/10 text-violet-400/90 border-violet-500/15 text-[10px] px-2 py-0 h-5 font-medium">{LABELS.estilo[outfit.estilo[0] as keyof typeof LABELS.estilo]}</Badge>}
              </div>
            </div>
          </button>

          {/* Expanded garments */}
          {selected && (
            <div className="border-t border-white/[0.05] bg-white/[0.015] px-5 py-4">
              <h4 className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-3">Prendas del Outfit</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {garments.map((g, idx) => (
                  <div key={g.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.025] border border-white/[0.04] hover:bg-white/[0.04] transition-colors">
                    <span className="text-base">{g.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-white/70 truncate font-medium">{g.nombre}</p>
                      <p className="text-[10px] text-white/25">{g.color}</p>
                    </div>
                    <div className="w-4 h-4 rounded-full border border-white/10 flex-shrink-0" style={{ backgroundColor: g.colorHex }} />
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
