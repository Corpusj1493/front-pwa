// src/app/pages/profile/profile.page.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular'; // ⬅️ Añadiremos LoadingController

@Component({
  selector: 'app-profile', // ⬅️ Selector cambiado a 'app-profile'
  templateUrl: 'profile.page.html', // ⬅️ Apuntamos al nuevo template
  styleUrls: ['profile.page.scss'], // ⬅️ Apuntamos a los nuevos estilos
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class ProfilePage implements OnInit { // ⬅️ Clase renombrada a ProfilePage
  
  userData: any = null; 

  constructor(
    private authService: AuthService, 
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.loadUserData();
  }
  
  loadUserData() {
    this.userData = this.authService.getUserData();
    console.log('Datos de usuario cargados:', this.userData);
  }

  // 🎯 1. Método llamado desde el HTML (Icono en el Header)
  /**
   * Muestra la alerta de confirmación antes de ejecutar el cierre de sesión.
   */
  async logout() {
    const alert = await this.alertController.create({
      header: 'Confirmar Cierre de Sesión',
      message: '¿Estás seguro de que deseas salir de tu cuenta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Cerrar Sesión',
          cssClass: 'danger',
          handler: () => {
            this.executeLogoutAction(); // Llama a la acción real al confirmar
          },
        },
      ],
    });

    await alert.present();
  }

  // 🎯 2. Lógica de Ejecución (Contenido del método executeLogout anterior)
  /**
   * Ejecuta la llamada al servicio de logout, muestra carga y maneja la redirección.
   */
  async executeLogoutAction() {
    const loading = await this.loadingController.create({
      message: 'Cerrando sesión...',
    });
    await loading.present();

    this.authService.logout().subscribe({
      next: () => {
        // La limpieza local del token (localStorage.removeItem) ocurre dentro del .tap del servicio
        console.log('Sesión cerrada en el backend y token eliminado localmente.');
        this.router.navigateByUrl('/login', { replaceUrl: true });
      },
      error: (err) => {
        // Manejo de error: Si falla la API, forzamos la limpieza local y redirigimos
        console.error('Error al contactar el backend. Forzando limpieza local.', err);
        
        // Limpieza forzada de las claves, en caso de que el 'tap' del servicio no se ejecute
        localStorage.removeItem('auth_token'); // Usa la misma clave que en tu AuthService
        localStorage.removeItem('user_data');
        
        this.router.navigateByUrl('/login', { replaceUrl: true });
      },
      complete: () => {
        loading.dismiss(); // Quitar la carga en cualquier caso (éxito o error)
      }
    });
  }

  // 🚪 Cierre de Sesión (Logout)
  /*logout() {
    this.authService.logout().pipe(
      finalize(() => {
        this.router.navigateByUrl('/login', { replaceUrl: true });
      })
    ).subscribe({
      next: () => {
        console.log('Sesión cerrada correctamente en el backend.');
      },
      error: (err) => {
        console.error('Error al cerrar sesión, forzando cierre local.', err);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        this.router.navigateByUrl('/login', { replaceUrl: true });
      }
    });
  }¨*/
}