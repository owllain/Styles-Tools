import { NextRequest, NextResponse } from 'next/server';

type OutfitRef = {
  id: string;
  nombre: string;
  descripcion: string;
  paletaColores: string[];
  estilo: string[];
  ocasion: string[];
};

// ── Helpers ────────────────────────────────────────────────────

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hueDiff(h1: number, h2: number): number {
  const diff = Math.abs(h1 - h2);
  return Math.min(diff, 360 - diff);
}

function isHighHarmony(paletaColores: string[]): boolean {
  if (paletaColores.length === 0) return false;

  const hslValues = paletaColores.map(hexToHSL);
  const neutrals = hslValues.filter(c => c.s < 15);
  const chromatic = hslValues.filter(c => c.s >= 15);
  const neutralRatio = neutrals.length / hslValues.length;

  // Mostly neutral (80%+) → high harmony
  if (neutralRatio >= 0.8) return true;

  // If we have chromatic colors, check if they're mostly analogous
  if (chromatic.length >= 2 && neutrals.length >= 1) {
    let analogousCount = 0;
    for (let i = 0; i < chromatic.length; i++) {
      let hasAnalogous = false;
      for (let j = 0; j < chromatic.length; j++) {
        if (i !== j && hueDiff(chromatic[i].h, chromatic[j].h) < 30) {
          hasAnalogous = true;
          break;
        }
      }
      if (hasAnalogous) analogousCount++;
    }
    const analogousRatio = analogousCount / chromatic.length;
    if (analogousRatio >= 0.6) return true;
  }

  return false;
}

function toOutfitSummary(o: { id: string; nombre: string; descripcion: string; paletaColores: string[]; estilo: string[]; ocasion: string[] }): OutfitRef {
  return {
    id: o.id,
    nombre: o.nombre,
    descripcion: o.descripcion,
    paletaColores: o.paletaColores,
    estilo: o.estilo,
    ocasion: o.ocasion,
  };
}

// ── Collection definitions ─────────────────────────────────────

interface CollectionDef {
  id: string;
  nombre: string;
  emoji: string;
  descripcion: string;
  color: string;
  filter: (outfit: any) => boolean;
}

const COLLECTIONS: CollectionDef[] = [
  {
    id: 'power-week',
    nombre: 'Semana de Poder',
    emoji: '🏢',
    descripcion: 'Looks de oficina formales y casuales con estilo corporativo para dominar la semana laboral.',
    color: '#3b82f6',
    filter: (o) =>
      (o.ocasion.includes('oficina') || o.ocasion.includes('oficina_casual')) &&
      o.estilo.includes('corporate'),
  },
  {
    id: 'noir-collection',
    nombre: 'Noir Total',
    emoji: '🖤',
    descripcion: 'Outfits donde todos los colores de la paleta son oscuros — misterio y elegancia absoluta.',
    color: '#6b7280',
    filter: (o) =>
      o.paletaColores.length > 0 &&
      o.paletaColores.every(hex => {
        const { l } = hexToHSL(hex);
        return l < 40;
      }),
  },
  {
    id: 'weekend-vibes',
    nombre: 'Fin de Semana Perfecto',
    emoji: '✨',
    descripcion: 'Los mejores looks para disfrutar del sábado y domingo con estilo y comodidad.',
    color: '#f59e0b',
    filter: (o) => o.ocasion.includes('fin_de_semana'),
  },
  {
    id: 'night-out',
    nombre: 'Noches de Rock',
    emoji: '🎸',
    descripcion: 'Outfits nocturnos con actitud rockera o estética noir para after-office y salidas.',
    color: '#8b5cf6',
    filter: (o) =>
      o.momento.includes('noche') &&
      (o.estilo.includes('rockero') || o.estilo.includes('noir')),
  },
  {
    id: 'old-money-essentials',
    nombre: 'Esencia Old Money',
    emoji: '🍷',
    descripcion: 'La colección definitiva de elegancia discreta — tonos tierra, texturas refinadas, clase heredada.',
    color: '#a16207',
    filter: (o) => o.estilo.includes('old_money'),
  },
  {
    id: 'hot-weather',
    nombre: 'Looks para Calor',
    emoji: '☀️',
    descripcion: 'Combinaciones ligeras y frescas para días calurosos sin sacrificar el estilo.',
    color: '#ef4444',
    filter: (o) => o.clima.includes('calor'),
  },
  {
    id: 'cold-weather',
    nombre: 'Abrigos y Elegancia',
    emoji: '❄️',
    descripcion: 'Capas, texturas y abrigos para enfrentar el frío con máxima sofisticación.',
    color: '#06b6d4',
    filter: (o) => o.clima.includes('frio'),
  },
  {
    id: 'high-harmony',
    nombre: 'Armonia Perfecta',
    emoji: '🎨',
    descripcion: 'Outfits con paletas de colores excepcionalmente armoniosas — analogía, neutros y cohesión cromática.',
    color: '#10b981',
    filter: (o) => isHighHarmony(o.paletaColores),
  },
];

// ── GET handler ─────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { outfits } = await import('@/data/wardrobe');

  const { searchParams } = new URL(request.url);
  const collectionId = searchParams.get('collection');

  const buildResult = (def: CollectionDef) => {
    const matched = outfits.filter(def.filter);
    return {
      id: def.id,
      nombre: def.nombre,
      emoji: def.emoji,
      descripcion: def.descripcion,
      color: def.color,
      outfitCount: matched.length,
      outfits: matched.slice(0, 6).map(toOutfitSummary),
    };
  };

  // Single collection
  if (collectionId) {
    const def = COLLECTIONS.find(c => c.id === collectionId);
    if (!def) {
      return NextResponse.json(
        { success: false, error: `Collection '${collectionId}' not found`, available: COLLECTIONS.map(c => c.id) },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, collection: buildResult(def) });
  }

  // All collections
  const collections = COLLECTIONS.map(buildResult);
  return NextResponse.json({ success: true, collections });
}
