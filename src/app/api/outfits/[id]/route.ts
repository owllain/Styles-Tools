import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { outfits, getPrenda } = await import('@/data/wardrobe');
    const { id } = await params;
    const outfit = outfits.find((o: Record<string, unknown>) => o.id === id);

    if (!outfit) {
      return NextResponse.json({ success: false, error: 'Outfit not found' }, { status: 404 });
    }

    const garmentIds = [outfit.prendaSuperior, outfit.pantalon, outfit.calzado, outfit.corbata, outfit.abrigo, ...(outfit.accesorios || [])].filter(Boolean) as string[];
    const garments = garmentIds.map(id => {
      const p = getPrenda(id);
      return p ? { id: p.id, nombre: p.nombre, emoji: p.emoji, color: p.color, colorHex: p.colorHex } : { id, nombre: id, emoji: '', color: '', colorHex: '' };
    });

    return NextResponse.json({ success: true, outfit, garments });
  } catch (error) {
    console.error('Outfit detail API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
