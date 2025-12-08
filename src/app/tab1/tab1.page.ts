import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { PlaceService } from '../services/place.services';
import { ReviewService, Review } from '../services/review'; // ⬅️ Importar servicio e interfaces
import { finalize, mergeMap, map } from 'rxjs/operators';
import { forkJoin, of, Observable } from 'rxjs'; // Necesitamos forkJoin, of, Observable

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class Tab1Page implements OnInit {

  reviews: Review[] = [];
  isLoadingReviews: boolean = false;
  errorMessage: string | null = null;

  // Inyectamos el ReviewService
  constructor(private reviewService: ReviewService, private placeService: PlaceService, private router: Router) {}

  ngOnInit() {
    // Cuando la página se inicializa, cargamos las reseñas
    this.loadReviews();
  }
  
  // Esto es útil si quieres que se recarguen las reseñas al volver a la pestaña
  ionViewWillEnter() {
    this.loadReviews();
  }
  goToDetails(placeId: number) {
    if (placeId) {
      // 🎯 FORZAMOS LA NAVEGACIÓN A LA RUTA ANIDADA COMPLETA
      this.router.navigate(['/tabs', 'place-detail', placeId]);
      console.log('Navegando a:', `/tabs/place-detail/${placeId}`);
    } else {
      console.error('No se pudo navegar, placeId es inválido.');
    }
  }

  loadReviews() {
    this.isLoadingReviews = true;
    this.errorMessage = null;

    this.reviewService.getReviews().pipe(
            // 1. Obtener la lista de reseñas
            map(response => response.data || []),
            // 2. Para cada reseña, obtener los detalles del lugar
            mergeMap(reviews => {
                if (reviews.length === 0) {
                    return of([]); // Retorna un array vacío si no hay reseñas
                }

                // Creamos un array de Observables para cargar los detalles del lugar para cada reseña
                const placeDetailObservables = reviews.map(review => {
                    // Si la reseña ya tiene el nombre del lugar, no hacemos la llamada
                    if (review.place?.name) {
                        return of(review);
                    }
                    
                    // 🎯 Llamamos al nuevo método para obtener el lugar por ID
                    return this.placeService.getPlaceById(review.place_id).pipe(
                        map(placeData => {
                            console.log(`Reseña ID: ${review.id} -> Buscando Place ID: ${review.place_id}`);

                            if (placeData) {
                                console.log(`Encontrado Place Name: ${placeData.name} para Reseña ID: ${review.id}`);
                                // ⬅️ Adjuntar los datos del lugar a la reseña
                                review.place = {
                                    id: placeData.id,
                                    name: placeData.name,
                                    address: placeData.address,
                                    lat: placeData.lat,
                                    lng: placeData.lng,
                                };
                                // Si la API no te devuelve el array de fotos, también puedes intentar cargar la primera
                                // review.photos = placeData.photos || null; 
                            }else {
                              console.log(`NO se encontró el lugar para Reseña ID: ${review.id}`);
                            }
                            return review;
                        })
                    );
                });
                
                // Espera a que todas las llamadas de detalles del lugar terminen
                return forkJoin(placeDetailObservables);
            }),
            finalize(() => this.isLoadingReviews = false)
        ).subscribe({
            next: (reviewsWithPlace) => {
                this.reviews = reviewsWithPlace;
                console.log('Reviews loaded with Place details:', this.reviews);
            },
            error: (err) => {
                console.error('API Error:', err);
                this.errorMessage = 'Error al cargar las reseñas o los detalles del lugar.';
            }
        });
    
  }
}