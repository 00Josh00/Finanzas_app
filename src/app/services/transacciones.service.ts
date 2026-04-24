import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Transaccion, OrdsResponse, Categoria } from '../models/finanzas.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl.endsWith('/') 
    ? environment.apiUrl.slice(0, -1) 
    : environment.apiUrl;

  private _transacciones = signal<Transaccion[]>([]);
  transacciones = computed(() => this._transacciones());

  private _categorias = signal<Categoria[]>([]);
  categorias = computed(() => this._categorias());

  saldoTotal = computed(() => {
    return this._transacciones().reduce((acc, t) => {
      const monto = Number(t.monto) || 0;
      return t.tipo_movimiento === 'INGRESO' ? acc + monto : acc - monto;
    }, 0);
  });

  totalIngresos = computed(() => {
    return this._transacciones()
      .filter(t => t.tipo_movimiento === 'INGRESO')
      .reduce((acc, t) => acc + (Number(t.monto) || 0), 0);
  });

  totalGastos = computed(() => {
    return this._transacciones()
      .filter(t => t.tipo_movimiento === 'GASTO')
      .reduce((acc, t) => acc + (Number(t.monto) || 0), 0);
  });

  gastosPorCategoria = computed(() => {
    const distribucion: { [key: string]: number } = {};
    this._transacciones()
      .filter(t => t.tipo_movimiento === 'GASTO')
      .forEach(t => {
        const cat = t.categoria_nombre || 'Otros';
        distribucion[cat] = (distribucion[cat] || 0) + (Number(t.monto) || 0);
      });
    return distribucion;
  });

  async sincronizarUsuario(uid: string, email: string) {
    try {
      const url = `${this.baseUrl}/usuarios/registro`;
      return await firstValueFrom(this.http.post(url, { uid, email }));
    } catch (error) {
      console.error('Error sincronizando:', error);
      throw error;
    }
  }

  async obtenerMovimientos(uid: string) {
    try {
      // Ruta actualizada para evitar colisiones: usuarios/:uid/movimientos
      const url = `${this.baseUrl}/usuarios/${uid}/movimientos`;
      const response = await firstValueFrom(this.http.get<OrdsResponse<Transaccion>>(url));
      this._transacciones.set(response.items || []);
      return response.items;
    } catch (error) {
      this._transacciones.set([]);
      throw error;
    }
  }

  async obtenerCategorias() {
    try {
      const url = `${this.baseUrl}/categorias`;
      const response = await firstValueFrom(this.http.get<OrdsResponse<Categoria>>(url));
      this._categorias.set(response.items || []);
      return response.items;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      this._categorias.set([]);
      return [];
    }
  }

  async crearTransaccion(payload: any) {
    try {
      const url = `${this.baseUrl}/movimientos`;
      const response = await firstValueFrom(this.http.post<Transaccion>(url, payload));
      await this.obtenerMovimientos(payload.uid);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async eliminarTransaccion(id: number, uid: string) {
    try {
      const url = `${this.baseUrl}/movimientos/${id}`;
      await firstValueFrom(this.http.delete(url));
      await this.obtenerMovimientos(uid);
    } catch (error) {
      throw error;
    }
  }

  async actualizarTransaccion(id: number, payload: any) {
    try {
      const url = `${this.baseUrl}/movimientos/${id}`;
      const response = await firstValueFrom(this.http.put<Transaccion>(url, payload));
      await this.obtenerMovimientos(payload.uid);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
