// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaces de Petición
interface LoginResponse { success: boolean; data: { user: any; token: string }; message: string; }
interface RegisterResponse { success: boolean; token: string; data: any; message: string; }
export interface UserData {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user'; // Asumiendo que el backend devuelve 'admin' o 'user'
}
// Interfaz que define la estructura de datos que se envía al endpoint /api/login
export interface LoginPayload {
  email: string;
  password: string;
  // 🎯 CAMPO REQUERIDO: El token que viene de la respuesta de reCAPTCHA
  recaptchaToken: string; 
}

// Clave de almacenamiento
const TOKEN_KEY = 'auth_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // 1. Obtiene el token para el Interceptor
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // 2. Lógica de Inicio de Sesión
  login(credentials: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.success && res.data.token) {
          // Guardar el token en el storage
          localStorage.setItem(TOKEN_KEY, res.data.token);
          // Opcional: guardar los datos del usuario
          localStorage.setItem('user_data', JSON.stringify(res.data.user)); 
        }
      })
    );
  }

  // 3. Lógica de Registro
  register(userData: any): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(res => {
        if (res.success && res.token) {
          // Guardar el token inmediatamente después del registro
          localStorage.setItem(TOKEN_KEY, res.token);
          // Opcional: guardar los datos del usuario
          localStorage.setItem('user_data', JSON.stringify(res.data)); 
        }
      })
    );
  }

  // 4. Lógica de Cierre de Sesión
  logout(): Observable<any> {
    // El backend necesita el token para invalidar la sesión
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        // Limpiar el storage local
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('user_data');
      })
    );
  }

  // 5. Verificación de Rol (CRUD, esto es una suposición, si tu backend NO devuelve el rol)
  // NECESITAS OBTENER EL ROL DEL BACKEND
  // Si tu backend no devuelve el rol en el login, necesitaremos un endpoint `/api/user`
  // para obtener los detalles del usuario, incluyendo el rol. 
  // Por ahora, asumiremos que si hay un token, es un usuario logueado.
  // La verificación de ADMIN la haremos con Guards de rutas.

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  getUserData(): any {
  const data = localStorage.getItem('user_data');
  return data ? JSON.parse(data) as UserData : null;
  }
  isAdmin(): boolean {
    const user = this.getUserData();
    return user && user.role === 'admin';
  }
}