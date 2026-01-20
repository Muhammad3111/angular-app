import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideStore, Store } from '@ngrx/store';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { regionsReducer } from './store/regions/region.reducer';
import { RegionsEffects } from './store/regions/region.effects';
import { OrdersEffects } from './store/orders/order.effects';
import { ordersReducer } from './store/orders/order.reducer';
import { analyticsReducer } from './store/analytics/analytics.reducers';
import { AnalyticsEffects } from './store/analytics/analytics.effects';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { authInterceptor } from './store/auth/auth.interceptor';
import { usersReducer } from './store/users/users.reducer';
import { UsersEffects } from './store/users/users.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideStore({
      regions: regionsReducer,
      orders: ordersReducer,
      analytics: analyticsReducer,
      auth: authReducer,
      users: usersReducer,
    }),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideEffects([RegionsEffects, OrdersEffects, AnalyticsEffects, AuthEffects, UsersEffects]),
    provideStoreDevtools({ maxAge: 25 }),
  ],
};
