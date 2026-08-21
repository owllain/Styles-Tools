'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  Sparkles, Warehouse, RefreshCw, Eye, Layers, Palette, Dice5, Heart,
  SlidersHorizontal, Briefcase, Shirt, Sun, Moon, CloudSun, Flame, Snowflake,
  Wine, Music, Crown, Search, X, BarChart3, ChevronDown, ChevronRight,
  TrendingUp, ShirtIcon, Clock, MapPin, Zap, Star, Gem,
  Calendar, CalendarDays, Copy, Check, Share2, ArrowLeftRight, Timer, Sparkle, Compass, Award,
  MessageSquare, Send, CheckCircle2, UserCircle, Trash2, Thermometer, CloudRain, FolderOpen, Lock, Unlock, EyeOff,
  Shuffle, Download, Upload
} from 'lucide-react';
import type { Ocasion, Momento, Clima, Estilo } from '@/data/types';
import { LABELS } from '@/data/types';
import { toast } from 'sonner';

interface WeatherData { clima: Clima; tempC: number; tempF: number; description: string; humidity: number; windSpeed: number; location: string }
interface CollectionBasic { id: string; nombre: string; emoji: string; descripcion: string; color: string; outfitCount: number }

const FAVS_KEY = 'stylevault_favorites';
const HISTORY_KEY = 'stylevault_history';
const MAX_HISTORY = 20;
const WEEKLY_KEY = 'stylevault_weekly';
const WORN_KEY = 'stylevault_worn';
const RATINGS_KEY = 'stylevault_ratings';

interface WornEntry { count: number; lastWorn: string; dates: string[] }

interface GarmentDetail {
  id: string; nombre: string; emoji: string; color: string; colorHex: string;
}
interface Suggestion {
  outfit: { id: string; nombre: string; descripcion: string; ocasion: string[]; momento: string[]; clima: string[]; estilo: string[]; paletaColores: string[]; prendaSuperior?: string; pantalon?: string; calzado?: string; corbata?: string; abrigo?: string; accesorios?: string[] };
  score: number;
  matchDetails: { ocasion: boolean; momento: boolean; clima: boolean; estilo: boolean };
  garments: GarmentDetail[];
}
interface OutfitBasic { id: string; nombre: string; descripcion: string; ocasion: string[]; momento: string[]; clima: string[]; estilo: string[]; paletaColores: string[]; prendaSuperior?: string; pantalon?: string; calzado?: string; corbata?: string; abrigo?: string; accesorios?: string[]; }
interface WeeklyDay { day: string; dayLabel: string; dateStr: string; outfit: any; garments: GarmentDetail[]; score: number; }

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

function useWornTracker() {
  const [worn, setWorn] = useState<Record<string, WornEntry>>(() => {
    if (typeof window === 'undefined') return {};
    try { return JSON.parse(localStorage.getItem(WORN_KEY) || '{}'); } catch { return {}; }
  });
  const markWorn = useCallback((id: string) => {
    setWorn(prev => {
      const today = new Date().toISOString().split('T')[0];
      const entry = prev[id] || { count: 0, lastWorn: '', dates: [] };
      const updated = { ...entry, count: entry.count + 1, lastWorn: today, dates: [...new Set([...entry.dates, today])] };
      const next = { ...prev, [id]: updated };
      localStorage.setItem(WORN_KEY, JSON.stringify(next));
      return next;
    });
  }, []);
  return { worn, markWorn };
}

function useRatings() {
  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    if (typeof window === 'undefined') return {};
    try { return JSON.parse(localStorage.getItem(RATINGS_KEY) || '{}'); } catch { return {}; }
  });
  const rate = useCallback((id: string, stars: number) => {
    setRatings(prev => {
      const next = { ...prev, [id]: stars };
      localStorage.setItem(RATINGS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);
  return { ratings, rate };
}

function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 6) return { text: 'Buenas noches', emoji: '\u{1F319}', sub: 'Aun es temprano para planificar' };
  if (h < 12) return { text: 'Buenos dias', emoji: '\u{2600}', sub: 'Comienza el dia con estilo' };
  if (h < 18) return { text: 'Buenas tardes', emoji: '\u{1F324}', sub: 'Tu guardarropa te espera' };
  return { text: 'Buenas noches', emoji: '\u{1F303}', sub: 'Planea tu proximo look' };
}

function getHarmonyScore(colors: string[]): { score: number; label: string; description: string } {
  if (colors.length < 2) return { score: 50, label: 'Neutro', description: 'Datos insuficientes' };
  
  const hexToHSL = (hex: string) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      else if (max === g) h = ((b - r) / d + 2) / 6;
      else h = ((r - g) / d + 4) / 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const hueDiff = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180);

  const hslColors = colors.map(hexToHSL);
  const neutrals = hslColors.filter(c => c.s < 15);
  const chromatics = hslColors.filter(c => c.s >= 15);

  let score = 60; // base

  // Bonus for neutrals (they go with everything)
  score += Math.min(neutrals.length * 5, 10);

  // Chromatic harmony
  if (chromatics.length >= 2) {
    const maxHueDiff = Math.max(...chromatics.flatMap((c, i) => chromatics.slice(i + 1).map(d => hueDiff(c.h, d.h))));
    const avgSat = chromatics.reduce((sum, c) => sum + c.s, 0) / chromatics.length;
    const avgLight = chromatics.reduce((sum, c) => sum + c.l, 0) / chromatics.length;

    if (maxHueDiff < 30 || maxHueDiff > 330) score += 15; // Analogous
    else if (Math.abs(maxHueDiff - 180) < 30) score += 12; // Complementary
    else if (maxHueDiff > 90 && maxHueDiff < 270) score += 8; // Triadic area
    else score += 5;

    if (avgSat < 40) score += 5; // Muted palette bonus
    if (avgLight > 20 && avgLight < 80) score += 5; // Good lightness range
  }

  // Monochrome bonus (very intentional)
  const uniqueHues = new Set(hslColors.filter(c => c.s >= 15).map(c => Math.round(c.h / 15) * 15));
  if (uniqueHues.size <= 2 && hslColors.length >= 3) score += 8;

  score = Math.min(Math.max(score, 30), 98);

  if (score >= 85) return { score, label: 'Armonia Excelente', description: 'Paleta cohesiva y sofisticada' };
  if (score >= 70) return { score, label: 'Buena Armonia', description: 'Combinacion equilibrada y atractiva' };
  if (score >= 55) return { score, label: 'Armonia Moderada', description: 'Funcional con potencial de mejora' };
  return { score, label: 'Contraste Alto', description: 'Combinacion atrevida y audaz' };
}

function copyOutfitToClipboard(outfit: OutfitBasic, garments: GarmentDetail[]) {
  const lines = [
    `\u{1F3AD} ${outfit.nombre}`,
    `${'─'.repeat(30)}`,
    outfit.descripcion,
    '',
    '\u{1F454} PRENDAS:',
    ...garments.map(g => `  ${g.emoji} ${g.nombre} (${g.color})`),
    '',
    `\u{1F3A8} Paleta: ${outfit.paletaColores.join(' ')}`,
    `\u{1F4CD} ${outfit.ocasion.map(o => LABELS.ocasion[o as keyof typeof LABELS.ocasion]).join(', ')}`,
    `\u{23F0} ${outfit.momento.map(m => LABELS.momento[m as keyof typeof LABELS.momento]).join(', ')}`,
    `\u{1F321} ${outfit.clima.map(c => LABELS.clima[c as keyof typeof LABELS.clima]).join(', ')}`,
    `\u{2728} ${outfit.estilo.map(e => LABELS.estilo[e as keyof typeof LABELS.estilo]).join(', ')}`,
    '',
    '— StyleVault para Enrique Cascante',
  ];
  navigator.clipboard.writeText(lines.join('\n')).then(() => {
    toast.success('Outfit copiado al portapapeles');
  }).catch(() => {
    toast.error('No se pudo copiar');
  });
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
  if (score >= 80) return 'text-amber-300';
  if (score >= 60) return 'text-amber-400/80';
  if (score >= 40) return 'text-amber-400/50';
  return 'text-white/30';
}
function getScoreBg(score: number) {
  if (score >= 80) return 'bg-amber-500/10 border-amber-500/15';
  if (score >= 60) return 'bg-amber-500/8 border-amber-500/12';
  if (score >= 40) return 'bg-amber-500/5 border-amber-500/8';
  return 'bg-white/[0.03] border-white/[0.06]';
}
function getScoreBarColor(score: number) {
  if (score >= 80) return 'score-excellent-bar';
  if (score >= 60) return 'score-good-bar';
  if (score >= 40) return 'score-moderate-bar';
  return 'score-low-bar';
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
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [compareData, setCompareData] = useState<Suggestion[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const greeting = useMemo(getTimeGreeting, []);

  const detectWeather = useCallback(async () => {
    setWeatherLoading(true);
    try {
      const res = await fetch('/api/weather');
      const data = await res.json();
      if (data.success) {
        setWeather(data);
        setClima(data.clima as Clima);
        toast.success(`Clima detectado: ${data.description} (${data.tempC}C)`);
      }
    } catch {
      toast.error('No se pudo detectar el clima');
    } finally { setWeatherLoading(false); }
  }, []);
  const { favs, toggle: toggleFav, isFav } = useFavorites();
  const { history, add: addHistory } = useHistory();
  const { worn, markWorn } = useWornTracker();
  const { ratings, rate } = useRatings();
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

  const toggleCompare = useCallback((id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  }, []);

  const runComparison = useCallback(async () => {
    if (compareIds.length !== 2) return;
    setShowComparison(true);
    try {
      const results = await Promise.all(compareIds.map(id => fetch(`/api/outfits/${id}`).then(r => r.json())));
      const data: Suggestion[] = results.map(r => ({
        outfit: r.outfit, garments: r.garments, score: 0,
        matchDetails: { ocasion: true, momento: true, clima: true, estilo: true },
      }));
      setCompareData(data);
    } catch { toast.error('Error cargando outfits para comparar'); }
  }, [compareIds]);

  return (
    <div className="min-h-screen flex flex-col noise-bg gradient-mesh relative overflow-hidden bg-[#08080a]">
      {/* Background orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-amber-900/[0.05] blur-[120px] animate-orb-drift" />
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full bg-purple-900/[0.03] blur-[100px] animate-orb-drift" style={{ animationDelay: '-7s' }} />
        <div className="absolute -bottom-40 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-900/[0.02] blur-[100px] animate-orb-drift" style={{ animationDelay: '-14s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-white/[0.04] bg-[#08080a]/80 backdrop-blur-2xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-amber-700 to-amber-950 flex items-center justify-center shadow-lg shadow-amber-900/30 animate-gradient">
                <Warehouse className="h-4 w-4 text-amber-100" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-white">StyleVault</h1>
                <p className="text-[9px] text-white/25 -mt-0.5 tracking-[0.2em] uppercase font-medium">Enrique Cascante</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              {favs.length > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/8 border border-rose-500/15">
                  <Heart className="h-3 w-3 text-rose-400 fill-rose-400" />
                  <span className="text-[10px] text-rose-300 font-semibold tabular-nums">{favs.length}</span>
                </div>
              )}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.04]">
                <div className="relative w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[10px] text-white/30 font-medium">130 outfits</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-white/[0.025] border border-white/[0.05] rounded-2xl p-1.5 w-full sm:w-auto backdrop-blur-sm">
              <TabsTrigger value="suggest" className="rounded-xl data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-400 data-[state=active]:shadow-[0_0_15px_rgba(245,158,11,0.08)] gap-1.5 text-xs sm:text-sm transition-all duration-300">
                <Sparkles className="h-3.5 w-3.5" /><span className="hidden sm:inline">Sugerencias</span><span className="sm:hidden">AI</span>
              </TabsTrigger>
              <TabsTrigger value="weekly" className="rounded-xl data-[state=active]:bg-white/10 data-[state=active]:text-white gap-1.5 text-xs sm:text-sm transition-all duration-300">
                <Calendar className="h-3.5 w-3.5" /><span className="hidden sm:inline">Semanal</span><span className="sm:hidden">Sem</span>
              </TabsTrigger>
              <TabsTrigger value="wardrobe" className="rounded-xl data-[state=active]:bg-white/10 data-[state=active]:text-white gap-1.5 text-xs sm:text-sm transition-all duration-300">
                <Layers className="h-3.5 w-3.5" /><span className="hidden sm:inline">Inventario</span><span className="sm:hidden">Ropa</span>
              </TabsTrigger>
              <TabsTrigger value="explore" className="rounded-xl data-[state=active]:bg-white/10 data-[state=active]:text-white gap-1.5 text-xs sm:text-sm transition-all duration-300">
                <Compass className="h-3.5 w-3.5" /><span className="hidden sm:inline">Explorar</span><span className="sm:hidden">All</span>
              </TabsTrigger>
              <TabsTrigger value="collections" className="rounded-xl data-[state=active]:bg-sky-500/15 data-[state=active]:text-sky-400 data-[state=active]:shadow-[0_0_15px_rgba(56,189,248,0.08)] gap-1.5 text-xs sm:text-sm transition-all duration-300">
                <FolderOpen className="h-3.5 w-3.5" /><span className="hidden sm:inline">Colecciones</span><span className="sm:hidden">Col</span>
              </TabsTrigger>
              <TabsTrigger value="calendar" className="rounded-xl data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400 data-[state=active]:shadow-[0_0_15px_rgba(16,185,129,0.08)] gap-1.5 text-xs sm:text-sm transition-all duration-300">
                <CalendarDays className="h-3.5 w-3.5" /><span className="hidden sm:inline">Calendario</span><span className="sm:hidden">Cal</span>
              </TabsTrigger>
              <TabsTrigger value="mixmatch" className="rounded-xl data-[state=active]:bg-rose-500/15 data-[state=active]:text-rose-400 data-[state=active]:shadow-[0_0_15px_rgba(244,63,94,0.08)] gap-1.5 text-xs sm:text-sm transition-all duration-300">
                <Shuffle className="h-3.5 w-3.5" /><span className="hidden sm:inline">Mix & Match</span><span className="sm:hidden">Mix</span>
              </TabsTrigger>
              <TabsTrigger value="favorites" className="rounded-xl data-[state=active]:bg-rose-500/15 data-[state=active]:text-rose-400 gap-1.5 text-xs sm:text-sm transition-all duration-300">
                <Heart className="h-3.5 w-3.5" /><span className="hidden sm:inline">Favoritos</span><span className="sm:hidden">{'\u2764'}</span>
              </TabsTrigger>
              <TabsTrigger value="advisor" className="rounded-xl data-[state=active]:bg-violet-500/15 data-[state=active]:text-violet-400 data-[state=active]:shadow-[0_0_15px_rgba(139,92,246,0.08)] gap-1.5 text-xs sm:text-sm transition-all duration-300">
                <MessageSquare className="h-3.5 w-3.5" /><span className="hidden sm:inline">Asesor IA</span><span className="sm:hidden">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="rounded-xl data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400 gap-1.5 text-xs sm:text-sm transition-all duration-300">
                <BarChart3 className="h-3.5 w-3.5" /><span className="hidden sm:inline">Estadisticas</span><span className="sm:hidden">{'\u{1F4CA}'}</span>
              </TabsTrigger>
            </TabsList>

            {/* === SUGERENCIAS TAB === */}
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
                          <CardDescription className="text-[11px] text-white/25">Selecciona el contexto para sugerencias inteligentes</CardDescription>
                        </CardHeader>
                        <CardContent className={`${mobileSettingsOpen ? '' : 'hidden lg:block'} space-y-4 pb-6`}>
                          {/* Look del Dia hero */}
                          <div className="relative rounded-2xl overflow-hidden border border-amber-500/10 bg-gradient-to-br from-amber-900/15 via-amber-950/10 to-transparent p-4 mb-2">
                            <div className="absolute top-2 right-2 text-[10px] font-medium text-amber-400/50 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/10">
                              <Timer className="h-2.5 w-2.5 inline mr-1 -mt-0.5" />{greeting.text.split(' ').pop()}
                            </div>
                            <p className="text-lg mb-0.5">{greeting.emoji}</p>
                            <p className="text-xs font-semibold text-white/70">{greeting.text}, Enrique</p>
                            <p className="text-[10px] text-white/30 mt-0.5">{greeting.sub}</p>
                            <Button size="sm" className="mt-3 h-8 bg-amber-600/80 hover:bg-amber-500 text-[11px] rounded-lg gap-1.5 shadow-lg shadow-amber-900/20 border border-amber-500/20" onClick={getRandomOutfit} disabled={randomLoading}>
                              {randomLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Sparkle className="h-3 w-3" />}
                              Look del Dia
                            </Button>
                          </div>

                          {/* Quick Presets */}
                          <div>
                            <label className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-2 block">Quick Presets</label>
                            <div className="grid grid-cols-2 gap-1.5">
                              {PRESETS.map(p => (
                                <button key={p.name} onClick={() => applyPreset(p)}
                                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl border border-white/[0.04] bg-white/[0.015] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-200 text-left group">
                                  <span className="text-sm group-hover:scale-110 transition-transform duration-200">{p.emoji}</span>
                                  <span className="text-[10px] text-white/45 group-hover:text-white/75 font-medium leading-tight transition-colors">{p.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                          <Separator className="bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                          {/* Ocasion */}
                          <div>
                            <label className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-2.5 block">Ocasion</label>
                            <div className="space-y-1">
                              {OCASION_OPTS.map(opt => (
                                <button key={opt.value} onClick={() => setOcasion(ocasion === opt.value ? null : opt.value)}
                                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 border ${
                                    ocasion === opt.value
                                      ? `bg-gradient-to-r ${opt.accent} border-white/10 text-white shadow-sm`
                                      : 'bg-white/[0.015] border-white/[0.03] text-white/40 hover:bg-white/[0.04] hover:text-white/60'
                                  }`}>
                                  <div className={`p-1.5 rounded-lg transition-colors ${ocasion === opt.value ? 'bg-white/10' : 'bg-white/[0.03]'}`}>{opt.icon}</div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium truncate">{LABELS.ocasion[opt.value]}</div>
                                    <div className={`text-[10px] mt-0.5 transition-colors ${ocasion === opt.value ? 'text-white/45' : 'text-white/18'}`}>{opt.desc}</div>
                                  </div>
                                  {ocasion === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white/60 shadow-[0_0_6px_rgba(255,255,255,0.3)]" />}
                                </button>
                              ))}
                            </div>
                          </div>
                          <Separator className="bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                          {/* Momento */}
                          <div>
                            <label className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-2.5 block">Momento</label>
                            <div className="grid grid-cols-3 gap-1.5">
                              {MOMENTO_OPTS.map(opt => (
                                <button key={opt.value} onClick={() => setMomento(momento === opt.value ? null : opt.value)}
                                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all duration-200 ${
                                    momento === opt.value ? 'bg-white/[0.08] border-white/15 text-white shadow-sm' : 'bg-white/[0.015] border-white/[0.03] text-white/35 hover:bg-white/[0.04]'
                                  }`}>
                                  {opt.icon}<span className="text-[10px] font-medium">{LABELS.momento[opt.value]}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                          <Separator className="bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                          {/* Clima */}
                          <div>
                            <div className="flex items-center justify-between mb-2.5">
                              <label className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em]">Clima</label>
                              <button onClick={detectWeather} disabled={weatherLoading}
                                className="flex items-center gap-1 text-[9px] text-amber-400/60 hover:text-amber-400 transition-colors disabled:opacity-30">
                                {weatherLoading ? <RefreshCw className="h-2.5 w-2.5 animate-spin" /> : <Thermometer className="h-2.5 w-2.5" />}
                                Auto-detectar
                              </button>
                            </div>
                            {weather && (
                              <div className="weather-badge glass-amber rounded-xl px-3 py-2 mb-2 flex items-center gap-2">
                                <CloudRain className="h-3.5 w-3.5 text-sky-400" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] text-white/60 font-medium">{weather.description}</p>
                                  <p className="text-[9px] text-white/30">{weather.tempC}C · Humedad {weather.humidity}%</p>
                                </div>
                                <span className="text-[10px] font-bold text-amber-400 tabular-nums">{weather.tempC}°</span>
                              </div>
                            )}
                            <div className="grid grid-cols-3 gap-1.5">
                              {CLIMA_OPTS.map(opt => (
                                <button key={opt.value} onClick={() => setClima(clima === opt.value ? null : opt.value)}
                                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all duration-200 ${
                                    clima === opt.value ? 'bg-white/[0.08] border-white/15 text-white shadow-sm' : 'bg-white/[0.015] border-white/[0.03] text-white/35 hover:bg-white/[0.04]'
                                  }`}>
                                  {opt.icon}<span className="text-[10px] font-medium">{LABELS.clima[opt.value]}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                          <Separator className="bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                          {/* Estetica */}
                          <div>
                            <label className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-2.5 block">Estetica</label>
                            <div className="grid grid-cols-2 gap-1.5">
                              {ESTILO_OPTS.map(opt => (
                                <button key={opt.value} onClick={() => setEstilo(estilo === opt.value ? null : opt.value)}
                                  className={`px-3 py-2.5 rounded-xl border text-center transition-all duration-200 flex items-center justify-center gap-2 ${
                                    estilo === opt.value ? 'bg-white/[0.08] border-white/15 shadow-sm' : 'bg-white/[0.015] border-white/[0.03] text-white/35 hover:bg-white/[0.04]'
                                  }`}>
                                  <span className={estilo === opt.value ? opt.color : 'text-white/18'}>{opt.icon}</span>
                                  <span className={`text-[11px] font-medium ${estilo === opt.value ? 'text-white' : ''}`}>{opt.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                          <Button onClick={getSuggestions} disabled={loading}
                            className="w-full h-12 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 hover:from-amber-500 hover:via-amber-600 hover:to-amber-800 text-amber-50 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-amber-900/25 hover:shadow-amber-800/30 border border-amber-600/20">
                            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <><Sparkles className="h-4 w-4 mr-2" />Generar Sugerencias</>}
                          </Button>
                          {/* Compare button */}
                          {compareIds.length > 0 && (
                            <Button onClick={runComparison} disabled={compareIds.length < 2}
                              variant="outline" className="w-full h-10 rounded-xl border-white/[0.06] text-white/40 hover:text-amber-400 hover:border-amber-500/20 text-xs gap-2 transition-all">
                              <ArrowLeftRight className="h-3.5 w-3.5" />
                              Comparar ({compareIds.length}/2)
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </div>

                <div className="lg:col-span-8 xl:col-span-9">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                    {/* Empty state */}
                    {suggestions.length === 0 && !loading && (
                      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, type: 'spring' }}>
                          <div className="relative mb-8">
                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/[0.07] flex items-center justify-center animate-float-slow backdrop-blur-sm">
                              <Palette className="h-10 w-10 text-white/12" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center animate-pulse">
                              <Dice5 className="h-4 w-4 text-amber-400" />
                            </div>
                          </div>
                          <h2 className="text-2xl font-bold text-white/50 mb-2">{'\u00bf'}Que te vas a poner hoy?</h2>
                          <p className="text-sm text-white/20 max-w-md mb-8 leading-relaxed">
                            Configura tu ocasion, momento, clima y estetica para obtener sugerencias personalizadas de tu guardarropa.
                          </p>
                          <Button variant="outline" size="lg" className="rounded-2xl border-white/[0.08] text-white/35 hover:text-amber-400 hover:border-amber-500/25 hover:bg-amber-500/5 gap-2 px-6 transition-all duration-300" onClick={getRandomOutfit} disabled={randomLoading}>
                            {randomLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Dice5 className="h-4 w-4" />}
                            Sorprendeme
                          </Button>
                          {history.length > 0 && (
                            <div className="mt-8">
                              <p className="text-[10px] text-white/15 uppercase tracking-[0.15em] mb-3 font-semibold">Recientes</p>
                              <div className="flex gap-1.5 justify-center flex-wrap max-w-lg">
                                {history.slice(0, 8).map(id => (
                                  <span key={id} className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.025] border border-white/[0.04] text-white/20 font-mono">{id}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </div>
                    )}
                    {/* Loading */}
                    {loading && (
                      <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                            <Skeleton className="h-48 bg-white/[0.02] rounded-2xl border border-white/[0.03]" />
                          </motion.div>
                        ))}
                      </div>
                    )}
                    {/* Results */}
                    {suggestions.length > 0 && !loading && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between px-1 gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative flex-1 max-w-xs">
                              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/15" />
                              <Input placeholder="Filtrar sugerencias..." value={searchText} onChange={e => setSearchText(e.target.value)}
                                className="h-8 pl-8 pr-8 text-xs bg-white/[0.025] border-white/[0.05] rounded-xl text-white/65 placeholder:text-white/15 focus:border-amber-500/25 focus:ring-amber-500/10" />
                              {searchText && <button onClick={() => setSearchText('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/15 hover:text-white/40"><X className="h-3 w-3" /></button>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/35">
                              <span className="text-amber-400/70 font-bold tabular-nums">{filteredSuggestions.length}</span>
                              <span>resultados</span>
                              <div className="w-px h-3 bg-white/[0.08] mx-1" />
                              <span className="text-[10px] text-white/20">de {totalAvailable} matching</span>
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs text-white/25 hover:text-amber-400 h-7 gap-1" onClick={getRandomOutfit} disabled={randomLoading}>
                              <Dice5 className="h-3 w-3" /> <span className="hidden sm:inline">Random</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="text-xs text-amber-500/50 hover:text-amber-400 h-7 gap-1" onClick={getSuggestions}>
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
                                  onViewDetail={() => setDetailOutfit(s)}
                                  onShare={() => copyOutfitToClipboard(s.outfit, s.garments)}
                                  compareMode={compareIds.length > 0}
                                  isComparing={compareIds.includes(s.outfit.id)}
                                  onToggleCompare={() => toggleCompare(s.outfit.id)}
                                  rating={ratings[s.outfit.id]} onRate={rate} />
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </motion.div>
                        {filteredSuggestions.length === 0 && searchText && (
                          <div className="text-center py-12 text-white/25 text-sm">No se encontraron resultados para &ldquo;{searchText}&rdquo;</div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </TabsContent>

            {/* === WEEKLY TAB === */}
            <TabsContent value="weekly" className="mt-6">
              <WeeklyPlannerSection favs={favs} isFav={isFav} onToggleFav={toggleFav} onViewDetail={(s: Suggestion) => setDetailOutfit(s)} />
            </TabsContent>

            {/* === WARDROBE TAB === */}
            <TabsContent value="wardrobe" className="mt-6">
              <WardrobeSection />
            </TabsContent>

            {/* === EXPLORE TAB === */}
            <TabsContent value="explore" className="mt-6">
              <ExploreSection favs={favs} isFav={isFav} onToggleFav={toggleFav} onViewDetail={(s: Suggestion) => setDetailOutfit(s)} />
            </TabsContent>

            {/* === COLLECTIONS TAB === */}
            <TabsContent value="collections" className="mt-6">
              <CollectionsSection favs={favs} isFav={isFav} onToggleFav={toggleFav} onViewDetail={(s: Suggestion) => setDetailOutfit(s)} />
            </TabsContent>

            {/* === CALENDAR TAB === */}
            <TabsContent value="calendar" className="mt-6">
              <WornCalendarSection worn={worn} onViewDetail={(s: Suggestion) => setDetailOutfit(s)} />
            </TabsContent>

            {/* === MIX & MATCH TAB === */}
            <TabsContent value="mixmatch" className="mt-6">
              <MixMatchSection onViewDetail={(s: Suggestion) => setDetailOutfit(s)} />
            </TabsContent>

            {/* === FAVORITES TAB === */}
            <TabsContent value="favorites" className="mt-6">
              <FavoritesSection favs={favs} isFav={isFav} onToggleFav={toggleFav} onViewDetail={(s: Suggestion) => setDetailOutfit(s)} />
            </TabsContent>

            {/* === AI ADVISOR TAB === */}
            <TabsContent value="advisor" className="mt-6">
              <AdvisorSection />
            </TabsContent>

            {/* === STATS TAB === */}
            <TabsContent value="stats" className="mt-6">
              <StatsSection worn={worn} ratings={ratings} favs={favs} />
            </TabsContent>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/[0.03] mt-auto bg-[#08080a]/60 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-amber-500/25 to-amber-900/20 flex items-center justify-center">
                <Warehouse className="h-2.5 w-2.5 text-amber-400/50" />
              </div>
              <p className="text-[10px] text-white/12 font-medium">StyleVault v7.0 \u{2014} Enrique Cascante</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-white/10 font-medium">
              <span>130 outfits</span>
              <div className="w-px h-2.5 bg-white/[0.04]" />
              <span>46 prendas</span>
              <div className="w-px h-2.5 bg-white/[0.04]" />
              <span>4 esteticas</span>
              <div className="w-px h-2.5 bg-white/[0.04]" />
              <span className="text-sky-400/30">Calendario + Mix & Match</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Outfit Detail Dialog */}
      {detailOutfit && (
        <OutfitDetailDialog
          outfit={detailOutfit}
          onClose={() => setDetailOutfit(null)}
          isFav={isFav(detailOutfit.outfit.id)}
          onToggleFav={() => toggleFav(detailOutfit.outfit.id)}
          worn={worn[detailOutfit.outfit.id]}
          rating={ratings[detailOutfit.outfit.id]}
          onRate={(id: string, stars: number) => rate(id, stars)}
          onMarkWorn={(id: string) => { markWorn(id); toast.success('Look registrado como vestido'); }}
        />
      )}

      {/* Comparison Dialog */}
      {showComparison && (
        <ComparisonDialog outfits={compareData} onClose={() => { setShowComparison(false); setCompareIds([]); setCompareData([]); }} />
      )}
    </div>
  );
}

/* ============================================================
   OUTFIT CARD ROW (Suggestions Tab)
   ============================================================ */
function OutfitCardRow({ suggestion, rank, selected, onSelect, isFav, onToggleFav, onViewDetail, onShare, compareMode, isComparing, onToggleCompare, rating, onRate }: {
  suggestion: Suggestion; rank: number; selected: boolean; onSelect: () => void; isFav?: boolean; onToggleFav?: () => void; onViewDetail?: () => void; onShare?: () => void; compareMode?: boolean; isComparing?: boolean; onToggleCompare?: () => void; rating?: number; onRate?: (id: string, stars: number) => void;
}) {
  const { outfit, garments, matchDetails, score } = suggestion;
  const matchCount = [matchDetails.ocasion, matchDetails.momento, matchDetails.clima, matchDetails.estilo].filter(Boolean).length;
  const harmony = getHarmonyScore(outfit.paletaColores);
  return (
    <Card className={`outfit-card-refined border rounded-2xl overflow-hidden transition-all duration-300 group backdrop-blur-sm weekly-card-shine {
      isComparing ? 'border-amber-500/30 shadow-[0_0_25px_-5px_rgba(245,158,11,0.1)] animate-glow-pulse' :
      selected ? 'border-amber-500/20 shadow-[0_0_30px_-5px_rgba(245,158,11,0.06)]' : 'border-white/[0.04] hover:border-white/[0.08] hover:shadow-lg hover:shadow-black/20'
    }`}>
      <CardContent className="p-0">
        {/* Top bar: rank + score + actions */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-2.5">
            <span className={`text-[11px] font-black tabular-nums w-8 h-8 rounded-lg flex items-center justify-center border ${
              rank === 1 ? 'bg-gradient-to-br from-amber-500/25 to-amber-700/15 border-amber-500/30 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.12)]' :
              rank === 2 ? 'bg-white/[0.05] border-white/[0.08] text-white/45' :
              rank === 3 ? 'bg-orange-500/8 border-orange-500/12 text-orange-400/80' :
              'bg-white/[0.02] border-white/[0.05] text-white/20'
            }`}>#{rank}</span>
            <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getScoreBg(score)} ${getScoreColor(score)}`}>{Math.round(score)}%</div>
            <div className={`w-12 h-1.5 rounded-full bg-white/[0.04] overflow-hidden`}><div className={`h-full rounded-full ${getScoreBarColor(score)} transition-all duration-700`} style={{ width: `${score}%` }} /></div>
            <span className="text-[10px] text-white/18">{matchCount}/4</span>
            {/* Harmony mini indicator */}
            <div className="hidden sm:flex items-center gap-1 ml-1">
              <div className={`w-1.5 h-1.5 rounded-full ${harmony.score >= 75 ? 'bg-amber-400' : harmony.score >= 55 ? 'bg-amber-400/60' : 'bg-amber-400/30'}`} />
              <span className="text-[9px] text-white/15 font-mono">{harmony.score}</span>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            {compareMode && onToggleCompare && (
              <button className={`h-7 w-7 p-0 rounded-lg transition-all duration-200 flex items-center justify-center ${isComparing ? 'text-amber-400 bg-amber-500/10' : 'text-white/10 hover:text-amber-400 hover:bg-amber-500/5'}`} onClick={(e) => { e.stopPropagation(); onToggleCompare(); }} title="Comparar">
                <ArrowLeftRight className="h-3 w-3" />
              </button>
            )}
            {onShare && (
              <button className="h-7 w-7 p-0 rounded-lg transition-all duration-200 flex items-center justify-center text-white/10 hover:text-white/40" onClick={(e) => { e.stopPropagation(); onShare(); }} title="Compartir">
                <Share2 className="h-3 w-3" />
              </button>
            )}
            {onToggleFav && (
              <button className={`h-7 w-7 p-0 rounded-lg transition-all duration-200 flex items-center justify-center ${isFav ? 'text-rose-400 hover:text-rose-300' : 'text-white/10 hover:text-rose-400'}`} onClick={(e) => { e.stopPropagation(); onToggleFav(); }}>
                <Heart className={`h-3.5 w-3.5 transition-all ${isFav ? 'fill-rose-400 scale-110' : ''}`} />
              </button>
            )}
            <button className={`h-7 w-7 p-0 rounded-lg flex items-center justify-center transition-transform duration-300 text-white/12 ${selected ? 'rotate-180' : ''}`} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        {/* Main content */}
        <button onClick={onSelect} className="w-full text-left px-6 pb-5">
          <h3 className="text-[15px] font-semibold text-white/90 group-hover:text-amber-200 transition-colors leading-tight">{outfit.nombre}</h3>
          {rating !== undefined && (
            <div className="flex items-center gap-0.5 mt-1.5">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} className="star-btn" onClick={(e) => { e.stopPropagation(); if (onRate) onRate(s.outfit.id, n); }}>
                  <Star className={`h-3 w-3 ${n <= (rating || 0) ? 'star-filled' : 'star-empty'}`} />
                </button>
              ))}
            </div>
          )}
          <p className="text-xs text-white/45 mt-1.5 line-clamp-2 leading-relaxed">{outfit.descripcion}</p>
          <div className="flex items-center gap-2 mt-4">
            <div className="flex -space-x-1">
              {outfit.paletaColores.map((color, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-[#0a0a0b] shadow-md transition-transform hover:scale-125 hover:z-10 relative" style={{ backgroundColor: color, zIndex: outfit.paletaColores.length - i }} title={color} />
              ))}
            </div>
            <div className="flex-1" />
            <div className="flex flex-wrap gap-1">
              {matchDetails.ocasion && <Badge variant="secondary" className="tag-ocasion border text-[10px] px-2.5 py-0 h-5 font-medium">{LABELS.ocasion[outfit.ocasion[0] as keyof typeof LABELS.ocasion]}</Badge>}
              {matchDetails.momento && <Badge variant="secondary" className="tag-momento border text-[10px] px-2.5 py-0 h-5 font-medium">{LABELS.momento[outfit.momento[0] as keyof typeof LABELS.momento]}</Badge>}
              {matchDetails.clima && <Badge variant="secondary" className="tag-clima border text-[10px] px-2.5 py-0 h-5 font-medium">{LABELS.clima[outfit.clima[0] as keyof typeof LABELS.clima]}</Badge>}
              {matchDetails.estilo && <Badge variant="secondary" className="tag-estilo border text-[10px] px-2.5 py-0 h-5 font-medium">{LABELS.estilo[outfit.estilo[0] as keyof typeof LABELS.estilo]}</Badge>}
            </div>
          </div>
        </button>
        {/* Expanded garment list */}
        <AnimatePresence>
          {selected && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="border-t border-white/[0.04] bg-white/[0.01] px-6 py-4">
              <h4 className="text-[10px] font-semibold text-white/25 uppercase tracking-[0.15em] mb-3">Prendas del Outfit</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {garments.map((g) => (
                  <div key={g.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04] transition-colors">
                    <span className="text-base">{g.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-white/65 truncate font-medium">{g.nombre}</p>
                      <p className="text-[10px] text-white/20">{g.color}</p>
                    </div>
                    <div className="w-4 h-4 rounded-full border border-white/[0.08] flex-shrink-0" style={{ backgroundColor: g.colorHex }} />
                  </div>
                ))}
              </div>
              {onViewDetail && (
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1 rounded-xl border-white/[0.05] text-white/35 hover:text-amber-400 hover:border-amber-500/20 hover:bg-amber-500/5 text-xs gap-2 transition-all duration-200" onClick={(e) => { e.stopPropagation(); onViewDetail(); }}>
                    <Eye className="h-3 w-3" /> Ver Detalle
                  </Button>
                  {onShare && (
                    <Button variant="outline" size="sm" className="rounded-xl border-white/[0.05] text-white/35 hover:text-white/60 hover:border-white/[0.1] text-xs gap-2 transition-all duration-200" onClick={(e) => { e.stopPropagation(); onShare(); }}>
                      <Share2 className="h-3 w-3" /> Compartir
                    </Button>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

/* ============================================================
   OUTFIT DETAIL DIALOG (Enhanced with Color Harmony)
   ============================================================ */
function OutfitDetailDialog({ outfit: s, onClose, isFav, onToggleFav, worn, rating, onRate, onMarkWorn }: { outfit: Suggestion; onClose: () => void; isFav: boolean; onToggleFav: () => void; worn?: WornEntry; rating?: number; onRate: (id: string, stars: number) => void; onMarkWorn: (id: string) => void; }) {
  const [copied, setCopied] = useState(false);
  const harmony = getHarmonyScore(s.outfit.paletaColores);

  const handleCopy = () => {
    copyOutfitToClipboard(s.outfit, s.garments);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#111113] border-white/[0.07] rounded-2xl max-w-lg w-[95vw] p-0 overflow-hidden backdrop-blur-xl">
        {/* Header gradient */}
        <div className="relative">
          <div className="h-36 bg-gradient-to-br from-amber-900/15 via-purple-900/10 to-transparent relative overflow-hidden">
            <div className="absolute inset-0 opacity-30" style={{ background: `linear-gradient(135deg, ${s.outfit.paletaColores[0]}20 0%, transparent 50%, ${s.outfit.paletaColores[s.outfit.paletaColores.length - 1]}15 100%)` }} />
          </div>
          <div className="absolute -bottom-6 left-6 flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#111113] border-2 border-white/[0.08] flex items-center justify-center shadow-xl">
              <Gem className="h-6 w-6 text-amber-400" />
            </div>
          </div>
          {/* Close button */}
          <button onClick={onClose} className="absolute top-3 right-3 h-8 w-8 rounded-lg bg-black/30 backdrop-blur-sm border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white/70 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 pt-10 pb-6 space-y-5">
          <DialogHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <DialogTitle className="text-xl font-bold text-white/90 leading-tight">{s.outfit.nombre}</DialogTitle>
                <DialogDescription className="text-sm text-white/35 mt-2 leading-relaxed">{s.outfit.descripcion}</DialogDescription>
              </div>
              <button onClick={onToggleFav} className={`h-10 w-10 rounded-xl border flex items-center justify-center transition-all duration-200 flex-shrink-0 ${isFav ? 'border-rose-500/25 bg-rose-500/10 text-rose-400' : 'border-white/[0.05] bg-white/[0.02] text-white/15 hover:text-rose-400'}`}>
                <Heart className={`h-4 w-4 ${isFav ? 'fill-rose-400' : ''}`} />
              </button>
            </div>
          </DialogHeader>

          {/* Color Palette + Harmony */}
          <div className="grid grid-cols-[1fr_auto] gap-4">
            <div>
              <p className="text-[10px] font-semibold text-white/25 uppercase tracking-[0.15em] mb-3">Paleta de Colores</p>
              <div className="flex items-center gap-2">
                {s.outfit.paletaColores.map((c, i) => (
                  <div key={i} className="group relative">
                    <div className="w-10 h-10 rounded-xl border-2 border-white/[0.06] shadow-lg transition-transform hover:scale-110" style={{ backgroundColor: c }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold text-white/25 uppercase tracking-[0.15em] mb-1">Armonia</p>
              <div className={`text-2xl font-black tabular-nums ${harmony.score >= 75 ? 'text-emerald-400' : harmony.score >= 55 ? 'text-amber-400' : 'text-orange-400'}`}>{harmony.score}</div>
              <p className="text-[9px] text-white/25 mt-0.5">{harmony.label}</p>
            </div>
          </div>

          {/* Harmony description */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${harmony.score >= 75 ? 'bg-emerald-500/5 border-emerald-500/10' : harmony.score >= 55 ? 'bg-amber-500/5 border-amber-500/10' : 'bg-orange-500/5 border-orange-500/10'}`}>
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${harmony.score >= 75 ? 'bg-emerald-400' : harmony.score >= 55 ? 'bg-amber-400' : 'bg-orange-400'}`} />
            <p className="text-[10px] text-white/35">{harmony.description}</p>
          </div>

          {/* Tags */}
          <div>
            <p className="text-[10px] font-semibold text-white/25 uppercase tracking-[0.15em] mb-3">Contexto</p>
            <div className="flex flex-wrap gap-1.5">
              {s.outfit.ocasion.map((o) => <Badge key={o} className="bg-emerald-500/8 text-emerald-400/80 border-emerald-500/12 text-[10px] font-medium">{LABELS.ocasion[o as keyof typeof LABELS.ocasion]}</Badge>)}
              {s.outfit.momento.map((m) => <Badge key={m} className="bg-sky-500/8 text-sky-400/80 border-sky-500/12 text-[10px] font-medium">{LABELS.momento[m as keyof typeof LABELS.momento]}</Badge>)}
              {s.outfit.clima.map((c) => <Badge key={c} className="bg-orange-500/8 text-orange-400/80 border-orange-500/12 text-[10px] font-medium">{LABELS.clima[c as keyof typeof LABELS.clima]}</Badge>)}
              {s.outfit.estilo.map((e) => <Badge key={e} className="bg-violet-500/8 text-violet-400/80 border-violet-500/12 text-[10px] font-medium">{LABELS.estilo[e as keyof typeof LABELS.estilo]}</Badge>)}
            </div>
          </div>

          {/* Garments */}
          <div>
            <p className="text-[10px] font-semibold text-white/25 uppercase tracking-[0.15em] mb-3">Prendas Incluidas</p>
            <div className="space-y-1.5">
              {s.garments.map((g) => (
                <div key={g.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.025] border border-white/[0.04] hover:bg-white/[0.035] transition-colors">
                  <span className="text-lg">{g.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/75 font-medium truncate">{g.nombre}</p>
                    <p className="text-[11px] text-white/25">{g.color}</p>
                  </div>
                  <div className="w-5 h-5 rounded-full border border-white/[0.08]" style={{ backgroundColor: g.colorHex }} />
                </div>
              ))}
            </div>
          </div>

          {/* Rating + Worn info */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-semibold text-white/25 uppercase tracking-[0.15em] mb-1">Tu Valoracion</p>
              <div className="flex gap-0.5" onClick={(e) => { e.stopPropagation(); rate(s.outfit.id, 5); }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} className="transition-transform hover:scale-125" onClick={(e) => { e.stopPropagation(); rate(s.outfit.id, n); }}>
                    <Star className={`h-5 w-5 transition-colors ${n <= (ratings[s.outfit.id] || 0) ? 'text-amber-400 fill-amber-400' : 'text-white/15 hover:text-amber-400/50'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-white/25">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400/60" />
              <span>Vestido {worn[s.outfit.id]?.count || 0} veces</span>
            </div>
          </div>

          {/* Action bar */}
          <div className="flex items-center justify-between pt-2 gap-3">
            <div className="flex items-center gap-2">
              {s.score > 0 && <div className={`text-sm font-bold ${getScoreColor(s.score)}`}>Match: {Math.round(s.score)}%</div>}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-xl border-white/[0.05] text-white/35 hover:text-white/60 text-xs gap-2 h-9" onClick={handleCopy}>
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copiado' : 'Copiar'}
              </Button>
              <Button onClick={onClose} className="rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-all duration-200 px-5 h-9">
                <Sparkles className="h-4 w-4 mr-2" />Usar este Look
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ============================================================
   COMPARISON DIALOG
   ============================================================ */
function ComparisonDialog({ outfits, onClose }: { outfits: Suggestion[]; onClose: () => void }) {
  if (outfits.length !== 2) return null;
  const [a, b] = outfits;
  const hA = getHarmonyScore(a.outfit.paletaColores);
  const hB = getHarmonyScore(b.outfit.paletaColores);
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#111113] border-white/[0.07] rounded-2xl max-w-3xl w-[95vw] p-0 overflow-hidden backdrop-blur-xl max-h-[85vh] overflow-y-auto">
        <div className="p-6 space-y-5">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white/90 flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-amber-400" />Comparacion de Outfits
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[a, b].map((s, i) => {
              const h = i === 0 ? hA : hB;
              return (
                <div key={s.outfit.id} className="bg-white/[0.025] border border-white/[0.05] rounded-2xl p-5 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white/85">{s.outfit.nombre}</h3>
                    <p className="text-xs text-white/30 mt-1 line-clamp-2">{s.outfit.descripcion}</p>
                  </div>
                  <div className="flex -space-x-1">{s.outfit.paletaColores.map((c, j) => <div key={j} className="w-6 h-6 rounded-full border-2 border-[#111113]" style={{ backgroundColor: c }} />)}</div>
                  <div className="flex flex-wrap gap-1">
                    {s.outfit.estilo.map(e => <Badge key={e} className="bg-violet-500/8 text-violet-400/80 text-[9px] px-1.5 py-0 border-violet-500/10">{LABELS.estilo[e as keyof typeof LABELS.estilo]}</Badge>)}
                    {s.outfit.clima.map(c => <Badge key={c} className="bg-orange-500/8 text-orange-400/80 text-[9px] px-1.5 py-0 border-orange-500/10">{LABELS.clima[c as keyof typeof LABELS.clima]}</Badge>)}
                  </div>
                  <div className="text-[10px] text-white/20 uppercase tracking-wider font-semibold pt-2 border-t border-white/[0.04]">Prendas</div>
                  {s.garments.map(g => (
                    <div key={g.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/[0.02]">
                      <span className="text-sm">{g.emoji}</span>
                      <span className="text-[11px] text-white/60 truncate flex-1">{g.nombre}</span>
                      <div className="w-3 h-3 rounded-full border border-white/[0.06]" style={{ backgroundColor: g.colorHex }} />
                    </div>
                  ))}
                  <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl border ${h.score >= 75 ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-amber-500/5 border-amber-500/10'}`}>
                    <span className="text-[10px] text-white/30 font-medium">Armonia</span>
                    <span className={`text-sm font-bold tabular-nums ${h.score >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>{h.score}%</span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Comparison summary */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-[9px] text-white/25 uppercase tracking-wider mb-1">Colores A</p>
                <p className="text-lg font-bold text-white/60 tabular-nums">{a.outfit.paletaColores.length}</p>
              </div>
              <div>
                <p className="text-[9px] text-white/25 uppercase tracking-wider mb-1">Colores B</p>
                <p className="text-lg font-bold text-white/60 tabular-nums">{b.outfit.paletaColores.length}</p>
              </div>
              <div>
                <p className="text-[9px] text-white/25 uppercase tracking-wider mb-1">Prendas</p>
                <p className="text-lg font-bold text-white/60 tabular-nums">{a.garments.length} vs {b.garments.length}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ============================================================
   WEEKLY PLANNER SECTION
   ============================================================ */
function WeeklyPlannerSection({ favs, isFav, onToggleFav, onViewDetail }: { favs: string[]; isFav: (id: string) => boolean; onToggleFav: (id: string) => void; onViewDetail: (s: Suggestion) => void }) {
  const [week, setWeek] = useState<WeeklyDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [weeklyClima, setWeeklyClima] = useState<Clima | null>(null);

  const generateWeek = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/weekly', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clima: weeklyClima || undefined }) });
      const data = await res.json();
      if (data.success) {
        setWeek(data.week);
        localStorage.setItem(WEEKLY_KEY, JSON.stringify({ date: new Date().toDateString(), week: data.week }));
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [weeklyClima]);

  useEffect(() => {
    try {
      const cached = JSON.parse(localStorage.getItem(WEEKLY_KEY) || '{}');
      if (cached.date === new Date().toDateString() && cached.week) {
        setWeek(cached.week);
        return;
      }
    } catch {}
    generateWeek();
  }, [generateWeek]);

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white/90 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-amber-400" />Planificador Semanal
            </h2>
            <p className="text-xs text-white/30 mt-0.5">Tu semana de estilo, planificada inteligentemente</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {CLIMA_OPTS.map(opt => (
                <button key={opt.value} onClick={() => setWeeklyClima(weeklyClima === opt.value ? null : opt.value)}
                  className={`h-8 px-2.5 rounded-lg border text-[10px] font-medium flex items-center gap-1.5 transition-all ${
                    weeklyClima === opt.value ? 'bg-white/[0.08] border-white/[0.12] text-white' : 'border-white/[0.04] text-white/25 hover:text-white/50 hover:bg-white/[0.03]'
                  }`}>
                  {opt.icon}{LABELS.clima[opt.value]}
                </button>
              ))}
            </div>
            <Button onClick={generateWeek} disabled={loading} size="sm" className="h-8 bg-amber-600/80 hover:bg-amber-500 rounded-lg text-xs gap-1.5 border border-amber-500/20">
              {loading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}Regenerar
            </Button>
          </div>
        </div>
      </motion.div>

      {loading && <div className="space-y-3">{Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-32 bg-white/[0.02] rounded-2xl" />)}</div>}

      {!loading && week.length > 0 && (
        <motion.div className="space-y-3" variants={stagger} initial="initial" animate="animate">
          {week.map((day, i) => (
            <motion.div key={day.day} variants={fadeUp}>
              <div className={`weekly-card-shine bg-white/[0.02] border rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/[0.03] backdrop-blur-sm ${
                i === 0 ? 'border-amber-500/20 shadow-[0_0_20px_-5px_rgba(245,158,11,0.06)]' : 'border-white/[0.04] hover:border-white/[0.07]'
              }`}>
                <div className="flex flex-col sm:flex-row">
                  {/* Day column */}
                  <div className={`sm:w-40 flex-shrink-0 p-4 sm:p-5 flex flex-col justify-center items-center sm:items-start border-b sm:border-b-0 sm:border-r border-white/[0.04] ${i === 0 ? 'bg-amber-500/[0.03]' : ''}`}>
                    <div className="flex items-center gap-2">
                      {i === 0 && <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                      <span className={`text-sm font-bold ${i === 0 ? 'text-amber-300' : 'text-white/60'}`}>{day.dayLabel}</span>
                    </div>
                    <span className="text-[10px] text-white/25 mt-0.5 font-mono">{day.dateStr}</span>
                    <div className="flex gap-1 mt-2">
                      {day.outfit.estilo.slice(0, 2).map(e => <Badge key={e} className={`text-[8px] px-1.5 py-0 border-0 ${i === 0 ? 'bg-amber-500/10 text-amber-400/70' : 'bg-white/[0.03] text-white/20'}`}>{LABELS.estilo[e as keyof typeof LABELS.estilo]}</Badge>)}
                    </div>
                  </div>
                  {/* Outfit column */}
                  <div className="flex-1 p-4 sm:p-5 flex items-center gap-4">
                    <div className="flex -space-x-1 flex-shrink-0">
                      {day.garments.slice(0, 4).map(g => (
                        <div key={g.id} className="w-10 h-10 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-lg shadow-sm" title={g.nombre}>
                          {g.emoji}
                        </div>
                      ))}
                      {day.garments.length > 4 && <div className="w-10 h-10 rounded-xl border border-white/[0.04] bg-white/[0.02] flex items-center justify-center text-[10px] text-white/25 font-bold">+{day.garments.length - 4}</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-semibold truncate ${i === 0 ? 'text-amber-200' : 'text-white/75 group-hover:text-white/90'}`}>{day.outfit.nombre}</h3>
                      <p className="text-[11px] text-white/25 mt-0.5 line-clamp-1">{day.outfit.descripcion}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex -space-x-1">{day.outfit.paletaColores.slice(0, 5).map((c, j) => <div key={j} className="w-4 h-4 rounded-full border border-[#0a0a0b]" style={{ backgroundColor: c }} />)}</div>
                        <span className={`text-[10px] font-bold tabular-nums ${day.score >= 80 ? 'text-amber-400/70' : 'text-white/15'}`}>{Math.round(day.score)}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => { const s: Suggestion = { outfit: day.outfit, garments: day.garments, score: day.score, matchDetails: { ocasion: true, momento: true, clima: true, estilo: true } }; onViewDetail(s); }} className="h-8 w-8 rounded-lg flex items-center justify-center text-white/15 hover:text-amber-400 hover:bg-amber-500/5 transition-all">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => onToggleFav(day.outfit.id)} className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${isFav(day.outfit.id) ? 'text-rose-400' : 'text-white/10 hover:text-rose-400'}`}>
                        <Heart className={`h-3.5 w-3.5 ${isFav(day.outfit.id) ? 'fill-rose-400' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

/* ============================================================
   WARDROBE SECTION
   ============================================================ */
function WardrobeSection() {
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [allItems, setAllItems] = useState<Array<Record<string, unknown>>>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [selectedGarment, setSelectedGarment] = useState<Record<string, unknown> | null>(null);
  const [relatedOutfits, setRelatedOutfits] = useState<OutfitBasic[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/wardrobe');
        const data = await res.json();
        if (!cancelled) { setAllItems(data.prendas || []); setItems(data.prendas || []); }
      } catch (e) { console.error(e); }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleCategory = (cat: string | null) => {
    setCategory(cat); setSelectedGarment(null);
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
            <p className="text-xs text-white/25 mt-0.5">{allItems.length} prendas en 8 categorias</p>
          </div>
          <div className="text-[10px] text-white/15 font-mono bg-white/[0.02] px-2.5 py-1 rounded-lg border border-white/[0.04]">{items.length} prendas</div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {CATEGORIES.map(cat => {
            const count = getCount(cat.id);
            const isActive = category === cat.id;
            return (
              <Button key={cat.id || 'all'} variant="outline" size="sm"
                className={`rounded-xl text-xs h-9 px-3 gap-1.5 transition-all duration-200 border ${isActive ? 'bg-white/[0.06] border-white/[0.12] text-white shadow-sm' : 'border-white/[0.03] text-white/30 hover:text-white/55 hover:bg-white/[0.03]'}`}
                onClick={() => handleCategory(cat.id)}>
                <span>{cat.emoji}</span><span>{cat.label}</span>
                <Badge variant="secondary" className={`h-4 min-w-4 px-1 text-[9px] font-bold rounded ${isActive ? 'bg-white/[0.08] text-white/60' : 'bg-white/[0.02] text-white/15'}`}>{count}</Badge>
              </Button>
            );
          })}
        </div>
      </motion.div>
      <motion.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3" variants={stagger} initial="initial" animate="animate">
        {items.map(item => (
          <motion.div key={item.id as string} variants={fadeUp} layout>
            <div onClick={() => handleGarmentClick(item)}
              className={`group bg-white/[0.015] border rounded-2xl p-4 transition-all duration-300 cursor-pointer hover:bg-white/[0.04] ${selectedGarment?.id === item.id ? 'border-amber-500/25 shadow-[0_0_20px_-5px_rgba(245,158,11,0.05)]' : 'border-white/[0.03] hover:border-white/[0.07]'}`}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl drop-shadow-lg transition-transform group-hover:scale-110 duration-300">{item.emoji as string}</span>
                <div className="flex flex-col items-end gap-1.5">
                  <div className="w-7 h-7 rounded-full border-2 border-white/[0.06] shadow-inner transition-transform group-hover:scale-110 duration-300" style={{ backgroundColor: item.colorHex as string }} />
                  <span className="text-[9px] text-white/10 font-mono">{item.id as string}</span>
                </div>
              </div>
              <h3 className="text-[11px] font-medium text-white/65 line-clamp-2 leading-relaxed group-hover:text-white/80 transition-colors">{item.nombre as string}</h3>
              {(item.notas as string) && <p className="text-[9px] text-white/12 mt-1 line-clamp-1 italic">{item.notas as string}</p>}
              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-[10px] text-white/20 font-medium">{item.color as string}</span>
                <div className="flex gap-[3px]">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className={`w-[3px] h-3.5 rounded-full transition-all duration-300 ${j < (item.formalidad as number) ? 'bg-amber-500/40' : 'bg-white/[0.03]'}`} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      <AnimatePresence>
        {selectedGarment && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="border-t border-white/[0.04] pt-5">
            <h3 className="text-sm font-semibold text-white/75 mb-1">Outfits con esta prenda</h3>
            <p className="text-[11px] text-white/25 mb-3">{relatedOutfits.length} outfits utilizan esta prenda</p>
            <div className="flex flex-wrap gap-2">
              {relatedOutfits.slice(0, 12).map(o => (
                <div key={o.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.025] border border-white/[0.04] hover:bg-white/[0.04] transition-colors">
                  <div className="flex -space-x-1">{o.paletaColores.slice(0, 3).map((c, i) => <div key={i} className="w-3.5 h-3.5 rounded-full border border-[#0a0a0b]" style={{ backgroundColor: c }} />)}</div>
                  <span className="text-[10px] text-white/40 font-medium">{o.nombre}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   EXPLORE SECTION
   ============================================================ */
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
    if (searchExplore.trim()) { const q = searchExplore.toLowerCase(); result = result.filter(o => o.nombre.toLowerCase().includes(q) || o.descripcion.toLowerCase().includes(q)); }
    return result;
  }, [allOutfits, filterOcasion, filterEstilo, searchExplore]);

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white/90 flex items-center gap-2"><Compass className="h-5 w-5 text-amber-400" />Explorar Combinaciones</h2>
            <p className="text-xs text-white/25 mt-0.5">{filtered.length} de {counts.total || 0} outfits</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/15" />
            <Input placeholder="Buscar outfit..." value={searchExplore} onChange={e => setSearchExplore(e.target.value)}
              className="h-8 pl-8 pr-8 text-xs bg-white/[0.025] border-white/[0.05] rounded-xl text-white/65 placeholder:text-white/15 focus:border-amber-500/25" />
            {searchExplore && <button onClick={() => setSearchExplore('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/15 hover:text-white/40"><X className="h-3 w-3" /></button>}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {[{ value: null, label: 'Todas' }, { value: 'oficina', label: 'Oficina' }, { value: 'oficina_casual', label: 'Casual' }, { value: 'salida', label: 'Salida' }, { value: 'after_office', label: 'After Office' }, { value: 'fin_de_semana', label: 'Fin de Semana' }].map(v => {
            const isActive = filterOcasion === v.value;
            const count = v.value ? (counts[v.value] || 0) : (counts.total || 0);
            return (
              <Button key={v.value || 'all'} size="sm"
                className={`rounded-xl text-[11px] h-8 px-3 gap-1.5 transition-all duration-200 border ${isActive ? 'bg-white/[0.06] border-white/[0.12] text-white shadow-sm' : 'border-white/[0.03] text-white/30 hover:text-white/55 hover:bg-white/[0.03]'}`}
                onClick={() => setFilterOcasion(v.value)}>
                {v.label}<span className={`text-[9px] font-bold px-1.5 py-0 rounded-md ${isActive ? 'bg-white/[0.08] text-white/60' : 'bg-white/[0.02] text-white/15'}`}>{count}</span>
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
                  isActive ? `border-white/[0.12] bg-white/[0.06] ${opt.color}` : 'border-white/[0.03] text-white/25 hover:text-white/45 hover:bg-white/[0.02]'
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
              <Card className={`weekly-card-shine bg-white/[0.02] border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 group backdrop-blur-sm ${expandedId === outfit.id ? 'border-amber-500/20 shadow-[0_0_20px_-5px_rgba(245,158,11,0.05)]' : 'border-white/[0.04] hover:border-white/[0.07] hover:bg-white/[0.025]'}`}
                onClick={() => setExpandedId(expandedId === outfit.id ? null : outfit.id)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-semibold text-white/75 group-hover:text-amber-200 transition-colors truncate">{outfit.nombre}</h3>
                      <p className="text-[10px] text-white/25 line-clamp-2 mt-0.5 leading-relaxed">{outfit.descripcion}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={(e) => { e.stopPropagation(); onToggleFav(outfit.id); }} className={`h-6 w-6 flex items-center justify-center rounded-md transition-all ${isFav(outfit.id) ? 'text-rose-400' : 'text-white/[0.06] hover:text-rose-400'}`}>
                        <Heart className={`h-3 w-3 ${isFav(outfit.id) ? 'fill-rose-400' : ''}`} />
                      </button>
                      <ChevronRight className={`h-4 w-4 text-white/10 transition-transform duration-300 ${expandedId === outfit.id ? 'rotate-90 text-amber-400' : ''}`} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3">
                    <div className="flex -space-x-1">
                      {outfit.paletaColores.slice(0, 4).map((c, i) => <div key={i} className="w-4 h-4 rounded-full border border-[#0a0a0b]" style={{ backgroundColor: c }} />)}
                      {outfit.paletaColores.length > 4 && <div className="w-4 h-4 rounded-full bg-white/[0.04] border border-[#0a0a0b] flex items-center justify-center text-[7px] text-white/25 font-bold">+{outfit.paletaColores.length - 4}</div>}
                    </div>
                    <div className="flex-1" />
                    <div className="flex gap-1">
                      {outfit.estilo.slice(0, 2).map((e) => <Badge key={e} className="bg-white/[0.025] text-white/20 text-[8px] px-1.5 py-0 border-0 font-medium">{LABELS.estilo[e as keyof typeof LABELS.estilo]}</Badge>)}
                    </div>
                  </div>
                  {expandedId === outfit.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 pt-3 border-t border-white/[0.04] space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {outfit.ocasion.map((o) => <Badge key={o} className="bg-emerald-500/6 text-emerald-400/70 text-[9px] px-1.5 py-0 border-emerald-500/8 font-medium">{LABELS.ocasion[o as keyof typeof LABELS.ocasion]}</Badge>)}
                        {outfit.momento.map((m) => <Badge key={m} className="bg-sky-500/6 text-sky-400/70 text-[9px] px-1.5 py-0 border-sky-500/8 font-medium">{LABELS.momento[m as keyof typeof LABELS.momento]}</Badge>)}
                        {outfit.clima.map((c) => <Badge key={c} className="bg-orange-500/6 text-orange-400/70 text-[9px] px-1.5 py-0 border-orange-500/8 font-medium">{LABELS.clima[c as keyof typeof LABELS.clima]}</Badge>)}
                      </div>
                      <Button variant="outline" size="sm" className="w-full rounded-xl border-white/[0.05] text-white/35 hover:text-amber-400 hover:border-amber-500/20 text-[10px] gap-1.5 mt-2" onClick={(e) => {
                        e.stopPropagation();
                        fetch(`/api/outfits/${outfit.id}`).then(r => r.json()).then(data => { if (data.success) onViewDetail({ outfit: data.outfit, garments: data.garments, score: 0, matchDetails: { ocasion: true, momento: true, clima: true, estilo: true } }); });
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

/* ============================================================
   FAVORITES SECTION (Fixed: uses /api/outfits instead of /api/suggest)
   ============================================================ */
function FavoritesSection({ favs, isFav, onToggleFav, onViewDetail }: { favs: string[]; isFav: (id: string) => boolean; onToggleFav: (id: string) => void; onViewDetail: (s: Suggestion) => void }) {
  const [items, setItems] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (favs.length === 0) { setItems([]); return; }
    setLoading(true);
    (async () => {
      try {
        const res = await fetch('/api/outfits?limit=130');
        const data = await res.json();
        const allOutfits: OutfitBasic[] = data.outfits || [];
        const favOutfits = allOutfits.filter(o => favs.includes(o.id));
        const withDetails = await Promise.all(favOutfits.map(async (o) => {
          try {
            const dRes = await fetch(`/api/outfits/${o.id}`);
            const dData = await dRes.json();
            if (dData.success) return { outfit: dData.outfit, garments: dData.garments, score: 0, matchDetails: { ocasion: true, momento: true, clima: true, estilo: true } } as Suggestion;
          } catch {}
          return { outfit: o, garments: [], score: 0, matchDetails: { ocasion: true, momento: true, clima: true, estilo: true } } as Suggestion;
        }));
        setItems(withDetails);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [favs]);

  if (favs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', duration: 0.6 }}>
          <div className="w-20 h-20 rounded-3xl bg-rose-500/[0.04] border border-rose-500/[0.08] flex items-center justify-center mb-6 animate-float">
            <Heart className="h-8 w-8 text-rose-500/15" />
          </div>
          <h2 className="text-xl font-semibold text-white/40 mb-2">Sin favoritos aun</h2>
          <p className="text-sm text-white/20 max-w-sm">Haz clic en el corazon de cualquier outfit para guardarlo aqui.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white/90 flex items-center gap-2"><Heart className="h-5 w-5 text-rose-400" />Mis Favoritos</h2>
          <p className="text-xs text-white/30">{items.length} outfits guardados</p>
        </div>
      </div>
      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-32 bg-white/[0.02] rounded-2xl" />)}</div>
      ) : (
        <motion.div className="space-y-3" variants={stagger} initial="initial" animate="animate">
          {items.map(s => (
            <motion.div key={s.outfit.id} variants={fadeUp}>
              <Card className="weekly-card-shine bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 hover:bg-white/[0.035] transition-all duration-300 group backdrop-blur-sm cursor-pointer"
                onClick={() => onViewDetail(s)}>
                <div className="flex items-start gap-4">
                  <div className="flex -space-x-1 flex-shrink-0 pt-1">
                    {s.outfit.paletaColores.slice(0, 4).map((c, i) => (
                      <div key={i} className="w-5 h-5 rounded-full border border-[#0a0a0b]" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white/75 group-hover:text-amber-300 transition-colors">{s.outfit.nombre}</h3>
                    <p className="text-xs text-white/30 mt-1 line-clamp-1 leading-relaxed">{s.outfit.descripcion}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {s.outfit.estilo.map((e) => <Badge key={e} className="bg-violet-500/6 text-violet-400/70 text-[9px] px-1.5 py-0 border-violet-500/8 font-medium">{LABELS.estilo[e as keyof typeof LABELS.estilo]}</Badge>)}
                      {s.outfit.clima.map((c) => <Badge key={c} className="bg-orange-500/6 text-orange-400/70 text-[9px] px-1.5 py-0 border-orange-500/8 font-medium">{LABELS.clima[c as keyof typeof LABELS.clima]}</Badge>)}
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); onToggleFav(s.outfit.id); }} className={`h-8 w-8 flex items-center justify-center rounded-lg flex-shrink-0 transition-all ${isFav(s.outfit.id) ? 'text-rose-400' : 'text-white/[0.06] hover:text-rose-400'}`}>
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

/* ============================================================
   WORN CALENDAR SECTION
   ============================================================ */
function WornCalendarSection({ worn, onViewDetail }: { worn: Record<string, WornEntry>; onViewDetail: (s: Suggestion) => void }) {
  const dateMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    Object.entries(worn).forEach(([id, entry]) => {
      entry.dates.forEach(d => {
        if (!map[d]) map[d] = [];
        if (!map[d].includes(id)) map[d].push(id);
      });
    });
    return map;
  }, [worn]);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayOutfits, setDayOutfits] = useState<Suggestion[]>([]);
  const [dayLoading, setDayLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const dayNames = ['Lu','Ma','Mi','Ju','Vi','Sa','Do'];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  const prevMonth = () => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); } else setCurrentMonth(m => m - 1); };
  const nextMonth = () => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); } else setCurrentMonth(m => m + 1); };

  const handleDayClick = async (dateStr: string) => {
    setSelectedDate(dateStr);
    const ids = dateMap[dateStr];
    if (!ids || ids.length === 0) { setDayOutfits([]); return; }
    setDayLoading(true);
    try {
      const results = await Promise.all(ids.map(id => fetch(`/api/outfits/${id}`).then(r => r.json())));
      setDayOutfits(results.map(r => ({ outfit: r.outfit, garments: r.garments, score: 0, matchDetails: { ocasion: true, momento: true, clima: true, estilo: true } })));
    } catch { setDayOutfits([]); }
    finally { setDayLoading(false); }
  };

  const calendarDays: Array<{ day: number; dateStr: string; isCurrentMonth: boolean; isToday: boolean; hasOutfit: boolean }> = [];
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const m = currentMonth === 0 ? 12 : currentMonth;
    const y = currentMonth === 0 ? currentYear - 1 : currentYear;
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarDays.push({ day, dateStr, isCurrentMonth: false, isToday: dateStr === today, hasOutfit: !!dateMap[dateStr] });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({ day: d, dateStr, isCurrentMonth: true, isToday: dateStr === today, hasOutfit: !!dateMap[dateStr] });
  }
  const remaining = 42 - calendarDays.length;
  for (let d = 1; d <= remaining; d++) {
    const m = currentMonth + 2 > 12 ? 1 : currentMonth + 2;
    const y = currentMonth + 2 > 12 ? currentYear + 1 : currentYear;
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({ day: d, dateStr, isCurrentMonth: false, isToday: dateStr === today, hasOutfit: !!dateMap[dateStr] });
  }

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-lg font-bold text-white/90 flex items-center gap-2"><CalendarDays className="h-5 w-5 text-amber-400" />Calendario de Outfits</h2>
        <p className="text-xs text-white/30 mt-0.5">Historial de looks vestidos por fecha</p>
      </motion.div>
      <Card className="bg-white/[0.02] border-white/[0.05] rounded-2xl overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="h-8 w-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-all"><ChevronRight className="h-4 w-4 rotate-180" /></button>
            <h3 className="text-sm font-bold text-white/80">{monthNames[currentMonth]} {currentYear}</h3>
            <button onClick={nextMonth} className="h-8 w-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-all"><ChevronRight className="h-4 w-4" /></button>
          </div>
          <div className="calendar-grid mb-1">
            {dayNames.map(d => <div key={d} className="text-center text-[10px] font-semibold text-white/25 py-1">{d}</div>)}
          </div>
          <div className="calendar-grid">
            {calendarDays.map((cd, i) => (
              <button key={i} onClick={() => handleDayClick(cd.dateStr)}
                className={`calendar-day text-white/50 ${cd.isCurrentMonth ? '' : 'other-month'} ${cd.isToday ? 'today' : ''} ${cd.hasOutfit ? 'has-outfit' : ''} ${selectedDate === cd.dateStr ? 'selected' : ''}`}>
                {cd.day}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      <AnimatePresence>
        {selectedDate && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            <h3 className="text-sm font-semibold text-white/70">Outfits del {selectedDate}</h3>
            {dayLoading ? <Skeleton className="h-20 rounded-xl" /> : dayOutfits.length === 0 ? <p className="text-xs text-white/25">Sin outfits registrados este dia</p> : dayOutfits.map(s => (
              <div key={s.outfit.id} onClick={() => onViewDetail(s)} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] cursor-pointer transition-all">
                <div className="flex -space-x-1">{s.outfit.paletaColores.slice(0, 4).map((c, i) => <div key={i} className="w-5 h-5 rounded-full border border-[#08080a]" style={{ backgroundColor: c }} />)}</div>
                <div className="flex-1 min-w-0"><p className="text-xs font-medium text-white/65 truncate">{s.outfit.nombre}</p><p className="text-[10px] text-white/25 truncate">{s.outfit.descripcion}</p></div>
                <ChevronRight className="h-4 w-4 text-white/15" />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   MIX & MATCH SECTION
   ============================================================ */
function MixMatchSection({ onViewDetail }: { onViewDetail: (s: Suggestion) => void }) {
  const [garments, setGarments] = useState<Array<{ id: string; nombre: string; emoji: string; color: string; colorHex: string; categoria: string }>>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [results, setResults] = useState<Suggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [filterCat, setFilterCat] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/wardrobe').then(r => r.json()).then(d => setGarments(d.prendas || [])).catch(() => {});
  }, []);

  const toggleGarment = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev);
    setResults([]);
  };

  const search = async () => {
    if (selected.length === 0) return;
    setSearching(true);
    try {
      const res = await fetch('/api/outfits?limit=130');
      const data = await res.json();
      const allOutfits: OutfitBasic[] = data.outfits || [];
      const matching = allOutfits.filter(o => {
        const ids = [o.prendaSuperior, o.pantalon, o.calzado, o.corbata, o.abrigo, ...(o.accesorios || [])].filter(Boolean) as string[];
        return selected.every(sid => ids.includes(sid));
      });
      const detailed = await Promise.all(matching.slice(0, 12).map(async o => {
        const r = await fetch(`/api/outfits/${o.id}`);
        const d = await r.json();
        return { outfit: d.outfit, garments: d.garments, score: 0, matchDetails: { ocasion: true, momento: true, clima: true, estilo: true } };
      }));
      setResults(detailed);
    } catch { setResults([]); }
    finally { setSearching(false); }
  };

  const filtered = filterCat ? garments.filter(g => g.categoria === filterCat) : garments;

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-lg font-bold text-white/90 flex items-center gap-2"><Shuffle className="h-5 w-5 text-amber-400" />Mix & Match</h2>
        <p className="text-xs text-white/30 mt-0.5">Selecciona prendas y encuentra outfits compatibles</p>
      </motion.div>
      {selected.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
          <span className="text-xs text-amber-400/80 font-medium">{selected.length}/3 seleccionadas</span>
          <div className="flex-1" />
          <Button size="sm" onClick={search} disabled={searching} className="h-8 bg-amber-600/80 hover:bg-amber-500 rounded-lg text-xs gap-1.5 border border-amber-500/20">
            {searching ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Search className="h-3 w-3" />}Buscar Outfits
          </Button>
          <button onClick={() => { setSelected([]); setResults([]); }} className="text-white/25 hover:text-white/50"><X className="h-4 w-4" /></button>
        </div>
      )}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map(cat => (
          <button key={cat.id || 'all'} onClick={() => setFilterCat(cat.id)} className={`px-3 py-1.5 rounded-lg border text-[10px] font-medium transition-all ${filterCat === cat.id ? 'bg-white/[0.06] border-white/[0.12] text-white' : 'border-white/[0.03] text-white/25 hover:text-white/45'}`}>
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {filtered.map(g => (
          <button key={g.id} onClick={() => toggleGarment(g.id)} className={`garment-chip ${selected.includes(g.id) ? 'selected' : ''}`}>
            <span className="chip-color" style={{ backgroundColor: g.colorHex }} />
            <span className="text-xs">{g.emoji} {g.nombre}</span>
          </button>
        ))}
      </div>
      {results.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white/70">{results.length} outfits encontrados</h3>
          {results.map(s => (
            <div key={s.outfit.id} onClick={() => onViewDetail(s)} className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.035] cursor-pointer transition-all">
              <div className="flex -space-x-1.5">{s.outfit.paletaColores.map((c, i) => <div key={i} className="w-7 h-7 rounded-full border-2 border-[#08080a] shadow" style={{ backgroundColor: c }} />)}</div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white/80 truncate">{s.outfit.nombre}</h4>
                <p className="text-[11px] text-white/35 mt-0.5 truncate">{s.outfit.descripcion}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-white/15 flex-shrink-0" />
            </div>
          ))}
        </div>
      )}
      {searching && <Skeleton className="h-32 rounded-xl" />}
    </div>
  );
}

/* ============================================================
   AI ADVISOR SECTION
   ============================================================ */
function AdvisorSection() {
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant'; content: string; time: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const SUGGESTIONS = [
    '\xbfQue me pongo para una junta importante?',
    '\xbfOutfit para un concierto de metal?',
    '\xbfCombina algo estilo old money',
    '\xbfQue no deberia usar nunca?',
    '\xbfSugiere un look de viernes casual',
    '\xbfEstilo para una cita romantica?',
  ];

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = useCallback(async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    const time = new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { role: 'user', content: msg, time }]);
    setLoading(true);
    try {
      const res = await fetch('/api/advisor', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, sessionId: 'stylevault-chat' }),
      });
      const data = await res.json();
      if (data.success) {
        const aTime = new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });
        setMessages(prev => [...prev, { role: 'assistant', content: data.response, time: aTime }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, no pude procesar tu pregunta. Intenta de nuevo.', time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }) }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error de conexion. Verifica tu conexion e intenta de nuevo.', time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }) }]);
    }
    finally { setLoading(false); }
  }, [input, loading]);

  const clearChat = useCallback(async () => {
    try { await fetch('/api/advisor?sessionId=stylevault-chat', { method: 'DELETE' }); } catch {}
    setMessages([]);
  }, []);

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white/90 flex items-center gap-2"><MessageSquare className="h-5 w-5 text-violet-400" />Asesor de Estilo IA</h2>
            <p className="text-xs text-white/25 mt-0.5">Tu estilista personal impulsado por inteligencia artificial</p>
          </div>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearChat} className="text-xs text-white/25 hover:text-white/50 h-8 gap-1.5"><Trash2 className="h-3 w-3" />Limpiar chat</Button>
          )}
        </div>
      </motion.div>

      <div className="relative bg-white/[0.015] border border-white/[0.05] rounded-2xl overflow-hidden backdrop-blur-sm" style={{ height: 'calc(100vh - 380px)', minHeight: '400px' }}>
        <div ref={chatRef} className="absolute inset-0 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, type: 'spring' }} className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-violet-500/[0.06] border border-violet-500/10 flex items-center justify-center mb-5 animate-float-slow">
                <UserCircle className="h-8 w-8 text-violet-400/40" />
              </div>
              <h3 className="text-lg font-semibold text-white/50 mb-2">{'\xbf'}Hola, Enrique!</h3>
              <p className="text-sm text-white/20 max-w-sm mb-6 leading-relaxed">Soy tu asesor de estilo personal. Preguntame sobre outfits, combinaciones, o cualquier duda de moda.</p>
              <div className="flex flex-wrap gap-1.5 justify-center max-w-md">
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s)}
                    className="px-3 py-2 rounded-xl border border-violet-500/10 bg-violet-500/[0.03] text-violet-300/70 text-[11px] font-medium hover:bg-violet-500/[0.08] hover:border-violet-500/20 transition-all duration-200">
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <div className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.role === 'user' ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-violet-500/10 border border-violet-500/15'
                    }`}>{msg.role === 'user' ? <UserCircle className="h-4 w-4 text-amber-300" /> : <Sparkles className="h-4 w-4 text-violet-300" />}</div>
                    <div className={`flex-1 min-w-0 rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-amber-500/[0.06] border border-amber-500/10 ml-10'
                        : 'bg-white/[0.02] border border-white/[0.04]'
                    }`}>
                      <p className={`text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'text-amber-100' : 'text-white/60'}`}>{msg.content}</p>
                      <p className={`text-[9px] mt-1 ${msg.role === 'user' ? 'text-amber-400/40 text-right' : 'text-white/15'}`}>{msg.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/10 border border-violet-500/15 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-violet-400 animate-pulse" />
                  </div>
                  <div className="flex-1 rounded-2xl px-4 py-3 bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-violet-400/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-violet-400/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-violet-400/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      {messages.length > 0 && !loading && (
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTIONS.slice(0, 4).map((s, i) => (
            <button key={i} onClick={() => sendMessage(s)}
              className="px-2.5 py-1.5 rounded-lg border border-white/[0.04] bg-white/[0.02] text-white/30 text-[10px] font-medium hover:bg-violet-500/[0.06] hover:text-violet-300 hover:border-violet-500/15 transition-all duration-200">
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <Input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) sendMessage(); }}
          placeholder="Pregunta sobre tu estilo..."
          disabled={loading}
          className="w-full h-12 pl-12 pr-24 text-sm bg-white/[0.025] border-violet-500/15 border-white/[0.05] rounded-2xl text-white/70 placeholder:text-white/15 focus:border-violet-400/30 focus:ring-violet-500/10 transition-all duration-200"
        />
        <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-lg shadow-violet-900/30">
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   STATS SECTION
   ============================================================ */
function StatsSection({ worn, ratings, favs }: { worn?: Record<string, WornEntry>; ratings?: Record<string, number>; favs: string[] }) {
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

    // Average harmony
    const avgHarmony = allOutfits.reduce((sum, o) => sum + getHarmonyScore(o.paletaColores).score, 0) / Math.max(allOutfits.length, 1);

    return { ocasionCount, estiloCount, momentoCount, climaCount, colorCount, topColors, topGarments, maxOcasion, maxEstilo, maxMomento, maxClima, avgHarmony };
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
        <h2 className="text-lg font-bold text-white/90 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-emerald-400" />Estadisticas del Guardarropa</h2>
        <p className="text-xs text-white/25 mt-0.5">Analisis de tus 130 combinaciones y 46 prendas</p>
      </motion.div>

      {/* Summary cards */}
      <motion.div className="grid grid-cols-2 sm:grid-cols-5 gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        {[
          { label: 'Total Outfits', value: allOutfits.length, icon: <ShirtIcon className="h-4 w-4" />, color: 'text-amber-400', bg: 'bg-amber-500/[0.06] border-amber-500/10' },
          { label: 'Total Prendas', value: allGarments.length, icon: <Layers className="h-4 w-4" />, color: 'text-emerald-400', bg: 'bg-emerald-500/[0.06] border-emerald-500/10' },
          { label: 'Estilos', value: Object.keys(stats.estiloCount).length, icon: <Palette className="h-4 w-4" />, color: 'text-violet-400', bg: 'bg-violet-500/[0.06] border-violet-500/10' },
          { label: 'Colores Unicos', value: Object.keys(stats.colorCount).length, icon: <Gem className="h-4 w-4" />, color: 'text-sky-400', bg: 'bg-sky-500/[0.06] border-sky-500/10' },
          { label: 'Armonia Promedio', value: Math.round(stats.avgHarmony), icon: <Star className="h-4 w-4" />, color: stats.avgHarmony >= 70 ? 'text-emerald-400' : 'text-amber-400', bg: stats.avgHarmony >= 70 ? 'bg-emerald-500/[0.06] border-emerald-500/10' : 'bg-amber-500/[0.06] border-amber-500/10' },
        ].map(s => (
          <Card key={s.label} className={`${s.bg} border rounded-xl p-4 backdrop-blur-sm`}>
            <div className={`${s.color} mb-2`}>{s.icon}</div>
            <div className={`text-2xl font-bold ${s.color} tabular-nums`}>{s.value}</div>
            <div className="text-[10px] text-white/30 font-medium mt-0.5">{s.label}</div>
          </Card>
        ))}
      </motion.div>

      {/* Style DNA Radar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <StyleDNARadar
          favs={favs}
          worn={worn}
          ratings={ratings}
          allOutfits={allOutfits}
        />
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          { title: 'Por Ocasion', data: stats.ocasionCount, max: stats.maxOcasion, icon: <MapPin className="h-3.5 w-3.5 text-emerald-400" />, gradient: 'from-emerald-500 to-emerald-400', labelKey: 'ocasion' as const },
          { title: 'Por Estilo', data: stats.estiloCount, max: stats.maxEstilo, icon: <Crown className="h-3.5 w-3.5 text-violet-400" />, gradient: 'from-violet-500 to-purple-400', labelKey: 'estilo' as const },
          { title: 'Por Momento', data: stats.momentoCount, max: stats.maxMomento, icon: <Clock className="h-3.5 w-3.5 text-sky-400" />, gradient: 'from-sky-500 to-cyan-400', labelKey: 'momento' as const },
          { title: 'Por Clima', data: stats.climaCount, max: stats.maxClima, icon: <Flame className="h-3.5 w-3.5 text-orange-400" />, gradient: 'from-orange-500 to-amber-400', labelKey: 'clima' as const },
        ].map((chart, i) => (
          <motion.div key={chart.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
            <Card className="bg-white/[0.015] border-white/[0.04] rounded-2xl p-5 backdrop-blur-sm">
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4 flex items-center gap-2">{chart.icon}{chart.title}</h3>
              <div className="space-y-3">
                {Object.entries(chart.data).sort((a, b) => b[1] - a[1]).map(([key, count]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-white/50 font-medium">{LABELS[chart.labelKey][key as keyof typeof LABELS[typeof chart.labelKey]]}</span>
                      <span className="text-[10px] text-white/25 font-mono tabular-nums">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.03] overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(count / chart.max) * 100}%` }} transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }} className={`h-full rounded-full bg-gradient-to-r ${chart.gradient}`} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Top Colors */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="bg-white/[0.015] border-white/[0.04] rounded-2xl p-5 backdrop-blur-sm">
          <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4 flex items-center gap-2"><Star className="h-3.5 w-3.5 text-amber-400" />Colores Mas Usados</h3>
          <div className="space-y-2.5">
            {stats.topColors.map(([color, count]) => (
              <div key={color} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg border border-white/[0.06] flex-shrink-0" style={{ backgroundColor: color }} />
                <div className="flex-1 min-w-0">
                  <div className="h-1.5 rounded-full bg-white/[0.03] overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(count / stats.topColors[0][1]) * 100}%` }} transition={{ duration: 0.6 }} className="h-full rounded-full" style={{ backgroundColor: color }} />
                  </div>
                </div>
                <span className="text-[10px] text-white/25 font-mono w-6 text-right tabular-nums">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Top Garments */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card className="bg-white/[0.015] border-white/[0.04] rounded-2xl p-5 backdrop-blur-sm">
          <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4 flex items-center gap-2"><TrendingUp className="h-3.5 w-3.5 text-emerald-400" />Prendas Mas Versatiles</h3>
          <div className="space-y-2">
            {topGarmentNames.map((g, i) => (
              <div key={g.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.015] border border-white/[0.03] hover:bg-white/[0.025] transition-colors">
                <span className={`text-[10px] font-black w-5 text-center tabular-nums ${i === 0 ? 'text-amber-400' : 'text-white/15'}`}>#{i + 1}</span>
                <span className="text-lg">{g.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-white/60 font-medium truncate">{g.nombre}</p>
                </div>
                <div className="w-4 h-4 rounded-full border border-white/[0.06]" style={{ backgroundColor: g.colorHex }} />
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.03]">
                  <Zap className="h-2.5 w-2.5 text-amber-400" />
                  <span className="text-[10px] text-white/40 font-bold tabular-nums">{g.count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Export/Import */}
      <div className="mt-8 pt-6 border-t border-white/[0.04]">
        <h3 className="text-sm font-semibold text-white/70 flex items-center gap-2 mb-4"><Lock className="h-4 w-4 text-amber-400" />Datos y Copia de Seguridad</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="data-card surface-1 rounded-2xl p-5 space-y-3 cursor-pointer hover-lift" onClick={() => {
            const data = { favorites: JSON.parse(localStorage.getItem(FAVS_KEY) || '[]'), history: JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'), worn: JSON.parse(localStorage.getItem(WORN_KEY) || '{}'), ratings: JSON.parse(localStorage.getItem(RATINGS_KEY) || '{}'), exportDate: new Date().toISOString() };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = `stylevault-backup-${new Date().toISOString().split('T')[0]}.json`; a.click(); URL.revokeObjectURL(url);
            toast.success('Datos exportados correctamente');
          }}>
            <div className="flex items-center gap-3"><div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center"><Download className="h-5 w-5 text-amber-400" /></div><div><p className="text-sm font-medium text-white/75">Exportar Datos</p><p className="text-[10px] text-white/25 mt-0.5">Descargar copia de seguridad JSON</p></div></div>
          </div>
          <div className="data-card surface-1 rounded-2xl p-5 space-y-3 relative">
            <input type="file" accept=".json" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => {
                try {
                  const data = JSON.parse(ev.target?.result as string);
                  if (data.favorites) localStorage.setItem(FAVS_KEY, JSON.stringify(data.favorites));
                  if (data.history) localStorage.setItem(HISTORY_KEY, JSON.stringify(data.history));
                  if (data.worn) localStorage.setItem(WORN_KEY, JSON.stringify(data.worn));
                  if (data.ratings) localStorage.setItem(RATINGS_KEY, JSON.stringify(data.ratings));
                  toast.success('Datos importados. Recarga la pagina para ver los cambios.');
                } catch { toast.error('Archivo invalido'); }
              };
              reader.readAsText(file);
            }} />
            <div className="flex items-center gap-3"><div className="h-10 w-10 rounded-xl bg-sky-500/10 flex items-center justify-center"><Upload className="h-5 w-5 text-sky-400" /></div><div><p className="text-sm font-medium text-white/75">Importar Datos</p><p className="text-[10px] text-white/25 mt-0.5">Restaurar desde archivo JSON</p></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STYLE DNA RADAR CHART
   ============================================================ */
function StyleDNARadar({ favs, worn, ratings, allOutfits }: { favs: string[]; worn?: Record<string, WornEntry>; ratings?: Record<string, number>; allOutfits: OutfitBasic[] }) {
  const estilos = ['noir', 'old_money', 'rockero', 'corporate'] as const;
  const estiloLabels: Record<string, string> = { noir: 'Noir', old_money: 'Old Money', rockero: 'Rockero', corporate: 'Corporate' };
  const estiloColors: Record<string, string> = { noir: '#9ca3af', old_money: '#f59e0b', rockero: '#ef4444', corporate: '#38bdf8' };

  const scores = useMemo(() => {
    const counts: Record<string, number> = { noir: 0, old_money: 0, rockero: 0, corporate: 0 };
    const weightedCounts: Record<string, number> = { noir: 0, old_money: 0, rockero: 0, corporate: 0 };

    allOutfits.forEach(o => {
      o.estilo.forEach(e => { if (counts[e] !== undefined) counts[e]++; });
    });

    // Weight: favorites = 5pts, worn = 3pts, rated = 4pts
    favs.forEach(id => {
      const o = allOutfits.find(x => x.id === id);
      if (o) o.estilo.forEach(e => { if (weightedCounts[e] !== undefined) weightedCounts[e] += 5; });
    });
    Object.entries(worn || {}).forEach(([id, entry]) => {
      const o = allOutfits.find(x => x.id === id);
      if (o) o.estilo.forEach(e => { if (weightedCounts[e] !== undefined) weightedCounts[e] += 3 * entry.count; });
    });
    Object.entries(ratings || {}).forEach(([id, stars]) => {
      const o = allOutfits.find(x => x.id === id);
      if (o) o.estilo.forEach(e => { if (weightedCounts[e] !== undefined) weightedCounts[e] += 4 * (stars / 5); });
    });

    // If no interactions, use base distribution
    const hasInteractions = favs.length > 0 || Object.keys(worn).length > 0 || Object.keys(ratings).length > 0;
    if (!hasInteractions) {
      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      return estilos.map(e => total > 0 ? (counts[e] / total) * 100 : 25);
    }

    const total = Object.values(weightedCounts).reduce((a, b) => a + b, 0);
    if (total === 0) return estilos.map(() => 25);
    return estilos.map(e => (weightedCounts[e] / total) * 100);
  }, [favs, worn, ratings, allOutfits]);

  const maxScore = Math.max(...scores, 1);
  const center = 50;
  const radius = 38;
  const n = estilos.length;
  const angleStep = (2 * Math.PI) / n;

  const getPoint = (i: number, value: number) => {
    const angle = angleStep * i - Math.PI / 2;
    const r = (value / 100) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  const dataPoints = scores.map((s, i) => getPoint(i, s));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  const dominantIndex = scores.indexOf(Math.max(...scores));
  const dominant = estilos[dominantIndex];

  return (
    <Card className="bg-white/[0.015] border-white/[0.04] rounded-2xl p-5 backdrop-blur-sm">
      <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4 flex items-center gap-2"><Gem className="h-3.5 w-3.5 text-violet-400" />Style DNA</h3>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="style-dna-chart relative flex-shrink-0 py-3">
          <svg viewBox="0 0 100 100" className="w-40 h-40" overflow="visible">
            {/* Grid lines */}
            {[25, 50, 75, 100].map(level => {
              const pts = estilos.map((_, i) => getPoint(i, level));
              const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
              return <path key={level} d={path} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />;
            })}
            {/* Axis lines */}
            {estilos.map((_, i) => {
              const p = getPoint(i, 100);
              return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.03)" strokeWidth="0.3" />;
            })}
            {/* Data polygon */}
            <motion.path
              d={dataPath}
              fill="rgba(212,168,67,0.08)"
              stroke="rgba(212,168,67,0.5)"
              strokeWidth="0.8"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
              style={{ transformOrigin: `${center}px ${center}px` }}
            />
            {/* Data points */}
            {dataPoints.map((p, i) => (
              <motion.circle
                key={i} cx={p.x} cy={p.y} r="1.8"
                fill={estiloColors[estilos[i]]}
                stroke="#08080a" strokeWidth="0.8"
                initial={{ r: 0 }} animate={{ r: 1.8 }} transition={{ delay: 0.3 + i * 0.1 }}
              />
            ))}
            {/* Labels */}
            {estilos.map((e, i) => {
              const angle = angleStep * i - Math.PI / 2;
              const lr = radius + 10;
              const lx = center + lr * Math.cos(angle);
              const ly = center + lr * Math.sin(angle);
              return (
                <text key={e} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className="text-[5px] font-semibold" fill={scores[i] === maxScore ? estiloColors[e] : 'rgba(255,255,255,0.25)'}>
                  {estiloLabels[e]}
                </text>
              );
            })}
          </svg>
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.04] bg-white/[0.015]">
            <span className="text-lg">{dominant === 'noir' ? '🖤' : dominant === 'old_money' ? '👑' : dominant === 'rockero' ? '🎸' : '💼'}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-white/70">Estilo Dominante</p>
              <p className="text-[10px] font-bold" style={{ color: estiloColors[dominant] }}>{estiloLabels[dominant]}</p>
            </div>
            <span className="text-lg font-bold tabular-nums" style={{ color: estiloColors[dominant] }}>{Math.round(scores[dominantIndex])}%</span>
          </div>
          <div className="space-y-1.5">
            {estilos.map((e, i) => (
              <div key={e} className="flex items-center gap-2">
                <span className="text-[10px] w-16 text-right font-medium" style={{ color: estiloColors[e] }}>{estiloLabels[e]}</span>
                <div className="flex-1 h-1.5 rounded-full bg-white/[0.03] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${scores[i]}%` }}
                    transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: estiloColors[e], opacity: 0.7 }}
                  />
                </div>
                <span className="text-[9px] text-white/20 font-mono w-7 tabular-nums text-right">{Math.round(scores[i])}%</span>
              </div>
            ))}
          </div>
          {favs.length === 0 && Object.keys(worn).length === 0 && (
            <p className="text-[9px] text-white/15 italic">Usa favoritos, calificaciones y registro de uso para personalizar tu perfil de estilo</p>
          )}
        </div>
      </div>
    </Card>
  );
}

/* ============================================================
   COLLECTIONS SECTION
   ============================================================ */
function CollectionsSection({ favs, isFav, onToggleFav, onViewDetail }: { favs: string[]; isFav: (id: string) => boolean; onToggleFav: (id: string) => void; onViewDetail: (s: Suggestion) => void }) {
  const [collections, setCollections] = useState<CollectionBasic[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [collectionOutfits, setCollectionOutfits] = useState<OutfitBasic[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/collections');
        const data = await res.json();
        if (data.success) setCollections(data.collections || []);
      } catch (e) { console.error(e); }
    })();
  }, []);

  const openCollection = useCallback(async (id: string) => {
    if (selectedCollection === id) { setSelectedCollection(null); setCollectionOutfits([]); return; }
    setLoading(true);
    setSelectedCollection(id);
    try {
      const res = await fetch(`/api/collections?collection=${id}`);
      const data = await res.json();
      if (data.success) setCollectionOutfits(data.collection?.outfits || []);
    } catch { toast.error('Error cargando coleccion'); }
    finally { setLoading(false); }
  }, [selectedCollection]);

  const viewOutfit = useCallback(async (outfit: OutfitBasic) => {
    setDetailLoading(outfit.id);
    try {
      const res = await fetch(`/api/outfits/${outfit.id}`);
      const data = await res.json();
      if (data.success) {
        onViewDetail({ outfit: data.outfit, garments: data.garments, score: 0, matchDetails: { ocasion: true, momento: true, clima: true, estilo: true } });
      }
    } catch {}
    finally { setDetailLoading(null); }
  }, [onViewDetail]);

  if (collections.length === 0) {
    return <div className="space-y-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-36 bg-white/[0.015] rounded-2xl" />)}</div>;
  }

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-lg font-bold text-white/90 flex items-center gap-2"><FolderOpen className="h-5 w-5 text-sky-400" />Colecciones Curadas</h2>
        <p className="text-xs text-white/25 mt-0.5">Outfits agrupados por tema, mood y estetica</p>
      </motion.div>

      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" variants={stagger} initial="initial" animate="animate">
        {collections.map(col => (
          <motion.div key={col.id} variants={fadeUp}>
            <button
              onClick={() => openCollection(col.id)}
              className={`w-full text-left collection-card rounded-2xl p-4 border transition-all duration-300 hover-lift ${
                selectedCollection === col.id
                  ? 'bg-white/[0.04] border-white/[0.1] shadow-lg shadow-black/20'
                  : 'bg-white/[0.015] border-white/[0.04] hover:bg-white/[0.03] hover:border-white/[0.07]'
              }`}
              style={{ '--collection-color': col.color } as React.CSSProperties}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{col.emoji}</span>
                <span className="text-[10px] font-bold tabular-nums px-2 py-0.5 rounded-full border border-white/[0.06] text-white/25">{col.outfitCount}</span>
              </div>
              <h3 className="text-sm font-semibold text-white/80 mb-1">{col.nombre}</h3>
              <p className="text-[10px] text-white/25 line-clamp-2 leading-relaxed">{col.descripcion}</p>
              <div className="mt-3 h-1 rounded-full overflow-hidden bg-white/[0.03]">
                <div className="h-full rounded-full" style={{ backgroundColor: col.color, opacity: 0.6, width: `${Math.min((col.outfitCount / 80) * 100, 100)}%` }} />
              </div>
            </button>
          </motion.div>
        ))}
      </motion.div>

      {selectedCollection && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button onClick={() => { setSelectedCollection(null); setCollectionOutfits([]); }} className="h-8 w-8 rounded-lg flex items-center justify-center text-white/25 hover:text-white/60 hover:bg-white/[0.04] transition-all">
                <ChevronDown className="h-4 w-4 rotate-90" />
              </button>
              <div>
                <h3 className="text-sm font-semibold text-white/80">{collections.find(c => c.id === selectedCollection)?.emoji} {collections.find(c => c.id === selectedCollection)?.nombre}</h3>
                <p className="text-[10px] text-white/25">{collectionOutfits.length} outfits en esta coleccion</p>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 bg-white/[0.015] rounded-xl" />)}</div>
          ) : (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-3" variants={stagger} initial="initial" animate="animate">
              {collectionOutfits.map(outfit => (
                <motion.div key={outfit.id} variants={fadeUp}>
                  <Card className="weekly-card-shine bg-white/[0.015] border-white/[0.04] rounded-xl p-4 hover:bg-white/[0.03] transition-all duration-300 group cursor-pointer"
                    onClick={() => viewOutfit(outfit)}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-white/70 group-hover:text-amber-200 transition-colors truncate">{outfit.nombre}</h4>
                        <p className="text-[10px] text-white/20 line-clamp-1 mt-0.5">{outfit.descripcion}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <div className="flex -space-x-1">{outfit.paletaColores.slice(0, 4).map((c, i) => <div key={i} className="w-3.5 h-3.5 rounded-full border border-[#08080a]" style={{ backgroundColor: c }} />)}</div>
                          {isFav(outfit.id) && <Heart className="h-3 w-3 text-rose-400 fill-rose-400 ml-1" />}
                        </div>
                      </div>
                      {detailLoading === outfit.id ? <RefreshCw className="h-4 w-4 text-white/20 animate-spin flex-shrink-0" /> : <Eye className="h-4 w-4 text-white/15 group-hover:text-amber-400 transition-colors flex-shrink-0" />}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
