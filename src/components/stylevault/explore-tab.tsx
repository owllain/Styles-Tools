'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight } from 'lucide-react';
import { LABELS } from '@/data/types';

const FILTER_OPTIONS = [
  { value: null, label: 'Todas' },
  { value: 'oficina', label: 'Oficina' },
  { value: 'oficina_casual', label: 'Casual' },
  { value: 'salida', label: 'Salida' },
  { value: 'after_office', label: 'After Office' },
  { value: 'fin_de_semana', label: 'Fin de Semana' },
];

export function ExploreTab() {
  const [allOutfits, setAllOutfits] = useState<any[]>([]);
  const [exploreLoading, setExploreLoading] = useState(false);
  const [filterOcasion, setFilterOcasion] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});

  const loadAll = useCallback(async () => {
    setExploreLoading(true);
    try {
      const res = await fetch('/api/outfits?limit=130');
      const data = await res.json();
      const outfits = data.outfits || [];
      setAllOutfits(outfits);
      const c: Record<string, number> = { total: outfits.length };
      outfits.forEach((o: any) => {
        o.ocasion.forEach((oc: string) => { c[oc] = (c[oc] || 0) + 1; });
      });
      setCounts(c);
    } catch (e) { console.error(e); }
    finally { setExploreLoading(false); }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const filtered = filterOcasion ? allOutfits.filter(o => o.ocasion.includes(filterOcasion)) : allOutfits;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white/90">Explorar Combinaciones</h2>
          <p className="text-xs text-white/30 mt-0.5">{filtered.length} de {counts.total || 0} outfits</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTER_OPTIONS.map(v => {
            const isActive = filterOcasion === v.value;
            const count = v.value ? (counts[v.value] || 0) : (counts.total || 0);
            return (
              <Button key={v.value || 'all'} size="sm"
                className={`rounded-xl text-[11px] h-8 px-3 gap-1.5 transition-all duration-200 border ${
                  isActive
                    ? 'bg-white/[0.08] border-white/15 text-white shadow-sm'
                    : 'border-white/[0.04] text-white/35 hover:text-white/60 hover:bg-white/[0.04] hover:border-white/[0.08]'
                }`}
                onClick={() => setFilterOcasion(v.value)}>
                {v.label}
                <span className={`text-[9px] font-bold px-1.5 py-0 rounded-md ${isActive ? 'bg-white/10' : 'bg-white/[0.03] text-white/20'}`}>{count}</span>
              </Button>
            );
          })}
        </div>
      </div>
      {exploreLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 stagger-children">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 bg-white/[0.02] rounded-xl border border-white/[0.03]" />)}
        </div>
      ) : (
        <ScrollArea className="max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 stagger-children">
            {filtered.map(outfit => (
              <Card key={outfit.id}
                className={`bg-white/[0.025] border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 group ${
                  expandedId === outfit.id ? 'border-amber-500/25 shadow-[0_0_20px_-5px_rgba(245,158,11,0.06)]' : 'border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.03]'
                }`}
                onClick={() => setExpandedId(expandedId === outfit.id ? null : outfit.id)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-semibold text-white/80 group-hover:text-amber-200 transition-colors truncate">{outfit.nombre}</h3>
                      <p className="text-[10px] text-white/30 line-clamp-2 mt-0.5 leading-relaxed">{outfit.descripcion}</p>
                    </div>
                    <ChevronRight className={`h-4 w-4 text-white/15 flex-shrink-0 transition-transform duration-300 ${expandedId === outfit.id ? 'rotate-90 text-amber-400' : ''}`} />
                  </div>
                  <div className="flex items-center gap-1.5 mt-3">
                    <div className="flex -space-x-1">
                      {outfit.paletaColores.slice(0, 4).map((c: string, i: number) => (
                        <div key={i} className="w-4 h-4 rounded-full border border-[#0a0a0b]" style={{ backgroundColor: c }} />
                      ))}
                      {outfit.paletaColores.length > 4 && <div className="w-4 h-4 rounded-full bg-white/[0.06] border border-[#0a0a0b] flex items-center justify-center text-[7px] text-white/30 font-bold">+{outfit.paletaColores.length - 4}</div>}
                    </div>
                    <div className="flex-1" />
                    <div className="flex gap-1">
                      {outfit.estilo.slice(0, 2).map((e: string) => (
                        <Badge key={e} className="bg-white/[0.03] text-white/25 text-[8px] px-1.5 py-0 border-0 font-medium">
                          {LABELS.estilo[e as keyof typeof LABELS.estilo]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {expandedId === outfit.id && (
                    <div className="mt-3 pt-3 border-t border-white/[0.05] space-y-2 animate-fade-in-up">
                      <div className="flex flex-wrap gap-1">
                        {outfit.ocasion.map((o: string) => (
                          <Badge key={o} className="bg-emerald-500/8 text-emerald-400/80 text-[9px] px-1.5 py-0 border-emerald-500/10 font-medium">
                            {LABELS.ocasion[o as keyof typeof LABELS.ocasion]}
                          </Badge>
                        ))}
                        {outfit.momento.map((m: string) => (
                          <Badge key={m} className="bg-sky-500/8 text-sky-400/80 text-[9px] px-1.5 py-0 border-sky-500/10 font-medium">
                            {LABELS.momento[m as keyof typeof LABELS.momento]}
                          </Badge>
                        ))}
                        {outfit.clima.map((c: string) => (
                          <Badge key={c} className="bg-orange-500/8 text-orange-400/80 text-[9px] px-1.5 py-0 border-orange-500/10 font-medium">
                            {LABELS.clima[c as keyof typeof LABELS.clima]}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}