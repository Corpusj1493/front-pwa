// src/app/services/review.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators'

// Interfaz para el payload de RESEÑA (Endpoint 21)
export interface ReviewPayload {
  place_id: number;
  rating: number;
  comment: string | null;
}

// Interfaz para el payload de FOTO (Endpoint 16)
export interface PhotoPayload {
    place_id: number;
    photo: string; // Base64 de la foto
    description: string | null;
}
export interface Review {
  id: number;
  place_id: number;
  user_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  
  // Asumo que el backend incluye los datos del lugar
  place?: {
    id: number;
    name: string;
    address: string | null;
    lat: number;
    lng: number;
  } | null;
  
  // Asumo que el backend incluye la foto principal
  photos?: {
      url: string;
      description: string | null;
  }[] | null;
  
  user?: {
      id: number;
      name: string;
  } | null;
}

// Interfaz de respuesta genérica
interface ApiResponse {
  success: boolean;
  data: any; 
  message: string;
}

export interface ReviewsListResponse {
    success: boolean;
    data: Review[]; // Un array de la interfaz Review
    message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = environment.apiUrl;
  private reviewEndpoint = `${this.apiUrl}/reviews`; 
  private photosEndpoint = `${this.apiUrl}/photos`; // ⬅️ Nuevo endpoint de fotos

  constructor(private http: HttpClient) { }

  /**
   * 1. Crea la reseña (comentario y rating).
   * Coincide con el Endpoint 21: POST /api/reviews
   */
  createReview(reviewData: ReviewPayload): Observable<ApiResponse> {
    console.log('📦 Enviando comentario y rating para place_id:', reviewData.place_id);
    return this.http.post<ApiResponse>(this.reviewEndpoint, reviewData);
  }

  /**
   * 2. Sube la foto del lugar.
   * Coincide con el Endpoint 16: POST /api/photos (Multipart Form Data)
   */
  uploadPhoto(photoData: PhotoPayload): Observable<ApiResponse> {
    
    // Necesitamos convertir el Base64 a un objeto File para enviarlo como Form Data
    const formData = new FormData();
    formData.append('place_id', photoData.place_id.toString());
    
    // Asume que la foto es el Base64 sin el prefijo 'data:image/jpeg;base64,'
    // Si la foto incluye el prefijo, debes removerlo antes de enviar
    const imageBase64 = photoData.photo;
    const blob = this.b64toBlob(imageBase64, 'image/jpeg'); 
    
    // 'photo' es el nombre del campo que el backend espera
    formData.append('photo', blob, `photo-${Date.now()}.jpeg`); 

    if (photoData.description) {
        formData.append('description', photoData.description);
    }
    
    console.log('📸 Subiendo foto para place_id:', photoData.place_id);
    
    // HttpClient maneja automáticamente el Content-Type: multipart/form-data
    return this.http.post<ApiResponse>(this.photosEndpoint, formData);
  }

  getReviews(): Observable<ReviewsListResponse> {
    console.log('Fetching all reviews...');
    // Usamos el endpoint sin argumentos para obtener la lista
    return this.http.get<ReviewsListResponse>(this.reviewEndpoint);
  }
  getReviewsByPlaceId(placeId: number): Observable<ReviewsListResponse> {
  console.log(`Fetching and filtering reviews for Place ID: ${placeId}`);
  
  // 1. Llamar al endpoint /api/reviews SIN FILTROS (asumiendo que devuelve todas las reseñas)
  return this.http.get<ReviewsListResponse>(this.reviewEndpoint).pipe(
    map(response => {
      if (response.success && response.data) {
        
        // 2. Filtrar LOCALMENTE las reseñas
        const filteredReviews = response.data.filter(review => review.place_id === placeId);
        
        console.log(`✅ Filtrado local: ${filteredReviews.length} reseñas encontradas para ID ${placeId}.`);
        
        // 3. Devolver la estructura de respuesta con solo las reseñas filtradas
        return {
          success: true,
          data: filteredReviews
        } as ReviewsListResponse;
      }
      return response;
    })
  );
}

  /*getReviewsByPlaceId(placeId: number): Observable<ReviewsListResponse> {
  console.log(`Fetching reviews for Place ID: ${placeId}`);
  const params = { place_id: placeId.toString() }; // ⬅️ Enviamos el ID como query param

  return this.http.get<ReviewsListResponse>(this.reviewEndpoint, { params });
  }*/
  
  /**
   * Helper para convertir Base64 a Blob/File para Form Data
   */
  private b64toBlob(b64Data: string, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}