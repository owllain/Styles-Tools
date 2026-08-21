'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight } from 'lucide-react';
import { LABELS } from '@/data/types';

export function ExploreTab() {
  const [allOutfits, setAllOutfits] = useState<any[]>([]);
  const [exploreLoading, setExploreLoading] = useState(false);
  const [filterOcasion, setFilterOcasion] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setExploreLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterOcasion) params.set('ocasion', filterOcasion);
      params.set('limit', '50');
      const res = await fetch(`/api/outfits?${params}`);
      const data = await res.json();
      setAllOutfits(data.outfits || []);
    } catch (e) {
      console.error(e);
    } finally {
      setExploreLoading(false);
    }
  }, [filterOcasion]);

  useEffect(() => { loadAll(); }, [loadAll]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white/90">Explorar Combinaciones</h2>
          <p className="text-xs text-white/40">{allOutfits.length} outfits disponibles</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[null, 'oficina', 'oficina_casual', 'salida', 'after_office', 'fin_de_semana'].map(v => (
            <Button key={v || 'all'}
              variant={filterOcasion === v ? 'default' : 'outline'} size="sm"
              className={`rounded-full text-[10px] h-7 px-3 ${
                filterOcasion === v ? 'bg-amber-700 hover:bg-amber-600 text-amber-50 border-amber-700' : 'border-white/10 text-white/50 hover:text-white/80 hover:bg-white/[0.05]'
              }`}
              onClick={() => setFilterOcasion(v)}>
              {v ? LABELS.ocasion[v as keyof typeof LABELS.ocasion] : 'Todas'}
            </Button>
          ))}
        </div>
      </div>
      {exploreLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 bg-white/[0.03] rounded-xl" />)}
        </div>
      ) : (
        <ScrollArea className="max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {allOutfits.map(outfit => (
              <Card key={outfit.id}
                className={`bg-white/[0.03] border rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
                  expandedId === outfit.id ? 'border-amber-500/30' : 'border-white/[0.06] hover:border-white/[0.12]'
                }`}
                onClick={() => setExpandedId(expandedId === outfit.id ? null : outfit.id)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-semibold text-white/80 truncate">{outfit.nombre}</h3>
                      <p className="text-[10px] text-white/35 line-clamp-2 mt-0.5">{outfit.descripcion}</p>
                    </div>
                    <ChevronRight className={`h-4 w-4 text-white/20 flex-shrink-0 transition-transform ${expandedId === outfit.id ? 'rotate-90' : ''}`} />
                  </div>
                  <div className="flex items-center gap-1 mt-2.5">
                    {outfit.paletaColores.map((c: string, i: number) => (
                      <div key={i} className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ backgroundColor: c }} />
                    ))}
                    <div className="flex-1" />
                    <div className="flex gap-1">
                      {outfit.estilo.slice(0, 2).map((e: string) => (
                        <Badge key={e} className="bg-white/[0.04] text-white/30 text-[8px] px-1.5 py-0 border-0">
                          {LABELS.estilo[e as keyof typeof LABELS.estilo]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {expandedId === outfit.id && (
                    <div className="mt-3 pt-3 border-t border-white/[0.06] space-y-1.5">
                      <div className="flex flex-wrap gap-1">
                        {outfit.ocasion.map((o: string) => (
                          <Badge key={o} className="bg-emerald-500/10 text-emerald-400 text-[9px] px-1.5 py-0 border-emerald-500/20">
                            {LABELS.ocasion[o as keyof typeof LABELS.ocasion]}
                          </Badge>
                        ))}
                        {outfit.momento.map((m: string) => (
                          <Badge key={m} className="bg-blue-500/10 text-blue-400 text-[9px] px-1.5 py-0 border-blue-500/20">
                            {LABELS.momento[m as keyof typeof LABELS.momento]}
                          </Badge>
                        ))}
                        {outfit.clima.map((c: string) => (
                          <Badge key={c} className="bg-orange-500/10 text-orange-400 text-[9px] px-1.5 py-0 border-orange-500/20">
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
