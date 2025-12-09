// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Necesitamos 'switchMap' para encadenar la llamada de login con la de /api/me
import { Observable, tap, switchMap, of } from 'rxjs'; 
import { environment } from '../../environments/environment';

// --- Interfaces ---

interface MeResponse { 
  success: boolean; 
  data: UserData; // El endpoint /api/me devuelve directamente UserData
}
interface LoginResponse { success: boolean; data: { user: any; token: string }; message: string; }
interface RegisterResponse { success: boolean; token: string; data: any; message: string; }

// Interfaz para la data del usuario almacenada
export interface UserData {
  id: number;
  name: string;
  last_name: string; // Asegúrate de que este campo también se guarde si lo usas
  email: string;
  roles: string[]; // ⬅️ Array de roles: ["user", "admin"]
  created_at?: string;
  updated_at?: string;
}

// Interfaz que define la estructura de datos que se envía al endpoint /api/login
export interface LoginPayload {
  email: string;
  password: string;
  // Si no usas reCAPTCHA, puedes quitar este campo
  recaptchaToken: string; 
}

// Clave de almacenamiento
const TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // 1. OBTENER Y ALMACENAR DATOS DEL USUARIO (incluyendo roles)
  // Llama a /api/me y guarda la respuesta completa en localStorage
  loadUserData(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.apiUrl}/me`).pipe(
      tap(res => {
        if (res.success && res.data) {
          // Guardamos la data completa, incluyendo el array de roles
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(res.data));
        }
      })
    );
  }

  // 2. Obtiene el token para el Interceptor
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // 3. Obtiene los datos del usuario desde el localStorage
  getUserData(): UserData | null {
    const data = localStorage.getItem(USER_DATA_KEY);
    // Usamos 'USER_DATA_KEY' en lugar de 'user_data' directamente
    return data ? JSON.parse(data) as UserData : null;
  }

  // 4. Lógica de Inicio de Sesión
  login(credentials: LoginPayload): Observable<LoginResponse | any> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.success && res.data.token) {
          // 4a. Guardar el token
          localStorage.setItem(TOKEN_KEY, res.data.token);
          // 4b. No guardamos res.data.user aquí; lo haremos con /api/me
          // para tener la info completa (incluyendo roles).
        }
      }),
      // 4c. Encadenar la llamada de login con la llamada a /api/me
      switchMap((res: LoginResponse) => {
        if (res.success && res.data.token) {
          // Si el login fue exitoso, cargamos los datos del usuario con roles
          return this.loadUserData();
        }
        // Si el login falló, devolvemos un observable vacío
        return of(res); 
      })
    );
  }

  // 5. Lógica de Registro
  register(userData: any): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(res => {
        if (res.success && res.token) {
          // Guardar el token
          localStorage.setItem(TOKEN_KEY, res.token);
          // En el registro, como el backend devuelve el user y el token,
          // podríamos confiar en res.data si ya incluye los roles.
          // Si no incluye roles, deberías llamar a loadUserData().subscribe() aquí también.
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(res.data));
        }
      })
    );
  }

  // 6. Lógica de Cierre de Sesión
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        // Limpiar el storage local
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_DATA_KEY);
      })
    );
  }

  // 7. Verificación de Autenticación
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // 8. VERIFICACIÓN DE ROLES

  // Comprueba si el usuario tiene un rol específico (ej: 'admin', 'editor')
  hasRole(requiredRole: string): boolean {
    const user = this.getUserData();
    
    // Verifica que el usuario exista y que el array de roles incluya el rol requerido
    // Usamos ?. para manejo seguro de null/undefined
    return user?.roles?.includes(requiredRole) ?? false;
  }

  // Comprueba si el usuario es Administrador
  isAdmin(): boolean {
    return this.hasRole('admin');
  }
}