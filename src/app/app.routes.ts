import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Dashboard } from './pages/dashboard/dashboard';
import { OrdersHistory } from './pages/orders-history/orders-history';
import { Settings } from './pages/settings/settings';
import { Login } from './pages/login/login';
import { Layout } from './layout/layout';

export const routes: Routes = [
  { path: 'login', component: Login },

  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' }, // default child
      { path: 'home', component: Home },
      { path: 'dashboard', component: Dashboard },
      { path: 'orders-history', component: OrdersHistory },
      { path: 'settings', component: Settings },
    ],
  },

  { path: '**', redirectTo: 'home' },
];
