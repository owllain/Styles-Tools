import { NextRequest, NextResponse } from 'next/server';
import type { Ocasion, Momento, Clima, Estilo } from '@/data/types';

export async function POST(request: NextRequest) {
  try {
    const { outfits, getPrenda } = await import('@/data/wardrobe');
    const body = await request.json();
    const { ocasion, momento, clima, estilo, count = 5 } = body as {
      ocasion?: Ocasion; momento?: Momento; clima?: Clima; estilo?: Estilo; count?: number;
    };

    const hasFilters = ocasion || momento || clima || estilo;

    const scored = outfits.map((outfit: any) => {
      const matchDetails = {
        ocasion: !ocasion || outfit.ocasion.includes(ocasion),
        momento: !momento || outfit.momento.includes(momento),
        clima: !clima || outfit.clima.includes(clima),
        estilo: !estilo || outfit.estilo.includes(estilo),
      };

      let score = 0;
      if (matchDetails.ocasion && ocasion) score += 40;
      if (matchDetails.momento && momento) score += 20;
      if (matchDetails.clima && clima) score += 25;
      if (matchDetails.estilo && estilo) score += 15;

      if (hasFilters) {
        const activeFilters = [ocasion, momento, clima, estilo].filter(Boolean);
        const matchedCount = [matchDetails.ocasion, matchDetails.momento, matchDetails.clima, matchDetails.estilo]
          .filter((m, i) => [ocasion, momento, clima, estilo][i] && m).length;
        if (matchedCount === 0) score = -1;
        else if (matchedCount < activeFilters.length) score *= (matchedCount / activeFilters.length);
      } else {
        score = Math.random() * 100;
      }

      const garmentIds = [outfit.prendaSuperior, outfit.pantalon, outfit.calzado, outfit.corbata, outfit.abrigo, ...outfit.accesorios].filter(Boolean);
      const garments = garmentIds.map((id: string) => {
        const p = getPrenda(id);
        return p ? { id: p.id, nombre: p.nombre, emoji: p.emoji, color: p.color, colorHex: p.colorHex } : { id, nombre: id, emoji: '', color: '', colorHex: '' };
      });

      return { outfit, score, matchDetails, garments };
    });

    const filtered = scored.filter((s: any) => s.score >= 0).sort((a: any, b: any) => (b.score + Math.random() * 10) - (a.score + Math.random() * 10));
    const results = filtered.slice(0, Math.min(count, filtered.length));
    const totalMatched = scored.filter((s: any) => s.score >= 0).length;

    return NextResponse.json({ success: true, query: { ocasion, momento, clima, estilo }, totalAvailable: totalMatched, totalInDatabase: outfits.length, suggestions: results });
  } catch (error) {
    console.error('Suggest API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
