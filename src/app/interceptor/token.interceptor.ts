// src/app/interceptors/token.interceptor.ts
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core'; // Importar 'inject'
import { AuthService } from '../services/auth.service';

// Ahora es una función, no una clase
export const TokenInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  // Usamos inject() para obtener el servicio, ya que no estamos en una clase con constructor
  const authService = inject(AuthService);
  const token = authService.getToken();

  let request = req;

  if (token) {
    // Clona la petición y añade la cabecera de autorización (Bearer Token)
    request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` 
      }
    });
  }

  return next(request);
};