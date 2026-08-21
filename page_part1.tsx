'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Ocasion, Momento, Clima, Estilo, Garment } from '@/data/types';
import { LABELS } from '@/data/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { TooltipProvider, TooltipTrigger, TooltipContent, Tooltip } from '@/components/ui/tooltip';
import {
  Heart, Sparkles, Search, ChevronDown, ChevronUp, Eye, Shirt,
  BarChart3, X, Filter, Sliders, Briefcase, Wine, PartyPopper,
  Coffee, Sun, Palette, TrendingUp, Users,
} from 'lucide-react';

interface SuggestionOutfit {
  id: string; nombre: string; descripcion: string; ocasion: Ocasion;
  momento: Momento; clima: Clima; estilo: Estilo; colores: string[];
  prendas: Garment[]; puntuacion: number; coincidencias: number;
}
interface OutfitListItem {
  id: string; nombre: string; descripcion: string; ocasion: Ocasion;
  momento: Momento; clima: Clima; estilo: Estilo; colores: string[];
  prendaIds: string[];
}

const QUICK_PRESETS = [
  { name: 'Lunes de Oficina', emoji: '💼', filters: { ocasion: 'oficina' as const, momento: 'dia' as const, clima: 'templado' as const, estilo: 'corporate' as const } },
  { name: 'Viernes Casual', emoji: '🍻', filters: { ocasion: 'oficina_casual' as const, momento: 'tarde' as const, clima: 'templado' as const, estilo: 'old_money' as const } },
  { name: 'Concierto de Metal', emoji: '🎸', filters: { ocasion: 'salida' as const, momento: 'noche' as const, clima: 'frio' as const, estilo: 'rockero' as const } },
  { name: 'Cena Elegante', emoji: '🍷', filters: { ocasion: 'after_office' as const, momento: 'noche' as const, clima: 'frio' as const, estilo: 'noir' as const } },
  { name: 'Sabado Relajado', emoji: '☕', filters: { ocasion: 'fin_de_semana' as const, momento: 'dia' as const, clima: 'calor' as const, estilo: 'old_money' as const } },
  { name: 'Noche de Rock', emoji: '🤘', filters: { ocasion: 'salida' as const, momento: 'noche' as const, clima: 'frio' as const, estilo: 'rockero' as const } },
];

const OI: Record<string, React.ReactNode> = {
  oficina: <Briefcase className="size-3.5" />,
  oficina_casual: <Coffee className="size-3.5" />,
  salida: <PartyPopper className="size-3.5" />,
  after_office: <Wine className="size-3.5" />,
  fin_de_semana: <Sun className="size-3.5" />,
};
const OD: Record<string, string> = {
  oficina: 'Reuniones, presentaciones, corporativo',
  oficina_casual: 'Dias relajados, creative spaces',
  salida: 'Conciertos, bares, eventos',
  after_office: 'Cocktails, cenas, eventos sociales',
  fin_de_semana: 'Brunch, paseos, casual',
};
const CL: Record<string, string> = {
  camisas_formales: 'Camisas', corbatas: 'Corbatas', pantalones: 'Pantalones',
  abrigos: 'Abrigos', cuellos_tortuga: 'Cuellos Tortuga', henley_casual: 'Henley/Casual',
  calzado: 'Calzado', accesorios: 'Accesorios',
};
const CEmoji: Record<string, string> = {
  camisas_formales: '👔', corbatas: '🧩', pantalones: '👖',
  abrigos: '🧥', cuellos_tortuga: '🧣', henley_casual: '👕',
  calzado: '👞', accesorios: '💍',
};

const GS = 'bg-white/[0.025] border border-white/[0.05] backdrop-blur-sm';
const GHH = 'hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-300';

function useFavorites() {
  const [favs, setFavs] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem('sv_fav') ?? '[]') as string[]; } catch { return []; }
  });
  useEffect(() => { localStorage.setItem('sv_fav', JSON.stringify(favs)); }, [favs]);
  const toggle = useCallback((id: string) => { setFavs((p) => p.includes(id) ? p.filter((f) => f !== id) : [...p, id]); }, []);
  const isFav = useCallback((id: string) => favs.includes(id), [favs]);
  return { favorites: favs, toggleFavorite: toggle, isFavorite: isFav };
}

function DetailDlg({ outfit, open, onOpenChange, isFav, onToggle }: {
  outfit: SuggestionOutfit | null; open: boolean; onOpenChange: (v: boolean) => void;
  isFav: (id: string) => boolean; onToggle: (id: string) => void;
}) {
  if (!outfit) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto bg-[#111113] border-white/[0.08] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent">{outfit.nombre}</DialogTitle>
          <DialogDescription className="text-zinc-400 leading-relaxed">{outfit.descripcion}</DialogDescription>
        </DialogHeader>
        <div className="space-y-5 mt-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/5">{LABELS.ocasion[outfit.ocasion]}</Badge>
            <Badge variant="outline" className="border-zinc-500/30 text-zinc-300 bg-zinc-500/5">{LABELS.momento[outfit.momento]}</Badge>
            <Badge variant="outline" className="border-sky-500/30 text-sky-400 bg-sky-500/5">{LABELS.clima[outfit.clima]}</Badge>
            <Badge variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-500/5">{LABELS.estilo[outfit.estilo]}</Badge>
          </div>
          <Separator className="bg-white/[0.06]" />
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Paleta de Colores</p>
            <div className="flex gap-3">
              {outfit.colores.map((hex: string, i: number) => (
                <TooltipProvider key={i}><Tooltip><TooltipTrigger asChild>
                  <div className="w-12 h-12 rounded-full border-2 border-white/10 shadow-lg transition-transform duration-300 hover:scale-110" style={{ backgroundColor: hex }} />
                </TooltipTrigger><TooltipContent side="bottom" className="bg-zinc-800 text-zinc-200 border-zinc-700">{hex}</TooltipContent></Tooltip></TooltipProvider>
              ))}
            </div>
          </div>
          <Separator className="bg-white/[0.06]" />
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Prendas ({outfit.prendas.length})</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {outfit.prendas.map((p: Garment) => (
                <div key={p.id} className={`${GS} rounded-lg p-3 flex items-start gap-3 ${GHH}`}>
                  <span className="text-xl">{p.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-200 truncate">{p.nombre}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: p.colorHex }} />
                      <p className="text-xs text-zinc-500 truncate">{p.color}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button onClick={() => onToggle(outfit.id)} variant="outline" className={isFav(outfit.id) ? 'border-rose-500/50 text-rose-400 bg-rose-500/10' : 'border-white/10 text-zinc-400'}>
              <Heart className={`size-4 mr-2 ${isFav(outfit.id) ? 'fill-rose-400' : ''}`} />{isFav(outfit.id) ? 'Guardado' : 'Guardar'}
            </Button>
            <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white">
              <Sparkles className="size-4 mr-2" />Usar este Look
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MiniCard({ o, isFav, onToggle }: { o: OutfitListItem; isFav: boolean; onToggle: (id: string) => void }) {
  return (
    <Card className={`${GS} rounded-xl overflow-hidden ${GHH} hover:shadow-lg hover:shadow-amber-500/5`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-zinc-200 line-clamp-1 flex-1">{o.nombre}</h3>
          <button onClick={() => onToggle(o.id)} className={`p-1.5 rounded-lg transition-all duration-300 cursor-pointer flex-shrink-0 ${isFav ? 'text-rose-400' : 'text-zinc-700 hover:text-rose-400'}`}>
            <Heart className={`size-3.5 ${isFav ? 'fill-rose-400' : ''}`} />
          </button>
        </div>
        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{o.descripcion}</p>
        <div className="flex items-center gap-1.5">
          {o.colores.slice(0, 5).map((hex: string, i: number) => (
            <div key={i} className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: hex }} />
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="border-amber-500/20 text-amber-500/60 bg-amber-500/5 text-[9px] px-1.5 py-0">{LABELS.ocasion[o.ocasion]}</Badge>
          <Badge variant="outline" className="border-purple-500/20 text-purple-500/60 bg-purple-500/5 text-[9px] px-1.5 py-0">{LABELS.estilo[o.estilo]}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
