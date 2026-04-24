export interface Transaccion {
  id: number;
  monto: number;
  fecha: string;
  descripcion: string;
  categoria_nombre: string;
  tipo_movimiento: 'INGRESO' | 'GASTO';
}

export interface Categoria {
  id: number;
  nombre: string;
  tipo: 'INGRESO' | 'GASTO';
}

export interface OrdsResponse<T> {
  items: T[];
  hasMore: boolean;
  limit: number;
  offset: number;
  count: number;
}
