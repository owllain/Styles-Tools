'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const CATEGORIES = [
  { id: null, label: 'Todas', emoji: '👔' },
  { id: 'camisas_formales', label: 'Formales', emoji: '👔' },
  { id: 'corbatas', label: 'Corbatas', emoji: '🪢' },
  { id: 'pantalones', label: 'Pantalones', emoji: '👖' },
  { id: 'abrigos', label: 'Abrigos', emoji: '🧥' },
  { id: 'cuellos_tortuga', label: 'Tortuga', emoji: '👕' },
  { id: 'henley_casual', label: 'Henley', emoji: '🎽' },
  { id: 'calzado', label: 'Calzado', emoji: '🥾' },
  { id: 'accesorios', label: 'Accesorios', emoji: '🔗' },
];

export function WardrobeTab() {
  const [items, setItems] = useState<any[]>([]);
  const [allItems, setAllItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    try {
      const res = await fetch('/api/wardrobe');
      const data = await res.json();
      setAllItems(data.prendas || []);
      setItems(data.prendas || []);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleCategory = (cat: string | null) => {
    setCategory(cat);
    setLoading(true);
    setTimeout(() => {
      if (cat) setItems(allItems.filter(i => i.categoria === cat));
      else setItems(allItems);
      setLoading(false);
    }, 150);
  };

  const getCount = (catId: string | null) => {
    if (!catId) return allItems.length;
    return allItems.filter(i => i.categoria === catId).length;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white/90">Inventario de Guardarropa</h2>
          <p className="text-xs text-white/30 mt-0.5">{allItems.length} prendas en 8 categorias</p>
        </div>
        <div className="text-[10px] text-white/20 font-mono bg-white/[0.02] px-2.5 py-1 rounded-lg border border-white/[0.04]">
          {items.length} prendas
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map(cat => {
          const count = getCount(cat.id);
          const isActive = category === cat.id;
          return (
            <Button key={cat.id || 'all'} variant="outline" size="sm"
              className={`rounded-xl text-xs h-9 px-3 gap-1.5 transition-all duration-200 border ${
                isActive
                  ? 'bg-white/[0.08] border-white/15 text-white shadow-sm'
                  : 'border-white/[0.04] text-white/35 hover:text-white/60 hover:bg-white/[0.04] hover:border-white/[0.08]'
              }`}
              onClick={() => handleCategory(cat.id)}>
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              <Badge variant="secondary" className={`h-4 min-w-4 px-1 text-[9px] font-bold rounded ${isActive ? 'bg-white/10 text-white/70' : 'bg-white/[0.03] text-white/20'}`}>{count}</Badge>
            </Button>
          );
        })}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 stagger-children">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-36 bg-white/[0.02] rounded-xl border border-white/[0.03]" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 stagger-children">
          {items.map(item => (
            <div key={item.id} className="group bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300 cursor-default">
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl drop-shadow-lg transition-transform group-hover:scale-110 duration-300">{item.emoji}</span>
                <div className="flex flex-col items-end gap-1.5">
                  <div className="w-7 h-7 rounded-full border-2 border-white/[0.08] shadow-inner transition-transform group-hover:scale-110 duration-300" style={{ backgroundColor: item.colorHex }} />
                  <span className="text-[9px] text-white/15 font-mono">{item.id}</span>
                </div>
              </div>
              <h3 className="text-[11px] font-medium text-white/75 line-clamp-2 leading-relaxed group-hover:text-white/90 transition-colors">{item.nombre}</h3>
              {item.notas && <p className="text-[9px] text-white/15 mt-1 line-clamp-1 italic">{item.notas}</p>}
              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-[10px] text-white/25 font-medium">{item.color}</span>
                <div className="flex gap-[3px]">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className={`w-[3px] h-3.5 rounded-full transition-all duration-300 ${j < item.formalidad ? 'bg-amber-500/50' : 'bg-white/[0.04]'}`} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}