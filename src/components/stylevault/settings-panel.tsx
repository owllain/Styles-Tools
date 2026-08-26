'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LABELS, type Ocasion, type Momento, type Clima, type Estilo } from '@/data/types';
import {
  Sparkles, Shirt, Layers, Briefcase, RefreshCw, SlidersHorizontal,
  Sun, Moon, CloudSun, Flame, Snowflake, Wine, Music, Crown,
} from 'lucide-react';

const OCASION_OPTIONS: { value: Ocasion; icon: React.ReactNode; desc: string; accent: string }[] = [
  { value: 'oficina', icon: <Briefcase className="h-4 w-4" />, desc: 'Reunion, cliente, gerencia', accent: 'from-blue-500/20 to-blue-600/5' },
  { value: 'oficina_casual', icon: <Shirt className="h-4 w-4" />, desc: 'Viernes, home office', accent: 'from-sky-500/20 to-sky-600/5' },
  { value: 'salida', icon: <Sparkles className="h-4 w-4" />, desc: 'Concierto, bar, fiesta', accent: 'from-fuchsia-500/20 to-fuchsia-600/5' },
  { value: 'after_office', icon: <Wine className="h-4 w-4" />, desc: 'Cena, copas, transicion', accent: 'from-purple-500/20 to-purple-600/5' },
  { value: 'fin_de_semana', icon: <Sun className="h-4 w-4" />, desc: 'Sabado, domingo, relax', accent: 'from-emerald-500/20 to-emerald-600/5' },
];

const MOMENTO_OPTIONS: { value: Momento; icon: React.ReactNode; desc: string }[] = [
  { value: 'dia', icon: <Sun className="h-4 w-4" />, desc: 'Manana' },
  { value: 'tarde', icon: <CloudSun className="h-4 w-4" />, desc: 'Atardecer' },
  { value: 'noche', icon: <Moon className="h-4 w-4" />, desc: 'Noche' },
];

const CLIMA_OPTIONS: { value: Clima; icon: React.ReactNode; desc: string }[] = [
  { value: 'frio', icon: <Snowflake className="h-4 w-4" />, desc: '< 18C' },
  { value: 'templado', icon: <CloudSun className="h-4 w-4" />, desc: '18-26C' },
  { value: 'calor', icon: <Flame className="h-4 w-4" />, desc: '> 26C' },
];

const ESTILO_OPTIONS: { value: Estilo; desc: string; icon: React.ReactNode; color: string }[] = [
  { value: 'noir', desc: 'Noir Sophistique', icon: <Crown className="h-3.5 w-3.5" />, color: 'text-gray-300' },
  { value: 'old_money', desc: 'Old Money', icon: <Crown className="h-3.5 w-3.5" />, color: 'text-amber-300' },
  { value: 'rockero', desc: 'Rockero / Metal', icon: <Music className="h-3.5 w-3.5" />, color: 'text-red-400' },
  { value: 'corporate', desc: 'Corporate Tech', icon: <Crown className="h-3.5 w-3.5" />, color: 'text-sky-400' },
];

interface Props {
  ocasion: Ocasion | null; setOcasion: (v: Ocasion | null) => void;
  momento: Momento | null; setMomento: (v: Momento | null) => void;
  clima: Clima | null; setClima: (v: Clima | null) => void;
  estilo: Estilo | null; setEstilo: (v: Estilo | null) => void;
  onSuggest: () => void; loading: boolean;
}

export function SettingsPanel({ ocasion, setOcasion, momento, setMomento, clima, setClima, estilo, setEstilo, onSuggest, loading }: Props) {
  const hasAnyFilter = ocasion || momento || clima || estilo;
  const filterCount = [ocasion, momento, clima, estilo].filter(Boolean).length;
  const clearFilters = () => { setOcasion(null); setMomento(null); setClima(null); setEstilo(null); };

  return (
    <div className="sticky top-24">
      <Card className="bg-white/[0.02] border-white/[0.05] rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl shadow-black/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-white/90 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-amber-500/15 flex items-center justify-center">
                <SlidersHorizontal className="h-3.5 w-3.5 text-amber-400" />
              </div>
              Configura tu Look
            </CardTitle>
            {hasAnyFilter && (
              <Button variant="ghost" size="sm" className="text-[10px] text-white/30 hover:text-rose-400 h-6 px-2 rounded-lg hover:bg-rose-500/5 transition-colors" onClick={clearFilters}>
                Limpiar ({filterCount})
              </Button>
            )}
          </div>
          <CardDescription className="text-[11px] text-white/30">
            Selecciona el contexto para sugerencias inteligentes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pb-6">
          {/* OCASION */}
          <div>
            <label className="text-[10px] font-semibold text-white/35 uppercase tracking-[0.15em] mb-2.5 block">Ocasion</label>
            <div className="space-y-1">
              {OCASION_OPTIONS.map(opt => (
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
          {/* MOMENTO */}
          <div>
            <label className="text-[10px] font-semibold text-white/35 uppercase tracking-[0.15em] mb-2.5 block">Momento del Dia</label>
            <div className="grid grid-cols-3 gap-1.5">
              {MOMENTO_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setMomento(momento === opt.value ? null : opt.value)}
                  className={`flex flex-col items-center gap-1.5 py-3.5 rounded-xl border transition-all duration-200 ${
                    momento === opt.value
                      ? 'bg-white/[0.08] border-white/15 text-white shadow-sm'
                      : 'bg-white/[0.015] border-white/[0.03] text-white/40 hover:bg-white/[0.04]'
                  }`}>
                  {opt.icon}
                  <span className="text-[10px] font-medium">{LABELS.momento[opt.value]}</span>
                </button>
              ))}
            </div>
          </div>
          <Separator className="bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          {/* CLIMA */}
          <div>
            <label className="text-[10px] font-semibold text-white/35 uppercase tracking-[0.15em] mb-2.5 block">Clima</label>
            <div className="grid grid-cols-3 gap-1.5">
              {CLIMA_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setClima(clima === opt.value ? null : opt.value)}
                  className={`flex flex-col items-center gap-1.5 py-3.5 rounded-xl border transition-all duration-200 ${
                    clima === opt.value
                      ? 'bg-white/[0.08] border-white/15 text-white shadow-sm'
                      : 'bg-white/[0.015] border-white/[0.03] text-white/40 hover:bg-white/[0.04]'
                  }`}>
                  {opt.icon}
                  <span className="text-[10px] font-medium">{LABELS.clima[opt.value]}</span>
                </button>
              ))}
            </div>
          </div>
          <Separator className="bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          {/* ESTILO */}
          <div>
            <label className="text-[10px] font-semibold text-white/35 uppercase tracking-[0.15em] mb-2.5 block">Estetica</label>
            <div className="grid grid-cols-2 gap-1.5">
              {ESTILO_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setEstilo(estilo === opt.value ? null : opt.value)}
                  className={`px-3 py-3 rounded-xl border text-center transition-all duration-200 flex items-center justify-center gap-2 ${
                    estilo === opt.value
                      ? 'bg-white/[0.08] border-white/15 shadow-sm'
                      : 'bg-white/[0.015] border-white/[0.03] text-white/40 hover:bg-white/[0.04]'
                  }`}>
                  <span className={estilo === opt.value ? opt.color : 'text-white/20'}>{opt.icon}</span>
                  <span className={`text-[11px] font-medium ${estilo === opt.value ? 'text-white' : ''}`}>{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
          {/* BUTTON */}
          <Button onClick={onSuggest} disabled={loading}
            className="w-full h-13 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 hover:from-amber-500 hover:via-amber-600 hover:to-amber-800 text-amber-50 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-amber-900/25 hover:shadow-amber-800/30 border border-amber-600/20 active:scale-[0.98]">
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <><Sparkles className="h-4 w-4 mr-2" />Generar Sugerencias</>}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
