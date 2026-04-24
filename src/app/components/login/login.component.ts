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
    <div class="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
      <div class="card p-4 p-md-5" style="max-width: 400px; width: 100%;">
        
        <div class="text-center mb-4">
          <h2 class="mb-2">Finanzas App</h2>
          <p class="text-secondary small">
            {{ isLoginMode() ? 'Inicia sesión para continuar' : 'Crea tu cuenta ahora' }}
          </p>
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="row g-3">
          <div class="col-12">
            <label class="form-label small fw-semibold text-secondary">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              [(ngModel)]="email"
              required
              class="form-control"
              placeholder="nombre@ejemplo.com"
            />
          </div>

          <div class="col-12">
            <label class="form-label small fw-semibold text-secondary">Contraseña</label>
            <input
              type="password"
              name="password"
              [(ngModel)]="password"
              required
              class="form-control"
              placeholder="••••••••"
            />
          </div>

          <div class="col-12 mt-4">
            <button
              type="submit"
              [disabled]="loading() || !loginForm.valid"
              class="btn btn-primary w-100 fw-semibold py-2"
            >
              {{ loading() ? 'Procesando...' : (isLoginMode() ? 'Entrar' : 'Registrarme') }}
            </button>
          </div>
        </form>

        @if (errorMessage()) {
          <div class="alert alert-danger mt-3 py-2 small text-center">
            {{ errorMessage() }}
          </div>
        }

        @if (successMessage()) {
          <div class="alert alert-success mt-3 py-2 small text-center">
            {{ successMessage() }}
          </div>
        }

        <div class="text-center mt-4 pt-2">
          <p class="small text-secondary m-0">
            {{ isLoginMode() ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
            <button (click)="toggleMode()" class="btn btn-link p-0 small fw-semibold text-decoration-none">
              {{ isLoginMode() ? 'Registrarse' : 'Iniciar Sesión' }}
            </button>
          </p>
        </div>

      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
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
