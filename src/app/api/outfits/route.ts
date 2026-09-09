import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { outfits } = await import('@/data/wardrobe');
    const { searchParams } = new URL(request.url);
    const ocasion = searchParams.get('ocasion');
    const momento = searchParams.get('momento');
    const clima = searchParams.get('clima');
    const estilo = searchParams.get('estilo');
    const limit = parseInt(searchParams.get('limit') || '50');

    let filtered = outfits;
    if (ocasion) filtered = filtered.filter((o: any) => o.ocasion.includes(ocasion));
    if (momento) filtered = filtered.filter((o: any) => o.momento.includes(momento));
    if (clima) filtered = filtered.filter((o: any) => o.clima.includes(clima));
    if (estilo) filtered = filtered.filter((o: any) => o.estilo.includes(estilo));

    return NextResponse.json({ total: filtered.length, outfits: filtered.slice(0, limit) });
  } catch (error) {
    console.error('Outfits API error:', error);
    return NextResponse.json({ total: 0, outfits: [] }, { status: 500 });
  }
}
