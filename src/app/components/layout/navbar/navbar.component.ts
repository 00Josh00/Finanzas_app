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
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark py-2 shadow-sm sticky-top d-none d-md-flex">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center gap-2 fw-bold" routerLink="/dashboard">
          <div class="bg-primary rounded-2 p-1 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
            <i class="bi bi-wallet2 text-white"></i>
          </div>
          <span class="tracking-tight text-white">Finanzas<span class="text-primary">Pro</span></span>
        </a>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto ms-4 gap-1">
            <li class="nav-item">
              <a class="nav-link px-3 rounded-2" routerLink="/dashboard" routerLinkActive="active bg-secondary bg-opacity-25">Dashboard</a>
            </li>
          </ul>

          @if (authService.user(); as user) {
            <div class="dropdown">
              <button class="btn btn-link p-0 border-0 d-flex align-items-center gap-2 text-decoration-none" type="button" id="userMenu" data-bs-toggle="dropdown">
                <span class="text-white small fw-medium d-none d-lg-inline">{{ user.email.split('@')[0] }}</span>
                <div class="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" style="width: 35px; height: 35px; font-size: 13px;">
                  {{ user.email.charAt(0).toUpperCase() }}
                </div>
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3 mt-2">
                <li><a class="dropdown-item small py-2" href="#"><i class="bi bi-person me-2"></i> Perfil</a></li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <button (click)="onLogout()" class="dropdown-item small py-2 text-danger fw-bold">
                    <i class="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                  </button>
                </li>
              </ul>
            </div>
          }
        </div>
      </div>
    </nav>

    <!-- Bottom Navigation (Mobile Only) -->
    <nav class="fixed-bottom bg-white border-top d-flex d-md-none justify-content-around align-items-center py-2 shadow-lg z-3">
      <a routerLink="/dashboard" routerLinkActive="text-primary fw-bold" class="text-center text-decoration-none text-secondary flex-grow-1">
        <i class="bi bi-grid-fill fs-4 d-block"></i>
        <span style="font-size: 10px;">Inicio</span>
      </a>
      
      <!-- Central FAB Placeholder -->
      <div style="width: 60px;"></div>

      <a routerLink="/perfil" class="text-center text-decoration-none text-secondary flex-grow-1 opacity-50">
        <i class="bi bi-person-fill fs-4 d-block"></i>
        <span style="font-size: 10px;">Perfil</span>
      </a>
    </nav>

    <!-- Floating Action Button for Mobile -->
    <button 
      routerLink="/nueva-transaccion" 
      class="btn btn-primary rounded-circle position-fixed bottom-0 start-50 translate-middle-x mb-4 shadow-lg d-md-none d-flex align-items-center justify-content-center z-3"
      style="width: 56px; height: 56px; border: 4px solid white;"
    >
      <i class="bi bi-plus-lg fs-3"></i>
    </button>
  `,
  styles: [`
    .nav-link { font-size: 14px; font-weight: 500; transition: 0.2s; }
    .nav-link:hover { color: #fff !important; }
    .active { color: #fff !important; }
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
