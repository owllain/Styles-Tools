// Types and labels only - NO outfit data (keeps client bundle small)

export interface Garment {
  id: string;
  nombre: string;
  categoria: Categoria;
  color: string;
  colorHex: string;
  formalidad: number;
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

export const LABELS: Record<string, Record<string, string>> = {
  ocasion: {
    oficina: 'Oficina Formal',
    oficina_casual: 'Oficina Casual',
    salida: 'Salida / Noche',
    after_office: 'After Office',
    fin_de_semana: 'Fin de Semana',
  },
  momento: { dia: 'Dia', tarde: 'Tarde', noche: 'Noche' },
  clima: { frio: 'Frio', templado: 'Templado', calor: 'Calor' },
  estilo: {
    noir: 'Noir Sophistique',
    old_money: 'Old Money',
    rockero: 'Rockero / Metal',
    corporate: 'Corporate Tech Lord',
  },
};
