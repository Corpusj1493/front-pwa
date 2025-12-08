import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { GeolocationPosition } from '@capacitor/geolocation';

// ⬅️ Importaciones de Servicios y Operadores
import { MediaService } from '../../services/media.services'; // Asumo que cambiaste a .service
import { ReviewService } from '../../services/review'; // Archivo actualizado
import { PlaceService } from '../../services/place.services'; // ¡NUEVO SERVICIO!
import { finalize, switchMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs'; 

@Component({
  selector: 'app-create-review',
  templateUrl: './create-review.page.html',
  styleUrls: ['./create-review.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CreateReviewPage implements OnInit {

  // ⚠️ Modelo de datos ajustado para la API (Lugar + Reseña)
  reviewData = {
    // Campos del LUGAR (Endpoint 11: /api/places)
    name: '', // Usaremos el 'title' del formulario para el nombre del lugar
    address: '',
    category: 'General', 
    
    // Campos de RESEÑA (Endpoint 21: /api/reviews)
    comment: '', // El cuerpo del comentario (antes 'description')
    rating: 3, 
    
    // Datos de FOTO y GEOLOCALIZACIÓN
    latitude: null as number | null,
    longitude: null as number | null,
    photo_base64: '' as string | null, // Base64 sin el prefijo 'data:image/jpeg;base64,'
  };

  photoPath: string | null = null;
  isLoading: boolean = false;
  isLocating: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private mediaService: MediaService,
    private reviewService: ReviewService, 
    private placeService: PlaceService, // ⬅️ Inyectado
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.getCurrentLocation(); // Intentar obtener la ubicación al iniciar
  }

// --- GESTIÓN DE CÁMARA Y UBICACIÓN ---
  
  /**
   * Helper para convertir el URI de Capacitor a Base64, 
   * y eliminar el prefijo 'data:image/...'.
   */
  private async readAsBase64(photo: Photo): Promise<string> {
    // Asumimos que photo.webPath no es nulo aquí, si se llega a esta función
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        // Quitamos el prefijo (ej: 'data:image/jpeg;base64,') antes de resolver
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.readAsDataURL(blob);
    });
  }
  
  // 📸 Llama al plugin de la cámara
  async takePhoto() {
    try {
      this.errorMessage = null;
      const photo: Photo = await this.mediaService.takePhoto();
      
      this.photoPath = photo.webPath || null;
      
      const base64String = await this.readAsBase64(photo);
      this.reviewData.photo_base64 = base64String;

    } catch (e) {
      console.error('Error al tomar foto:', e);
      this.errorMessage = 'No se pudo acceder a la cámara o galería.';
    }
  }

  // 📍 Llama al plugin de geolocalización
  async getCurrentLocation() {
    this.isLocating = true;
    this.errorMessage = null;
    try {
      const position: GeolocationPosition = await this.mediaService.getCurrentPosition();
      this.reviewData.latitude = position.coords.latitude;
      this.reviewData.longitude = position.coords.longitude;
      this.presentToast('Ubicación capturada con éxito.', 'success');
    } catch (e) {
      console.error('Error al obtener ubicación:', e);
      this.errorMessage = 'No se pudo obtener la ubicación. Verifica los permisos de GPS.';
    } finally {
      this.isLocating = false;
    }
  }

// --- LÓGICA DE ENVÍO DE DATOS (FLUJO DE 3 PASOS) ---
  
  isFormValid(): boolean {
    // Validamos campos requeridos: Nombre, Comentario, Rating y Ubicación.
    return !!this.reviewData.name && 
           !!this.reviewData.comment && 
           this.reviewData.rating > 0 &&
           this.reviewData.latitude !== null && 
           this.reviewData.longitude !== null;
  }

  /**
   * 💾 Implementa el flujo de trabajo de 3 pasos: 
  * 1. Crear Lugar, 
  * 2. (Paralelo) Subir Foto & Crear Reseña.
  */
  submitReview() {
    if (!this.isFormValid()) {
      this.presentToast('Por favor, completa los campos requeridos (Nombre, Comentario, Rating y Ubicación).', 'danger');
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = null;

    // 1. Preparamos el payload de CREACIÓN DE LUGAR
    const placePayload = {
      name: this.reviewData.name,
      description: this.reviewData.comment, 
      address: this.reviewData.address || null,
      lat: this.reviewData.latitude!,
      lng: this.reviewData.longitude!,
      category: this.reviewData.category || null
    };

    // 2. Llama a la API para crear el lugar
    this.placeService.createPlace(placePayload).pipe(
      // Encadenamos la subida de foto y reseña usando el place_id devuelto
      switchMap(placeRes => {
        if (!placeRes.success || !placeRes.data?.id) {
          // Si falla la creación del lugar, lanzamos un error que será capturado abajo
          throw new Error(placeRes.message || 'Fallo al crear el lugar.');
        }
        const placeId = placeRes.data.id;
        
        // Preparamos la creación de la reseña
        const reviewCreation$ = this.reviewService.createReview({
          place_id: placeId,
          rating: this.reviewData.rating,
          comment: this.reviewData.comment
        });

        if (this.reviewData.photo_base64) {
          // Si hay foto, preparamos la subida
          const photoUpload$ = this.reviewService.uploadPhoto({
            place_id: placeId,
            photo: this.reviewData.photo_base64,
            description: this.reviewData.comment 
          });
          
          // 3. Ejecutamos ambas en paralelo
          return forkJoin({ photo: photoUpload$, review: reviewCreation$ });
        } else {
          // Si no hay foto, solo creamos la reseña
          return reviewCreation$;
        }
      }),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (res) => {
         console.log('Transacción completada con éxito:', res);
         this.presentSuccessAlert();
         this.resetForm();
         this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
      },
      error: (err) => {
         console.error('Error durante la transacción:', err);
         // Intentamos mostrar un mensaje de error útil del servidor
         const msg = err.error?.message || (err.message.includes('Http failure') ? 'Error de conexión' : 'Error desconocido');
         this.errorMessage = msg;
         this.presentToast(`Fallo al guardar: ${msg}`, 'danger');
      }
    });
  }

// --- UTILIDADES ---
  
  resetForm() {
    this.reviewData = {
        name: '', address: '', category: 'General', 
        comment: '', rating: 3, 
        latitude: null, longitude: null, photo_base64: null,
    };
    this.photoPath = null;
  }

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: '¡Lugar y Reseña Creados!',
      message: 'El lugar fue registrado y tu reseña fue enviada con éxito.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    toast.present();
  }
}