// src/app/services/place.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators'; // ⬅️ IMPORTAR MAP OPERATOR
import { Review } from './review'; // Importar Review para PlaceDetail

// Interfaz para el payload de creación de lugar (Endpoint 11)
export interface PlacePayload {
  name: string;
  description: string | null;
  address: string | null;
  lat: number;
  lng: number;
  category: string | null;
}

// Interfaz para la respuesta de creación de lugar
export interface PlaceResponse {
    success: boolean;
    data: {
        id: number; // ⬅️ ¡Este es el place_id que necesitamos!
        user_id: number;
        name: string;
        description: string | null;
        address: string | null;
        lat: number;
        lng: number;
        category: string | null;
        created_at: string;
        updated_at: string;
    };
    message: string;
}
export interface PlaceDetail {
    id: number;
    user_id: number;
    name: string;
    description: string | null;
    address: string | null;
    lat: number;
    lng: number;
    category: string | null;
    created_at: string;
    updated_at: string;
    photos: any[]; // Detalles completos
    reviews: any[];
    votes: any[];
    deleted_at: string | null;
}

// ⬅️ Interfaz para la respuesta del listado
export interface PlacesListResponse {
    success: boolean;
    data: PlaceDetail[]; // Un array de PlaceDetail
    message?: string;
}


@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  private apiUrl = environment.apiUrl;
  private placesEndpoint = `${this.apiUrl}/places`;

  constructor(private http: HttpClient) { }

  /**
   * Crea un nuevo lugar enviando la información principal y coordenadas.
   * Retorna el ID del lugar creado.
   */
  createPlace(placeData: PlacePayload): Observable<PlaceResponse> {
    console.log('📦 Creando nuevo lugar:', placeData.name);
    return this.http.post<PlaceResponse>(this.placesEndpoint, placeData);
  }
  /**
   * 🎯 NUEVO MÉTODO: Obtiene un lugar específico usando el filtro place_id.
   * Endpoint: GET /api/places?place_id={id}
   * Retorna un array, pero esperamos solo un elemento.
   */
  getPlaceById(id: number): Observable<PlaceDetail | null> {
    console.log(`🗺️ Buscando lugar ID: ${id} usando filtro query.`);
    const params = { place_id: id.toString() };

    return this.http.get<PlacesListResponse>(this.placesEndpoint, { params }).pipe(
        map(response => {
            // Si la respuesta es exitosa y hay datos, devuelve el primer elemento.
            const foundPlace = response.data?.find(place => place.id === id);
            
            // ⬅️ DEBUG Y SEGURIDAD: Verifica si el ID encontrado coincide con el ID solicitado
            if (foundPlace && foundPlace.id !== id) {
                 console.warn(`⚠️ ALERTA: La API devolvió el lugar ID ${foundPlace.id} cuando se solicitó el ID ${id}. Hay un problema en el backend.`);
            }
            
            // Si el backend te devuelve una lista de lugares, y el filtro NO funciona, 
            // este mapeo tomará el primer lugar (ID 1) si no aplicamos un filtro local.
            // Asumiendo que el filtro del backend *sí funciona* para el ID, tomamos el primero.
            return foundPlace || null; 
        })
    );
  }
}