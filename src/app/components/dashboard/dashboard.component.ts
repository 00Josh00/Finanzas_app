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
    <div class="min-vh-100 bg-main pb-5 animate-fade-in">
      
      <app-navbar></app-navbar>

      <main class="container-fluid px-md-5 py-4">
        
        <!-- Welcome Header (Mobile & Desktop) -->
        <div class="d-flex flex-wrap justify-content-between align-items-end mb-4 mb-md-5 px-1 gap-3">
          <div>
            <p class="text-primary fw-bold small text-uppercase tracking-widest mb-1" style="font-size: 0.7rem;">Resumen General</p>
            @if (authService.user(); as user) {
              <h2 class="fw-bold m-0 h2 h1-md">Hola, {{ user.email.split('@')[0] }} 👋</h2>
            } @else {
              <h2 class="fw-bold m-0 h2 h1-md">Hola, Invitado 👋</h2>
            }
          </div>
          <div class="d-flex gap-2">
             <button (click)="onLogout()" class="btn btn-light rounded-3 d-md-none border-0 premium-shadow">
                <i class="bi bi-box-arrow-right text-danger"></i>
             </button>
             <div class="d-none d-md-flex gap-3">
                <div class="glass-card rounded-3 p-2 px-3 d-flex align-items-center gap-2">
                   <i class="bi bi-calendar3 text-primary"></i>
                   <span class="small fw-bold text-muted">{{ today | date:'dd MMMM, yyyy' }}</span>
                </div>
             </div>
          </div>
        </div>

        <div class="row g-4 mb-5">
          <!-- Balance Summary Card -->
          <div class="col-12 col-lg-4">
            <div class="card h-100 p-4 border-0 premium-shadow rounded-5 balance-card text-white overflow-hidden position-relative">
              <div class="mesh-gradient"></div>
              
              <div class="position-relative z-1 d-flex flex-column h-100">
                <div class="d-flex justify-content-between align-items-start mb-4">
                  <div class="w-100 me-2">
                    <p class="text-white opacity-75 small fw-bold text-uppercase tracking-wider mb-0" style="font-size: 0.65rem;">Saldo Disponible</p>
                    <h1 class="amount mb-0 fw-extrabold text-white text-truncate responsive-amount">
                      S/ {{ transaccionesService.saldoTotal() | number:'1.2-2' }}
                    </h1>
                  </div>
                  <div class="bg-white rounded-3 p-1 shadow-sm flex-shrink-0" style="width: 44px; height: 44px; overflow: hidden;">
                    <img src="logo.png" alt="Logo" style="width: 100%; height: 100%; object-fit: contain;">
                  </div>
                </div>
                
                <div class="mt-auto">
                  <div class="row g-2 g-md-3">
                    <div class="col-6">
                      <div class="bg-white bg-opacity-10 rounded-4 p-2 p-md-3 border border-white border-opacity-10">
                        <span class="text-white opacity-75 d-block small mb-1 fw-bold" style="font-size: 0.6rem;">Ingresos</span>
                        <span class="fw-bold amount fs-6 fs-md-5 text-white">S/ {{ transaccionesService.totalIngresos() | number:'1.2-2' }}</span>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="bg-white bg-opacity-10 rounded-4 p-2 p-md-3 border border-white border-opacity-10">
                        <span class="text-white opacity-75 d-block small mb-1 fw-bold" style="font-size: 0.6rem;">Gastos</span>
                        <span class="fw-bold amount fs-6 fs-md-5 text-white">S/ {{ transaccionesService.totalGastos() | number:'1.2-2' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Category Chart Card -->
          <div class="col-12 col-lg-8">
            <div class="card h-100 p-4 border-0 premium-shadow rounded-5 bg-white">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 class="m-0 fw-bold">Distribución de Gastos</h5>
                  <p class="text-muted small m-0">Análisis por categorías este mes</p>
                </div>
                <button class="btn btn-light rounded-3 p-2 px-3 small fw-bold">Ver Detalles</button>
              </div>
              <div class="row align-items-center">
                <div class="col-md-6">
                  <div style="height: 220px;" class="d-flex justify-content-center align-items-center">
                    <canvas #chartCanvas></canvas>
                  </div>
                </div>
                <div class="col-md-6 mt-4 mt-md-0">
                  <div class="d-flex flex-column gap-2">
                    @for (label of Object.keys(transaccionesService.gastosPorCategoria()); track label) {
                      <div class="d-flex justify-content-between align-items-center p-2 rounded-3 hover-bg-light">
                        <div class="d-flex align-items-center gap-2 overflow-hidden me-2">
                          <div class="rounded-circle flex-shrink-0" [style.background-color]="getCategoryColor($index)" style="width: 8px; height: 8px;"></div>
                          <span class="small fw-semibold text-muted text-truncate">{{ label }}</span>
                        </div>
                        <span class="small fw-bold flex-shrink-0">S/ {{ transaccionesService.gastosPorCategoria()[label] | number:'1.2-2' }}</span>
                      </div>
                    } @empty {
                      <div class="text-center py-4 opacity-50">
                        <p class="small m-0">No hay datos suficientes</p>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Transactions Section -->
        <div class="d-flex justify-content-between align-items-center mb-4 px-1">
          <div>
            <h4 class="m-0 fw-bold">Actividad Reciente</h4>
            <p class="text-muted small m-0">Tus últimos movimientos financieros</p>
          </div>
          <button routerLink="/nueva-transaccion" class="btn btn-primary px-4 shadow-sm d-none d-md-block">
             <i class="bi bi-plus-lg me-2"></i> Nueva Transacción
          </button>
        </div>

        <!-- Table View (Desktop) -->
        <div class="card border-0 premium-shadow rounded-5 overflow-hidden d-none d-md-block p-0">
          <div class="table-responsive">
            <table class="table m-0">
              <thead>
                <tr class="bg-light bg-opacity-50">
                  <th class="ps-4 py-4 border-0 text-muted small text-uppercase tracking-wider fw-bold">Concepto</th>
                  <th class="py-4 border-0 text-muted small text-uppercase tracking-wider fw-bold">Categoría</th>
                  <th class="py-4 border-0 text-muted small text-uppercase tracking-wider fw-bold">Fecha</th>
                  <th class="py-4 border-0 text-muted small text-uppercase tracking-wider fw-bold text-end">Monto</th>
                  <th class="pe-4 py-4 border-0 text-muted small text-uppercase tracking-wider fw-bold text-center"></th>
                </tr>
              </thead>
              <tbody class="border-top-0">
                @for (t of transaccionesService.transacciones(); track t.id) {
                  <tr class="align-middle hover-lift-row">
                    <td class="ps-4 py-4">
                      <div class="d-flex align-items-center gap-3">
                        <div class="rounded-4 p-2 d-flex align-items-center justify-content-center" 
                             [class.bg-success-light]="t.tipo_movimiento === 'INGRESO'"
                             [class.bg-danger-light]="t.tipo_movimiento === 'GASTO'"
                             style="width: 44px; height: 44px;">
                          <i [class]="t.tipo_movimiento === 'INGRESO' ? 'bi bi-arrow-up-right text-success' : 'bi bi-arrow-down-left text-danger'" class="fs-5"></i>
                        </div>
                        <span class="fw-bold text-truncate" style="max-width: 200px;">{{ t.descripcion }}</span>
                      </div>
                    </td>
                    <td class="py-4">
                      <span class="badge bg-light text-muted border px-3 py-2 rounded-pill fw-medium">{{ t.categoria_nombre }}</span>
                    </td>
                    <td class="py-4 text-muted small fw-medium">{{ t.fecha | date:'dd MMM, yyyy' }}</td>
                    <td class="py-4 text-end amount fw-extrabold fs-5" [class.text-success]="t.tipo_movimiento === 'INGRESO'" [class.text-danger]="t.tipo_movimiento === 'GASTO'">
                      {{ t.tipo_movimiento === 'INGRESO' ? '+' : '-' }} S/ {{ t.monto | number:'1.2-2' }}
                    </td>
                    <td class="pe-4 py-4 text-center">
                      <div class="d-flex justify-content-center gap-2">
                        <button (click)="onEdit(t)" class="btn btn-light btn-sm rounded-3" data-bs-toggle="modal" data-bs-target="#editModal">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button (click)="onDelete(t)" class="btn btn-light btn-sm rounded-3 text-danger">
                          <i class="bi bi-trash"></i>
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
            <div class="card border-0 premium-shadow rounded-4 mb-3 p-3 overflow-hidden position-relative">
              <div class="d-flex justify-content-between align-items-center gap-2">
                <div class="d-flex align-items-center gap-3 overflow-hidden">
                  <div class="rounded-4 p-2 d-flex align-items-center justify-content-center flex-shrink-0" 
                       [class.bg-success-light]="t.tipo_movimiento === 'INGRESO'"
                       [class.bg-danger-light]="t.tipo_movimiento === 'GASTO'"
                       style="width: 48px; height: 48px;">
                     <i [class]="t.tipo_movimiento === 'INGRESO' ? 'bi bi-arrow-up-right text-success' : 'bi bi-arrow-down-left text-danger'" class="fs-5"></i>
                  </div>
                  <div class="overflow-hidden">
                    <h6 class="fw-bold mb-0 text-truncate">{{ t.descripcion }}</h6>
                    <p class="text-muted small m-0">{{ t.categoria_nombre }} • {{ t.fecha | date:'dd MMM' }}</p>
                  </div>
                </div>
                <div class="text-end flex-shrink-0">
                  <h6 class="amount fw-extrabold m-0" [class.text-success]="t.tipo_movimiento === 'INGRESO'" [class.text-danger]="t.tipo_movimiento === 'GASTO'">
                    {{ t.tipo_movimiento === 'INGRESO' ? '+' : '-' }}S/ {{ t.monto | number:'1.2-2' }}
                  </h6>
                  <button (click)="onEdit(t)" class="btn btn-link btn-sm p-0 text-muted text-decoration-none mt-1 small" data-bs-toggle="modal" data-bs-target="#editModal">Detalles</button>
                </div>
              </div>
            </div>
          }
        </div>

      </main>

      <!-- Edit Modal (Minimalist) -->
      <div class="modal fade" id="editModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
          <div class="modal-content border-0 premium-shadow rounded-5-md overflow-hidden">
            <div class="modal-body p-4 p-md-5">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h3 class="fw-bold m-0">Editar Movimiento</h3>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <form [formGroup]="editForm" (ngSubmit)="onSaveEdit()" class="row g-4">
                <div class="col-12">
                  <label class="form-label small fw-bold text-muted text-uppercase tracking-wider">Monto del Movimiento</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-0 rounded-start-4 fw-bold text-muted">S/</span>
                    <input type="number" formControlName="monto" class="form-control form-control-lg amount fw-bold border-0 bg-light rounded-end-4" placeholder="0.00">
                  </div>
                </div>
                <div class="col-12">
                  <label class="form-label small fw-bold text-muted text-uppercase tracking-wider">Categoría</label>
                  <select formControlName="categoria_id" class="form-select form-select-lg border-0 bg-light rounded-4">
                    @for (cat of transaccionesService.categorias(); track cat.id) {
                      <option [value]="cat.id">{{ cat.nombre }} ({{ cat.tipo }})</option>
                    }
                  </select>
                </div>
                <div class="col-12">
                  <label class="form-label small fw-bold text-muted text-uppercase tracking-wider">Descripción o Concepto</label>
                  <input type="text" formControlName="descripcion" class="form-control form-control-lg border-0 bg-light rounded-4" placeholder="Ej. Almuerzo corporativo">
                </div>
                <div class="col-12 mt-5">
                  <button type="submit" [disabled]="editForm.invalid || loading()" class="btn btn-primary w-100 py-3 fw-bold rounded-4 shadow">
                    {{ loading() ? 'Procesando...' : 'Guardar Cambios' }}
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
    .fw-extrabold { font-weight: 800; }
    
    .balance-card {
      background: #0F172A;
      box-shadow: 0 25px 50px -12px rgba(99, 102, 241, 0.25) !important;
      min-height: 220px;
    }
    
    .responsive-amount {
      font-size: clamp(1.5rem, 8vw, 3rem);
      line-height: 1.2;
    }

    @media (min-width: 768px) {
      .h1-md { font-size: 2.5rem; }
      .rounded-5-md { border-radius: 2rem; }
    }

    .mesh-gradient {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background-image: 
        radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.5) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.5) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(244, 63, 94, 0.3) 0px, transparent 50%),
        radial-gradient(at 0% 100%, rgba(16, 185, 129, 0.3) 0px, transparent 50%);
      opacity: 0.6;
      filter: blur(40px);
    }

    .bg-success-light { background-color: rgba(16, 185, 129, 0.1); }
    .bg-danger-light { background-color: rgba(244, 63, 94, 0.1); }
    
    .hover-lift-row { transition: background-color 0.2s ease; }
    .hover-lift-row:hover { background-color: #F8FAFC; }
    
    .hover-bg-light:hover { background-color: #F8FAFC; }
    
    .tracking-widest { letter-spacing: 0.15em; }
    .z-1 { z-index: 1; }

    @media (max-width: 767.98px) {
      .card { padding: 1.25rem !important; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  public transaccionesService = inject(TransaccionesService);
  private router = inject(Router);

  public today = new Date();

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

  getCategoryColor(index: number): string {
    const colors = ['#6366F1', '#10B981', '#F59E0B', '#F43F5E', '#3B82F6', '#8B5CF6'];
    return colors[index % colors.length];
  }

  async onLogout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
