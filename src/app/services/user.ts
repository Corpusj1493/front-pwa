// src/app/services/user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaces de datos (ajustadas según los endpoints)
export interface User {
  id: number;
  name: string;
  last_name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  // Añadir 'role' si es necesario para la visualización en el frontend, 
  // aunque no se incluye en las respuestas del CRUD, es útil para el Admin.
}

interface UserListResponse { success: true; data: User[]; }
interface UserSingleResponse { success: true; data: User; }
interface UserMessageResponse { success: true; data: any; message: string; }

// Payload para Crear (6)
export interface UserCreatePayload {
  name: string;
  last_name: string;
  email: string;
  password: string;
}

// Payload para Actualizar (7)
export interface UserUpdatePayload {
  name?: string;
  last_name?: string;
  email?: string;
  password?: string;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  private userEndpoint = `${this.apiUrl}/users`; // /api/users

  constructor(private http: HttpClient) { }

  // 🎯 4. LIST ALL USERS (GET /api/users)
  getUsers(): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(this.userEndpoint);
  }

  // 🎯 5. GET SPECIFIC USER (GET /api/users/{id})
  getUser(id: number): Observable<UserSingleResponse> {
    return this.http.get<UserSingleResponse>(`${this.userEndpoint}/${id}`);
  }

  // 🎯 6. CREATE USER (POST /api/users)
  createUser(payload: UserCreatePayload): Observable<UserSingleResponse> {
    // El backend maneja la validación de 'password_confirmation' si es necesario,
    // pero el endpoint 6 solo pide 'password'.
    return this.http.post<UserSingleResponse>(this.userEndpoint, payload);
  }

  // 🎯 7. UPDATE USER (PUT /api/users/{id})
  updateUser(id: number, payload: UserUpdatePayload): Observable<UserSingleResponse> {
    // Usaremos PUT según la documentación, aunque PATCH también es común.
    return this.http.put<UserSingleResponse>(`${this.userEndpoint}/${id}`, payload);
  }

  // 🎯 8. DELETE USER (DELETE /api/users/{id})
  deleteUser(id: number): Observable<UserMessageResponse> {
    return this.http.delete<UserMessageResponse>(`${this.userEndpoint}/${id}`);
  }
}