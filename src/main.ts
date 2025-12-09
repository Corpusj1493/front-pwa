// src/main.ts
import { enableProdMode, importProvidersFrom, isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter,  } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { provideServiceWorker } from '@angular/service-worker';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TokenInterceptor } from './app/interceptor/token.interceptor'; // Importamos la función
import { NgxCaptchaModule } from 'ngx-captcha';

if (environment.production) {
  enableProdMode();
}



bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),

    // 🎯 REGISTRO DEL SERVICE WORKER
    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.production, // Habilita S.W. solo cuando NO estamos en desarrollo
      registrationStrategy: 'registerWhenStable:30000'
    }),

    // 🎯 AÑADIR ESTO para asegurar la inicialización de la librería:
    importProvidersFrom(NgxCaptchaModule),
    // Configuración HTTP usando Interceptors funcionales
    provideHttpClient(
      withInterceptors([
        TokenInterceptor // ¡Ahora es una función!
      ])
    ),
  ],
});
