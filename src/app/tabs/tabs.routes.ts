import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../guards/auth-guard';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'tab1',
        loadComponent: () =>
          import('../tab1/tab1.page').then((m) => m.Tab1Page),
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('../pages/create-review/create-review.page').then((m) => m.CreateReviewPage),
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('../pages/profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: 'tab4',
        loadComponent: () =>
          import('../pages/admin-dashboard/admin-dashboard.page').then((m) => m.AdminDashboardPage),
      },
      // 🎯 RUTA 2: Gestión de Usuarios (Debe ser una ruta hermana de tab4)
      {
        path: 'admin-users', // Usar un nombre único para evitar conflictos
        loadComponent: () =>
          import('../pages/user-management/user-management.page').then((m) => m.UserManagementPage),
      },
      // 🎯 RUTA 3: Gestión de Lugares
      {
        path: 'admin-places', // Usar un nombre único
        loadComponent: () =>
          import('../pages/place-management/place-management.page').then((m) => m.PlaceManagementPage),
      },
      {
        path: 'place-detail/:id',
        loadComponent: () => import('../pages/place-detail/place-detail.page').then(m => m.PlaceDetailPage)
      },
      {
        path: '',
        redirectTo: 'tab1',
        pathMatch: 'full',
      },
    ],
  },

];
