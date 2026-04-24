import { Injectable, signal, computed, inject } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { TransaccionesService } from '../services/transacciones.service';
import { Router } from '@angular/router';

export interface UserSession {
  uid: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private transaccionesService = inject(TransaccionesService);
  private router = inject(Router);
  private _user = signal<UserSession | null>(null);

  user = computed(() => this._user());
  isAuthenticated = computed(() => !!this._user());

  constructor() {
    // Configuración resiliente de Supabase
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });

    this.initAuth();
  }

  private async initAuth() {
    // Escuchar cambios de autenticación
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth Event:', event);
      
      if (session?.user) {
        this.updateUserState(session.user);
        
        // Sincronización proactiva: asegura que el usuario exista en Oracle
        try {
          await this.transaccionesService.sincronizarUsuario(session.user.id, session.user.email ?? '');
        } catch (e) {
          console.error('Error en autosincronización');
        }

        // Redirigir al dashboard solo si estamos en la página de login
        if (event === 'SIGNED_IN' && window.location.pathname.includes('login')) {
          this.router.navigate(['/dashboard']);
        }
      } else {
        this._user.set(null);
      }
    });

    // Obtener sesión inicial
    const { data: { session } } = await this.supabase.auth.getSession();
    if (session?.user) {
      this.updateUserState(session.user);
    }
  }

  private updateUserState(user: User) {
    this._user.set({
      uid: user.id,
      email: user.email ?? ''
    });
  }

  async loginWithEmail(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  async signUp(email: string, password: string) {
    return await this.supabase.auth.signUp({ email, password });
  }

  async loginWithGoogle() {
    return await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  }

  async logout() {
    this._user.set(null);
    return await this.supabase.auth.signOut();
  }
}
