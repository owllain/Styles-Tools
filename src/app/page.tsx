'use client';

import { useState, useCallback, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Warehouse, RefreshCw, Eye, Layers, Palette, Dice5, Heart } from 'lucide-react';
import { type Ocasion, type Momento, type Clima, type Estilo } from '@/data/types';
import { OutfitCard, type Suggestion } from '@/components/stylevault/outfit-card';
import { SettingsPanel } from '@/components/stylevault/settings-panel';
import { ExploreTab } from '@/components/stylevault/explore-tab';
import { WardrobeTab } from '@/components/stylevault/wardrobe-tab';

const FAVS_KEY = 'stylevault_favorites';

function useFavorites() {
  const [favs, setFavs] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(FAVS_KEY) || '[]'); } catch { return []; }
  });
  const toggle = (id: string) => setFavs(prev => {
    const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
    localStorage.setItem(FAVS_KEY, JSON.stringify(next));
    return next;
  });
  const isFav = (id: string) => favs.includes(id);
  return { favs, toggle, isFav };
}

export default function StyleVaultPage() {
  const [activeTab, setActiveTab] = useState('suggest');
  const [ocasion, setOcasion] = useState<Ocasion | null>(null);
  const [momento, setMomento] = useState<Momento | null>(null);
  const [clima, setClima] = useState<Clima | null>(null);
  const [estilo, setEstilo] = useState<Estilo | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [totalInDb, setTotalInDb] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [randomLoading, setRandomLoading] = useState(false);
  const { favs, toggle: toggleFav, isFav } = useFavorites();

  const getSuggestions = useCallback(async () => {
    setLoading(true);
    setSelectedId(null);
    try {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ocasion: ocasion || undefined, momento: momento || undefined, clima: clima || undefined, estilo: estilo || undefined, count: 5 }),
      });
      const data = await res.json();
      if (data.success) {
        setSuggestions(data.suggestions);
        setTotalAvailable(data.totalAvailable);
        setTotalInDb(data.totalInDatabase);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [ocasion, momento, clima, estilo]);

  const getRandomOutfit = useCallback(async () => {
    setRandomLoading(true);
    setSelectedId(null);
    try {
      const res = await fetch('/api/suggest', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 1 }),
      });
      const data = await res.json();
      if (data.success && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
        setTotalAvailable(data.totalAvailable);
        setTotalInDb(data.totalInDatabase);
      }
    } catch (e) { console.error(e); }
    finally { setRandomLoading(false); }
  }, []);

  const filterCount = [ocasion, momento, clima, estilo].filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col noise-bg relative overflow-hidden">
      {/* Atmospheric gradient orbs */
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-amber-900/[0.07] blur-[120px] animate-pulse-glow" />
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full bg-purple-900/[0.05] blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-40 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-900/[0.04] blur-[100px] animate-pulse-glow" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col bg-[#0a0a0b]/80">
        {/* HEADER */
        <header className="border-b border-white/[0.06] bg-[#0a0a0b]/60 backdrop-blur-2xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-amber-700 to-amber-950 flex items-center justify-center shadow-lg shadow-amber-900/30 animate-gradient">
                <Warehouse className="h-4.5 w-4.5 text-amber-100" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white">StyleVault</h1>
                <p className="text-[10px] text-white/30 -mt-0.5 tracking-[0.2em] uppercase font-medium">Enrique Cascante</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {favs.length > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20">
                  <Heart className="h-3 w-3 text-rose-400 fill-rose-400" />
                  <span className="text-[11px] text-rose-300 font-medium">{favs.length}</span>
                </div>
              )}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                <span className="text-[11px] text-white/40 font-medium">130 outfits</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-1.5 w-full sm:w-auto backdrop-blur-sm">
              <TabsTrigger value="suggest" className="rounded-xl data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-400 data-[state=active]:shadow-[0_0_15px_rgba(245,158,11,0.1)] gap-1.5 text-xs sm:text-sm transition-all duration-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sugerencias</span><span className="sm:hidden">AI</span>
              </TabsTrigger>
              <TabsTrigger value="wardrobe" className="rounded-xl data-[state=active]:bg-white/10 data-[state=active]:text-white gap-1.5 text-xs sm:text-sm transition-all duration-300">
                <Layers className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Inventario</span><span className="sm:hidden">Ropa</span>
              </TabsTrigger>
              <TabsTrigger value="explore" className="rounded-xl data-[state=active]:bg-white/10 data-[state=active]:text-white gap-1.5 text-xs sm:text-sm transition-all duration-300">
                <Eye className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Explorar</span><span className="sm:hidden">All</span>
              </TabsTrigger>
              <TabsTrigger value="favorites" className="rounded-xl data-[state=active]:bg-rose-500/15 data-[state=active]:text-rose-400 gap-1.5 text-xs sm:text-sm transition-all duration-300">
                <Heart className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Favoritos</span><span className="sm:hidden">❤</span>
              </TabsTrigger>
            </TabsList>

            {/* SUGGEST TAB */}
            <TabsContent value="suggest" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 xl:col-span-3">
                  <SettingsPanel ocasion={ocasion} setOcasion={setOcasion} momento={momento} setMomento={setMomento} clima={clima} setClima={setClima} estilo={estilo} setEstilo={setEstilo} onSuggest={getSuggestions} loading={loading} />
                </div>
                <div className="lg:col-span-8 xl:col-span-9">
                  {suggestions.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in-up">
                      <div className="relative mb-8">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] flex items-center justify-center animate-float">
                          <Palette className="h-10 w-10 text-white/10" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                          <Dice5 className="h-4 w-4 text-amber-400" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-white/60 mb-3">¿Que te vas a poner hoy?</h2>
                      <p className="text-sm text-white/25 max-w-md mb-8 leading-relaxed">
                        Configura tu ocasion, momento, clima y estetica para obtener sugerencias personalizadas de tu guardarropa.
                      </p>
                      <Button variant="outline" size="lg" className="rounded-2xl border-white/10 text-white/40 hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/5 gap-2 px-6" onClick={getRandomOutfit} disabled={randomLoading}>
                        {randomLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Dice5 className="h-4 w-4" />}
                        Sorprendeme
                      </Button>
                    </div>
                  )}
                  {loading && (
                    <div className="space-y-4 stagger-children">
                      {[1, 2, 3].map(i => <Skeleton key={i} className="h-52 bg-white/[0.02] rounded-2xl border border-white/[0.04]" />)}
                    </div>
                  )}
                  {suggestions.length > 0 && !loading && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-xs text-white/40">
                            <span className="text-amber-400/80 font-semibold">{totalAvailable}</span>
                            <span>coincidencias</span>
                          </div>
                          <div className="w-px h-3 bg-white/10" />
                          <span className="text-[11px] text-white/25">de {totalInDb} total</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="text-xs text-white/30 hover:text-amber-400 h-7 gap-1" onClick={getRandomOutfit} disabled={randomLoading}>
                            <Dice5 className="h-3 w-3" /> Random
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs text-amber-500/60 hover:text-amber-400 h-7 gap-1" onClick={getSuggestions}>
                            <RefreshCw className="h-3 w-3" /> Refrescar
                          </Button>
                        </div>
                      </div>
                      <div className="stagger-children">
                        {suggestions.map((s, i) => (
                          <OutfitCard key={s.outfit.id} suggestion={s} rank={i + 1}
                            selected={selectedId === s.outfit.id}
                            onSelect={() => setSelectedId(selectedId === s.outfit.id ? null : s.outfit.id)}
                            isFav={isFav(s.outfit.id)} onToggleFav={() => toggleFav(s.outfit.id)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* WARDROBE TAB */}
            <TabsContent value="wardrobe" className="mt-6">
              <WardrobeTab />
            </TabsContent>

            {/* EXPLORE TAB */}
            <TabsContent value="explore" className="mt-6">
              <ExploreTab />
            </TabsContent>

            {/* FAVORITES TAB */}
            <TabsContent value="favorites" className="mt-6">
              <FavoritesTab favs={favs} isFav={isFav} onToggleFav={toggleFav} />
            </TabsContent>
          </Tabs>
        </main>

        <footer className="border-t border-white/[0.04] mt-auto bg-[#0a0a0b]/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[10px] text-white/15">StyleVault v2.0 — Inventario personalizado para Enrique Cascante</p>
            <div className="flex items-center gap-3">
              <p className="text-[10px] text-white/15">130 combinaciones curadas</p>
              <div className="w-px h-3 bg-white/10" />
              <p className="text-[10px] text-white/15">46 prendas</p>
              <div className="w-px h-3 bg-white/10" />
              <p className="text-[10px] text-white/15">4 esteticas</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function FavoritesTab({ favs, isFav, onToggleFav }: { favs: string[]; isFav: (id: string) => boolean; onToggleFav: (id: string) => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (favs.length === 0) { setItems([]); return; }
    setLoading(true);
    (async () => {
      try {
        const res = await fetch('/api/outfits?limit=130');
        const data = await res.json();
        setItems((data.outfits || []).filter((o: any) => favs.includes(o.id)));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [favs]);

  if (favs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center animate-fade-in-up">
        <div className="w-20 h-20 rounded-3xl bg-rose-500/5 border border-rose-500/10 flex items-center justify-center mb-6 animate-float">
          <Heart className="h-8 w-8 text-rose-500/20" />
        </div>
        <h2 className="text-xl font-semibold text-white/50 mb-2">Sin favoritos aun</h2>
        <p className="text-sm text-white/25 max-w-sm">Haz clic en el corazon de cualquier outfit para guardarlo aqui.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white/90">Mis Favoritos</h2>
          <p className="text-xs text-white/40">{items.length} outfits guardados</p>
        </div>
      </div>
      {loading ? (
        <div className="space-y-4 stagger-children">{[1, 2, 3].map(i => <Skeleton key={i} className="h-32 bg-white/[0.02] rounded-2xl" />)}</div>
      ) : (
        <div className="space-y-3 stagger-children">
          {items.map(outfit => (
            <div key={outfit.id} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 hover:bg-white/[0.04] transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white/80 group-hover:text-amber-300 transition-colors">{outfit.nombre}</h3>
                  <p className="text-xs text-white/35 mt-1 line-clamp-2">{outfit.descripcion}</p>
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {outfit.estilo.map((e: string) => (
                      <span key={e} className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/15">{outfit.estilo.includes(e) ? '' : ''}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {outfit.paletaColores.map((c: string, i: number) => (
                    <div key={i} className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10" onClick={() => onToggleFav(outfit.id)}>
                  <Heart className="h-4 w-4 fill-rose-400" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
