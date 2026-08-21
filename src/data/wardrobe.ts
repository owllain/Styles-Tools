// ============================================================
// STYLEVAULT - Wardrobe Database for Enrique
// ============================================================

export interface Garment {
  id: string;
  nombre: string;
  categoria: Categoria;
  color: string;
  colorHex: string;
  formalidad: number; // 1-5, 5=most formal
  emoji: string;
  notas?: string;
}

export type Categoria =
  | 'camisas_formales'
  | 'corbatas'
  | 'pantalones'
  | 'abrigos'
  | 'cuellos_tortuga'
  | 'henley_casual'
  | 'calzado'
  | 'accesorios';

export type Ocasion = 'oficina' | 'oficina_casual' | 'salida' | 'after_office' | 'fin_de_semana';
export type Momento = 'dia' | 'tarde' | 'noche';
export type Clima = 'frio' | 'templado' | 'calor';
export type Estilo = 'noir' | 'old_money' | 'rockero' | 'corporate';

export interface OutfitCombination {
  id: string;
  nombre: string;
  descripcion: string;
  ocasion: Ocasion[];
  momento: Momento[];
  clima: Clima[];
  estilo: Estilo[];
  prendaSuperior: string;
  pantalon: string;
  calzado: string;
  corbata?: string;
  abrigo?: string;
  accesorios: string[];
  paletaColores: string[];
}

export const LABELS: Record<string, Record<string, string>> = {
  ocasion: {
    oficina: 'Oficina Formal',
    oficina_casual: 'Oficina Casual',
    salida: 'Salida / Noche',
    after_office: 'After Office',
    fin_de_semana: 'Fin de Semana',
  },
  momento: {
    dia: 'Día',
    tarde: 'Tarde',
    noche: 'Noche',
  },
  clima: {
    frio: 'Frío',
    templado: 'Templado',
    calor: 'Calor',
  },
  estilo: {
    noir: 'Noir Sophistiqué',
    old_money: 'Old Money',
    rockero: 'Rockero / Metal',
    corporate: 'Corporate Tech Lord',
  },
};

// ============================================================
// GARMENTS DATABASE
// ============================================================

export const prendas: Garment[] = [
  // --- CAMISAS FORMALES ---
  { id: 'cf-1', nombre: 'Camisa Blanca formal ajustada', categoria: 'camisas_formales', color: 'Blanco', colorHex: '#FAFAFA', formalidad: 5, emoji: '👔', notas: 'El lienzo de poder y pulcritud' },
  { id: 'cf-2', nombre: 'Camisa Celeste formal', categoria: 'camisas_formales', color: 'Celeste', colorHex: '#87CEEB', formalidad: 5, emoji: '👔', notas: 'La clásica bancaria por excelencia' },
  { id: 'cf-3', nombre: 'Camisa Azul Marino', categoria: 'camisas_formales', color: 'Azul Marino', colorHex: '#1B2A4A', formalidad: 5, emoji: '👔', notas: 'Manga larga, autoridad oscura' },
  { id: 'cf-4', nombre: 'Camisa Azul Rey', categoria: 'camisas_formales', color: 'Azul Rey', colorHex: '#4169E1', formalidad: 4, emoji: '👔', notas: 'Vibrante, para combinar con tonos tierra' },
  { id: 'cf-5', nombre: 'Camisa Gris ajustada', categoria: 'camisas_formales', color: 'Gris', colorHex: '#6B7280', formalidad: 4, emoji: '👔', notas: 'Perfil tecnológico y moderno' },
  { id: 'cf-6', nombre: 'Camisa Taupe', categoria: 'camisas_formales', color: 'Taupe', colorHex: '#8B7355', formalidad: 4, emoji: '👔', notas: 'Tono tierra refinado y neutral' },
  { id: 'cf-7', nombre: 'Camisa Negra formal', categoria: 'camisas_formales', color: 'Negro', colorHex: '#1A1A1A', formalidad: 4, emoji: '👔', notas: 'Manga larga, uso estratégico/jueves' },
  { id: 'cf-8', nombre: 'Camisa Vino satinada', categoria: 'camisas_formales', color: 'Vino', colorHex: '#722F37', formalidad: 4, emoji: '👔', notas: 'Brillo sutil para transiciones nocturnas' },

  // --- CORBATAS ---
  { id: 'co-1', nombre: 'Corbata Negra lisa', categoria: 'corbatas', color: 'Negro', colorHex: '#1A1A1A', formalidad: 5, emoji: '🪢', notas: 'Rigidez y formalidad absoluta' },
  { id: 'co-2', nombre: 'Corbata Negra con puntos blancos', categoria: 'corbatas', color: 'Negro', colorHex: '#1A1A1A', formalidad: 4, emoji: '🪢', notas: 'Textura visual, perfil Tech' },
  { id: 'co-3', nombre: 'Corbata Celeste', categoria: 'corbatas', color: 'Celeste', colorHex: '#87CEEB', formalidad: 4, emoji: '🪢', notas: 'Monocromía y diplomacia' },
  { id: 'co-4', nombre: 'Corbata Rojo Vino', categoria: 'corbatas', color: 'Rojo Vino', colorHex: '#722F37', formalidad: 4, emoji: '🪢', notas: 'Contraste de alto mando / Power Tie' },
  { id: 'co-5', nombre: 'Corbata Gris liso', categoria: 'corbatas', color: 'Gris', colorHex: '#6B7280', formalidad: 4, emoji: '🪢', notas: 'Sofisticación y degradado neutro' },

  // --- PANTALONES ---
  { id: 'pa-1', nombre: 'Pantalón Azul hiper formal', categoria: 'pantalones', color: 'Azul Formal', colorHex: '#1B3A5C', formalidad: 5, emoji: '👖', notas: 'El estándar corporativo' },
  { id: 'pa-2', nombre: 'Pantalón Gris claro', categoria: 'pantalones', color: 'Gris Claro', colorHex: '#D1D5DB', formalidad: 4, emoji: '👖', notas: 'Aporta luz y elegancia diurna' },
  { id: 'pa-3', nombre: 'Pantalón Gris ajustado', categoria: 'pantalones', color: 'Gris', colorHex: '#6B7280', formalidad: 4, emoji: '👖', notas: 'Corte más afilado y moderno' },
  { id: 'pa-4', nombre: 'Pantalón Negro ajustado', categoria: 'pantalones', color: 'Negro', colorHex: '#1A1A1A', formalidad: 4, emoji: '👖', notas: 'Tu pieza de anclaje Noir' },
  { id: 'pa-5', nombre: 'Pantalón Café formal', categoria: 'pantalones', color: 'Café', colorHex: '#5C3A1E', formalidad: 4, emoji: '👖', notas: 'Estética Old Money' },
  { id: 'pa-6', nombre: 'Pantalón Beige formal', categoria: 'pantalones', color: 'Beige', colorHex: '#D4C5A9', formalidad: 3, emoji: '👖', notas: 'Clásico de transición' },
  { id: 'pa-7', nombre: 'Pantalón Mezclilla negro/oscuro', categoria: 'pantalones', color: 'Mezclilla Negra', colorHex: '#2C2C2C', formalidad: 2, emoji: '👖', notas: 'Viernes/Fines de semana' },

  // --- ABRIGOS ---
  { id: 'ab-1', nombre: 'Levita Negra (Chaps de lana)', categoria: 'abrigos', color: 'Negro', colorHex: '#1A1A1A', formalidad: 5, emoji: '🧥', notas: 'Tu pieza firma y marco de poder' },
  { id: 'ab-2', nombre: 'Chaqueta de Cuero Negra', categoria: 'abrigos', color: 'Negro', colorHex: '#1A1A1A', formalidad: 3, emoji: '🧥', notas: 'Modo Rockstar / Dark Luxe' },

  // --- CUELLOS DE TORTUGA ---
  { id: 'ct-1', nombre: 'Suéter cuello de tortuga Negro', categoria: 'cuellos_tortuga', color: 'Negro', colorHex: '#1A1A1A', formalidad: 4, emoji: '👕', notas: 'El clásico monolítico' },
  { id: 'ct-2', nombre: 'Suéter cuello de tortuga Blanco', categoria: 'cuellos_tortuga', color: 'Blanco', colorHex: '#FAFAFA', formalidad: 4, emoji: '👕', notas: 'Contraste de lujo' },
  { id: 'ct-3', nombre: 'Camisa cuello de tortuga Gris', categoria: 'cuellos_tortuga', color: 'Gris', colorHex: '#6B7280', formalidad: 3, emoji: '👕', notas: 'Transición técnica' },
  { id: 'ct-4', nombre: 'Camisa ligera Negra lisa cuello alto', categoria: 'cuellos_tortuga', color: 'Negro', colorHex: '#1A1A1A', formalidad: 3, emoji: '👕', notas: 'Punto fino, ideal para sol/capas' },
  { id: 'ct-5', nombre: 'Camisa ligera Negra acanalada cuello alto', categoria: 'cuellos_tortuga', color: 'Negro', colorHex: '#1A1A1A', formalidad: 3, emoji: '👕', notas: 'Textura vertical' },
  { id: 'ct-6', nombre: 'Suéter Negro trenzado (cable-knit)', categoria: 'cuellos_tortuga', color: 'Negro', colorHex: '#1A1A1A', formalidad: 3, emoji: '👕', notas: 'Textura bajo la levita' },
  { id: 'ct-7', nombre: 'Suéter de Pricemart', categoria: 'cuellos_tortuga', color: 'Variado', colorHex: '#6B7280', formalidad: 1, emoji: '👕', notas: 'Comodidad absoluta para días relax' },

  // --- HENLEY / CASUAL ---
  { id: 'hc-1', nombre: 'Camisa Negra Henley acanalada', categoria: 'henley_casual', color: 'Negro', colorHex: '#1A1A1A', formalidad: 2, emoji: '🎽', notas: 'Cuello alto con botones' },
  { id: 'hc-2', nombre: 'Camisa Verde Henley acanalada', categoria: 'henley_casual', color: 'Verde', colorHex: '#2D5A27', formalidad: 2, emoji: '🎽', notas: 'Cuello alto con botones' },
  { id: 'hc-3', nombre: 'Camisa Café Henley acanalada', categoria: 'henley_casual', color: 'Café', colorHex: '#5C3A1E', formalidad: 2, emoji: '🎽', notas: 'Cuello alto con botones' },
  { id: 'hc-4', nombre: 'Camisa de banda Negra', categoria: 'henley_casual', color: 'Negro', colorHex: '#1A1A1A', formalidad: 1, emoji: '🎽', notas: 'Toque rebelde y minimalista' },
  { id: 'hc-5', nombre: 'Camisa manga corta Negra', categoria: 'henley_casual', color: 'Negro', colorHex: '#1A1A1A', formalidad: 2, emoji: '🎽', notas: 'Climas cálidos/resorts' },
  { id: 'hc-6', nombre: 'Camisa Café Crema', categoria: 'henley_casual', color: 'Café Crema', colorHex: '#F5F0E1', formalidad: 2, emoji: '🎽', notas: 'La de Colombia - Old Money de fin de semana' },

  // --- CALZADO ---
  { id: 'cz-1', nombre: 'Zapatos Cuero Negro', categoria: 'calzado', color: 'Negro', colorHex: '#1A1A1A', formalidad: 5, emoji: '🥾', notas: 'Máxima formalidad bancaria' },
  { id: 'cz-2', nombre: 'Mocasines Cuero Negro', categoria: 'calzado', color: 'Negro', colorHex: '#1A1A1A', formalidad: 4, emoji: '🥾', notas: 'Formalidad sin cordones' },
  { id: 'cz-3', nombre: 'Zapatos Cuero Café', categoria: 'calzado', color: 'Café', colorHex: '#5C3A1E', formalidad: 4, emoji: '🥾', notas: 'Obligatorios con pantalón café/beige' },
  { id: 'cz-4', nombre: 'Mocasines Negros suela blanca', categoria: 'calzado', color: 'Negro', colorHex: '#1A1A1A', formalidad: 3, emoji: '🥾', notas: 'Estilo náutico/fresco para viernes' },
  { id: 'cz-5', nombre: 'Tenis Airless Negras', categoria: 'calzado', color: 'Negro', colorHex: '#1A1A1A', formalidad: 2, emoji: '🥾', notas: 'Comodidad urbana monolítica' },
  { id: 'cz-6', nombre: 'Zapatos Cuero Crema Café', categoria: 'calzado', color: 'Crema Café', colorHex: '#C4A882', formalidad: 3, emoji: '🥾', notas: 'Uso ultra restringido' },

  // --- ACCESORIOS ---
  { id: 'ac-1', nombre: 'Faja de cuero Negra', categoria: 'accesorios', color: 'Negro', colorHex: '#1A1A1A', formalidad: 4, emoji: '🔗', notas: '' },
  { id: 'ac-2', nombre: 'Faja de cuero Café', categoria: 'accesorios', color: 'Café', colorHex: '#5C3A1E', formalidad: 3, emoji: '🔗', notas: '' },
  { id: 'ac-3', nombre: 'Reloj Platino con Dorado', categoria: 'accesorios', color: 'Platino/Dorado', colorHex: '#C0C0C0', formalidad: 5, emoji: '⌚', notas: 'Toque cálido, estatus financiero' },
  { id: 'ac-4', nombre: 'Reloj Plateado con fondo Verde', categoria: 'accesorios', color: 'Plateado/Verde', colorHex: '#A8A8A8', formalidad: 4, emoji: '⌚', notas: 'Toque frío, precisión técnica' },
  { id: 'ac-5', nombre: 'Pulseras metaleras de cuero negro', categoria: 'accesorios', color: 'Negro/Metal', colorHex: '#2C2C2C', formalidad: 1, emoji: '📿', notas: 'After-Office / modo Metalhead' },
];

// ============================================================
// HELPER: get garment by id
// ============================================================
export function getPrenda(id: string): Garment | undefined {
  return prendas.find(p => p.id === id);
}

// ============================================================
// 130+ CURATED OUTFIT COMBINATIONS
// ============================================================

export const outfits: OutfitCombination[] = [
  // === OFICINA FORMAL + CORPORATE ===
  { id: 'o-001', nombre: 'El Banquero Supremo', descripcion: 'La máxima expresión de poder corporativo. Blanco inmaculado con negro absoluto.', ocasion: ['oficina'], momento: ['dia'], clima: ['frio', 'templado'], estilo: ['corporate'], prendaSuperior: 'cf-1', pantalon: 'pa-1', calzado: 'cz-1', corbata: 'co-1', abrigo: 'ab-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#FAFAFA', '#1A1A1A', '#1B3A5C'] },
  { id: 'o-002', nombre: 'Diplomacia Celeste', descripcion: 'Clásico bancario: celeste con azul formal para un lunes impecable.', ocasion: ['oficina'], momento: ['dia'], clima: ['templado'], estilo: ['corporate'], prendaSuperior: 'cf-2', pantalon: 'pa-1', calzado: 'cz-1', corbata: 'co-3', accesorios: ['ac-1', 'ac-4'], paletaColores: ['#87CEEB', '#1B3A5C', '#1A1A1A'] },
  { id: 'o-003', nombre: 'Autoridad Oscura', descripcion: 'Azul marino de cabeza a pie con corbata negra. Presencia imponente.', ocasion: ['oficina'], momento: ['dia', 'tarde'], clima: ['frio', 'templado'], estilo: ['corporate', 'noir'], prendaSuperior: 'cf-3', pantalon: 'pa-1', calzado: 'cz-1', corbata: 'co-1', abrigo: 'ab-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#1B2A4A', '#1A1A1A', '#1B3A5C'] },
  { id: 'o-004', nombre: 'Power Tie Rojo', descripcion: 'Camisa gris con corbata vino para juntas de alto nivel.', ocasion: ['oficina'], momento: ['dia'], clima: ['templado'], estilo: ['corporate'], prendaSuperior: 'cf-5', pantalon: 'pa-3', calzado: 'cz-1', corbata: 'co-4', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#6B7280', '#722F37', '#1A1A1A'] },
  { id: 'o-005', nombre: 'Ejecutivo Nocturno', descripcion: 'Negro total con corbata negra y levita. Para cuando la reunión es después del atardecer.', ocasion: ['oficina', 'after_office'], momento: ['noche'], clima: ['frio'], estilo: ['noir', 'corporate'], prendaSuperior: 'cf-7', pantalon: 'pa-4', calzado: 'cz-1', corbata: 'co-1', abrigo: 'ab-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#1A1A1A', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-006', nombre: 'Jueves Estratégico', descripcion: 'Camisa negra formal sin corbata. El poder silencioso del jueves.', ocasion: ['oficina'], momento: ['dia', 'tarde'], clima: ['templado'], estilo: ['noir', 'corporate'], prendaSuperior: 'cf-7', pantalon: 'pa-4', calzado: 'cz-2', accesorios: ['ac-1', 'ac-4'], paletaColores: ['#1A1A1A', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-007', nombre: 'Tono Tierra Ejecutivo', descripcion: 'Taupe con pantalón gris claro. Sofisticación natural para el corporativo moderno.', ocasion: ['oficina'], momento: ['dia'], clima: ['templado'], estilo: ['corporate', 'old_money'], prendaSuperior: 'cf-6', pantalon: 'pa-2', calzado: 'cz-3', corbata: 'co-5', accesorios: ['ac-2', 'ac-3'], paletaColores: ['#8B7355', '#D1D5DB', '#5C3A1E'] },
  { id: 'o-008', nombre: 'Azul Rey Mandato', descripcion: 'Camisa azul rey con pantalón azul formal. Presencia vibrante de liderazgo.', ocasion: ['oficina'], momento: ['dia'], clima: ['templado', 'calor'], estilo: ['corporate'], prendaSuperior: 'cf-4', pantalon: 'pa-1', calzado: 'cz-1', corbata: 'co-5', accesorios: ['ac-1', 'ac-4'], paletaColores: ['#4169E1', '#1B3A5C', '#6B7280'] },
  { id: 'o-009', nombre: 'Tecnocracia Gris', descripcion: 'Camisa gris ajustada con pantalón gris y mocasines. El uniforme del tech lord.', ocasion: ['oficina', 'oficina_casual'], momento: ['dia', 'tarde'], clima: ['templado'], estilo: ['corporate'], prendaSuperior: 'cf-5', pantalon: 'pa-3', calzado: 'cz-2', corbata: 'co-2', accesorios: ['ac-1', 'ac-4'], paletaColores: ['#6B7280', '#6B7280', '#1A1A1A'] },
  { id: 'o-010', nombre: 'El Purista', descripcion: 'Camisa blanca sin corbata con pantalón gris ajustado. Minimalismo de alto nivel.', ocasion: ['oficina', 'oficina_casual'], momento: ['dia'], clima: ['templado', 'calor'], estilo: ['corporate'], prendaSuperior: 'cf-1', pantalon: 'pa-3', calzado: 'cz-2', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#FAFAFA', '#6B7280', '#1A1A1A'] },
  { id: 'o-011', nombre: 'Levita de Poder', descripcion: 'Camisa blanca + corbata negra + levita. El look completo de impacto al entrar.', ocasion: ['oficina'], momento: ['dia', 'tarde'], clima: ['frio'], estilo: ['corporate', 'noir'], prendaSuperior: 'cf-1', pantalon: 'pa-1', calzado: 'cz-1', corbata: 'co-1', abrigo: 'ab-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#FAFAFA', '#1A1A1A', '#1B3A5C'] },
  { id: 'o-012', nombre: 'Monocromía Celeste', descripcion: 'Camisa y corbata celeste con azul formal. Armonía total bancaria.', ocasion: ['oficina'], momento: ['dia'], clima: ['templado'], estilo: ['corporate'], prendaSuperior: 'cf-2', pantalon: 'pa-1', calzado: 'cz-2', corbata: 'co-3', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#87CEEB', '#1B3A5C', '#1A1A1A'] },

  // === OFICINA CASUAL + CORPORATE TECH ===
  { id: 'o-013', nombre: 'Viernes de Acero', descripcion: 'Henley negro con mezclilla oscura y Airless. El viernes del desarrollador.', ocasion: ['oficina_casual', 'fin_de_semana'], momento: ['dia'], clima: ['templado', 'calor'], estilo: ['corporate', 'noir'], prendaSuperior: 'hc-1', pantalon: 'pa-7', calzado: 'cz-5', accesorios: ['ac-1', 'ac-4'], paletaColores: ['#1A1A1A', '#2C2C2C', '#1A1A1A'] },
  { id: 'o-014', nombre: 'Tech Casual Gris', descripcion: 'Camisa cuello tortuga gris con pantalón gris ajustado. Elegancia tecnológica.', ocasion: ['oficina_casual'], momento: ['dia', 'tarde'], clima: ['frio', 'templado'], estilo: ['corporate'], prendaSuperior: 'ct-3', pantalon: 'pa-3', calzado: 'cz-2', accesorios: ['ac-1', 'ac-4'], paletaColores: ['#6B7280', '#6B7280', '#1A1A1A'] },
  { id: 'o-015', nombre: 'Cuello Alto Corporativo', descripcion: 'Suéter tortuga negro con pantalón negro. Silueta alargada y poderosa.', ocasion: ['oficina_casual', 'oficina'], momento: ['dia', 'tarde'], clima: ['frio'], estilo: ['noir', 'corporate'], prendaSuperior: 'ct-1', pantalon: 'pa-4', calzado: 'cz-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#1A1A1A', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-016', nombre: 'Viernes Náutico', descripcion: 'Camisa negra sin corbata con mocasines de suela blanca. Relajado pero prolijo.', ocasion: ['oficina_casual'], momento: ['dia'], clima: ['templado', 'calor'], estilo: ['corporate', 'old_money'], prendaSuperior: 'cf-7', pantalon: 'pa-1', calzado: 'cz-4', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#1A1A1A', '#1B3A5C', '#FFFFFF'] },
  { id: 'o-017', nombre: 'Contraste de Lujo', descripcion: 'Suéter tortuga blanco con pantalón negro. Elegancia nórdica para el corporativo.', ocasion: ['oficina_casual', 'oficina'], momento: ['dia'], clima: ['frio'], estilo: ['noir', 'corporate'], prendaSuperior: 'ct-2', pantalon: 'pa-4', calzado: 'cz-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#FAFAFA', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-018', nombre: 'Tortuga con Levita', descripcion: 'Suéter tortuga negro + levita negra. Doble capa de autoridad sin corbata.', ocasion: ['oficina_casual', 'oficina'], momento: ['dia', 'tarde'], clima: ['frio'], estilo: ['noir', 'corporate'], prendaSuperior: 'ct-1', pantalon: 'pa-4', calzado: 'cz-1', abrigo: 'ab-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#1A1A1A', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-019', nombre: 'Desarrollo Zen', descripcion: 'Cabello largo suelto, henley café, mezclilla negra. Comodidad con identidad.', ocasion: ['oficina_casual', 'fin_de_semana'], momento: ['dia'], clima: ['templado'], estilo: ['corporate'], prendaSuperior: 'hc-3', pantalon: 'pa-7', calzado: 'cz-5', accesorios: ['ac-2', 'ac-4'], paletaColores: ['#5C3A1E', '#2C2C2C', '#1A1A1A'] },
  { id: 'o-020', nombre: 'Celeste Sin Ataduras', descripcion: 'Camisa celeste sin corbata con pantalón azul formal. Joven pero profesional.', ocasion: ['oficina_casual'], momento: ['dia'], clima: ['templado', 'calor'], estilo: ['corporate'], prendaSuperior: 'cf-2', pantalon: 'pa-1', calzado: 'cz-2', accesorios: ['ac-1', 'ac-4'], paletaColores: ['#87CEEB', '#1B3A5C', '#1A1A1A'] },
  { id: 'o-021', nombre: 'Gris Atardecer', descripcion: 'Camisa gris sin corbata con pantalón gris claro al atardecer.', ocasion: ['oficina_casual', 'oficina'], momento: ['tarde'], clima: ['templado'], estilo: ['corporate'], prendaSuperior: 'cf-5', pantalon: 'pa-2', calzado: 'cz-2', accesorios: ['ac-1', 'ac-4'], paletaColores: ['#6B7280', '#D1D5DB', '#1A1A1A'] },
  { id: 'o-022', nombre: 'Tech Lord Invernal', descripcion: 'Cable-knit negro bajo levita con pantalón formal. Textura y jerarquía.', ocasion: ['oficina_casual', 'oficina'], momento: ['dia', 'tarde'], clima: ['frio'], estilo: ['noir', 'corporate'], prendaSuperior: 'ct-6', pantalon: 'pa-4', calzado: 'cz-1', abrigo: 'ab-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#1A1A1A', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-023', nombre: 'Azul Marino Casual', descripcion: 'Camisa azul marino sin corbata con mocasines. Autoridad sin rigidez.', ocasion: ['oficina_casual'], momento: ['dia'], clima: ['templado'], estilo: ['corporate'], prendaSuperior: 'cf-3', pantalon: 'pa-3', calzado: 'cz-2', accesorios: ['ac-1', 'ac-4'], paletaColores: ['#1B2A4A', '#6B7280', '#1A1A1A'] },
  { id: 'o-024', nombre: 'Punto Fino Ejecutivo', descripcion: 'Camisa ligera negra lisa cuello alto con pantalón negro ajustado. Minimalismo sofisticado.', ocasion: ['oficina_casual', 'after_office'], momento: ['dia', 'tarde'], clima: ['templado'], estilo: ['noir', 'corporate'], prendaSuperior: 'ct-4', pantalon: 'pa-4', calzado: 'cz-2', accesorios: ['ac-1', 'ac-4'], paletaColores: ['#1A1A1A', '#1A1A1A', '#1A1A1A'] },

  // === AFTER OFFICE / DARK LUXE ===
  { id: 'o-025', nombre: 'Transición Vino', descripcion: 'Camisa vino satinada sin corbata con pantalón negro. De la junta al bar sin cambiarse.', ocasion: ['after_office', 'salida'], momento: ['tarde', 'noche'], clima: ['frio', 'templado'], estilo: ['noir'], prendaSuperior: 'cf-8', pantalon: 'pa-4', calzado: 'cz-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#722F37', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-026', nombre: 'Sombra con Brillo', descripcion: 'Vino satinada + corbata rojo vino. La transición perfecta noche adentro.', ocasion: ['after_office', 'salida'], momento: ['noche'], clima: ['frio', 'templado'], estilo: ['noir'], prendaSuperior: 'cf-8', pantalon: 'pa-4', calzado: 'cz-1', corbata: 'co-4', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#722F37', '#1A1A1A', '#722F37'] },
  { id: 'o-027', nombre: 'Noche de Cuero', descripcion: 'Henley negro + chaqueta de cuero + mezclilla negra. Dark Luxe activado.', ocasion: ['after_office', 'salida'], momento: ['noche'], clima: ['frio', 'templado'], estilo: ['rockero', 'noir'], prendaSuperior: 'hc-1', pantalon: 'pa-7', calzado: 'cz-5', abrigo: 'ab-2', accesorios: ['ac-1', 'ac-5'], paletaColores: ['#1A1A1A', '#2C2C2C', '#1A1A1A'] },
  { id: 'o-028', nombre: 'Rockstar Corporativo', descripcion: 'Camisa de banda negra + cuero negro + mezclilla. Del cubículo al concierto.', ocasion: ['after_office', 'salida'], momento: ['noche'], clima: ['frio', 'templado'], estilo: ['rockero'], prendaSuperior: 'hc-4', pantalon: 'pa-7', calzado: 'cz-5', abrigo: 'ab-2', accesorios: ['ac-1', 'ac-5'], paletaColores: ['#1A1A1A', '#2C2C2C', '#1A1A1A'] },
  { id: 'o-029', nombre: 'Tortuga Nocturna', descripcion: 'Suéter tortuga negro con pantalón negro y mocasines. Silueta de novela noir.', ocasion: ['after_office', 'salida'], momento: ['noche'], clima: ['frio'], estilo: ['noir'], prendaSuperior: 'ct-1', pantalon: 'pa-4', calzado: 'cz-2', abrigo: 'ab-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#1A1A1A', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-030', nombre: 'Blanco Underworld', descripcion: 'Suéter tortuga blanco con pantalón negro y levita. Contraste dramático nocturno.', ocasion: ['after_office', 'salida'], momento: ['noche'], clima: ['frio'], estilo: ['noir'], prendaSuperior: 'ct-2', pantalon: 'pa-4', calzado: 'cz-1', abrigo: 'ab-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#FAFAFA', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-031', nombre: 'Power Tie Nocturno', descripcion: 'Camisa blanca + corbata rojo vino sin levita. Poder elegante de noche.', ocasion: ['after_office', 'salida'], momento: ['noche'], clima: ['templado'], estilo: ['corporate', 'noir'], prendaSuperior: 'cf-1', pantalon: 'pa-4', calzado: 'cz-1', corbata: 'co-4', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#FAFAFA', '#722F37', '#1A1A1A'] },
  { id: 'o-032', nombre: 'Acero y Vino', descripcion: 'Camisa gris con pantalón negro y corbata vino. Transición de poder al after office.', ocasion: ['after_office', 'oficina_casual'], momento: ['tarde', 'noche'], clima: ['templado'], estilo: ['corporate', 'noir'], prendaSuperior: 'cf-5', pantalon: 'pa-4', calzado: 'cz-2', corbata: 'co-4', accesorios: ['ac-1', 'ac-4'], paletaColores: ['#6B7280', '#1A1A1A', '#722F37'] },
  { id: 'o-033', nombre: 'Acanalado Nocturno', descripcion: 'Camisa ligera negra acanalada cuello alto + pantalón negro. Textura para la noche.', ocasion: ['after_office', 'salida'], momento: ['noche'], clima: ['frio', 'templado'], estilo: ['noir'], prendaSuperior: 'ct-5', pantalon: 'pa-4', calzado: 'cz-2', accesorios: ['ac-1', 'ac-4'], paletaColores: ['#1A1A1A', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-034', nombre: 'Negro Total After', descripcion: 'Todo negro con zapatos formales. El uniforme de la sombra elegante.', ocasion: ['after_office', 'salida'], momento: ['noche'], clima: ['frio', 'templado'], estilo: ['noir'], prendaSuperior: 'ct-1', pantalon: 'pa-4', calzado: 'cz-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#1A1A1A', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-035', nombre: 'Levita Vino', descripcion: 'Camisa vino + levita negra + pantalón negro. La capa final de sofisticación oscura.', ocasion: ['after_office', 'salida'], momento: ['noche'], clima: ['frio'], estilo: ['noir'], prendaSuperior: 'cf-8', pantalon: 'pa-4', calzado: 'cz-1', abrigo: 'ab-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#722F37', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-036', nombre: 'Puntos de Tecnología', descripcion: 'Camisa blanca + corbata negra puntos blancos + pantalón gris. Tech después de horas.', ocasion: ['after_office', 'oficina_casual'], momento: ['tarde', 'noche'], clima: ['templado'], estilo: ['corporate'], prendaSuperior: 'cf-1', pantalon: 'pa-3', calzado: 'cz-2', corbata: 'co-2', accesorios: ['ac-1', 'ac-4'], paletaColores: ['#FAFAFA', '#1A1A1A', '#6B7280'] },

  // === SALIDA / NOCHE ===
  { id: 'o-037', nombre: 'Motionless in Black', descripcion: 'Camisa de banda + cuero + mezclilla + pulseras metaleras. Tributo a tus raíces metal.', ocasion: ['salida'], momento: ['noche'], clima: ['frio', 'templado'], estilo: ['rockero'], prendaSuperior: 'hc-4', pantalon: 'pa-7', calzado: 'cz-5', abrigo: 'ab-2', accesorios: ['ac-1', 'ac-5'], paletaColores: ['#1A1A1A', '#2C2C2C', '#2C2C2C'] },
  { id: 'o-038', nombre: 'Rammstein Industrial', descripcion: 'Henley negro + pantalón negro + cuero negro. Estética industrial alemana.', ocasion: ['salida'], momento: ['noche'], clima: ['frio'], estilo: ['rockero'], prendaSuperior: 'hc-1', pantalon: 'pa-4', calzado: 'cz-5', abrigo: 'ab-2', accesorios: ['ac-1', 'ac-5'], paletaColores: ['#1A1A1A', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-039', nombre: 'HIM Romantic Goth', descripcion: 'Suéter tortuga negro + pantalón negro + levita. Melancolía gótica finlandesa.', ocasion: ['salida', 'after_office'], momento: ['noche'], clima: ['frio'], estilo: ['rockero', 'noir'], prendaSuperior: 'ct-1', pantalon: 'pa-4', calzado: 'cz-1', abrigo: 'ab-1', accesorios: ['ac-1', 'ac-5'], paletaColores: ['#1A1A1A', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-040', nombre: 'Verde Rebelde', descripcion: 'Henley verde con mezclilla negra. Un toque de color orgánico en la oscuridad.', ocasion: ['salida', 'fin_de_semana'], momento: ['noche', 'tarde'], clima: ['templado', 'calor'], estilo: ['rockero'], prendaSuperior: 'hc-2', pantalon: 'pa-7', calzado: 'cz-5', accesorios: ['ac-1', 'ac-5'], paletaColores: ['#2D5A27', '#2C2C2C', '#1A1A1A'] },
  { id: 'o-041', nombre: 'Vino y Cuero', descripcion: 'Camisa vino satinada + chaqueta cuero + mezclilla. La fusión dark luxe.', ocasion: ['salida'], momento: ['noche'], clima: ['frio', 'templado'], estilo: ['noir', 'rockero'], prendaSuperior: 'cf-8', pantalon: 'pa-7', calzado: 'cz-5', abrigo: 'ab-2', accesorios: ['ac-1', 'ac-5'], paletaColores: ['#722F37', '#2C2C2C', '#1A1A1A'] },
  { id: 'o-042', nombre: 'Metal Elegante', descripcion: 'Suéter cable-knit + pantalón negro + cuero. Textura pesada con clase.', ocasion: ['salida'], momento: ['noche'], clima: ['frio'], estilo: ['rockero', 'noir'], prendaSuperior: 'ct-6', pantalon: 'pa-4', calzado: 'cz-5', abrigo: 'ab-2', accesorios: ['ac-1', 'ac-5'], paletaColores: ['#1A1A1A', '#1A1A1A', '#2C2C2C'] },
  { id: 'o-043', nombre: 'Blanco y Sombra', descripcion: 'Tortuga blanco + pantalón negro + mocasines. Para una cita nocturna con contraste.', ocasion: ['salida'], momento: ['noche'], clima: ['frio', 'templado'], estilo: ['noir'], prendaSuperior: 'ct-2', pantalon: 'pa-4', calzado: 'cz-2', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#FAFAFA', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-044', nombre: 'Café Nocturno', descripcion: 'Henley café con pantalón negro. Calidez oscura para salir.', ocasion: ['salida', 'after_office'], momento: ['noche'], clima: ['frio', 'templado'], estilo: ['old_money', 'noir'], prendaSuperior: 'hc-3', pantalon: 'pa-4', calzado: 'cz-2', accesorios: ['ac-2', 'ac-3'], paletaColores: ['#5C3A1E', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-045', nombre: 'Gris Metálico', descripcion: 'Camisa gris + pantalón negro + zapatos negros. Perfil tecnológico nocturno.', ocasion: ['salida', 'after_office'], momento: ['noche'], clima: ['templado'], estilo: ['corporate', 'noir'], prendaSuperior: 'cf-5', pantalon: 'pa-4', calzado: 'cz-1', accesorios: ['ac-1', 'ac-4'], paletaColores: ['#6B7280', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-046', nombre: 'Azul de Medianoche', descripcion: 'Camisa azul marino + pantalón negro sin corbata. Misterio azul.', ocasion: ['salida'], momento: ['noche'], clima: ['templado'], estilo: ['noir'], prendaSuperior: 'cf-3', pantalon: 'pa-4', calzado: 'cz-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#1B2A4A', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-047', nombre: 'Rey de la Noche', descripcion: 'Camisa azul rey + pantalón negro. Vibrante y audaz para salir.', ocasion: ['salida'], momento: ['noche'], clima: ['templado'], estilo: ['corporate', 'noir'], prendaSuperior: 'cf-4', pantalon: 'pa-4', calzado: 'cz-2', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#4169E1', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-048', nombre: 'Manga Corta Rebelde', descripcion: 'Camisa manga corta negra + mezclilla + Airless. Noche tropical.', ocasion: ['salida', 'fin_de_semana'], momento: ['noche', 'tarde'], clima: ['calor'], estilo: ['rockero'], prendaSuperior: 'hc-5', pantalon: 'pa-7', calzado: 'cz-5', accesorios: ['ac-1', 'ac-5'], paletaColores: ['#1A1A1A', '#2C2C2C', '#1A1A1A'] },

  // === OLD MONEY ===
  { id: 'o-049', nombre: 'Old Money Dominical', descripcion: 'Camisa café crema + pantalón beige + zapatos café. Paseo dominical sofisticado.', ocasion: ['fin_de_semana', 'salida'], momento: ['dia', 'tarde'], clima: ['templado', 'calor'], estilo: ['old_money'], prendaSuperior: 'hc-6', pantalon: 'pa-6', calzado: 'cz-3', accesorios: ['ac-2', 'ac-3'], paletaColores: ['#F5F0E1', '#D4C5A9', '#5C3A1E'] },
  { id: 'o-050', nombre: 'Herencia Café', descripcion: 'Camisa taupe + pantalón café + zapatos cuero café. Elegancia terruza heredada.', ocasion: ['oficina_casual', 'fin_de_semana'], momento: ['dia'], clima: ['templado'], estilo: ['old_money'], prendaSuperior: 'cf-6', pantalon: 'pa-5', calzado: 'cz-3', accesorios: ['ac-2', 'ac-3'], paletaColores: ['#8B7355', '#5C3A1E', '#5C3A1E'] },
  { id: 'o-051', nombre: 'Beige y Negro', descripcion: 'Camisa blanca + pantalón beige + zapatos negros. Contraste clásico de estatus.', ocasion: ['oficina_casual', 'fin_de_semana', 'salida'], momento: ['dia', 'tarde'], clima: ['templado', 'calor'], estilo: ['old_money', 'corporate'], prendaSuperior: 'cf-1', pantalon: 'pa-6', calzado: 'cz-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#FAFAFA', '#D4C5A9', '#1A1A1A'] },
  { id: 'o-052', nombre: 'Gris Claro Elegante', descripcion: 'Camisa blanca + pantalón gris claro + mocasines. Frescura old money.', ocasion: ['oficina_casual', 'fin_de_semana'], momento: ['dia'], clima: ['templado', 'calor'], estilo: ['old_money'], prendaSuperior: 'cf-1', pantalon: 'pa-2', calzado: 'cz-4', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#FAFAFA', '#D1D5DB', '#1A1A1A'] },
  { id: 'o-053', nombre: 'Café con Leche', descripcion: 'Henley café + pantalón beige + mocasines suela blanca. Relajado pero con clase.', ocasion: ['fin_de_semana'], momento: ['dia', 'tarde'], clima: ['templado', 'calor'], estilo: ['old_money'], prendaSuperior: 'hc-3', pantalon: 'pa-6', calzado: 'cz-4', accesorios: ['ac-2', 'ac-3'], paletaColores: ['#5C3A1E', '#D4C5A9', '#FFFFFF'] },
  { id: 'o-054', nombre: 'Náutico Viejo', descripcion: 'Camisa celeste + pantalón beige + mocasines suela blanca. Verano en la costa.', ocasion: ['fin_de_semana', 'salida'], momento: ['dia'], clima: ['calor', 'templado'], estilo: ['old_money'], prendaSuperior: 'cf-2', pantalon: 'pa-6', calzado: 'cz-4', accesorios: ['ac-2', 'ac-3'], paletaColores: ['#87CEEB', '#D4C5A9', '#FFFFFF'] },
  { id: 'o-055', nombre: 'Tortuga Natural', descripcion: 'Suéter tortuga gris + pantalón café. Textura orgánica para el fin de semana.', ocasion: ['fin_de_semana'], momento: ['dia', 'tarde'], clima: ['frio', 'templado'], estilo: ['old_money'], prendaSuperior: 'ct-3', pantalon: 'pa-5', calzado: 'cz-3', accesorios: ['ac-2', 'ac-4'], paletaColores: ['#6B7280', '#5C3A1E', '#5C3A1E'] },
  { id: 'o-056', nombre: 'Crema y Cuero Café', descripcion: 'Camisa café crema + pantalón café + zapatos crema café. Monocromía tierra.', ocasion: ['fin_de_semana', 'salida'], momento: ['dia', 'tarde'], clima: ['templado', 'calor'], estilo: ['old_money'], prendaSuperior: 'hc-6', pantalon: 'pa-5', calzado: 'cz-6', accesorios: ['ac-2', 'ac-3'], paletaColores: ['#F5F0E1', '#5C3A1E', '#C4A882'] },
  { id: 'o-057', nombre: 'Blanco y Café', descripcion: 'Camisa blanca + pantalón café + zapatos cuero café. El clásico atemporal.', ocasion: ['oficina_casual', 'fin_de_semana'], momento: ['dia'], clima: ['templado'], estilo: ['old_money', 'corporate'], prendaSuperior: 'cf-1', pantalon: 'pa-5', calzado: 'cz-3', accesorios: ['ac-2', 'ac-3'], paletaColores: ['#FAFAFA', '#5C3A1E', '#5C3A1E'] },
  { id: 'o-058', nombre: 'Levita Heritage', descripcion: 'Suéter tortuga blanco + levita + pantalón gris claro. Herencia con clase.', ocasion: ['fin_de_semana', 'salida', 'after_office'], momento: ['tarde', 'noche'], clima: ['frio'], estilo: ['old_money', 'noir'], prendaSuperior: 'ct-2', pantalon: 'pa-2', calzado: 'cz-1', abrigo: 'ab-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#FAFAFA', '#D1D5DB', '#1A1A1A'] },
  { id: 'o-059', nombre: 'Verde Bosque', descripcion: 'Henley verde + pantalón café + zapatos café. conexión con la naturaleza.', ocasion: ['fin_de_semana'], momento: ['dia', 'tarde'], clima: ['templado'], estilo: ['old_money'], prendaSuperior: 'hc-2', pantalon: 'pa-5', calzado: 'cz-3', accesorios: ['ac-2', 'ac-4'], paletaColores: ['#2D5A27', '#5C3A1E', '#5C3A1E'] },
  { id: 'o-060', nombre: 'Taupe Serena', descripcion: 'Camisa taupe + pantalón gris claro + mocasines. Tarde tranquila de privilegio.', ocasion: ['fin_de_semana', 'oficina_casual'], momento: ['tarde'], clima: ['templado'], estilo: ['old_money'], prendaSuperior: 'cf-6', pantalon: 'pa-2', calzado: 'cz-4', accesorios: ['ac-2', 'ac-3'], paletaColores: ['#8B7355', '#D1D5DB', '#1A1A1A'] },

  // === ROCKERO / METAL ===
  { id: 'o-061', nombre: 'Infernal Majesty', descripcion: 'Camisa de banda + cuero + mezclilla + pulseras. Tributo a HIM.', ocasion: ['salida', 'fin_de_semana'], momento: ['noche'], clima: ['frio', 'templado'], estilo: ['rockero'], prendaSuperior: 'hc-4', pantalon: 'pa-7', calzado: 'cz-5', abrigo: 'ab-2', accesorios: ['ac-1', 'ac-5'], paletaColores: ['#1A1A1A', '#2C2C2C', '#2C2C2C'] },
  { id: 'o-062', nombre: 'Metal Industrial', descripcion: 'Henley negro + pantalón negro + cuero + cable-knit debajo. Capas de acero.', ocasion: ['salida'], momento: ['noche'], clima: ['frio'], estilo: ['rockero'], prendaSuperior: 'ct-6', pantalon: 'pa-4', calzado: 'cz-5', abrigo: 'ab-2', accesorios: ['ac-1', 'ac-5'], paletaColores: ['#1A1A1A', '#1A1A1A', '#2C2C2C'] },
  { id: 'o-063', nombre: 'Gótico Tropical', descripcion: 'Manga corta negra + mezclilla + Airless. Cuando el metal se encuentra con el calor.', ocasion: ['salida', 'fin_de_semana'], momento: ['noche', 'tarde'], clima: ['calor'], estilo: ['rockero'], prendaSuperior: 'hc-5', pantalon: 'pa-7', calzado: 'cz-5', accesorios: ['ac-1', 'ac-5'], paletaColores: ['#1A1A1A', '#2C2C2C', '#1A1A1A'] },
  { id: 'o-064', nombre: 'Verde Metalero', descripcion: 'Henley verde + mezclilla + cuero. Un oasis oscuro en el mosh pit.', ocasion: ['salida'], momento: ['noche'], clima: ['frio', 'templado'], estilo: ['rockero'], prendaSuperior: 'hc-2', pantalon: 'pa-7', calzado: 'cz-5', abrigo: 'ab-2', accesorios: ['ac-1', 'ac-5'], paletaColores: ['#2D5A27', '#2C2C2C', '#1A1A1A'] },
  { id: 'o-065', nombre: 'Café de Concierto', descripcion: 'Henley café + mezclilla + Airless. Rock con calidez.', ocasion: ['salida', 'fin_de_semana'], momento: ['noche', 'tarde'], clima: ['templado'], estilo: ['rockero'], prendaSuperior: 'hc-3', pantalon: 'pa-7', calzado: 'cz-5', accesorios: ['ac-2', 'ac-5'], paletaColores: ['#5C3A1E', '#2C2C2C', '#1A1A1A'] },
  { id: 'o-066', nombre: 'Sombra Total', descripcion: 'Tortuga negro + pantalón negro + cuero + Airless. El uniforme del oscuro.', ocasion: ['salida', 'fin_de_semana'], momento: ['noche'], clima: ['frio', 'templado'], estilo: ['rockero', 'noir'], prendaSuperior: 'ct-1', pantalon: 'pa-4', calzado: 'cz-5', abrigo: 'ab-2', accesorios: ['ac-1', 'ac-5'], paletaColores: ['#1A1A1A', '#1A1A1A', '#2C2C2C'] },
  { id: 'o-067', nombre: 'Acanalado Metal', descripcion: 'Camisa acanalada cuello alto + mezclilla + cuero. Textura vertical rebelde.', ocasion: ['salida', 'fin_de_semana'], momento: ['noche'], clima: ['frio', 'templado'], estilo: ['rockero'], prendaSuperior: 'ct-5', pantalon: 'pa-7', calzado: 'cz-5', abrigo: 'ab-2', accesorios: ['ac-1', 'ac-5'], paletaColores: ['#1A1A1A', '#2C2C2C', '#2C2C2C'] },
  { id: 'o-068', nombre: 'Punto Fino Metalero', descripcion: 'Camisa ligera negra lisa cuello alto + pantalón negro. Minimalismo oscuro.', ocasion: ['salida', 'after_office'], momento: ['noche'], clima: ['templado'], estilo: ['rockero', 'noir'], prendaSuperior: 'ct-4', pantalon: 'pa-4', calzado: 'cz-5', accesorios: ['ac-1', 'ac-5'], paletaColores: ['#1A1A1A', '#1A1A1A', '#1A1A1A'] },

  // === FIN DE SEMANA RELAX ===
  { id: 'o-069', nombre: 'Sábado de Pricemart', descripcion: 'Suéter de Pricemart + mezclilla + Airless. Confort absoluto sin perder identidad.', ocasion: ['fin_de_semana'], momento: ['dia'], clima: ['frio', 'templado'], estilo: ['corporate'], prendaSuperior: 'ct-7', pantalon: 'pa-7', calzado: 'cz-5', accesorios: ['ac-4'], paletaColores: ['#6B7280', '#2C2C2C', '#1A1A1A'] },
  { id: 'o-070', nombre: 'Domingo Café', descripcion: 'Henley café + mezclilla + Airless. Relajado con tonos cálidos.', ocasion: ['fin_de_semana'], momento: ['dia', 'tarde'], clima: ['templado'], estilo: ['old_money'], prendaSuperior: 'hc-3', pantalon: 'pa-7', calzado: 'cz-5', accesorios: ['ac-2', 'ac-4'], paletaColores: ['#5C3A1E', '#2C2C2C', '#1A1A1A'] },
  { id: 'o-071', nombre: 'Cabello Suelto Domingo', descripcion: 'Camisa café crema + mezclilla + mocasines. Old Money sin esfuerzo.', ocasion: ['fin_de_semana'], momento: ['dia', 'tarde'], clima: ['templado', 'calor'], estilo: ['old_money'], prendaSuperior: 'hc-6', pantalon: 'pa-7', calzado: 'cz-4', accesorios: ['ac-2', 'ac-3'], paletaColores: ['#F5F0E1', '#2C2C2C', '#FFFFFF'] },
  { id: 'o-072', nombre: 'Negro Doméstico', descripcion: 'Henley negro + mezclilla + Airless. El uniforme del fin de semana noir.', ocasion: ['fin_de_semana'], momento: ['dia', 'tarde', 'noche'], clima: ['templado', 'calor'], estilo: ['noir'], prendaSuperior: 'hc-1', pantalon: 'pa-7', calzado: 'cz-5', accesorios: ['ac-1', 'ac-4'], paletaColores: ['#1A1A1A', '#2C2C2C', '#1A1A1A'] },
  { id: 'o-073', nombre: 'Verde Fin de Semana', descripcion: 'Henley verde + pantalón beige + Airless. Frescura natural.', ocasion: ['fin_de_semana'], momento: ['dia'], clima: ['templado', 'calor'], estilo: ['old_money'], prendaSuperior: 'hc-2', pantalon: 'pa-6', calzado: 'cz-5', accesorios: ['ac-4'], paletaColores: ['#2D5A27', '#D4C5A9', '#1A1A1A'] },
  { id: 'o-074', nombre: 'Gris Fin de Semana', descripcion: 'Tortuga gris + mezclilla + Airless. Tech casual de fin de semana.', ocasion: ['fin_de_semana'], momento: ['dia', 'tarde'], clima: ['frio', 'templado'], estilo: ['corporate'], prendaSuperior: 'ct-3', pantalon: 'pa-7', calzado: 'cz-5', accesorios: ['ac-1', 'ac-4'], paletaColores: ['#6B7280', '#2C2C2C', '#1A1A1A'] },
  { id: 'o-075', nombre: 'Cable-Knit Doméstico', descripcion: 'Suéter trenzado + pantalón negro + mocasines. Textura hogareña.', ocasion: ['fin_de_semana'], momento: ['dia', 'tarde'], clima: ['frio'], estilo: ['noir', 'old_money'], prendaSuperior: 'ct-6', pantalon: 'pa-4', calzado: 'cz-2', accesorios: ['ac-1', 'ac-4'], paletaColores: ['#1A1A1A', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-076', nombre: 'Manga Corta Tropical', descripcion: 'Camisa manga corta + mezclilla + Airless. Calor con actitud.', ocasion: ['fin_de_semana'], momento: ['dia', 'tarde'], clima: ['calor'], estilo: ['rockero'], prendaSuperior: 'hc-5', pantalon: 'pa-7', calzado: 'cz-5', accesorios: ['ac-4'], paletaColores: ['#1A1A1A', '#2C2C2C', '#1A1A1A'] },

  // === CALOR ESPECÍFICO ===
  { id: 'o-077', nombre: 'Oficina Calor Blanco', descripcion: 'Camisa blanca sin corbata + pantalón beige + mocasines suela blanca.', ocasion: ['oficina', 'oficina_casual'], momento: ['dia'], clima: ['calor'], estilo: ['corporate', 'old_money'], prendaSuperior: 'cf-1', pantalon: 'pa-6', calzado: 'cz-4', accesorios: ['ac-2', 'ac-3'], paletaColores: ['#FAFAFA', '#D4C5A9', '#FFFFFF'] },
  { id: 'o-078', nombre: 'Celeste Verano', descripcion: 'Camisa celeste sin corbata + pantalón gris claro + mocasines.', ocasion: ['oficina', 'oficina_casual'], momento: ['dia'], clima: ['calor'], estilo: ['corporate'], prendaSuperior: 'cf-2', pantalon: 'pa-2', calzado: 'cz-4', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#87CEEB', '#D1D5DB', '#FFFFFF'] },
  { id: 'o-079', nombre: 'Viernes Caluroso', descripcion: 'Henley negro + mezclilla + Airless. Para cuando el AC no basta.', ocasion: ['oficina_casual', 'fin_de_semana'], momento: ['dia'], clima: ['calor'], estilo: ['noir', 'corporate'], prendaSuperior: 'hc-1', pantalon: 'pa-7', calzado: 'cz-5', accesorios: ['ac-1', 'ac-4'], paletaColores: ['#1A1A1A', '#2C2C2C', '#1A1A1A'] },
  { id: 'o-080', nombre: 'Taupe Estival', descripcion: 'Camisa taupe + pantalón beige + mocasines. Tonos tierra frescos.', ocasion: ['oficina_casual', 'fin_de_semana'], momento: ['dia'], clima: ['calor'], estilo: ['old_money'], prendaSuperior: 'cf-6', pantalon: 'pa-6', calzado: 'cz-4', accesorios: ['ac-2', 'ac-3'], paletaColores: ['#8B7355', '#D4C5A9', '#FFFFFF'] },

  // === FRÍO INTENSO ===
  { id: 'o-081', nombre: 'Invierno Noir', descripcion: 'Tortuga negro + pantalón negro + levita + zapatos negros. Blindaje térmico elegante.', ocasion: ['oficina', 'oficina_casual', 'after_office'], momento: ['dia', 'tarde', 'noche'], clima: ['frio'], estilo: ['noir'], prendaSuperior: 'ct-1', pantalon: 'pa-4', calzado: 'cz-1', abrigo: 'ab-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#1A1A1A', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-082', nombre: 'Invierno Corporativo', descripcion: 'Camisa blanca + corbata + pantalón azul + levita. El ejecutivo del invierno.', ocasion: ['oficina'], momento: ['dia', 'tarde'], clima: ['frio'], estilo: ['corporate'], prendaSuperior: 'cf-1', pantalon: 'pa-1', calzado: 'cz-1', corbata: 'co-1', abrigo: 'ab-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#FAFAFA', '#1A1A1A', '#1B3A5C'] },
  { id: 'o-083', nombre: 'Cable-Knit Invernal', descripcion: 'Suéter trenzado + pantalón gris + levita. Capas de textura.', ocasion: ['oficina_casual', 'fin_de_semana', 'salida'], momento: ['dia', 'tarde'], clima: ['frio'], estilo: ['old_money', 'noir'], prendaSuperior: 'ct-6', pantalon: 'pa-3', calzado: 'cz-1', abrigo: 'ab-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#1A1A1A', '#6B7280', '#1A1A1A'] },
  { id: 'o-084', nombre: 'Doble Capa Blanca', descripcion: 'Tortuga blanco + levita + pantalón gris claro. Invierno luminoso.', ocasion: ['oficina_casual', 'salida'], momento: ['dia', 'tarde'], clima: ['frio'], estilo: ['old_money', 'noir'], prendaSuperior: 'ct-2', pantalon: 'pa-2', calzado: 'cz-1', abrigo: 'ab-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#FAFAFA', '#D1D5DB', '#1A1A1A'] },
  { id: 'o-085', nombre: 'Cuero y Lana', descripcion: 'Tortuga negro + pantalón negro + chaqueta cuero + cable-knit debajo.', ocasion: ['salida', 'fin_de_semana'], momento: ['noche'], clima: ['frio'], estilo: ['rockero', 'noir'], prendaSuperior: 'ct-6', pantalon: 'pa-4', calzado: 'cz-5', abrigo: 'ab-2', accesorios: ['ac-1', 'ac-5'], paletaColores: ['#1A1A1A', '#1A1A1A', '#2C2C2C'] },
  { id: 'o-086', nombre: 'Invierno Café', descripcion: 'Tortuga gris + pantalón café + levita. Calidez elegante contra el frío.', ocasion: ['oficina_casual', 'fin_de_semana'], momento: ['dia', 'tarde'], clima: ['frio'], estilo: ['old_money'], prendaSuperior: 'ct-3', pantalon: 'pa-5', calzado: 'cz-3', abrigo: 'ab-1', accesorios: ['ac-2', 'ac-3'], paletaColores: ['#6B7280', '#5C3A1E', '#1A1A1A'] },

  // === TARDE / ATARDECER ===
  { id: 'o-087', nombre: 'Golden Hour Noir', descripcion: 'Camisa negra formal + pantalón gris + mocasines. La transición dorada.', ocasion: ['oficina_casual', 'after_office'], momento: ['tarde'], clima: ['templado'], estilo: ['noir', 'corporate'], prendaSuperior: 'cf-7', pantalon: 'pa-3', calzado: 'cz-2', accesorios: ['ac-1', 'ac-4'], paletaColores: ['#1A1A1A', '#6B7280', '#1A1A1A'] },
  { id: 'o-088', nombre: 'Atardecer Vino', descripcion: 'Camisa vino + pantalón negro + zapatos negros. Colores del atardecer.', ocasion: ['after_office', 'salida'], momento: ['tarde'], clima: ['templado'], estilo: ['noir'], prendaSuperior: 'cf-8', pantalon: 'pa-4', calzado: 'cz-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#722F37', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-089', nombre: 'Café Atardecer', descripcion: 'Camisa café crema + pantalón café + mocasines. La hora dorada old money.', ocasion: ['fin_de_semana', 'salida'], momento: ['tarde'], clima: ['templado'], estilo: ['old_money'], prendaSuperior: 'hc-6', pantalon: 'pa-5', calzado: 'cz-4', accesorios: ['ac-2', 'ac-3'], paletaColores: ['#F5F0E1', '#5C3A1E', '#FFFFFF'] },
  { id: 'o-090', nombre: 'Azul Atardecer', descripcion: 'Camisa azul rey + pantalón gris + mocasines. El último rayo de azul.', ocasion: ['oficina_casual', 'after_office'], momento: ['tarde'], clima: ['templado'], estilo: ['corporate'], prendaSuperior: 'cf-4', pantalon: 'pa-3', calzado: 'cz-2', accesorios: ['ac-1', 'ac-4'], paletaColores: ['#4169E1', '#6B7280', '#1A1A1A'] },

  // === COMBINACIONES ADICIONALES PARA LLEGAR A 130+ ===
  { id: 'o-091', nombre: 'Negro con Puntos', descripcion: 'Camisa blanca + corbata negra puntos blancos + pantalón negro. Personalidad tech.', ocasion: ['oficina', 'oficina_casual'], momento: ['dia'], clima: ['templado'], estilo: ['corporate'], prendaSuperior: 'cf-1', pantalon: 'pa-4', calzado: 'cz-1', corbata: 'co-2', accesorios: ['ac-1', 'ac-4'], paletaColores: ['#FAFAFA', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-092', nombre: 'Gris con Levita', descripcion: 'Camisa gris + pantalón gris + levita. Monocromía gris de poder.', ocasion: ['oficina', 'after_office'], momento: ['dia', 'tarde'], clima: ['frio'], estilo: ['corporate', 'noir'], prendaSuperior: 'cf-5', pantalon: 'pa-3', calzado: 'cz-1', abrigo: 'ab-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#6B7280', '#6B7280', '#1A1A1A'] },
  { id: 'o-093', nombre: 'Celeste Gris', descripcion: 'Camisa celeste + pantalón gris claro + mocasines. Frescura bancaria.', ocasion: ['oficina', 'oficina_casual'], momento: ['dia'], clima: ['templado', 'calor'], estilo: ['corporate'], prendaSuperior: 'cf-2', pantalon: 'pa-2', calzado: 'cz-2', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#87CEEB', '#D1D5DB', '#1A1A1A'] },
  { id: 'o-094', nombre: 'Taupe con Negro', descripcion: 'Camisa taupe + pantalón negro + zapatos negros. Tierra y sombra.', ocasion: ['oficina_casual', 'after_office'], momento: ['dia', 'tarde'], clima: ['templado'], estilo: ['old_money', 'noir'], prendaSuperior: 'cf-6', pantalon: 'pa-4', calzado: 'cz-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#8B7355', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-095', nombre: 'Blanco Celeste', descripcion: 'Camisa blanca + corbata celeste + pantalón azul formal. Aire fresco ejecutivo.', ocasion: ['oficina'], momento: ['dia'], clima: ['templado', 'calor'], estilo: ['corporate'], prendaSuperior: 'cf-1', pantalon: 'pa-1', calzado: 'cz-1', corbata: 'co-3', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#FAFAFA', '#87CEEB', '#1B3A5C'] },
  { id: 'o-096', nombre: 'Negro y Vino', descripcion: 'Camisa negra + corbata rojo vino + pantalón negro. Contraste dramático.', ocasion: ['oficina', 'after_office'], momento: ['dia', 'tarde', 'noche'], clima: ['templado'], estilo: ['noir', 'corporate'], prendaSuperior: 'cf-7', pantalon: 'pa-4', calzado: 'cz-1', corbata: 'co-4', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#1A1A1A', '#722F37', '#1A1A1A'] },
  { id: 'o-097', nombre: 'Azul con Gris', descripcion: 'Camisa azul marino + pantalón gris + mocasines. Transición ejecutiva.', ocasion: ['oficina', 'oficina_casual'], momento: ['dia', 'tarde'], clima: ['templado'], estilo: ['corporate'], prendaSuperior: 'cf-3', pantalon: 'pa-3', calzado: 'cz-2', accesorios: ['ac-1', 'ac-4'], paletaColores: ['#1B2A4A', '#6B7280', '#1A1A1A'] },
  { id: 'o-098', nombre: 'Tortuga con Cuero', descripcion: 'Tortuga negro + pantalón negro + chaqueta cuero. Biker elegante.', ocasion: ['salida', 'after_office', 'fin_de_semana'], momento: ['noche', 'tarde'], clima: ['frio', 'templado'], estilo: ['rockero', 'noir'], prendaSuperior: 'ct-1', pantalon: 'pa-4', calzado: 'cz-5', abrigo: 'ab-2', accesorios: ['ac-1', 'ac-5'], paletaColores: ['#1A1A1A', '#1A1A1A', '#2C2C2C'] },
  { id: 'o-099', nombre: 'Café Formal Completo', descripcion: 'Camisa blanca + pantalón café + zapatos café + corbata gris. Old Money bancario.', ocasion: ['oficina_casual', 'oficina'], momento: ['dia'], clima: ['templado'], estilo: ['old_money', 'corporate'], prendaSuperior: 'cf-1', pantalon: 'pa-5', calzado: 'cz-3', corbata: 'co-5', accesorios: ['ac-2', 'ac-3'], paletaColores: ['#FAFAFA', '#5C3A1E', '#6B7280'] },
  { id: 'o-100', nombre: 'Noir Total Día', descripcion: 'Camisa negra + pantalón negro + zapatos negros sin corbata. Minimalismo absoluto diurno.', ocasion: ['oficina_casual', 'oficina'], momento: ['dia'], clima: ['templado', 'calor'], estilo: ['noir'], prendaSuperior: 'cf-7', pantalon: 'pa-4', calzado: 'cz-1', accesorios: ['ac-1', 'ac-4'], paletaColores: ['#1A1A1A', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-101', nombre: 'Levita Celeste', descripcion: 'Camisa celeste + pantalón gris + levita + zapatos negros. Invierno bancario.', ocasion: ['oficina'], momento: ['dia', 'tarde'], clima: ['frio'], estilo: ['corporate'], prendaSuperior: 'cf-2', pantalon: 'pa-3', calzado: 'cz-1', abrigo: 'ab-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#87CEEB', '#6B7280', '#1A1A1A'] },
  { id: 'o-102', nombre: 'Henley con Cuero Café', descripcion: 'Henley café + pantalón negro + chaqueta cuero + Airless. Mix rockero cálido.', ocasion: ['salida', 'fin_de_semana'], momento: ['noche', 'tarde'], clima: ['frio', 'templado'], estilo: ['rockero'], prendaSuperior: 'hc-3', pantalon: 'pa-4', calzado: 'cz-5', abrigo: 'ab-2', accesorios: ['ac-2', 'ac-5'], paletaColores: ['#5C3A1E', '#1A1A1A', '#2C2C2C'] },
  { id: 'o-103', nombre: 'Verde con Beige', descripcion: 'Henley verde + pantalón beige + Airless. Día de campo con estilo.', ocasion: ['fin_de_semana'], momento: ['dia'], clima: ['templado', 'calor'], estilo: ['old_money'], prendaSuperior: 'hc-2', pantalon: 'pa-6', calzado: 'cz-5', accesorios: ['ac-4'], paletaColores: ['#2D5A27', '#D4C5A9', '#1A1A1A'] },
  { id: 'o-104', nombre: 'Blanco Invernal Completo', descripcion: 'Camisa blanca + corbata negra + pantalón gris claro + levita. Nieve ejecutiva.', ocasion: ['oficina'], momento: ['dia'], clima: ['frio'], estilo: ['corporate'], prendaSuperior: 'cf-1', pantalon: 'pa-2', calzado: 'cz-1', corbata: 'co-1', abrigo: 'ab-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#FAFAFA', '#1A1A1A', '#D1D5DB'] },
  { id: 'o-105', nombre: 'Gris Nocturno con Levita', descripcion: 'Tortuga gris + pantalón negro + levita. Silueta alargada nocturna.', ocasion: ['after_office', 'salida'], momento: ['noche'], clima: ['frio'], estilo: ['noir'], prendaSuperior: 'ct-3', pantalon: 'pa-4', calzado: 'cz-1', abrigo: 'ab-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#6B7280', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-106', nombre: 'Celeste con Beige', descripcion: 'Camisa celeste + pantalón beige + mocasines suela blanca. Verano bancario.', ocasion: ['oficina_casual', 'fin_de_semana'], momento: ['dia'], clima: ['calor', 'templado'], estilo: ['corporate', 'old_money'], prendaSuperior: 'cf-2', pantalon: 'pa-6', calzado: 'cz-4', accesorios: ['ac-2', 'ac-3'], paletaColores: ['#87CEEB', '#D4C5A9', '#FFFFFF'] },
  { id: 'o-107', nombre: 'Banda y Levita', descripcion: 'Camisa de banda + levita + pantalón negro. Rebelión con clase.', ocasion: ['salida', 'after_office'], momento: ['noche'], clima: ['frio'], estilo: ['rockero', 'noir'], prendaSuperior: 'hc-4', pantalon: 'pa-4', calzado: 'cz-1', abrigo: 'ab-1', accesorios: ['ac-1', 'ac-5'], paletaColores: ['#1A1A1A', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-108', nombre: 'Negro Acanalado Formal', descripcion: 'Camisa acanalada cuello alto + pantalón negro + mocasines. Textura para la oficina casual.', ocasion: ['oficina_casual'], momento: ['dia', 'tarde'], clima: ['templado'], estilo: ['noir', 'corporate'], prendaSuperior: 'ct-5', pantalon: 'pa-4', calzado: 'cz-2', accesorios: ['ac-1', 'ac-4'], paletaColores: ['#1A1A1A', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-109', nombre: 'Azul Rey Old Money', descripcion: 'Camisa azul rey + pantalón café + mocasines. Color con tradición.', ocasion: ['oficina_casual', 'salida'], momento: ['dia', 'tarde'], clima: ['templado'], estilo: ['old_money', 'corporate'], prendaSuperior: 'cf-4', pantalon: 'pa-5', calzado: 'cz-4', accesorios: ['ac-2', 'ac-3'], paletaColores: ['#4169E1', '#5C3A1E', '#FFFFFF'] },
  { id: 'o-110', nombre: 'Reloj Verde Ejecutivo', descripcion: 'Camisa gris + pantalón azul + corbata gris + reloj verde. Tech Lord completo.', ocasion: ['oficina', 'oficina_casual'], momento: ['dia'], clima: ['templado'], estilo: ['corporate'], prendaSuperior: 'cf-5', pantalon: 'pa-1', calzado: 'cz-2', corbata: 'co-5', accesorios: ['ac-1', 'ac-4'], paletaColores: ['#6B7280', '#1B3A5C', '#6B7280'] },
  { id: 'o-111', nombre: 'Blanco y Negro Clásico', descripcion: 'Camisa blanca + pantalón negro + zapatos negros. El eterno contraste.', ocasion: ['oficina', 'oficina_casual', 'salida'], momento: ['dia', 'tarde', 'noche'], clima: ['templado'], estilo: ['noir', 'corporate'], prendaSuperior: 'cf-1', pantalon: 'pa-4', calzado: 'cz-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#FAFAFA', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-112', nombre: 'Gris y Café Harmony', descripcion: 'Camisa gris + pantalón café + zapatos café. Armonía terrosa.', ocasion: ['oficina_casual', 'fin_de_semana'], momento: ['dia'], clima: ['templado'], estilo: ['old_money'], prendaSuperior: 'cf-5', pantalon: 'pa-5', calzado: 'cz-3', accesorios: ['ac-2', 'ac-4'], paletaColores: ['#6B7280', '#5C3A1E', '#5C3A1E'] },
  { id: 'o-113', nombre: 'Cuero y Vino Nocturno', descripcion: 'Camisa vino + chaqueta cuero + pantalón negro + Airless. Transición agresiva.', ocasion: ['salida'], momento: ['noche'], clima: ['frio', 'templado'], estilo: ['rockero', 'noir'], prendaSuperior: 'cf-8', pantalon: 'pa-4', calzado: 'cz-5', abrigo: 'ab-2', accesorios: ['ac-1', 'ac-5'], paletaColores: ['#722F37', '#2C2C2C', '#1A1A1A'] },
  { id: 'o-114', nombre: 'Tortuga Blanca Casual', descripcion: 'Suéter tortuga blanco + mezclilla + mocasines. Fin de semana luminoso.', ocasion: ['fin_de_semana'], momento: ['dia', 'tarde'], clima: ['frio', 'templado'], estilo: ['old_money', 'noir'], prendaSuperior: 'ct-2', pantalon: 'pa-7', calzado: 'cz-4', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#FAFAFA', '#2C2C2C', '#FFFFFF'] },
  { id: 'o-115', nombre: 'Celeste con Levita', descripcion: 'Camisa celeste + corbata celeste + pantalón azul + levita. Bancario invernal completo.', ocasion: ['oficina'], momento: ['dia', 'tarde'], clima: ['frio'], estilo: ['corporate'], prendaSuperior: 'cf-2', pantalon: 'pa-1', calzado: 'cz-1', corbata: 'co-3', abrigo: 'ab-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#87CEEB', '#1B3A5C', '#1A1A1A'] },
  { id: 'o-116', nombre: 'Negro con Levita y Corbata Gris', descripcion: 'Camisa negra + corbata gris + pantalón negro + levita. Elegancia sombría.', ocasion: ['oficina', 'after_office'], momento: ['dia', 'tarde', 'noche'], clima: ['frio'], estilo: ['noir', 'corporate'], prendaSuperior: 'cf-7', pantalon: 'pa-4', calzado: 'cz-1', corbata: 'co-5', abrigo: 'ab-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#1A1A1A', '#6B7280', '#1A1A1A'] },
  { id: 'o-117', nombre: 'Verde con Negro Formal', descripcion: 'Henley verde + pantalón negro + mocasines negros. Verde oscuro corporativo.', ocasion: ['oficina_casual', 'fin_de_semana'], momento: ['dia'], clima: ['templado'], estilo: ['corporate'], prendaSuperior: 'hc-2', pantalon: 'pa-4', calzado: 'cz-2', accesorios: ['ac-1', 'ac-4'], paletaColores: ['#2D5A27', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-118', nombre: 'Taupe con Beige', descripcion: 'Camisa taupe + pantalón beige + mocasines. Tierra total.', ocasion: ['oficina_casual', 'fin_de_semana'], momento: ['dia'], clima: ['calor', 'templado'], estilo: ['old_money'], prendaSuperior: 'cf-6', pantalon: 'pa-6', calzado: 'cz-4', accesorios: ['ac-2', 'ac-3'], paletaColores: ['#8B7355', '#D4C5A9', '#FFFFFF'] },
  { id: 'o-119', nombre: 'Cable-Knit con Cuero', descripcion: 'Suéter trenzado + pantalón negro + chaqueta cuero. Textura y rebeldía.', ocasion: ['salida', 'fin_de_semana', 'after_office'], momento: ['noche', 'tarde'], clima: ['frio'], estilo: ['rockero', 'noir'], prendaSuperior: 'ct-6', pantalon: 'pa-4', calzado: 'cz-5', abrigo: 'ab-2', accesorios: ['ac-1', 'ac-5'], paletaColores: ['#1A1A1A', '#1A1A1A', '#2C2C2C'] },
  { id: 'o-120', nombre: 'Celeste Power', descripcion: 'Camisa celeste + corbata rojo vino + pantalón azul. Contraste de mando.', ocasion: ['oficina'], momento: ['dia'], clima: ['templado'], estilo: ['corporate'], prendaSuperior: 'cf-2', pantalon: 'pa-1', calzado: 'cz-1', corbata: 'co-4', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#87CEEB', '#722F37', '#1B3A5C'] },
  { id: 'o-121', nombre: 'Noir con Brown', descripcion: 'Tortuga negro + pantalón café + zapatos café. Contraste extremo.', ocasion: ['oficina_casual', 'after_office', 'salida'], momento: ['tarde', 'noche'], clima: ['frio', 'templado'], estilo: ['noir', 'old_money'], prendaSuperior: 'ct-1', pantalon: 'pa-5', calzado: 'cz-3', accesorios: ['ac-2', 'ac-3'], paletaColores: ['#1A1A1A', '#5C3A1E', '#5C3A1E'] },
  { id: 'o-122', nombre: 'Azul Marino Total', descripcion: 'Camisa azul marino + pantalón azul formal + zapatos negros. Monocromía azul.', ocasion: ['oficina'], momento: ['dia', 'tarde'], clima: ['templado'], estilo: ['corporate'], prendaSuperior: 'cf-3', pantalon: 'pa-1', calzado: 'cz-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#1B2A4A', '#1B3A5C', '#1A1A1A'] },
  { id: 'o-123', nombre: 'Pricemart y Mezclilla', descripcion: 'Suéter Pricemart + mezclilla + mocasines suela blanca. Máximo relax.', ocasion: ['fin_de_semana'], momento: ['dia'], clima: ['templado', 'calor'], estilo: ['corporate'], prendaSuperior: 'ct-7', pantalon: 'pa-7', calzado: 'cz-4', accesorios: ['ac-4'], paletaColores: ['#6B7280', '#2C2C2C', '#FFFFFF'] },
  { id: 'o-124', nombre: 'Blanco con Levita y Corbata Vino', descripcion: 'Camisa blanca + corbata vino + pantalón negro + levita. Alta cocina de moda.', ocasion: ['oficina', 'after_office', 'salida'], momento: ['tarde', 'noche'], clima: ['frio'], estilo: ['corporate', 'noir'], prendaSuperior: 'cf-1', pantalon: 'pa-4', calzado: 'cz-1', corbata: 'co-4', abrigo: 'ab-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#FAFAFA', '#722F37', '#1A1A1A'] },
  { id: 'o-125', nombre: 'Gris Claro Nocturno', descripcion: 'Camisa gris + pantalón gris claro + mocasines. Suave transición nocturna.', ocasion: ['after_office', 'salida'], momento: ['noche'], clima: ['templado'], estilo: ['corporate'], prendaSuperior: 'cf-5', pantalon: 'pa-2', calzado: 'cz-2', accesorios: ['ac-1', 'ac-4'], paletaColores: ['#6B7280', '#D1D5DB', '#1A1A1A'] },
  { id: 'o-126', nombre: 'Negro con Celeste', descripcion: 'Camisa negra + corbata celeste + pantalón negro. Toque de luz en la oscuridad.', ocasion: ['oficina', 'oficina_casual'], momento: ['dia', 'tarde'], clima: ['templado'], estilo: ['noir', 'corporate'], prendaSuperior: 'cf-7', pantalon: 'pa-4', calzado: 'cz-1', corbata: 'co-3', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#1A1A1A', '#87CEEB', '#1A1A1A'] },
  { id: 'o-127', nombre: 'Café con Cuero', descripcion: 'Henley café + pantalón café + chaqueta cuero. Mono-cromo café rockero.', ocasion: ['salida', 'fin_de_semana'], momento: ['noche', 'tarde'], clima: ['frio', 'templado'], estilo: ['rockero', 'old_money'], prendaSuperior: 'hc-3', pantalon: 'pa-5', calzado: 'cz-3', abrigo: 'ab-2', accesorios: ['ac-2', 'ac-5'], paletaColores: ['#5C3A1E', '#5C3A1E', '#2C2C2C'] },
  { id: 'o-128', nombre: 'Azul Rey con Levita', descripcion: 'Camisa azul rey + pantalón negro + levita. Presencia vibrante invernal.', ocasion: ['oficina', 'salida'], momento: ['dia', 'tarde', 'noche'], clima: ['frio'], estilo: ['corporate', 'noir'], prendaSuperior: 'cf-4', pantalon: 'pa-4', calzado: 'cz-1', abrigo: 'ab-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#4169E1', '#1A1A1A', '#1A1A1A'] },
  { id: 'o-129', nombre: 'Tortuga Gris con Mezclilla', descripcion: 'Tortuga gris + mezclilla + mocasines suela blanca. Casual texturizado.', ocasion: ['fin_de_semana', 'oficina_casual'], momento: ['dia', 'tarde'], clima: ['frio', 'templado'], estilo: ['corporate'], prendaSuperior: 'ct-3', pantalon: 'pa-7', calzado: 'cz-4', accesorios: ['ac-1', 'ac-4'], paletaColores: ['#6B7280', '#2C2C2C', '#FFFFFF'] },
  { id: 'o-130', nombre: 'Vino con Levita y Negro', descripcion: 'Camisa vino + pantalón negro + levita + corbata vino. Máximo dramatismo.', ocasion: ['salida', 'after_office'], momento: ['noche'], clima: ['frio'], estilo: ['noir'], prendaSuperior: 'cf-8', pantalon: 'pa-4', calzado: 'cz-1', corbata: 'co-4', abrigo: 'ab-1', accesorios: ['ac-1', 'ac-3'], paletaColores: ['#722F37', '#1A1A1A', '#1A1A1A'] },
];

// ============================================================
// CATEGORIES METADATA
// ============================================================

export const categorias: { id: Categoria; nombre: string; emoji: string }[] = [
  { id: 'camisas_formales', nombre: 'Camisas Formales', emoji: '👔' },
  { id: 'corbatas', nombre: 'Corbatas', emoji: '🪢' },
  { id: 'pantalones', nombre: 'Pantalones', emoji: '👖' },
  { id: 'abrigos', nombre: 'Abrigos', emoji: '🧥' },
  { id: 'cuellos_tortuga', nombre: 'Cuellos de Tortuga', emoji: '👕' },
  { id: 'henley_casual', nombre: 'Henley / Casual', emoji: '🎽' },
  { id: 'calzado', nombre: 'Calzado', emoji: '🥾' },
  { id: 'accesorios', nombre: 'Accesorios', emoji: '🔗' },
];
