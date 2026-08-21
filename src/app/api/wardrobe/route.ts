import { NextResponse } from 'next/server';
import type { Categoria } from '@/data/types';

export async function GET(request: Request) {
  try {
    const { prendas, categorias } = await import('@/data/wardrobe');
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria') as Categoria | null;

    let items = prendas;
    if (categoria) items = items.filter((p: any) => p.categoria === categoria);

    return NextResponse.json({ total: items.length, prendas: items, categorias });
  } catch (error) {
    console.error('Wardrobe API error:', error);
    return NextResponse.json({ total: 0, prendas: [], categorias: [] }, { status: 500 });
  }
}
