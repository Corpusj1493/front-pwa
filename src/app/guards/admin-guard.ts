// src/app/guards/admin.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular'; // ⬅️ 1. Importar ToastController

export const AdminGuard: CanActivateFn =  async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastCtrl = inject(ToastController); // ⬅️ 2. Inyectar ToastController

  if (authService.isAdmin()) {
    console.log('✅ Admin Guard: Acceso permitido.');
    return true;
  } else {
    // ⬅️ 3. Mostrar la notificación
    const toast = await toastCtrl.create({
      message: 'Acceso denegado. Se requiere ser Administrador.',
      duration: 3000,
      color: 'danger',
      position: 'bottom'
    });
    await toast.present();
    
    // 4. Redirigir
    return router.navigate(['/tabs/tab1'], { replaceUrl: true });
  }
};