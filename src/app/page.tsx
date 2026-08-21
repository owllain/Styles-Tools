'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
  Sparkles, Warehouse, RefreshCw, Eye, Layers, Palette, Dice5, Heart,
  SlidersHorizontal, Briefcase, Shirt, Sun, Moon, CloudSun, Flame, Snowflake,
  Wine, Music, Crown, Search, X, BarChart3, ChevronDown, ChevronUp, ChevronRight,
  TrendingUp, ShirtIcon, Clock, MapPin, Zap, Star, Gem, Award, ArrowRight
} from 'lucide-react';
import type { Ocasion, Momento, Clima, Estilo } from '@/data/types';
import { LABELS } from '@/data/types';

const FAVS_KEY = 'stylevault_favorites';
const HISTORY_KEY = 'stylevault_history';
const MAX_HISTORY = 20;

interface GarmentDetail {
  id: string; nombre: string; emoji: string; color: string; colorHex: string;
}
interface Suggestion {
  outfit: { id: string; nombre: string; descripcion: string; ocasion: string[]; momento: string[]; clima: string[]; estilo: string[]; paletaColores: string[]; prendaSuperior?: string; pantalon?: string; calzado?: string; corbata?: string; abrigo?: string; accesorios?: string[] };
  score: number;
  matchDetails: { ocasion: boolean; momento: boolean; clima: boolean; estilo: boolean };
  garments: GarmentDetail[];
}
interface OutfitBasic { id: string; nombre: string; descripcion: string; ocasion: string[]; momento: string[]; clima: string[]; estilo: string[]; paletaColores: string[]; prendaSuperior?: string; pantalon?: string; calzado?: string; corbata?: string; abrigo?: string; accesorios?: string[] };

function useFavorites() {
  const [favs, setFavs] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(FAVS_KEY) || '[]'); } catch { return []; }
  });
  const toggle = useCallback((id: string) => {
    setFavs(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem(FAVS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);
  const isFav = useCallback((id: string) => favs.includes(id), [favs]);
  return { favs, toggle, isFav };
}

function useHistory() {
  const [history, setHistory] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
  });
  const add = useCallback((id: string) => {
    setHistory(prev => {
      const next = [id, ...prev.filter(x => x !== id)].slice(0, MAX_HISTORY);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);
  return { history, add };
}

const PRESETS = [
  { name: 'Lunes de Oficina', emoji: '\u{1F4BC}', ocasion: 'oficina' as Ocasion, momento: 'dia' as Momento, clima: 'templado' as Clima, estilo: 'corporate' as Estilo },
  { name: 'Viernes Casual', emoji: '\u{2615}', ocasion: 'oficina_casual' as Ocasion, momento: 'tarde' as Momento, clima: 'templado' as Clima, estilo: 'old_money' as Estilo },
  { name: 'Concierto de Metal', emoji: '\u{1F3B5}', ocasion: 'salida' as Ocasion, momento: 'noche' as Momento, clima: 'frio' as Clima, estilo: 'rockero' as Estilo },
  { name: 'Cena Elegante', emoji: '\u{1F37D}', ocasion: 'after_office' as Ocasion, momento: 'noche' as Momento, clima: 'frio' as Clima, estilo: 'noir' as Estilo },
  { name: 'Sabado Relajado', emoji: '\u{26F8}', ocasion: 'fin_de_semana' as Ocasion, momento: 'dia' as Momento, clima: 'calor' as Clima, estilo: 'old_money' as Estilo },
  { name: 'Noche de Rock', emoji: '\u{26A1}', ocasion: 'salida' as Ocasion, momento: 'noche' as Momento, clima: 'frio' as Clima, estilo: 'rockero' as Estilo },
];

const OCASION_OPTS: { value: Ocasion; icon: React.ReactNode; desc: string; accent: string }[] = [
  { value: 'oficina', icon: <Briefcase className="h-4 w-4" />, desc: 'Reunion, cliente, gerencia', accent: 'from-sky-500/20 to-sky-600/5' },
  { value: 'oficina_casual', icon: <Shirt className="h-4 w-4" />, desc: 'Viernes, home office', accent: 'from-emerald-500/20 to-emerald-600/5' },
  { value: 'salida', icon: <Sparkles className="h-4 w-4" />, desc: 'Concierto, bar, fiesta', accent: 'from-fuchsia-500/20 to-fuchsia-600/5' },
  { value: 'after_office', icon: <Wine className="h-4 w-4" />, desc: 'Cena, copas, transicion', accent: 'from-purple-500/20 to-purple-600/5' },
  { value: 'fin_de_semana', icon: <Sun className="h-4 w-4" />, desc: 'Sabado, domingo, relax', accent: 'from-amber-500/20 to-amber-600/5' },
];
const MOMENTO_OPTS: { value: Momento; icon: React.ReactNode }[] = [
  { value: 'dia', icon: <Sun className="h-4 w-4" /> },
  { value: 'tarde', icon: <CloudSun className="h-4 w-4" /> },
  { value: 'noche', icon: <Moon className="h-4 w-4" /> },
];
const CLIMA_OPTS: { value: Clima; icon: React.ReactNode }[] = [
  { value: 'frio', icon: <Snowflake className="h-4 w-4" /> },
  { value: 'templado', icon: <CloudSun className="h-4 w-4" /> },
  { value: 'calor', icon: <Flame className="h-4 w-4" /> },
];
const ESTILO_OPTS: { value: Estilo; icon: React.ReactNode; label: string; color: string }[] = [
  { value: 'noir', icon: <Gem className="h-3.5 w-3.5" />, label: 'Noir Sophistique', color: 'text-gray-300' },
  { value: 'old_money', icon: <Crown className="h-3.5 w-3.5" />, label: 'Old Money', color: 'text-amber-300' },
  { value: 'rockero', icon: <Music className="h-3.5 w-3.5" />, label: 'Rockero / Metal', color: 'text-red-400' },
  { value: 'corporate', icon: <Award className="h-3.5 w-3.5" />, label: 'Corporate Tech', color: 'text-sky-400' },
];
const CATEGORIES = [
  { id: null, label: 'Todas', emoji: '\u{1F454}' },
  { id: 'camisas_formales', label: 'Formales', emoji: '\u{1F454}' },
  { id: 'corbatas', label: 'Corbatas', emoji: '\u{1FA9E}' },
  { id: 'pantalones', label: 'Pantalones', emoji: '\u{1F456}' },
  { id: 'abrigos', label: 'Abrigos', emoji: '\u{1F9E5}' },
  { id: 'cuellos_tortuga', label: 'Tortuga', emoji: '\u{1F455}' },
  { id: 'henley_casual', label: 'Henley', emoji: '\u{1F4E5}' },
  { id: 'calzado', label: 'Calzado', emoji: '\u{1F97E}' },
  { id: 'accesorios', label: 'Accesorios', emoji: '\u{1F517}' },
];

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
function getScoreBarColor(score: number) {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-white/20';
}

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } };
const stagger = { animate: { transition: { staggerChildren: 0.06 } } };

export default function StyleVaultPage() {
  const [activeTab, setActiveTab] = useState('suggest');
  const [ocasion, setOcasion] = useState<Ocasion | null>(null);
  const [momento, setMomento] = useState<Momento | null>(null);
  const [clima, setClima] = useState<Clima | null>(null);
  const [estilo, setEstilo] = useState<Estilo | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [totalInDb, setTotalInDb] = useState(130);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [randomLoading, setRandomLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [detailOutfit, setDetailOutfit] = useState<Suggestion | null>(null);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(true);
  const { favs, toggle: toggleFav, isFav } = useFavorites();
  const { history, add: addHistory } = useHistory();
  const filterCount = [ocasion, momento, clima, estilo].filter(Boolean).length;

  const getSuggestions = useCallback(async () => {
    setLoading(true);
    setSelectedId(null);
    try {
      const res = await fetch('/api/suggest', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ocasion: ocasion || undefined, momento: momento || undefined, clima: clima || undefined, estilo: estilo || undefined, count: 8 }),
      });
      const data = await res.json();
      if (data.success) {
        setSuggestions(data.suggestions);
        setTotalAvailable(data.totalAvailable);
        setTotalInDb(data.totalInDatabase);
        data.suggestions.forEach((s: Suggestion) => addHistory(s.outfit.id));
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [ocasion, momento, clima, estilo, addHistory]);

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
        addHistory(data.suggestions[0].outfit.id);
      }
    } catch (e) { console.error(e); }
    finally { setRandomLoading(false); }
  }, [addHistory]);

  const applyPreset = useCallback((p: typeof PRESETS[number]) => {
    setOcasion(p.ocasion);
    setMomento(p.momento);
    setClima(p.clima);
    setEstilo(p.estilo);
  }, []);

  const clearFilters = useCallback(() => {
    setOcasion(null); setMomento(null); setClima(null); setEstilo(null);
  }, []);

  const filteredSuggestions = useMemo(() => {
    if (!searchText.trim()) return suggestions;
    const q = searchText.toLowerCase();
    return suggestions.filter(s => s.outfit.nombre.toLowerCase().includes(q) || s.outfit.descripcion.toLowerCase().includes(q));
  }, [suggestions, searchText]);

  return (
    <div className="min-h-screen flex flex-col noise-bg relative overflow-hidden bg-[#0a0a0b]">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-amber-900/[0.07] blur-[120px] animate-pulse-glow" />
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full bg-purple-900/[0.05] blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-40 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-900/[0.04] blur-[100px] animate-pulse-glow" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="border-b border-white/[0.06] bg-[#0a0a0b]/60 backdrop-blur-2xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-amber-700 to-amber-950 flex items-center justify-center shadow-lg shadow-amber-900/30 animate-gradient">
                <Warehouse className="h-4 w-4 text-amber-100" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white">StyleVault</h1>
                <p className="text-[10px] text-white/30 -mt-0.5 tracking-[0.2em] uppercase font-medium">Enrique Cascante</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
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
                <Sparkles className="h-3.5 w-3.5" /><span className="hidden sm:inline">Sugerencias</span><span className="sm:hidden">AI</span>
              </TabsTrigger>
              <TabsTrigger value="wardrobe" className="rounded-xl data-[state=active]:bg-white/10 data-[state=active]:text-white gap-1.5 text-xs sm:text-sm transition-all duration-300">
                <Layers className="h-3.5 w-3.5" /><span className="hidden sm:inline">Inventario</span><span className="sm:hidden">Ropa</span>
              </TabsTrigger>
              <TabsTrigger value="explore" className="rounded-xl data-[state=active]:bg-white/10 data-[state=active]:text-white gap-1.5 text-xs sm:text-sm transition-all duration-300">
                <Eye className="h-3.5 w-3.5" /><span className="hidden sm:inline">Explorar</span><span className="sm:hidden">All</span>
              </TabsTrigger>
              <TabsTrigger value="favorites" className="rounded-xl data-[state=active]:bg-rose-500/15 data-[state=active]:text-rose-400 gap-1.5 text-xs sm:text-sm transition-all duration-300">
                <Heart className="h-3.5 w-3.5" /><span className="hidden sm:inline">Favoritos</span><span className="sm:hidden">{'❤'}</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="rounded-xl data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400 gap-1.5 text-xs sm:text-sm transition-all duration-300">
                <BarChart3 className="h-3.5 w-3.5" /><span className="hidden sm:inline">Estadisticas</span><span className="sm:hidden">{'📊'}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="suggest" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 xl:col-span-3">
                  <div className="lg:sticky lg:top-24">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                      <Card className="bg-white/[0.02] border-white/[0.05] rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl shadow-black/10">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-semibold text-white/90 flex items-center gap-2">
                              <div className="w-6 h-6 rounded-md bg-amber-500/15 flex items-center justify-center">
                                <SlidersHorizontal className="h-3.5 w-3.5 text-amber-400" />
                              </div>
                              Configura tu Look
                            </CardTitle>
                            <div className="flex items-center gap-2">
                              <button className="lg:hidden text-white/30 hover:text-white/60 text-[10px]" onClick={() => setMobileSettingsOpen(v => !v)}>
                                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${mobileSettingsOpen ? 'rotate-180' : ''}`} />
                              </button>
                              {filterCount > 0 && (
                                <Button variant="ghost" size="sm" className="text-[10px] text-white/30 hover:text-rose-400 h-6 px-2 rounded-lg hover:bg-rose-500/5 transition-colors" onClick={clearFilters}>
                                  Limpiar ({filterCount})
                                </Button>
                              )}
                            </div>
                          </div>
                          <CardDescription className="text-[11px] text-white/30">Selecciona el contexto para sugerencias inteligentes</CardDescription>
                        </CardHeader>
                        <CardContent className={`${mobileSettingsOpen ? '' : 'hidden lg:block'} space-y-4 pb-6`}>
                          <div>
                            <label className="text-[10px] font-semibold text-white/35 uppercase tracking-[0.15em] mb-2 block">Quick Presets</label>
                            <div className="grid grid-cols-2 gap-1.5">
                              {PRESETS.map(p => (
                                <button key={p.name} onClick={() => applyPreset(p)}
                                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl border border-white/[0.04] bg-white/[0.015] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-200 text-left group">
                                  <span className="text-sm group-hover:scale-110 transition-transform duration-200">{p.emoji}</span>
                                  <span className="text-[10px] text-white/50 group-hover:text-white/80 font-medium leading-tight transition-colors">{p.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                          <Separator className="bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                          <div>
                            <label className="text-[10px] font-semibold text-white/35 uppercase tracking-[0.15em] mb-2.5 block">Ocasion</label>
                            <div className="space-y-1">
                              {OCASION_OPTS.map(opt => (
                                <button key={opt.value} onClick={() => setOcasion(ocasion === opt.value ? null : opt.value)}
                                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 border ${
                                    ocasion === opt.value
                                      ? `bg-gradient-to-r ${opt.accent} border-white/10 text-white shadow-sm`
                                      : 'bg-white/[0.015] border-white/[0.03] text-white/45 hover:bg-white/[0.04] hover:text-white/65'
                                  }`}>
                                  <div className={`p-1.5 rounded-lg transition-colors ${ocasion === opt.value ? 'bg-white/10' : 'bg-white/[0.03]'}`}>{opt.icon}</div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium truncate">{LABELS.ocasion[opt.value]}</div>
                                    <div className={`text-[10px] mt-0.5 transition-colors ${ocasion === opt.value ? 'text-white/50' : 'text-white/20'}`}>{opt.desc}</div>
                                  </div>
                                  {ocasion === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white/60 shadow-[0_0_6px_rgba(255,255,255,0.3)]" />}
                                </button>
                              ))}
                            </div>
                          </div>
                          <Separator className="bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                          <div>
                            <label className="text-[10px] font-semibold text-white/35 uppercase tracking-[0.15em] mb-2.5 block">Momento</label>
                            <div className="grid grid-cols-3 gap-1.5">
                              {MOMENTO_OPTS.map(opt => (
                                <button key={opt.value} onClick={() => setMomento(momento === opt.value ? null : opt.value)}
                                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all duration-200 ${
                                    momento === opt.value ? 'bg-white/[0.08] border-white/15 text-white shadow-sm' : 'bg-white/[0.015] border-white/[0.03] text-white/40 hover:bg-white/[0.04]'
                                  }`}>
                                  {opt.icon}<span className="text-[10px] font-medium">{LABELS.momento[opt.value]}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                          <Separator className="bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                          <div>
                            <label className="text-[10px] font-semibold text-white/35 uppercase tracking-[0.15em] mb-2.5 block">Clima</label>
                            <div className="grid grid-cols-3 gap-1.5">
                              {CLIMA_OPTS.map(opt => (
                                <button key={opt.value} onClick={() => setClima(clima === opt.value ? null : opt.value)}
                                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all duration-200 ${
                                    clima === opt.value ? 'bg-white/[0.08] border-white/15 text-white shadow-sm' : 'bg-white/[0.015] border-white/[0.03] text-white/40 hover:bg-white/[0.04]'
                                  }`}>
                                  {opt.icon}<span className="text-[10px] font-medium">{LABELS.clima[opt.value]}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                          <Separator className="bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                          <div>
                            <label className="text-[10px] font-semibold text-white/35 uppercase tracking-[0.15em] mb-2.5 block">Estetica</label>
                            <div className="grid grid-cols-2 gap-1.5">
                              {ESTILO_OPTS.map(opt => (
                                <button key={opt.value} onClick={() => setEstilo(estilo === opt.value ? null : opt.value)}
                                  className={`px-3 py-2.5 rounded-xl border text-center transition-all duration-200 flex items-center justify-center gap-2 ${
                                    estilo === opt.value ? 'bg-white/[0.08] border-white/15 shadow-sm' : 'bg-white/[0.015] border-white/[0.03] text-white/40 hover:bg-white/[0.04]'
                                  }`}>
                                  <span className={estilo === opt.value ? opt.color : 'text-white/20'}>{opt.icon}</span>
                                  <span className={`text-[11px] font-medium ${estilo === opt.value ? 'text-white' : ''}`}>{opt.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                          <Button onClick={getSuggestions} disabled={loading}
                            className="w-full h-12 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 hover:from-amber-500 hover:via-amber-600 hover:to-amber-800 text-amber-50 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-amber-900/25 hover:shadow-amber-800/30 border border-amber-600/20 active:scale-[0.98]">
                            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <><Sparkles className="h-4 w-4 mr-2" />Generar Sugerencias</>}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </div>

                <div className="lg:col-span-8 xl:col-span-9">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                    {suggestions.length === 0 && !loading && (
                      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, type: 'spring' }}>
                          <div className="relative mb-8">
                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-white/[0.06] to-white/[0.01] border border-white/[0.08] flex items-center justify-center animate-float backdrop-blur-sm">
                              <Palette className="h-10 w-10 text-white/15" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center animate-pulse">
                              <Dice5 className="h-4 w-4 text-amber-400" />
                            </div>
                          </div>
                          <h2 className="text-2xl font-bold text-white/60 mb-3">{'¿'}Que te vas a poner hoy?</h2>
                          <p className="text-sm text-white/25 max-w-md mb-8 leading-relaxed">
                            Configura tu ocasion, momento, clima y estetica para obtener sugerencias personalizadas de tu guardarropa.
                          </p>
                          <Button variant="outline" size="lg" className="rounded-2xl border-white/10 text-white/40 hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/5 gap-2 px-6 transition-all duration-300" onClick={getRandomOutfit} disabled={randomLoading}>
                            {randomLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Dice5 className="h-4 w-4" />}
                            Sorprendeme
                          </Button>
                          {history.length > 0 && (
                            <div className="mt-8">
                              <p className="text-[10px] text-white/20 uppercase tracking-[0.15em] mb-3 font-semibold">Recientes</p>
                              <div className="flex gap-1.5 justify-center flex-wrap max-w-lg">
                                {history.slice(0, 8).map(id => (
                                  <span key={id} className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] text-white/25 font-mono">{id}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </div>
                    )}
                    {loading && (
                      <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                            <Skeleton className="h-48 bg-white/[0.02] rounded-2xl border border-white/[0.04]" />
                          </motion.div>
                        ))}
                      </div>
                    )}
                    {suggestions.length > 0 && !loading && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between px-1 gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative flex-1 max-w-xs">
                              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
                              <Input placeholder="Filtrar sugerencias..." value={searchText} onChange={e => setSearchText(e.target.value)}
                                className="h-8 pl-8 pr-8 text-xs bg-white/[0.03] border-white/[0.06] rounded-xl text-white/70 placeholder:text-white/20 focus:border-amber-500/30 focus:ring-amber-500/10" />
                              {searchText && <button onClick={() => setSearchText('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50"><X className="h-3 w-3" /></button>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/40">
                              <span className="text-amber-400/80 font-semibold">{filteredSuggestions.length}</span>
                              <span>resultados</span>
                              <div className="w-px h-3 bg-white/10 mx-1" />
                              <span className="text-[10px] text-white/25">de {totalAvailable} matching</span>
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs text-white/30 hover:text-amber-400 h-7 gap-1" onClick={getRandomOutfit} disabled={randomLoading}>
                              <Dice5 className="h-3 w-3" /> <span className="hidden sm:inline">Random</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="text-xs text-amber-500/60 hover:text-amber-400 h-7 gap-1" onClick={getSuggestions}>
                              <RefreshCw className="h-3 w-3" /> <span className="hidden sm:inline">Refrescar</span>
                            </Button>
                          </div>
                        </div>
                        <motion.div className="space-y-3" variants={stagger} initial="initial" animate="animate">
                          <AnimatePresence mode="popLayout">
                            {filteredSuggestions.map((s, i) => (
                              <motion.div key={s.outfit.id} variants={fadeUp} layout>
                                <OutfitCardRow suggestion={s} rank={i + 1} selected={selectedId === s.outfit.id}
                                  onSelect={() => setSelectedId(selectedId === s.outfit.id ? null : s.outfit.id)}
                                  isFav={isFav(s.outfit.id)} onToggleFav={() => toggleFav(s.outfit.id)}
                                  onViewDetail={() => setDetailOutfit(s)} />
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </motion.div>
                        {filteredSuggestions.length === 0 && searchText && (
                          <div className="text-center py-12 text-white/30 text-sm">No se encontraron resultados para &ldquo;{searchText}&rdquo;</div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="wardrobe" className="mt-6">
              <WardrobeSection />
            </TabsContent>

            <TabsContent value="explore" className="mt-6">
              <ExploreSection favs={favs} isFav={isFav} onToggleFav={toggleFav} onViewDetail={(s: Suggestion) => setDetailOutfit(s)} />
            </TabsContent>

            <TabsContent value="favorites" className="mt-6">
              <FavoritesSection favs={favs} isFav={isFav} onToggleFav={toggleFav} onViewDetail={(s: Suggestion) => setDetailOutfit(s)} />
            </TabsContent>

            <TabsContent value="stats" className="mt-6">
              <StatsSection />
            </TabsContent>
          </Tabs>
        </main>

        <footer className="border-t border-white/[0.04] mt-auto bg-[#0a0a0b]/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[10px] text-white/15">StyleVault v3.0 \u{2014} Inventario personalizado para Enrique Cascante</p>
            <div className="flex items-center gap-3">
              <p className="text-[10px] text-white/15">130 combinaciones</p>
              <div className="w-px h-3 bg-white/10" />
              <p className="text-[10px] text-white/15">46 prendas</p>
              <div className="w-px h-3 bg-white/10" />
              <p className="text-[10px] text-white/15">4 esteticas</p>
            </div>
          </div>
        </footer>
      </div>

      {detailOutfit && (
        <OutfitDetailDialog outfit={detailOutfit} onClose={() => setDetailOutfit(null)} isFav={isFav(detailOutfit.outfit.id)} onToggleFav={() => toggleFav(detailOutfit.outfit.id)} />
      )}
    </div>
  );
}

function OutfitCardRow({ suggestion, rank, selected, onSelect, isFav, onToggleFav, onViewDetail }: {
  suggestion: Suggestion; rank: number; selected: boolean; onSelect: () => void; isFav?: boolean; onToggleFav?: () => void; onViewDetail?: () => void;
}) {
  const { outfit, garments, matchDetails, score } = suggestion;
  const matchCount = [matchDetails.ocasion, matchDetails.momento, matchDetails.clima, matchDetails.estilo].filter(Boolean).length;
  return (
    <Card className={`bg-white/[0.025] border rounded-2xl overflow-hidden transition-all duration-300 group backdrop-blur-sm ${
      selected ? 'border-amber-500/25 shadow-[0_0_30px_-5px_rgba(245,158,11,0.08)]' : 'border-white/[0.05] hover:border-white/[0.1] hover:shadow-lg hover:shadow-black/20'
    }`}>
      <CardContent className="p-0">
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="flex items-center gap-2.5">
            <span className={`text-[11px] font-black tabular-nums w-8 h-8 rounded-lg flex items-center justify-center border ${
              rank === 1 ? 'bg-gradient-to-br from-amber-500/25 to-amber-700/15 border-amber-500/30 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)]' :
              rank === 2 ? 'bg-white/[0.06] border-white/[0.1] text-white/50' :
              rank === 3 ? 'bg-orange-500/10 border-orange-500/15 text-orange-400' :
              'bg-white/[0.03] border-white/[0.06] text-white/25'
            }`}>#{rank}</span>
            <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getScoreBg(score)} ${getScoreColor(score)}`}>{Math.round(score)}%</div>
            <div className={`w-12 h-1.5 rounded-full bg-white/[0.06] overflow-hidden`}><div className={`h-full rounded-full ${getScoreBarColor(score)} transition-all duration-700`} style={{ width: `${score}%` }} /></div>
            <span className="text-[10px] text-white/20">{matchCount}/4</span>
          </div>
          <div className="flex items-center gap-1">
            {onToggleFav && (
              <button className={`h-7 w-7 p-0 rounded-lg transition-all duration-200 flex items-center justify-center ${isFav ? 'text-rose-400 hover:text-rose-300' : 'text-white/15 hover:text-rose-400'}`} onClick={(e) => { e.stopPropagation(); onToggleFav(); }}>
                <Heart className={`h-3.5 w-3.5 transition-all ${isFav ? 'fill-rose-400 scale-110' : ''}`} />
              </button>
            )}
            <button className={`h-7 w-7 p-0 rounded-lg flex items-center justify-center transition-transform duration-300 text-white/15 ${selected ? 'rotate-180' : ''}`} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <button onClick={onSelect} className="w-full text-left px-5 pb-4">
          <h3 className="text-[15px] font-semibold text-white/85 group-hover:text-amber-200 transition-colors leading-tight">{outfit.nombre}</h3>
          <p className="text-xs text-white/35 mt-1.5 line-clamp-2 leading-relaxed">{outfit.descripcion}</p>
          <div className="flex items-center gap-2 mt-4">
            <div className="flex -space-x-1">
              {outfit.paletaColores.map((color, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-[#0a0a0b] shadow-md transition-transform hover:scale-125 hover:z-10 relative" style={{ backgroundColor: color, zIndex: outfit.paletaColores.length - i }} title={color} />
              ))}
            </div>
            <div className="flex-1" />
            <div className="flex flex-wrap gap-1">
              {matchDetails.ocasion && <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400/90 border-emerald-500/15 text-[10px] px-2 py-0 h-5 font-medium">{LABELS.ocasion[outfit.ocasion[0] as keyof typeof LABELS.ocasion]}</Badge>}
              {matchDetails.momento && <Badge variant="secondary" className="bg-sky-500/10 text-sky-400/90 border-sky-500/15 text-[10px] px-2 py-0 h-5 font-medium">{LABELS.momento[outfit.momento[0] as keyof typeof LABELS.momento]}</Badge>}
              {matchDetails.clima && <Badge variant="secondary" className="bg-orange-500/10 text-orange-400/90 border-orange-500/15 text-[10px] px-2 py-0 h-5 font-medium">{LABELS.clima[outfit.clima[0] as keyof typeof LABELS.clima]}</Badge>}
              {matchDetails.estilo && <Badge variant="secondary" className="bg-violet-500/10 text-violet-400/90 border-violet-500/15 text-[10px] px-2 py-0 h-5 font-medium">{LABELS.estilo[outfit.estilo[0] as keyof typeof LABELS.estilo]}</Badge>}
            </div>
          </div>
        </button>
        {selected && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="border-t border-white/[0.05] bg-white/[0.015] px-5 py-4">
            <h4 className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-3">Prendas del Outfit</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {garments.map((g) => (
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
            {onViewDetail && (
              <Button variant="outline" size="sm" className="mt-3 w-full rounded-xl border-white/[0.06] text-white/40 hover:text-amber-400 hover:border-amber-500/20 hover:bg-amber-500/5 text-xs gap-2 transition-all duration-200" onClick={(e) => { e.stopPropagation(); onViewDetail(); }}>
                <Eye className="h-3 w-3" /> Ver Detalle Completo
              </Button>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

function OutfitDetailDialog({ outfit: s, onClose, isFav, onToggleFav }: { outfit: Suggestion; onClose: () => void; isFav: boolean; onToggleFav: () => void }) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#111113] border-white/[0.08] rounded-2xl max-w-lg w-[95vw] p-0 overflow-hidden backdrop-blur-xl">
        <div className="relative">
          <div className="h-32 bg-gradient-to-br from-amber-900/20 via-transparent to-purple-900/10" />
          <div className="absolute -bottom-6 left-6 flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#111113] border-2 border-white/[0.1] flex items-center justify-center shadow-xl">
              <Gem className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </div>
        <div className="px-6 pt-10 pb-6 space-y-5">
          <DialogHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <DialogTitle className="text-xl font-bold text-white/95 leading-tight">{s.outfit.nombre}</DialogTitle>
                <DialogDescription className="text-sm text-white/40 mt-2 leading-relaxed">{s.outfit.descripcion}</DialogDescription>
              </div>
              <button onClick={onToggleFav} className={`h-10 w-10 rounded-xl border flex items-center justify-center transition-all duration-200 flex-shrink-0 ${isFav ? 'border-rose-500/30 bg-rose-500/10 text-rose-400' : 'border-white/[0.06] bg-white/[0.02] text-white/20 hover:text-rose-400'}`}>
                <Heart className={`h-4 w-4 ${isFav ? 'fill-rose-400' : ''}`} />
              </button>
            </div>
          </DialogHeader>
          <div>
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-3">Paleta de Colores</p>
            <div className="flex items-center gap-2">
              {s.outfit.paletaColores.map((c, i) => (
                <div key={i} className="group relative">
                  <div className="w-10 h-10 rounded-xl border-2 border-white/[0.08] shadow-lg transition-transform hover:scale-110" style={{ backgroundColor: c }} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-3">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {s.outfit.ocasion.map((o) => <Badge key={o} className="bg-emerald-500/10 text-emerald-400/90 border-emerald-500/15 text-[10px] font-medium">{LABELS.ocasion[o as keyof typeof LABELS.ocasion]}</Badge>)}
              {s.outfit.momento.map((m) => <Badge key={m} className="bg-sky-500/10 text-sky-400/90 border-sky-500/15 text-[10px] font-medium">{LABELS.momento[m as keyof typeof LABELS.momento]}</Badge>)}
              {s.outfit.clima.map((c) => <Badge key={c} className="bg-orange-500/10 text-orange-400/90 border-orange-500/15 text-[10px] font-medium">{LABELS.clima[c as keyof typeof LABELS.clima]}</Badge>)}
              {s.outfit.estilo.map((e) => <Badge key={e} className="bg-violet-500/10 text-violet-400/90 border-violet-500/15 text-[10px] font-medium">{LABELS.estilo[e as keyof typeof LABELS.estilo]}</Badge>)}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-3">Prendas Incluidas</p>
            <div className="space-y-1.5">
              {s.garments.map((g) => (
                <div key={g.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <span className="text-lg">{g.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 font-medium truncate">{g.nombre}</p>
                    <p className="text-[11px] text-white/30">{g.color}</p>
                  </div>
                  <div className="w-5 h-5 rounded-full border border-white/10" style={{ backgroundColor: g.colorHex }} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className={`text-sm font-bold ${getScoreColor(s.score)}`}>Match: {Math.round(s.score)}%</div>
            <Button onClick={onClose} className="rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-all duration-200 px-6">
              <Sparkles className="h-4 w-4 mr-2" />Usar este Look
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function WardrobeSection() {
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [allItems, setAllItems] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [selectedGarment, setSelectedGarment] = useState<Record<string, unknown> | null>(null);
  const [relatedOutfits, setRelatedOutfits] = useState<OutfitBasic[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/wardrobe');
        const data = await res.json();
        if (!cancelled) {
          setAllItems(data.prendas || []);
          setItems(data.prendas || []);
        }
      } catch (e) { console.error(e); }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleCategory = (cat: string | null) => {
    setCategory(cat);
    setSelectedGarment(null);
    if (cat) setItems(allItems.filter((i) => i.categoria === cat));
    else setItems(allItems);
  };

  const handleGarmentClick = useCallback(async (item: Record<string, unknown>) => {
    setSelectedGarment(item);
    try {
      const res = await fetch('/api/outfits?limit=130');
      const data = await res.json();
      const allOutfits: OutfitBasic[] = data.outfits || [];
      const itemId = item.id as string;
      const related = allOutfits.filter(o => {
        const ids = [o.prendaSuperior, o.pantalon, o.calzado, o.corbata, o.abrigo, ...(o.accesorios || [])].filter(Boolean);
        return ids.includes(itemId);
      });
      setRelatedOutfits(related);
    } catch (e) { console.error(e); }
  }, []);

  const getCount = (catId: string | null) => {
    if (!catId) return allItems.length;
    return allItems.filter((i) => i.categoria === catId).length;
  };

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white/90">Inventario de Guardarropa</h2>
            <p className="text-xs text-white/30 mt-0.5">{allItems.length} prendas en 8 categorias</p>
          </div>
          <div className="text-[10px] text-white/20 font-mono bg-white/[0.02] px-2.5 py-1 rounded-lg border border-white/[0.04]">{items.length} prendas</div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {CATEGORIES.map(cat => {
            const count = getCount(cat.id);
            const isActive = category === cat.id;
            return (
              <Button key={cat.id || 'all'} variant="outline" size="sm"
                className={`rounded-xl text-xs h-9 px-3 gap-1.5 transition-all duration-200 border ${isActive ? 'bg-white/[0.08] border-white/15 text-white shadow-sm' : 'border-white/[0.04] text-white/35 hover:text-white/60 hover:bg-white/[0.04]'}`}
                onClick={() => handleCategory(cat.id)}>
                <span>{cat.emoji}</span><span>{cat.label}</span>
                <Badge variant="secondary" className={`h-4 min-w-4 px-1 text-[9px] font-bold rounded ${isActive ? 'bg-white/10 text-white/70' : 'bg-white/[0.03] text-white/20'}`}>{count}</Badge>
              </Button>
            );
          })}
        </div>
      </motion.div>
      <motion.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3" variants={stagger} initial="initial" animate="animate">
        {items.map(item => (
          <motion.div key={item.id as string} variants={fadeUp} layout>
            <div onClick={() => handleGarmentClick(item)}
              className={`group bg-white/[0.02] border rounded-2xl p-4 transition-all duration-300 cursor-pointer hover:bg-white/[0.05] ${selectedGarment?.id === item.id ? 'border-amber-500/30 shadow-[0_0_20px_-5px_rgba(245,158,11,0.06)]' : 'border-white/[0.04] hover:border-white/[0.08]'}`}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl drop-shadow-lg transition-transform group-hover:scale-110 duration-300">{item.emoji as string}</span>
                <div className="flex flex-col items-end gap-1.5">
                  <div className="w-7 h-7 rounded-full border-2 border-white/[0.08] shadow-inner transition-transform group-hover:scale-110 duration-300" style={{ backgroundColor: item.colorHex as string }} />
                  <span className="text-[9px] text-white/15 font-mono">{item.id as string}</span>
                </div>
              </div>
              <h3 className="text-[11px] font-medium text-white/75 line-clamp-2 leading-relaxed group-hover:text-white/90 transition-colors">{item.nombre as string}</h3>
              {(item.notas as string) && <p className="text-[9px] text-white/15 mt-1 line-clamp-1 italic">{item.notas as string}</p>}
              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-[10px] text-white/25 font-medium">{item.color as string}</span>
                <div className="flex gap-[3px]">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className={`w-[3px] h-3.5 rounded-full transition-all duration-300 ${j < (item.formalidad as number) ? 'bg-amber-500/50' : 'bg-white/[0.04]'}`} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      <AnimatePresence>
        {selectedGarment && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="border-t border-white/[0.05] pt-5">
            <h3 className="text-sm font-semibold text-white/80 mb-1">Outfits con esta prenda</h3>
            <p className="text-[11px] text-white/30 mb-3">{relatedOutfits.length} outfits utilizan esta prenda</p>
            <div className="flex flex-wrap gap-2">
              {relatedOutfits.slice(0, 12).map(o => (
                <div key={o.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] transition-colors">
                  <div className="flex -space-x-1">
                    {o.paletaColores.slice(0, 3).map((c, i) => (
                      <div key={i} className="w-3.5 h-3.5 rounded-full border border-[#0a0a0b]" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <span className="text-[10px] text-white/50 font-medium">{o.nombre}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExploreSection({ favs, isFav, onToggleFav, onViewDetail }: { favs: string[]; isFav: (id: string) => boolean; onToggleFav: (id: string) => void; onViewDetail: (s: Suggestion) => void }) {
  const [allOutfits, setAllOutfits] = useState<OutfitBasic[]>([]);
  const [exploreLoading, setExploreLoading] = useState(false);
  const [filterOcasion, setFilterOcasion] = useState<string | null>(null);
  const [filterEstilo, setFilterEstilo] = useState<string | null>(null);
  const [searchExplore, setSearchExplore] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});

  const loadAll = useCallback(async () => {
    setExploreLoading(true);
    try {
      const res = await fetch('/api/outfits?limit=130');
      const data = await res.json();
      const outfits: OutfitBasic[] = data.outfits || [];
      setAllOutfits(outfits);
      const c: Record<string, number> = { total: outfits.length };
      outfits.forEach((o) => { o.ocasion.forEach((oc) => { c[oc] = (c[oc] || 0) + 1; }); o.estilo.forEach((es) => { c[es] = (c[es] || 0) + 1; }); });
      setCounts(c);
    } catch (e) { console.error(e); }
    finally { setExploreLoading(false); }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const filtered = useMemo(() => {
    let result = allOutfits;
    if (filterOcasion) result = result.filter(o => o.ocasion.includes(filterOcasion));
    if (filterEstilo) result = result.filter(o => o.estilo.includes(filterEstilo));
    if (searchExplore.trim()) {
      const q = searchExplore.toLowerCase();
      result = result.filter(o => o.nombre.toLowerCase().includes(q) || o.descripcion.toLowerCase().includes(q));
    }
    return result;
  }, [allOutfits, filterOcasion, filterEstilo, searchExplore]);

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white/90">Explorar Combinaciones</h2>
            <p className="text-xs text-white/30 mt-0.5">{filtered.length} de {counts.total || 0} outfits</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
            <Input placeholder="Buscar outfit..." value={searchExplore} onChange={e => setSearchExplore(e.target.value)}
              className="h-8 pl-8 pr-8 text-xs bg-white/[0.03] border-white/[0.06] rounded-xl text-white/70 placeholder:text-white/20 focus:border-amber-500/30" />
            {searchExplore && <button onClick={() => setSearchExplore('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50"><X className="h-3 w-3" /></button>}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {[{ value: null, label: 'Todas' }, { value: 'oficina', label: 'Oficina' }, { value: 'oficina_casual', label: 'Casual' }, { value: 'salida', label: 'Salida' }, { value: 'after_office', label: 'After Office' }, { value: 'fin_de_semana', label: 'Fin de Semana' }].map(v => {
            const isActive = filterOcasion === v.value;
            const count = v.value ? (counts[v.value] || 0) : (counts.total || 0);
            return (
              <Button key={v.value || 'all'} size="sm"
                className={`rounded-xl text-[11px] h-8 px-3 gap-1.5 transition-all duration-200 border ${isActive ? 'bg-white/[0.08] border-white/15 text-white shadow-sm' : 'border-white/[0.04] text-white/35 hover:text-white/60 hover:bg-white/[0.04]'}`}
                onClick={() => setFilterOcasion(v.value)}>
                {v.label}<span className={`text-[9px] font-bold px-1.5 py-0 rounded-md ${isActive ? 'bg-white/10' : 'bg-white/[0.03] text-white/20'}`}>{count}</span>
              </Button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {ESTILO_OPTS.map(opt => {
            const isActive = filterEstilo === opt.value;
            return (
              <button key={opt.value} onClick={() => setFilterEstilo(isActive ? null : opt.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-medium transition-all duration-200 ${
                  isActive ? `border-white/15 bg-white/[0.08] ${opt.color}` : 'border-white/[0.04] text-white/30 hover:text-white/50 hover:bg-white/[0.03]'
                }`}>
                {opt.icon}{opt.label}
              </button>
            );
          })}
        </div>
      </motion.div>
      {exploreLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 bg-white/[0.02] rounded-xl border border-white/[0.03]" />)}</div>
      ) : (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-3" variants={stagger} initial="initial" animate="animate">
          {filtered.map(outfit => (
            <motion.div key={outfit.id} variants={fadeUp} layout>
              <Card className={`bg-white/[0.025] border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 group backdrop-blur-sm ${expandedId === outfit.id ? 'border-amber-500/25 shadow-[0_0_20px_-5px_rgba(245,158,11,0.06)]' : 'border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.03]'}`}
                onClick={() => setExpandedId(expandedId === outfit.id ? null : outfit.id)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-semibold text-white/80 group-hover:text-amber-200 transition-colors truncate">{outfit.nombre}</h3>
                      <p className="text-[10px] text-white/30 line-clamp-2 mt-0.5 leading-relaxed">{outfit.descripcion}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={(e) => { e.stopPropagation(); onToggleFav(outfit.id); }} className={`h-6 w-6 flex items-center justify-center rounded-md transition-all ${isFav(outfit.id) ? 'text-rose-400' : 'text-white/10 hover:text-rose-400'}`}>
                        <Heart className={`h-3 w-3 ${isFav(outfit.id) ? 'fill-rose-400' : ''}`} />
                      </button>
                      <ChevronRight className={`h-4 w-4 text-white/15 transition-transform duration-300 ${expandedId === outfit.id ? 'rotate-90 text-amber-400' : ''}`} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3">
                    <div className="flex -space-x-1">
                      {outfit.paletaColores.slice(0, 4).map((c, i) => <div key={i} className="w-4 h-4 rounded-full border border-[#0a0a0b]" style={{ backgroundColor: c }} />)}
                      {outfit.paletaColores.length > 4 && <div className="w-4 h-4 rounded-full bg-white/[0.06] border border-[#0a0a0b] flex items-center justify-center text-[7px] text-white/30 font-bold">+{outfit.paletaColores.length - 4}</div>}
                    </div>
                    <div className="flex-1" />
                    <div className="flex gap-1">
                      {outfit.estilo.slice(0, 2).map((e) => <Badge key={e} className="bg-white/[0.03] text-white/25 text-[8px] px-1.5 py-0 border-0 font-medium">{LABELS.estilo[e as keyof typeof LABELS.estilo]}</Badge>)}
                    </div>
                  </div>
                  {expandedId === outfit.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 pt-3 border-t border-white/[0.05] space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {outfit.ocasion.map((o) => <Badge key={o} className="bg-emerald-500/8 text-emerald-400/80 text-[9px] px-1.5 py-0 border-emerald-500/10 font-medium">{LABELS.ocasion[o as keyof typeof LABELS.ocasion]}</Badge>)}
                        {outfit.momento.map((m) => <Badge key={m} className="bg-sky-500/8 text-sky-400/80 text-[9px] px-1.5 py-0 border-sky-500/10 font-medium">{LABELS.momento[m as keyof typeof LABELS.momento]}</Badge>)}
                        {outfit.clima.map((c) => <Badge key={c} className="bg-orange-500/8 text-orange-400/80 text-[9px] px-1.5 py-0 border-orange-500/10 font-medium">{LABELS.clima[c as keyof typeof LABELS.clima]}</Badge>)}
                      </div>
                      <Button variant="outline" size="sm" className="w-full rounded-xl border-white/[0.06] text-white/40 hover:text-amber-400 hover:border-amber-500/20 text-[10px] gap-1.5 mt-2" onClick={(e) => {
                        e.stopPropagation();
                        fetch(`/api/outfits/${outfit.id}`)
                          .then(r => r.json()).then(data => { if (data.success) onViewDetail({ outfit: data.outfit, garments: data.garments, score: 0, matchDetails: { ocasion: true, momento: true, clima: true, estilo: true } }); });
                      }}>
                        <Eye className="h-3 w-3" /> Ver Detalle
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function FavoritesSection({ favs, isFav, onToggleFav, onViewDetail }: { favs: string[]; isFav: (id: string) => boolean; onToggleFav: (id: string) => void; onViewDetail: (s: Suggestion) => void }) {
  const [items, setItems] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (favs.length === 0) { setItems([]); return; }
    setLoading(true);
    (async () => {
      try {
        const res = await fetch('/api/suggest', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ count: 130 }) });
        const data = await res.json();
        if (data.success) setItems(data.suggestions.filter((s: Suggestion) => favs.includes(s.outfit.id)));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [favs]);

  if (favs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', duration: 0.6 }}>
          <div className="w-20 h-20 rounded-3xl bg-rose-500/5 border border-rose-500/10 flex items-center justify-center mb-6 animate-float">
            <Heart className="h-8 w-8 text-rose-500/20" />
          </div>
          <h2 className="text-xl font-semibold text-white/50 mb-2">Sin favoritos aun</h2>
          <p className="text-sm text-white/25 max-w-sm">Haz clic en el corazon de cualquier outfit para guardarlo aqui.</p>
        </motion.div>
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
        <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-32 bg-white/[0.02] rounded-2xl" />)}</div>
      ) : (
        <motion.div className="space-y-3" variants={stagger} initial="initial" animate="animate">
          {items.map(s => (
            <motion.div key={s.outfit.id} variants={fadeUp}>
              <Card className="bg-white/[0.025] border border-white/[0.05] rounded-2xl p-4 hover:bg-white/[0.04] transition-all duration-300 group backdrop-blur-sm cursor-pointer"
                onClick={() => onViewDetail(s)}>
                <div className="flex items-start gap-4">
                  <div className="flex -space-x-1 flex-shrink-0 pt-1">
                    {s.outfit.paletaColores.slice(0, 4).map((c, i) => (
                      <div key={i} className="w-5 h-5 rounded-full border border-[#0a0a0b]" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white/80 group-hover:text-amber-300 transition-colors">{s.outfit.nombre}</h3>
                    <p className="text-xs text-white/35 mt-1 line-clamp-1 leading-relaxed">{s.outfit.descripcion}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {s.outfit.estilo.map((e) => <Badge key={e} className="bg-violet-500/8 text-violet-400/80 text-[9px] px-1.5 py-0 border-violet-500/10 font-medium">{LABELS.estilo[e as keyof typeof LABELS.estilo]}</Badge>)}
                      {s.outfit.clima.map((c) => <Badge key={c} className="bg-orange-500/8 text-orange-400/80 text-[9px] px-1.5 py-0 border-orange-500/10 font-medium">{LABELS.clima[c as keyof typeof LABELS.clima]}</Badge>)}
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); onToggleFav(s.outfit.id); }} className={`h-8 w-8 flex items-center justify-center rounded-lg flex-shrink-0 transition-all ${isFav(s.outfit.id) ? 'text-rose-400' : 'text-white/10 hover:text-rose-400'}`}>
                    <Heart className={`h-4 w-4 ${isFav(s.outfit.id) ? 'fill-rose-400' : ''}`} />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function StatsSection() {
  const [allOutfits, setAllOutfits] = useState<OutfitBasic[]>([]);
  const [allGarments, setAllGarments] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [oRes, gRes] = await Promise.all([fetch('/api/outfits?limit=130'), fetch('/api/wardrobe')]);
        const [oData, gData] = await Promise.all([oRes.json(), gRes.json()]);
        setAllOutfits(oData.outfits || []);
        setAllGarments(gData.prendas || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const stats = useMemo(() => {
    const ocasionCount: Record<string, number> = {};
    const estiloCount: Record<string, number> = {};
    const momentoCount: Record<string, number> = {};
    const climaCount: Record<string, number> = {};
    const colorCount: Record<string, number> = {};
    const garmentUsage: Record<string, number> = {};

    allOutfits.forEach(o => {
      o.ocasion.forEach(oc => { ocasionCount[oc] = (ocasionCount[oc] || 0) + 1; });
      o.estilo.forEach(es => { estiloCount[es] = (estiloCount[es] || 0) + 1; });
      o.momento.forEach(m => { momentoCount[m] = (momentoCount[m] || 0) + 1; });
      o.clima.forEach(c => { climaCount[c] = (climaCount[c] || 0) + 1; });
      o.paletaColores.forEach(c => { colorCount[c] = (colorCount[c] || 0) + 1; });
      const ids = [o.prendaSuperior, o.pantalon, o.calzado, o.corbata, o.abrigo, ...(o.accesorios || [])].filter(Boolean);
      ids.forEach(id => { garmentUsage[id] = (garmentUsage[id] || 0) + 1; });
    });

    const topColors = Object.entries(colorCount).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const topGarments = Object.entries(garmentUsage).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const maxOcasion = Math.max(...Object.values(ocasionCount), 1);
    const maxEstilo = Math.max(...Object.values(estiloCount), 1);
    const maxMomento = Math.max(...Object.values(momentoCount), 1);
    const maxClima = Math.max(...Object.values(climaCount), 1);

    return { ocasionCount, estiloCount, momentoCount, climaCount, colorCount, topColors, topGarments, maxOcasion, maxEstilo, maxMomento, maxClima };
  }, [allOutfits]);

  if (loading) {
    return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 bg-white/[0.02] rounded-2xl" />)}</div>;
  }

  const topGarmentNames = stats.topGarments.map(([id]) => {
    const g = allGarments.find(x => x.id === id);
    return g ? { id, nombre: g.nombre as string, emoji: g.emoji as string, colorHex: g.colorHex as string, count: stats.topGarments.find(x => x[0] === id)?.[1] || 0 } : { id, nombre: id, emoji: '?', colorHex: '#666', count: stats.topGarments.find(x => x[0] === id)?.[1] || 0 };
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-lg font-bold text-white/90">Estadisticas del Guardarropa</h2>
        <p className="text-xs text-white/30 mt-0.5">Analisis de tus 130 combinaciones y 46 prendas</p>
      </motion.div>

      <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        {[
          { label: 'Total Outfits', value: allOutfits.length, icon: <ShirtIcon className="h-4 w-4" />, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/15' },
          { label: 'Total Prendas', value: allGarments.length, icon: <Layers className="h-4 w-4" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/15' },
          { label: 'Estilos', value: Object.keys(stats.estiloCount).length, icon: <Palette className="h-4 w-4" />, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/15' },
          { label: 'Colores Unicos', value: Object.keys(stats.colorCount).length, icon: <Gem className="h-4 w-4" />, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/15' },
        ].map(s => (
          <Card key={s.label} className={`${s.bg} border rounded-xl p-4 backdrop-blur-sm`}>
            <div className={`${s.color} mb-2`}>{s.icon}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-white/35 font-medium mt-0.5">{s.label}</div>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-white/[0.02] border-white/[0.05] rounded-2xl p-5 backdrop-blur-sm">
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-emerald-400" />Por Ocasion</h3>
            <div className="space-y-3">
              {Object.entries(stats.ocasionCount).sort((a, b) => b[1] - a[1]).map(([key, count]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-white/60 font-medium">{LABELS.ocasion[key as keyof typeof LABELS.ocasion]}</span>
                    <span className="text-[10px] text-white/30 font-mono">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(count / stats.maxOcasion) * 100}%` }} transition={{ duration: 0.8, delay: 0.3 }} className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-white/[0.02] border-white/[0.05] rounded-2xl p-5 backdrop-blur-sm">
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2"><Crown className="h-3.5 w-3.5 text-violet-400" />Por Estilo</h3>
            <div className="space-y-3">
              {Object.entries(stats.estiloCount).sort((a, b) => b[1] - a[1]).map(([key, count]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-white/60 font-medium">{LABELS.estilo[key as keyof typeof LABELS.estilo]}</span>
                    <span className="text-[10px] text-white/30 font-mono">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(count / stats.maxEstilo) * 100}%` }} transition={{ duration: 0.8, delay: 0.4 }} className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-white/[0.02] border-white/[0.05] rounded-2xl p-5 backdrop-blur-sm">
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-sky-400" />Por Momento</h3>
            <div className="space-y-3">
              {Object.entries(stats.momentoCount).sort((a, b) => b[1] - a[1]).map(([key, count]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-white/60 font-medium">{LABELS.momento[key as keyof typeof LABELS.momento]}</span>
                    <span className="text-[10px] text-white/30 font-mono">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(count / stats.maxMomento) * 100}%` }} transition={{ duration: 0.8, delay: 0.5 }} className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-400" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="bg-white/[0.02] border-white/[0.05] rounded-2xl p-5 backdrop-blur-sm">
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2"><Flame className="h-3.5 w-3.5 text-orange-400" />Por Clima</h3>
            <div className="space-y-3">
              {Object.entries(stats.climaCount).sort((a, b) => b[1] - a[1]).map(([key, count]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-white/60 font-medium">{LABELS.clima[key as keyof typeof LABELS.clima]}</span>
                    <span className="text-[10px] text-white/30 font-mono">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(count / stats.maxClima) * 100}%` }} transition={{ duration: 0.8, delay: 0.6 }} className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="bg-white/[0.02] border-white/[0.05] rounded-2xl p-5 backdrop-blur-sm">
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2"><Star className="h-3.5 w-3.5 text-amber-400" />Colores Mas Usados</h3>
          <div className="space-y-2.5">
            {stats.topColors.map(([color, count]) => (
              <div key={color} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg border border-white/10 flex-shrink-0" style={{ backgroundColor: color }} />
                <div className="flex-1 min-w-0">
                  <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(count / stats.topColors[0][1]) * 100}%` }} transition={{ duration: 0.6 }} className="h-full rounded-full" style={{ backgroundColor: color }} />
                  </div>
                </div>
                <span className="text-[10px] text-white/30 font-mono w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card className="bg-white/[0.02] border-white/[0.05] rounded-2xl p-5 backdrop-blur-sm">
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2"><TrendingUp className="h-3.5 w-3.5 text-emerald-400" />Prendas Mas Versatiles</h3>
          <div className="space-y-2">
            {topGarmentNames.map((g, i) => (
              <div key={g.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className={`text-[10px] font-black w-5 text-center ${i === 0 ? 'text-amber-400' : 'text-white/20'}`}>#{i + 1}</span>
                <span className="text-lg">{g.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-white/70 font-medium truncate">{g.nombre}</p>
                </div>
                <div className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: g.colorHex }} />
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.04]">
                  <Zap className="h-2.5 w-2.5 text-amber-400" />
                  <span className="text-[10px] text-white/50 font-bold">{g.count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
