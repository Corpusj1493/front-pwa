// src/app/services/media.service.ts
import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Geolocation, Position } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor() { }

  /**
   * 📸 Abre la cámara para tomar una foto o seleccionar una de la galería.
   * Retorna el objeto Photo de Capacitor.
   */
  async takePhoto(): Promise<Photo> {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false, 
      resultType: CameraResultType.Uri, // Retorna un URI para mostrar la imagen y luego convertir a Base64
      source: CameraSource.Prompt, // Pregunta si usar cámara o galería (ideal para UI/UX)
      saveToGallery: false
    });

    return photo;
  }

  /**
   * 📍 Obtiene la posición actual del usuario.
   * Retorna el objeto Position de Capacitor.
   */
  async getCurrentPosition(): Promise<Position> {
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true, // Mayor precisión
      timeout: 10000, // Tiempo máximo de espera (10 segundos)
    });
    
    return position;
  }

}