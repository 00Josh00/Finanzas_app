import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransaccionesService } from '../../services/transacciones.service';
import { AuthService } from '../../auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../layout/navbar/navbar.component';

@Component({
  selector: 'app-nueva-transaccion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent],
  template: `
    <div class="min-vh-100 bg-main pb-5 animate-fade-in">
      <app-navbar></app-navbar>

      <div class="container py-4 py-lg-5">
        <div class="row justify-content-center">
          <div class="col-12 col-md-10 col-lg-6 col-xl-5">
            
            <div class="d-flex align-items-center mb-5">
              <button 
                routerLink="/dashboard"
                class="btn btn-white premium-shadow rounded-4 p-2 me-3 d-flex align-items-center justify-content-center hover-lift"
                style="width: 48px; height: 48px;"
              >
                <i class="bi bi-arrow-left text-dark fs-4"></i>
              </button>
              <div>
                <h2 class="fw-extrabold m-0 h3">Nuevo Movimiento</h2>
                <p class="text-muted small m-0 fw-medium">Registra tus ingresos o gastos con un toque premium</p>
              </div>
            </div>

            <div class="card p-4 p-lg-5 border-0 premium-shadow rounded-5 bg-white">
              <form [formGroup]="form" (ngSubmit)="onSubmit()" class="row g-4">
                
                <div class="col-12">
                  <label class="form-label small fw-bold text-muted text-uppercase tracking-wider">Monto del Movimiento</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-0 rounded-start-4 fw-extrabold text-primary fs-3">S/</span>
                    <input
                      type="number"
                      formControlName="monto"
                      class="form-control border-0 bg-light amount fw-extrabold rounded-end-4 responsive-amount-input py-3 py-lg-4"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div class="col-12 mt-5">
                  <label class="form-label small fw-bold text-muted text-uppercase tracking-wider">Categoría</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-0 rounded-start-4"><i class="bi bi-tag text-muted"></i></span>
                    <select
                      formControlName="categoria_id"
                      class="form-select form-select-lg border-0 bg-light rounded-end-4"
                    >
                      <option [value]="null" disabled selected>Selecciona una categoría...</option>
                      @for (cat of categorias(); track cat.id) {
                        <option [value]="cat.id">({{ cat.tipo }}) {{ cat.nombre }}</option>
                      }
                    </select>
                  </div>
                </div>

                <div class="col-12 mt-4">
                  <label class="form-label small fw-bold text-muted text-uppercase tracking-wider">Descripción o Concepto</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-0 rounded-start-4"><i class="bi bi-pencil-square text-muted"></i></span>
                    <input
                      type="text"
                      formControlName="descripcion"
                      class="form-control form-control-lg border-0 bg-light rounded-end-4"
                      placeholder="Ej: Pago de suscripción Netflix"
                    />
                  </div>
                </div>

                <div class="col-12 mt-5">
                  <button
                    type="submit"
                    [disabled]="form.invalid || loading()"
                    class="btn btn-primary btn-lg w-100 py-3 fw-bold shadow-lg rounded-4 fs-5"
                  >
                    @if (loading()) {
                      <span class="spinner-border spinner-border-sm me-2"></span>
                      Procesando...
                    } @else {
                      <i class="bi bi-check-lg me-2"></i> Confirmar Movimiento
                    }
                  </button>
                </div>

              </form>
            </div>

            <div class="text-center mt-5">
               <div class="d-flex align-items-center justify-content-center gap-2 opacity-50">
                  <i class="bi bi-shield-check text-primary"></i>
                  <p class="text-muted small m-0 fw-medium">Tus finanzas están seguras y encriptadas</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .fw-extrabold { font-weight: 800; }
    .amount { font-variant-numeric: tabular-nums; }
    .btn-white { background: white; border: 1px solid var(--border-subtle); }
    .amount::placeholder { color: #E2E8F0; }

    .responsive-amount-input {
      font-size: clamp(1.5rem, 8vw, 3.5rem);
    }
    
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    input[type=number] {
      -moz-appearance: textfield;
    }
  `]
})
export class NuevaTransaccionComponent implements OnInit {
  private fb = inject(FormBuilder);
  private transaccionesService = inject(TransaccionesService);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);

  categorias = this.transaccionesService.categorias;

  form = this.fb.group({
    monto: [null, [Validators.required, Validators.min(0.01)]],
    categoria_id: [null, Validators.required],
    descripcion: ['', Validators.required]
  });

  ngOnInit() {
    this.transaccionesService.obtenerCategorias();
  }

  async onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    const user = this.authService.user();
    if (!user) return;

    try {
      const payload = {
        uid: user.uid,
        categoria_id: Number(this.form.value.categoria_id),
        monto: this.form.value.monto,
        descripcion: this.form.value.descripcion
      };

      await this.transaccionesService.crearTransaccion(payload);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      alert('Error al registrar.');
    } finally {
      this.loading.set(false);
    }
  }
}
