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
        children: [
          // La ruta principal /tabs/tab4 mostrará el dashboard
          {
            path: '', 
            redirectTo: 'dashboard', 
            pathMatch: 'full'
          },
          {
            path: 'dashboard', // /tabs/tab4/dashboard
            loadComponent: () => import('../pages/admin-dashboard/admin-dashboard.page').then(m => m.AdminDashboardPage)
          },
          // Rutas para la gestión de usuarios (necesitas crear este componente)
          {
            path: 'users', // /tabs/tab4/users
            loadComponent: () => import('../pages/user-management/user-management.page').then(m => m.UserManagementPage)
          },
          // Rutas para la gestión de lugares (necesitas crear este componente)
          /*{
            path: 'places', // /tabs/tab4/places
            loadComponent: () => import('../pages/admin/place-management/place-management.page').then(m => m.PlaceManagementPage)
          },*/
        ]
      },
      {
        path: 'place-detail/:id',
        loadComponent: () => import('../pages/place-detail/place-detail.page').then(m => m.PlaceDetailPage)
      },
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },

];
