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
    <div class="min-vh-100 bg-white">
      <app-navbar></app-navbar>

      <div class="container py-3 py-lg-5">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-5">
            
            <div class="d-flex align-items-center mb-4">
              <button 
                routerLink="/dashboard"
                class="btn btn-light rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
                style="width: 40px; height: 40px;"
              >
                <i class="bi bi-chevron-left text-dark"></i>
              </button>
              <h4 class="fw-bold m-0 text-dark">Nuevo Movimiento</h4>
            </div>

            <div class="card p-4 p-lg-5 border-0 shadow-sm rounded-5 bg-light">
              <p class="text-secondary small mb-5">Ingresa los detalles para mantener tu balance actualizado.</p>
              
              <form [formGroup]="form" (ngSubmit)="onSubmit()" class="row g-4">
                
                <div class="col-12">
                  <label class="form-label small fw-bold text-secondary text-uppercase tracking-wider">Monto</label>
                  <div class="input-group input-group-lg">
                    <span class="input-group-text bg-white border-end-0 fw-bold text-primary px-3">S/</span>
                    <input
                      type="number"
                      formControlName="monto"
                      class="form-control border-start-0 amount fw-bold ps-0"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div class="col-12">
                  <label class="form-label small fw-bold text-secondary text-uppercase tracking-wider">Categoría</label>
                  <select
                    formControlName="categoria_id"
                    class="form-select form-select-lg border-0 bg-white shadow-none"
                  >
                    <option [value]="null" disabled selected>Selecciona...</option>
                    @for (cat of categorias(); track cat.id) {
                      <option [value]="cat.id">({{ cat.tipo }}) {{ cat.nombre }}</option>
                    }
                  </select>
                </div>

                <div class="col-12">
                  <label class="form-label small fw-bold text-secondary text-uppercase tracking-wider">Descripción</label>
                  <input
                    type="text"
                    formControlName="descripcion"
                    class="form-control form-control-lg border-0 bg-white shadow-none"
                    placeholder="Ej: Pago de internet"
                  />
                </div>

                <div class="col-12 mt-5">
                  <button
                    type="submit"
                    [disabled]="form.invalid || loading()"
                    class="btn btn-primary btn-lg w-100 py-3 fw-bold shadow rounded-4"
                  >
                    {{ loading() ? 'Guardando...' : 'Confirmar Gasto' }}
                  </button>
                </div>

              </form>
            </div>

            <div class="text-center mt-5 d-md-none">
               <p class="text-secondary small">Tus datos están protegidos y sincronizados.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .amount { font-size: 2rem !important; }
    .tracking-wider { letter-spacing: 0.05em; }
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
