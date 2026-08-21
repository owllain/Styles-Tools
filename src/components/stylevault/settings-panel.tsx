'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LABELS, type Ocasion, type Momento, type Clima, type Estilo } from '@/data/types';
import {
  Sparkles, Shirt, Layers, Briefcase, RefreshCw, SlidersHorizontal,
  Sun, Moon, CloudSun, Flame, Snowflake,
} from 'lucide-react';

const OCASION_OPTIONS: { value: Ocasion; icon: React.ReactNode; desc: string }[] = [
  { value: 'oficina', icon: <Briefcase className="h-4 w-4" />, desc: 'Reunion, cliente, gerencia' },
  { value: 'oficina_casual', icon: <Shirt className="h-4 w-4" />, desc: 'Viernes, home office, casual' },
  { value: 'salida', icon: <Sparkles className="h-4 w-4" />, desc: 'Concierto, bar, fiesta' },
  { value: 'after_office', icon: <Layers className="h-4 w-4" />, desc: 'Cena, copas, transicion' },
  { value: 'fin_de_semana', icon: <Sun className="h-4 w-4" />, desc: 'Sabado, domingo, relax' },
];

const MOMENTO_OPTIONS: { value: Momento; icon: React.ReactNode; desc: string }[] = [
  { value: 'dia', icon: <Sun className="h-4 w-4" />, desc: 'Manana / Mediodia' },
  { value: 'tarde', icon: <CloudSun className="h-4 w-4" />, desc: 'Atardecer' },
  { value: 'noche', icon: <Moon className="h-4 w-4" />, desc: 'Noche' },
];

const CLIMA_OPTIONS: { value: Clima; icon: React.ReactNode; desc: string }[] = [
  { value: 'frio', icon: <Snowflake className="h-4 w-4" />, desc: '< 18 grados' },
  { value: 'templado', icon: <CloudSun className="h-4 w-4" />, desc: '18-26 grados' },
  { value: 'calor', icon: <Flame className="h-4 w-4" />, desc: '> 26 grados' },
];

const ESTILO_OPTIONS: { value: Estilo; desc: string }[] = [
  { value: 'noir', desc: 'Noir Sophistique' },
  { value: 'old_money', desc: 'Old Money' },
  { value: 'rockero', desc: 'Rockero / Metal' },
  { value: 'corporate', desc: 'Corporate Tech Lord' },
];

interface Props {
  ocasion: Ocasion | null;
  setOcasion: (v: Ocasion | null) => void;
  momento: Momento | null;
  setMomento: (v: Momento | null) => void;
  clima: Clima | null;
  setClima: (v: Clima | null) => void;
  estilo: Estilo | null;
  setEstilo: (v: Estilo | null) => void;
  onSuggest: () => void;
  loading: boolean;
}

export function SettingsPanel({ ocasion, setOcasion, momento, setMomento, clima, setClima, estilo, setEstilo, onSuggest, loading }: Props) {
  const hasAnyFilter = ocasion || momento || clima || estilo;
  const filterCount = [ocasion, momento, clima, estilo].filter(Boolean).length;
  const clearFilters = () => { setOcasion(null); setMomento(null); setClima(null); setEstilo(null); };

  return (
    <div className="sticky top-24">
      <Card className="bg-white/[0.03] border-white/[0.06] rounded-2xl overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-white/90 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-amber-500" />
              Configura tu Look
            </CardTitle>
            {hasAnyFilter && (
              <Button variant="ghost" size="sm" className="text-[10px] text-white/40 hover:text-white/70 h-7 px-2" onClick={clearFilters}>
                Limpiar ({filterCount})
              </Button>
            )}
          </div>
          <CardDescription className="text-xs text-white/40">
            Selecciona el contexto para obtener sugerencias inteligentes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pb-6">
          {/* OCASION */}
          <div>
            <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider mb-2 block">Ocasion</label>
            <div className="space-y-1.5">
              {OCASION_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setOcasion(ocasion === opt.value ? null : opt.value)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                    ocasion === opt.value
                      ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
                      : 'bg-white/[0.02] border border-white/[0.04] text-white/60 hover:bg-white/[0.05] hover:text-white/80'
                  }`}>
                  <div className={`p-1.5 rounded-lg ${ocasion === opt.value ? 'bg-amber-500/20' : 'bg-white/[0.04]'}`}>{opt.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{LABELS.ocasion[opt.value]}</div>
                    <div className={`text-[10px] mt-0.5 ${ocasion === opt.value ? 'text-amber-400/60' : 'text-white/30'}`}>{opt.desc}</div>
                  </div>
                  {ocasion === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                </button>
              ))}
            </div>
          </div>
          <Separator className="bg-white/[0.06]" />
          {/* MOMENTO */}
          <div>
            <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider mb-2 block">Momento del Dia</label>
            <div className="grid grid-cols-3 gap-1.5">
              {MOMENTO_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setMomento(momento === opt.value ? null : opt.value)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all duration-200 ${
                    momento === opt.value
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                      : 'bg-white/[0.02] border-white/[0.04] text-white/50 hover:bg-white/[0.05]'
                  }`}>
                  {opt.icon}
                  <span className="text-[10px] font-medium">{LABELS.momento[opt.value]}</span>
                </button>
              ))}
            </div>
          </div>
          <Separator className="bg-white/[0.06]" />
          {/* CLIMA */}
          <div>
            <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider mb-2 block">Clima</label>
            <div className="grid grid-cols-3 gap-1.5">
              {CLIMA_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setClima(clima === opt.value ? null : opt.value)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all duration-200 ${
                    clima === opt.value
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                      : 'bg-white/[0.02] border-white/[0.04] text-white/50 hover:bg-white/[0.05]'
                  }`}>
                  {opt.icon}
                  <span className="text-[10px] font-medium">{LABELS.clima[opt.value]}</span>
                </button>
              ))}
            </div>
          </div>
          <Separator className="bg-white/[0.06]" />
          {/* ESTILO */}
          <div>
            <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider mb-2 block">Estetica</label>
            <div className="grid grid-cols-2 gap-1.5">
              {ESTILO_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setEstilo(estilo === opt.value ? null : opt.value)}
                  className={`px-3 py-2.5 rounded-xl border text-center transition-all duration-200 ${
                    estilo === opt.value
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                      : 'bg-white/[0.02] border-white/[0.04] text-white/50 hover:bg-white/[0.05]'
                  }`}>
                  <span className="text-[11px] font-medium">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
          {/* BUTTON */}
          <Button onClick={onSuggest} disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-amber-50 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-amber-900/20">
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <><Sparkles className="h-4 w-4 mr-2" />Generar Sugerencias</>}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
