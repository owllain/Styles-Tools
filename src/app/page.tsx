'use client';

import { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Warehouse, RefreshCw, Eye, Layers, Palette } from 'lucide-react';
import { type Ocasion, type Momento, type Clima, type Estilo } from '@/data/types';
import { OutfitCard, type Suggestion } from '@/components/stylevault/outfit-card';
import { SettingsPanel } from '@/components/stylevault/settings-panel';
import { ExploreTab } from '@/components/stylevault/explore-tab';
import { WardrobeTab } from '@/components/stylevault/wardrobe-tab';

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

  const getSuggestions = useCallback(async () => {
    setLoading(true);
    setSelectedId(null);
    try {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ocasion: ocasion || undefined,
          momento: momento || undefined,
          clima: clima || undefined,
          estilo: estilo || undefined,
          count: 5,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuggestions(data.suggestions);
        setTotalAvailable(data.totalAvailable);
        setTotalInDb(data.totalInDatabase);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [ocasion, momento, clima, estilo]);

  const hasAnyFilter = ocasion || momento || clima || estilo;
  const filterCount = [ocasion, momento, clima, estilo].filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white">
      {/* HEADER */}
      <header className="border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center">
              <Warehouse className="h-5 w-5 text-amber-100" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">StyleVault</h1>
              <p className="text-[10px] text-white/40 -mt-0.5 tracking-widest uppercase">Enrique Cascante</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-white/50">130 combinaciones</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-1 w-full sm:w-auto">
            <TabsTrigger value="suggest" className="rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-amber-400 gap-1.5 text-xs sm:text-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sugerencias</span>
              <span className="sm:hidden">AI</span>
            </TabsTrigger>
            <TabsTrigger value="wardrobe" className="rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-amber-400 gap-1.5 text-xs sm:text-sm">
              <Layers className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Inventario</span>
              <span className="sm:hidden">Ropa</span>
            </TabsTrigger>
            <TabsTrigger value="explore" className="rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-amber-400 gap-1.5 text-xs sm:text-sm">
              <Eye className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Explorar</span>
              <span className="sm:hidden">All</span>
            </TabsTrigger>
          </TabsList>

          {/* SUGGEST TAB */}
          <TabsContent value="suggest" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 xl:col-span-3">
                <SettingsPanel
                  ocasion={ocasion} setOcasion={setOcasion}
                  momento={momento} setMomento={setMomento}
                  clima={clima} setClima={setClima}
                  estilo={estilo} setEstilo={setEstilo}
                  onSuggest={getSuggestions} loading={loading}
                />
              </div>
              <div className="lg:col-span-8 xl:col-span-9">
                {suggestions.length === 0 && !loading && (
                  <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                    <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-6">
                      <Palette className="h-10 w-10 text-white/15" />
                    </div>
                    <h2 className="text-xl font-semibold text-white/70 mb-2">Que te vas a poner hoy?</h2>
                    <p className="text-sm text-white/30 max-w-sm">
                      Configura tu ocasion, momento, clima y estetica para obtener sugerencias personalizadas de tu guardarropa.
                    </p>
                  </div>
                )}
                {loading && (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 bg-white/[0.03] rounded-2xl" />)}
                  </div>
                )}
                {suggestions.length > 0 && !loading && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <span>{totalAvailable} outfits encontrados</span>
                        <span className="text-white/10">|</span>
                        <span>{totalInDb} en base de datos</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-xs text-amber-500 hover:text-amber-400 h-7 gap-1" onClick={getSuggestions}>
                        <RefreshCw className="h-3 w-3" /> Refrescar
                      </Button>
                    </div>
                    {suggestions.map((s, i) => (
                      <OutfitCard
                        key={s.outfit.id}
                        suggestion={s}
                        rank={i + 1}
                        selected={selectedId === s.outfit.id}
                        onSelect={() => setSelectedId(selectedId === s.outfit.id ? null : s.outfit.id)}
                      />
                    ))}
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
        </Tabs>
      </main>

      <footer className="border-t border-white/[0.04] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <p className="text-[10px] text-white/20">StyleVault v1.0 — Inventario personalizado para Enrique Cascante</p>
          <p className="text-[10px] text-white/20">130 combinaciones curadas</p>
        </div>
      </footer>
    </div>
  );
}
