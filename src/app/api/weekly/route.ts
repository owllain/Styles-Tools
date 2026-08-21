import { NextRequest, NextResponse } from 'next/server';
import type { Clima, Estilo } from '@/data/types';

const DAY_NAMES = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
const DAY_LABELS = ['Domingo', 'Lunes', 'Martes', 'Mi\u00e9rcoles', 'Jueves', 'Viernes', 'S\u00e1bado'];

const DAY_PROFILES: Record<string, { ocasion: string; momento: string; clima: Clima; estilo: Estilo }> = {
  domingo: { ocasion: 'fin_de_semana', momento: 'dia', clima: 'templado', estilo: 'old_money' },
  lunes: { ocasion: 'oficina', momento: 'dia', clima: 'templado', estilo: 'corporate' },
  martes: { ocasion: 'oficina', momento: 'dia', clima: 'templado', estilo: 'noir' },
  miercoles: { ocasion: 'oficina', momento: 'dia', clima: 'templado', estilo: 'corporate' },
  jueves: { ocasion: 'oficina', momento: 'dia', clima: 'templado', estilo: 'noir' },
  viernes: { ocasion: 'oficina_casual', momento: 'tarde', clima: 'templado', estilo: 'old_money' },
  sabado: { ocasion: 'fin_de_semana', momento: 'dia', clima: 'calor', estilo: 'rockero' },
};

export async function POST(request: NextRequest) {
  try {
    const { outfits, getPrenda } = await import('@/data/wardrobe');
    const body = await request.json();
    const climaOverride = body.clima as Clima | undefined;
    const estiloOverride = body.estilo as Estilo | undefined;
    const today = new Date();
    const todayIdx = today.getDay();
    const week: Array<{ day: string; dayLabel: string; dateStr: string; outfit: any; garments: any[]; score: number }> = [];

    for (let offset = 0; offset < 7; offset++) {
      const d = new Date(today);
      d.setDate(d.getDate() + offset);
      const dayIdx = d.getDay();
      const dayKey = DAY_NAMES[dayIdx];
      const profile = DAY_PROFILES[dayKey];
      const clima = climaOverride || profile.clima;
      const estilo = estiloOverride || profile.estilo;

      const scored = outfits.map((outfit: any) => {
        const matchDetails = {
          ocasion: outfit.ocasion.includes(profile.ocasion),
          momento: outfit.momento.includes(profile.momento),
          clima: outfit.clima.includes(clima),
          estilo: outfit.estilo.includes(estilo),
        };
        let score = 0;
        if (matchDetails.ocasion) score += 40;
        if (matchDetails.momento) score += 20;
        if (matchDetails.clima) score += 25;
        if (matchDetails.estilo) score += 15;
        if ([matchDetails.ocasion, matchDetails.momento, matchDetails.clima, matchDetails.estilo].filter(Boolean).length === 0) score = -1;
        return { outfit, score, matchDetails };
      }).filter((s: any) => s.score >= 0);

      scored.sort((a: any, b: any) => (b.score + Math.random() * 15) - (a.score + Math.random() * 15));
      const pick = scored[0];

      if (pick) {
        const garmentIds = [pick.outfit.prendaSuperior, pick.outfit.pantalon, pick.outfit.calzado, pick.outfit.corbata, pick.outfit.abrigo, ...pick.outfit.accesorios].filter(Boolean);
        const garments = garmentIds.map((id: string) => {
          const p = getPrenda(id);
          return p ? { id: p.id, nombre: p.nombre, emoji: p.emoji, color: p.color, colorHex: p.colorHex } : { id, nombre: id, emoji: '', color: '', colorHex: '' };
        });
        const dateStr = d.toLocaleDateString('es-CR', { weekday: 'short', day: 'numeric', month: 'short' });
        week.push({ day: dayKey, dayLabel: DAY_LABELS[dayIdx], dateStr, outfit: pick.outfit, garments, score: pick.score });
      }
    }

    return NextResponse.json({ success: true, week, todayIdx });
  } catch (error) {
    console.error('Weekly API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
