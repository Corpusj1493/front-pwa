// src/app/guards/admin.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    console.log('✅ Admin Guard: Acceso permitido.');
    return true;
  } else {
    // Si no es admin, redirigir a una ruta segura (ej. tab1)
    console.log('❌ Admin Guard: Acceso denegado. Redirigiendo a tab1.');
    // Usamos replaceUrl para evitar que el usuario regrese con el botón 'atrás'
    return router.navigate(['/tabs/tab1'], { replaceUrl: true });
  }
};