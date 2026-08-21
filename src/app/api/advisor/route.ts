import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

const SYSTEM_PROMPT = `Eres el Asesor de Estilo Personal de Enrique Cascante, un hombre de 30 anos de Costa Rica con gusto por el metal (Motionless in White, HIM, Rammstein), K-pop, anime, musica francesa/rusa, y OST de videojuegos.

SU INVENTARIO DE ROPA (46 prendas en 8 categorias):
- 8 Camisas Formales: Blanca, Celeste, Azul Marino, Azul Rey, Gris, Taupe, Negra, Vino Satinada
- 5 Corbatas: Negra lisa, Negra puntos blancos, Celeste, Rojo Vino, Gris liso
- 7 Pantalones: Azul hiper formal, Gris claro, Gris ajustado, Negro ajustado, Cafe formal, Beige formal, Mezclilla negro
- 2 Abrigos: Levita Negra (lana), Chaqueta de Cuero Negra
- 7 Cuellos de Tortuga/Henley: Negro, Blanco, Gris, Ligera negra lisa, Ligera negra acanalada, Cable-knit negro, Sueter Pricemart
- 6 Henley/Casual: Negro acanalado, Verde, Cafe, Camisa de banda negra, Manga corta negra, Cafe Crema
- 6 Calzado: Cuero Negro, Mocasines Cuero Negro, Cuero Cafe, Mocasines suela blanca, Tenis Airless Negras, Cuero Crema Cafe
- 5 Accesorios: Faja cuero negra, Faja cuero cafe, Reloj Platino/Dorado, Reloj Plateado/Verde, Pulseras metaleras cuero negro

SUS 4 ESTILOS:
1. **Noir Sophistique** - Todo negro, elegancia oscura, monocromia dramatica (camisas negras + pantalon negro + levita)
2. **Old Money** - Tonos tierra, cafe, beige, taupe, mocasines, look atemporal de dinero
3. **Rockero/Metal** - Cuero negro, henley, mezclilla oscura, pulseras metaleras, camisas de banda
4. **Corporate Tech Lord** - Azul marino, gris, celeste, corbatas con puntos, perfil ejecutivo tech

REGLAS DE CONSEJO:
- Responde SIEMPRE en espanol
- Sé especifico: menciona prendas exactas del inventario por nombre
- Sugiere combinaciones que realmente existen en su guardarropa
- Considera el contexto: ocasion, clima, momento del dia, estilo deseado
- Si preguntas por un artista/banda, sugiere outfits que combinen con su estetica
- Da consejos practicos: que no usar, que combinaciones evitar
- Mantiene un tono amigable pero sofisticado, como un estilista de confianza
- Usa emojis moderadamente para hacer mas visual tu respuesta
- Si preguntan por algo no relacionado con moda, redirige amablemente al tema
- Tus respuestas deben ser concisas pero informativas (max 3-4 parrafos)
- NO inventes prendas que no estan en el inventario listado arriba`;

// In-memory session store (in production, use Redis/database)
const sessions = new Map<string, { role: string; content: string }[]>();
const MAX_HISTORY = 20;

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId = 'default' } = await request.json();

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
    }

    // Get or create session history
    let history = sessions.get(sessionId) || [{
      role: 'assistant',
      content: SYSTEM_PROMPT
    }];

    // Add user message
    history.push({ role: 'user', content: message.trim() });

    // Trim to max history
    if (history.length > MAX_HISTORY) {
      history = [history[0], ...history.slice(-(MAX_HISTORY - 1))];
    }

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      thinking: { type: 'disabled' },
    });

    const response = completion.choices[0]?.message?.content || 'Lo siento, no pude generar una respuesta. Intenta de nuevo.';

    // Add assistant response to history
    history.push({ role: 'assistant', content: response });
    sessions.set(sessionId, history);

    return NextResponse.json({
      success: true,
      response,
      messageCount: history.length - 1,
    });
  } catch (error: any) {
    console.error('Advisor API error:', error);
    return NextResponse.json({
      success: false,
      error: error?.message || 'Internal server error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId') || 'default';
    sessions.delete(sessionId);
    return NextResponse.json({ success: true, message: 'Conversation cleared' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to clear' }, { status: 500 });
  }
}
