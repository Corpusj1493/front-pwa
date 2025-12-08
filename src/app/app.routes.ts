// src/app/app.routes.ts
import { Routes } from '@angular/router';


export const routes: Routes = [
  // Rutas de Autenticación
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  
  // Rutas Protegidas (la página principal de la app)
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes), 
  },
  
  // Ruta de redirección por defecto
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'place-detail',
    loadComponent: () => import('./pages/place-detail/place-detail.page').then( m => m.PlaceDetailPage)
  },
  {
    path: 'profile-edit',
    loadComponent: () => import('./profile-edit/profile-edit.page').then( m => m.ProfileEditPage)
  },
  {
    path: 'admin-dashboard',
    loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.page').then( m => m.AdminDashboardPage)
  },
  {
    path: 'admin-dashboard',
    loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.page').then( m => m.AdminDashboardPage)
  },
  {
    path: 'user-management',
    loadComponent: () => import('./pages/user-management/user-management.page').then( m => m.UserManagementPage)
  },
  {
    path: 'place-management',
    loadComponent: () => import('./pages/place-management/place-management.page').then( m => m.PlaceManagementPage)
  },
  {
    path: 'user-form-modal',
    loadComponent: () => import('./pages/user-management/user-form-modal/user-form-modal.page').then( m => m.UserFormModalPage)
  },

];
