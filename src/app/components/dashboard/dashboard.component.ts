import { Component, inject, OnInit, signal, effect, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { TransaccionesService } from '../../services/transacciones.service';
import { Router, RouterLink } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { NavbarComponent } from '../layout/navbar/navbar.component';
import { Transaccion } from '../../models/finanzas.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe, RouterLink, NavbarComponent, ReactiveFormsModule],
  template: `
    <div class="min-vh-100 bg-light pb-5">
      
      <app-navbar></app-navbar>

      <main class="container py-4">
        
        <!-- Welcome Header (Mobile focus) -->
        <div class="d-flex justify-content-between align-items-center mb-4 d-md-none px-1">
          <div>
            @if (authService.user(); as user) {
              <h5 class="fw-bold m-0 text-dark">Hola, {{ user.email.split('@')[0] }}</h5>
            } @else {
              <h5 class="fw-bold m-0 text-dark">Hola, Invitado</h5>
            }
            <p class="text-secondary small m-0">¡Qué bueno verte!</p>
          </div>
          <div class="bg-white rounded-circle p-2 shadow-sm">
             <i class="bi bi-bell text-secondary"></i>
          </div>
        </div>

        <div class="row g-3 g-lg-4 mb-4">
          <!-- Balance Summary Card -->
          <div class="col-12 col-md-5 col-lg-4">
            <div class="card h-100 p-4 border-0 shadow-sm rounded-4 balance-card text-white overflow-hidden position-relative">
              <div class="position-absolute top-0 end-0 p-3 opacity-10">
                <i class="bi bi-piggy-bank display-4"></i>
              </div>
              
              <div class="position-relative z-1">
                <p class="text-white opacity-75 small fw-semibold text-uppercase mb-1 tracking-wider">Saldo Disponible</p>
                <h1 class="amount mb-4 display-5 fw-bold text-white">
                  S/ {{ transaccionesService.saldoTotal() | number:'1.2-2' }}
                </h1>
                
                <div class="row g-2 pt-3 mt-auto">
                  <div class="col-6">
                    <span class="text-white opacity-75 d-block small mb-1">Ingresos</span>
                    <span class="fw-bold text-success amount fs-5">S/ {{ transaccionesService.totalIngresos() | number:'1.2-2' }}</span>
                  </div>
                  <div class="col-6 text-end border-start border-white border-opacity-10">
                    <span class="text-white opacity-75 d-block small mb-1">Gastos</span>
                    <span class="fw-bold text-danger amount fs-5">S/ {{ transaccionesService.totalGastos() | number:'1.2-2' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Category Chart Card -->
          <div class="col-12 col-md-7 col-lg-8">
            <div class="card h-100 p-4 border-0 shadow-sm rounded-4 bg-white">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="m-0 fw-bold">Análisis de Gastos</h6>
                <i class="bi bi-three-dots-vertical text-secondary"></i>
              </div>
              <div style="height: 180px;" class="d-flex justify-content-center align-items-center">
                <canvas #chartCanvas></canvas>
              </div>
              @if (Object.keys(transaccionesService.gastosPorCategoria()).length === 0) {
                <p class="text-center text-secondary small mt-3 m-0 opacity-50">Ingresa tus primeros gastos</p>
              }
            </div>
          </div>
        </div>

        <!-- Transactions Section -->
        <div class="d-flex justify-content-between align-items-center mb-3 px-1">
          <h6 class="m-0 fw-bold text-dark text-uppercase tracking-wider small">Movimientos Recientes</h6>
          <button routerLink="/nueva-transaccion" class="btn btn-primary btn-sm px-3 rounded-pill fw-bold d-none d-md-block shadow-sm">
             <i class="bi bi-plus-lg me-1"></i> Nuevo
          </button>
        </div>

        <!-- Table View (Desktop) -->
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden d-none d-md-block">
          <div class="table-responsive">
            <table class="table table-hover m-0">
              <thead class="bg-light">
                <tr>
                  <th class="ps-4 py-3 border-0 text-secondary small text-uppercase">Fecha</th>
                  <th class="py-3 border-0 text-secondary small text-uppercase">Descripción</th>
                  <th class="py-3 border-0 text-secondary small text-uppercase text-end">Monto</th>
                  <th class="pe-4 py-3 border-0 text-secondary small text-uppercase text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (t of transaccionesService.transacciones(); track t.id) {
                  <tr [class]="t.tipo_movimiento === 'INGRESO' ? 'income-row' : 'expense-row'" class="align-middle">
                    <td class="ps-4 py-3 small text-secondary">{{ t.fecha | date:'dd/MM/yy' }}</td>
                    <td class="py-3 fw-semibold">
                       <span class="d-block">{{ t.descripcion }}</span>
                       <span class="text-secondary fw-normal" style="font-size: 11px;">{{ t.categoria_nombre }}</span>
                    </td>
                    <td class="py-3 text-end amount fw-bold" [class.income-amount]="t.tipo_movimiento === 'INGRESO'" [class.expense-amount]="t.tipo_movimiento === 'GASTO'">
                      {{ t.tipo_movimiento === 'INGRESO' ? '+' : '-' }} S/ {{ t.monto | number:'1.2-2' }}
                    </td>
                    <td class="pe-4 py-3 text-center">
                      <div class="d-flex justify-content-center gap-1">
                        <button (click)="onEdit(t)" class="btn btn-sm btn-light rounded-circle p-2" data-bs-toggle="modal" data-bs-target="#editModal">
                          <i class="bi bi-pencil-fill text-secondary"></i>
                        </button>
                        <button (click)="onDelete(t)" class="btn btn-sm btn-light rounded-circle p-2">
                          <i class="bi bi-trash-fill text-danger"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Card View (Mobile) -->
        <div class="d-md-none">
          @for (t of transaccionesService.transacciones(); track t.id) {
            <div class="card border-0 shadow-sm rounded-4 mb-3 p-3 overflow-hidden position-relative"
                 [class.income-row]="t.tipo_movimiento === 'INGRESO'" 
                 [class.expense-row]="t.tipo_movimiento === 'GASTO'">
              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-3">
                  <div class="rounded-3 p-2 bg-light d-flex align-items-center justify-content-center" style="width: 45px; height: 45px;">
                     <i [class]="t.tipo_movimiento === 'INGRESO' ? 'bi bi-arrow-up-right text-success' : 'bi bi-arrow-down-left text-danger'" class="fs-4"></i>
                  </div>
                  <div>
                    <h6 class="fw-bold mb-0 text-dark">{{ t.descripcion }}</h6>
                    <p class="text-secondary small m-0">{{ t.categoria_nombre }} • {{ t.fecha | date:'dd MMM' }}</p>
                  </div>
                </div>
                <div class="text-end">
                  <h6 class="amount fw-bold m-0" [class.text-success]="t.tipo_movimiento === 'INGRESO'" [class.text-danger]="t.tipo_movimiento === 'GASTO'">
                    {{ t.tipo_movimiento === 'INGRESO' ? '+' : '-' }}S/ {{ t.monto | number:'1.2-2' }}
                  </h6>
                  <div class="mt-2 d-flex gap-2 justify-content-end">
                    <button (click)="onEdit(t)" class="btn btn-sm btn-light rounded-pill px-2 py-0" data-bs-toggle="modal" data-bs-target="#editModal" style="font-size: 10px;">Editar</button>
                    <button (click)="onDelete(t)" class="btn btn-sm btn-light text-danger rounded-pill px-2 py-0" style="font-size: 10px;">Borrar</button>
                  </div>
                </div>
              </div>
            </div>
          } @empty {
             <div class="text-center py-5 opacity-50">
               <i class="bi bi-inbox display-1"></i>
               <p class="mt-2 small fw-bold">Sin movimientos aún</p>
             </div>
          }
        </div>

      </main>

      <!-- Edit Modal -->
      <div class="modal fade" id="editModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow rounded-4">
            <div class="modal-body p-4">
              <h5 class="fw-bold mb-4">Editar Movimiento</h5>
              <form [formGroup]="editForm" (ngSubmit)="onSaveEdit()" class="row g-3">
                <div class="col-12">
                  <label class="form-label small fw-bold text-secondary">Monto (S/)</label>
                  <input type="number" formControlName="monto" class="form-control form-control-lg amount fw-bold border-light bg-light">
                </div>
                <div class="col-12">
                  <label class="form-label small fw-bold text-secondary">Categoría</label>
                  <select formControlName="categoria_id" class="form-select border-light bg-light">
                    @for (cat of transaccionesService.categorias(); track cat.id) {
                      <option [value]="cat.id">({{ cat.tipo }}) {{ cat.nombre }}</option>
                    }
                  </select>
                </div>
                <div class="col-12">
                  <label class="form-label small fw-bold text-secondary">Descripción</label>
                  <input type="text" formControlName="descripcion" class="form-control border-light bg-light">
                </div>
                <div class="col-12 mt-4">
                  <button type="submit" [disabled]="editForm.invalid || loading()" class="btn btn-primary w-100 py-3 fw-bold rounded-3" data-bs-dismiss="modal">
                    {{ loading() ? 'Guardando...' : 'Confirmar Cambios' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }
    .amount { font-variant-numeric: tabular-nums; }
    .balance-card {
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
      box-shadow: 0 10px 20px -5px rgba(15, 23, 42, 0.3) !important;
    }
    .balance-card h1 { color: #ffffff !important; }
    .income-row { border-left: 5px solid var(--bs-success) !important; }
    .expense-row { border-left: 5px solid var(--bs-danger) !important; }
    .tracking-wider { letter-spacing: 0.05em; }
    .z-1 { z-index: 1; }
  `]
})
export class DashboardComponent implements OnInit {
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  public transaccionesService = inject(TransaccionesService);
  private router = inject(Router);

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;
  public Object = Object;
  
  loading = signal(false);
  selectedTransaction: Transaccion | null = null;

  // Removido categorias harcodeadas

  editForm = this.fb.group({
    monto: [0, [Validators.required, Validators.min(0.01)]],
    categoria_id: [0, Validators.required],
    descripcion: ['', Validators.required]
  });

  constructor() {
    effect(() => {
      const datos = this.transaccionesService.gastosPorCategoria();
      this.updateChart(datos);
    });
  }

  async ngOnInit() {
    const user = this.authService.user();
    if (user) {
      try {
        await Promise.all([
          this.transaccionesService.obtenerMovimientos(user.uid),
          this.transaccionesService.obtenerCategorias()
        ]);
      } catch (err) {
        console.error('Error cargando movimientos o categorías');
      }
    }
  }

  private updateChart(datos: { [key: string]: number }) {
    if (!this.chartCanvas) return;

    const labels = Object.keys(datos);
    const values = Object.values(datos);

    if (this.chart) {
      this.chart.destroy();
    }

    if (labels.length === 0) return;

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: [
            '#0EA5E9', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6', '#64748B'
          ],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        plugins: {
          legend: { 
            display: window.innerWidth > 768,
            position: 'right', 
            labels: { 
              boxWidth: 8, 
              padding: 10,
              font: { family: 'Inter', size: 10, weight: 'bold' } 
            } 
          }
        },
        cutout: '75%',
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  onEdit(t: Transaccion) {
    this.selectedTransaction = t;
    const cat = this.transaccionesService.categorias().find(c => c.nombre === t.categoria_nombre);
    this.editForm.patchValue({
      monto: t.monto,
      categoria_id: cat ? cat.id : (this.transaccionesService.categorias()[0]?.id || 0),
      descripcion: t.descripcion
    });
  }

  async onSaveEdit() {
    if (this.editForm.invalid || !this.selectedTransaction) return;

    this.loading.set(true);
    const user = this.authService.user();
    if (!user) return;

    try {
      const payload = {
        uid: user.uid,
        categoria_id: Number(this.editForm.value.categoria_id),
        monto: this.editForm.value.monto,
        descripcion: this.editForm.value.descripcion
      };

      await this.transaccionesService.actualizarTransaccion(this.selectedTransaction.id, payload);
    } catch (err) {
      alert('Error al actualizar.');
    } finally {
      this.loading.set(false);
      this.selectedTransaction = null;
    }
  }

  async onDelete(t: Transaccion) {
    const user = this.authService.user();
    if (!user) return;

    if (confirm(`¿Eliminar "${t.descripcion}"?`)) {
      try {
        await this.transaccionesService.eliminarTransaccion(t.id, user.uid);
      } catch (err) {
        alert('Error al eliminar.');
      }
    }
  }

  async onLogout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
