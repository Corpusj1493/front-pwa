// src/app/place-detail/place-detail.page.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule} from '@ionic/angular';
import { PlaceService, PlaceDetail, PlacesListResponse } from '../../services/place.services'; 
import { ReviewService, Review, ReviewPayload, ReviewsListResponse } from '../../services/review';
import { finalize, map, switchMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-place-detail',
  // 🛑 VERIFICA ESTAS DOS LÍNEAS 🛑
  templateUrl: './place-detail.page.html', // ⬅️ DEBE EXISTIR Y ESTAR CORRECTO
  styleUrls: ['./place-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class PlaceDetailPage implements OnInit {
  placeId!: number;
  placeDetail: PlaceDetail | null = null;
  reviews: Review[] = []; // ⬅️ Para almacenar todas las reseñas/votos
  isLoading = false;
  averageRating: number | null = null;
  newComment = '';
  newRating = 5;

  constructor(
    private route: ActivatedRoute,
    private placeService: PlaceService,
    private reviewService: ReviewService // ⬅️ Inyectar ReviewService
  ) {}

  ngOnInit() {
    this.placeId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.placeId) {
      this.loadPlaceDetails();
    }
  }

  loadPlaceDetails() {
    this.isLoading = true;
    
    // Usamos forkJoin para cargar los datos básicos del lugar y sus reseñas en paralelo
    forkJoin({
      // 1. Obtener detalles básicos del lugar (usamos el método que ya filtra el primer elemento)
      place: this.placeService.getPlaceById(this.placeId),
      // 2. Obtener todas las reseñas/votos para este lugar
      reviewsResponse: this.reviewService.getReviewsByPlaceId(this.placeId),
    }).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (results) => {
        if (results.place) {
          this.placeDetail = results.place;
        }
        if (results.reviewsResponse.success && results.reviewsResponse.data) {
          this.reviews = results.reviewsResponse.data;
        }
        this.calculateAverageRating();
      },
      error: (err) => console.error('Error al cargar detalles:', err)
    });
  }
  
  calculateAverageRating() {
    if (this.reviews.length > 0) {
      // Calculamos el promedio usando el campo 'rating' de las reseñas
      const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
      this.averageRating = sum / this.reviews.length;
    } else {
      this.averageRating = null;
    }
  }
  
  // 3. Método para enviar Voto y Comentario
  submitReview() {
      if (!this.placeId || this.newRating < 1 || this.newRating > 5) {
          console.error('ID de lugar o rating inválido.');
          return;
      }
      
      const payload: ReviewPayload = {
          place_id: this.placeId,
          rating: this.newRating,
          comment: this.newComment || null // Enviamos null si el comentario está vacío
      };

      this.reviewService.createReview(payload).subscribe({
          next: () => {
              console.log('Reseña (Voto y Comentario) enviada con éxito.');
              this.newComment = ''; // Limpiar campo
              // Recargar la página para actualizar la lista y el promedio
              this.loadPlaceDetails(); 
          },
          error: (err) => console.error('Error al enviar reseña:', err)
      });
  }
}