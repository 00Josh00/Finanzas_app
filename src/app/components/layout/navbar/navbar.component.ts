import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <!-- Top Navbar (Desktop & Tablet) -->
    <nav class="navbar navbar-expand-lg py-3 sticky-top glass-card mx-md-4 mt-md-3 rounded-4 d-none d-md-flex z-3">
      <div class="container-fluid px-4">
        <a class="navbar-brand d-flex align-items-center gap-3 fw-bold" routerLink="/dashboard">
          <div class="bg-white rounded-3 p-1 d-flex align-items-center justify-content-center shadow-sm" style="width: 44px; height: 44px; overflow: hidden;">
            <img src="logo.png" alt="Logo" style="width: 100%; height: 100%; object-fit: contain;">
          </div>
          <span class="tracking-tighter fs-4" style="color: var(--text-main)">Finanzas<span class="text-primary">Pro</span></span>
        </a>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto gap-2 align-items-center">
            <li class="nav-item">
              <a class="nav-link px-3 rounded-3" routerLink="/dashboard" routerLinkActive="active-link shadow-sm">Dashboard</a>
            </li>
            
            @if (authService.user(); as user) {
              <li class="nav-item ms-3">
                <div class="dropdown">
                  <button class="btn btn-link p-0 border-0 d-flex align-items-center gap-2 text-decoration-none" type="button" id="userMenu" data-bs-toggle="dropdown">
                    <div class="user-avatar shadow-sm">
                      {{ user.email.charAt(0).toUpperCase() }}
                    </div>
                    <div class="d-none d-lg-block text-start">
                      <p class="m-0 small fw-bold text-dark" style="line-height: 1">{{ user.email.split('@')[0] }}</p>
                      <p class="m-0 text-muted" style="font-size: 10px;">Premium Account</p>
                    </div>
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end border-0 shadow-lg rounded-4 mt-3 p-2 animate-fade-in">
                    <li><a class="dropdown-item rounded-3 py-2 px-3 small" href="#"><i class="bi bi-person me-2"></i> Mi Perfil</a></li>
                    <li><a class="dropdown-item rounded-3 py-2 px-3 small" href="#"><i class="bi bi-gear me-2"></i> Ajustes</a></li>
                    <li><hr class="dropdown-divider mx-2"></li>
                    <li>
                      <button (click)="onLogout()" class="dropdown-item rounded-3 py-2 px-3 small text-danger fw-bold">
                        <i class="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                      </button>
                    </li>
                  </ul>
                </div>
              </li>
            }
          </ul>
        </div>
      </div>
    </nav>

    <!-- Bottom Navigation (Mobile Only) -->
    <nav class="fixed-bottom glass-card border-top d-flex d-md-none justify-content-around align-items-center py-3 shadow-lg z-3">
      <a routerLink="/dashboard" routerLinkActive="text-primary" class="nav-mobile-item">
        <i class="bi bi-house-door fs-4"></i>
        <span>Inicio</span>
      </a>
      
      <div style="width: 50px;"></div>

      <a routerLink="/perfil" class="nav-mobile-item opacity-50">
        <i class="bi bi-person fs-4"></i>
        <span>Perfil</span>
      </a>
    </nav>

    <!-- Floating Action Button for Mobile -->
    <button 
      routerLink="/nueva-transaccion" 
      class="btn btn-primary rounded-circle position-fixed bottom-0 start-50 translate-middle-x mb-4 shadow-lg d-md-none d-flex align-items-center justify-content-center z-3"
      style="width: 64px; height: 64px; border: 5px solid var(--bg-main);"
    >
      <i class="bi bi-plus-lg fs-2"></i>
    </button>
  `,
  styles: [`
    .nav-link { 
      font-size: 14px; 
      font-weight: 600; 
      color: var(--text-muted) !important;
      transition: all 0.2s ease; 
    }
    .nav-link:hover { color: var(--primary) !important; background: var(--primary-glow); }
    .active-link { color: var(--primary) !important; background: white !important; }
    
    .user-avatar {
      width: 40px; 
      height: 40px; 
      background: linear-gradient(135deg, var(--primary) 0%, #4F46E5 100%);
      color: white;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 14px;
    }

    .nav-mobile-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-decoration: none;
      color: var(--text-muted);
      flex: 1;
      gap: 2px;
    }
    .nav-mobile-item span { font-size: 10px; font-weight: 600; }
    
    .z-3 { z-index: 1030; }
  `]
})
export class NavbarComponent {
  public authService = inject(AuthService);
  private router = inject(Router);

  async onLogout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
