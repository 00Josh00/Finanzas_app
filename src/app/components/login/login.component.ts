import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page min-vh-100 d-flex align-items-center justify-content-center p-4">
      <div class="mesh-gradient-bg"></div>
      
      <div class="login-card glass-card p-5 animate-fade-in shadow-2xl">
        <div class="text-center mb-5">
          <div class="bg-white rounded-4 p-2 d-inline-flex align-items-center justify-content-center mb-4 shadow-lg mx-auto" style="width: 80px; height: 80px; overflow: hidden;">
            <img src="logo.png" alt="Logo" style="width: 100%; height: 100%; object-fit: contain;">
          </div>
          <h2 class="fw-extrabold h1 mb-2 tracking-tighter" style="color: var(--text-main)">Finanzas<span class="text-primary">Pro</span></h2>
          <p class="text-muted small fw-medium">
            {{ isLoginMode() ? 'Bienvenido de nuevo a tu libertad financiera' : 'Comienza hoy mismo tu viaje financiero' }}
          </p>
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="row g-4">
          <div class="col-12">
            <label class="form-label small fw-bold text-muted text-uppercase tracking-wider">Correo Electrónico</label>
            <div class="input-group">
              <span class="input-group-text bg-light border-0 rounded-start-4"><i class="bi bi-envelope text-muted"></i></span>
              <input
                type="email"
                name="email"
                [(ngModel)]="email"
                required
                class="form-control form-control-lg border-0 bg-light rounded-end-4"
                placeholder="tu@correo.com"
              />
            </div>
          </div>

          <div class="col-12">
            <div class="d-flex justify-content-between align-items-center">
              <label class="form-label small fw-bold text-muted text-uppercase tracking-wider">Contraseña</label>
              @if (isLoginMode()) {
                <a href="#" class="small text-primary text-decoration-none fw-bold" style="font-size: 11px;">¿Olvidaste tu contraseña?</a>
              }
            </div>
            <div class="input-group">
              <span class="input-group-text bg-light border-0 rounded-start-4"><i class="bi bi-lock text-muted"></i></span>
              <input
                type="password"
                name="password"
                [(ngModel)]="password"
                required
                class="form-control form-control-lg border-0 bg-light rounded-end-4"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div class="col-12 mt-5">
            <button
              type="submit"
              [disabled]="loading() || !loginForm.valid"
              class="btn btn-primary w-100 fw-bold py-3 shadow-lg rounded-4 fs-5"
            >
              {{ loading() ? 'Procesando...' : (isLoginMode() ? 'Iniciar Sesión' : 'Crear Cuenta') }}
            </button>
          </div>
        </form>

        @if (errorMessage()) {
          <div class="alert bg-danger bg-opacity-10 text-danger border-0 mt-4 py-3 small text-center rounded-4 animate-fade-in">
            <i class="bi bi-exclamation-circle me-2"></i> {{ errorMessage() }}
          </div>
        }

        @if (successMessage()) {
          <div class="alert bg-success bg-opacity-10 text-success border-0 mt-4 py-3 small text-center rounded-4 animate-fade-in">
            <i class="bi bi-check-circle me-2"></i> {{ successMessage() }}
          </div>
        }

        <div class="text-center mt-5">
          <p class="small text-muted fw-medium">
            {{ isLoginMode() ? '¿No tienes una cuenta?' : '¿Ya eres usuario?' }}
            <button (click)="toggleMode()" class="btn btn-link p-0 small fw-bold text-primary text-decoration-none ms-1">
              {{ isLoginMode() ? 'Regístrate aquí' : 'Inicia sesión' }}
            </button>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; overflow: hidden; }
    .login-page { position: relative; }
    .login-card { max-width: 480px; width: 100%; border-radius: 40px; }
    .fw-extrabold { font-weight: 800; }
    
    .mesh-gradient-bg {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background-color: #FBFBFE;
      background-image: 
        radial-gradient(at 10% 10%, rgba(99, 102, 241, 0.1) 0px, transparent 50%),
        radial-gradient(at 90% 10%, rgba(139, 92, 246, 0.1) 0px, transparent 50%),
        radial-gradient(at 50% 50%, rgba(16, 185, 129, 0.05) 0px, transparent 50%),
        radial-gradient(at 10% 90%, rgba(244, 63, 94, 0.1) 0px, transparent 50%),
        radial-gradient(at 90% 90%, rgba(99, 102, 241, 0.1) 0px, transparent 50%);
      z-index: -1;
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  isLoginMode = signal(true);
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  toggleMode() {
    this.isLoginMode.update(v => !v);
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  async onSubmit() {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    try {
      if (this.isLoginMode()) {
        const { error } = await this.authService.loginWithEmail(this.email, this.password);
        if (error) throw error;
        this.router.navigate(['/dashboard']);
      } else {
        const { error } = await this.authService.signUp(this.email, this.password);
        if (error) throw error;
        this.successMessage.set('¡Registro exitoso! Verifica tu correo.');
      }
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Error de autenticación');
    } finally {
      this.loading.set(false);
    }
  }
}
