import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular'; // Usamos AlertController para mensajes
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class RegisterPage {

  userData = { 
    name: '', 
    last_name: '', 
    email: '', 
    password: '', 
    password_confirmation: '' 
  };
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private alertController: AlertController // Para mostrar alertas de éxito/error
  ) { }

  register() {
    this.isLoading = true;
    this.errorMessage = null;

    // Validación simple en cliente antes de enviar
    if (this.userData.password !== this.userData.password_confirmation) {
        this.errorMessage = 'Las contraseñas no coinciden.';
        this.isLoading = false;
        return;
    }

    this.authService.register(this.userData).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (res) => {
        if (res.success) {
          this.presentSuccessAlert();
          // Redirigir al usuario al área principal después de un registro exitoso (y logueado)
          this.router.navigateByUrl('/tabs/explore', { replaceUrl: true });
        }
      },
      error: (err) => {
        // Manejo de errores de la API (generalmente 422 de Laravel)
        if (err.status === 422 && err.error && err.error.errors) {
          // Si hay errores de validación, los concatenamos
          this.formatValidationErrors(err.error.errors);
        } else {
          this.errorMessage = 'Ocurrió un error inesperado. Inténtalo de nuevo.';
        }
      }
    });
  }
  
  // Función para mostrar un mensaje de éxito con Ionic Alert
  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: '¡Registro Exitoso!',
      message: 'Tu cuenta ha sido creada. ¡Bienvenido!',
      buttons: ['OK']
    });
    await alert.present();
  }

  // Función para formatear errores de Laravel (ej: ['El email ya ha sido tomado'])
  formatValidationErrors(errors: any) {
    let errorMessages: string[] = [];
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        errorMessages = errorMessages.concat(errors[key]);
      }
    }
    this.errorMessage = errorMessages.join(', ');
  }

}