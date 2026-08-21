'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';


export function WardrobeTab() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<string | null>(null);

  const loadItems = useCallback(async (cat?: string | null) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cat) params.set('categoria', cat);
      const res = await fetch(`/api/wardrobe?${params}`);
      const data = await res.json();
      setItems(data.prendas);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadItems(); }, [loadItems]);

  const handleCategory = (cat: string | null) => {
    setCategory(cat);
    loadItems(cat);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white/90">Inventario de Guardarropa</h2>
        <span className="text-xs text-white/40">{items.length} prendas</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant={category === null ? 'default' : 'outline'} size="sm"
          className={`rounded-full text-xs h-8 ${
            category === null ? 'bg-amber-700 hover:bg-amber-600 text-amber-50 border-amber-700' : 'border-white/10 text-white/50 hover:text-white/80 hover:bg-white/[0.05]'
          }`} onClick={() => handleCategory(null)}>Todas</Button>
        {[
          { id: 'camisas_formales', label: '\uD83D\uDC54 Formales' },
          { id: 'corbatas', label: '\uD83E\uDEA2 Corbatas' },
          { id: 'pantalones', label: '\uD83D\uDC56 Pantalones' },
          { id: 'abrigos', label: '\uD83E\uDDE5 Abrigos' },
          { id: 'cuellos_tortuga', label: '\uD83D\uDCC5 Cuellos Tortuga' },
          { id: 'henley_casual', label: '\uD83C\uDFC5 Henley/Casual' },
          { id: 'calzado', label: '\uD83E\uDDE4 Calzado' },
          { id: 'accesorios', label: '\uD83D\uDD17 Accesorios' },
        ].map(cat => (
          <Button key={cat.id} variant={category === cat.id ? 'default' : 'outline'} size="sm"
            className={`rounded-full text-xs h-8 ${
              category === cat.id ? 'bg-amber-700 hover:bg-amber-600 text-amber-50 border-amber-700' : 'border-white/10 text-white/50 hover:text-white/80 hover:bg-white/[0.05]'
            }`} onClick={() => handleCategory(cat.id)}>{cat.label}</Button>
        ))}
      </div>
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-32 bg-white/[0.03] rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.map(item => (
            <div key={item.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.06] transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{item.emoji}</span>
                <div className="w-6 h-6 rounded-full border-2 border-white/10" style={{ backgroundColor: item.colorHex }} />
              </div>
              <h3 className="text-xs font-medium text-white/80 line-clamp-2 leading-relaxed">{item.nombre}</h3>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] text-white/30">{item.color}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: item.formalidad }).map((_, j) => (
                    <div key={j} className="w-1 h-3 bg-amber-500/40 rounded-full" />
                  ))}
                  {Array.from({ length: 5 - item.formalidad }).map((_, j) => (
                    <div key={j} className="w-1 h-3 bg-white/[0.06] rounded-full" />
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
