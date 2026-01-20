import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Dashboard } from './pages/dashboard/dashboard';
import { OrdersHistory } from './pages/orders-history/orders-history';
import { Settings } from './pages/settings/settings';
import { Login } from './pages/login/login';
import { Layout } from './layout/layout';
import { authChildGuard, authGuard, roleGuard } from './shared/guards/auth.guard';
import { Profile } from './profile/profile';
import { UsersPage } from './pages/users/users';

export const routes: Routes = [
  { path: 'login', component: Login },

  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    canActivateChild: [authChildGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' }, // default child
      { path: 'home', component: Home, canActivate: [roleGuard], data: { roles: ['admin'] } },
      {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [roleGuard],
        data: { roles: ['user', 'admin'] },
      },
      {
        path: 'orders-history',
        component: OrdersHistory,
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'settings',
        component: Settings,
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'profile',
        component: Profile,
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'users',
        component: UsersPage,
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
    ],
  },

  { path: '**', redirectTo: 'home' },
];
