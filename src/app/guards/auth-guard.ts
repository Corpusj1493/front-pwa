// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Guardias funcionales (standalone)
export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Si está logueado, permite el acceso
    return true;
  } else {
    // Si no está logueado, redirige a la página de login
    router.navigate(['/login']);
    return false;
  }
};