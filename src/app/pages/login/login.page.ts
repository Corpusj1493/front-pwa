import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService, LoginPayload } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';
import { NgxCaptchaModule, ReCaptcha2Component } from 'ngx-captcha';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  // Importaciones Standalone
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, NgxCaptchaModule] 
})
export class LoginPage  {
  
  // 🎯 1. Referencia a la casilla de reCAPTCHA
  @ViewChild('captchaRef') captchaRef!: ReCaptcha2Component; 
  
  // 🎯 2. Variables de reCAPTCHA
  siteKey: string = environment.recaptchaSiteKey; // ⬅️ REEMPLAZA CON TU CLAVE REAL
  recaptchaToken: string | null = null;
  credentials = { email: '', password: '', recaptchaToken: '' };
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService, 
    private router: Router
  ) { }

  /*ngOnInit() {
    // Si el usuario ya está autenticado, redirigir a la página principal
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
    }
  }*/
  ionViewWillEnter() {
    const token = localStorage.getItem('auth_token');

    if (token) {
      this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
    }
  }
  // 🎯 MÉTODO FALTANTE: Manejador de éxito de reCAPTCHA
  handleRecaptchaSuccess(token: string) {
      console.log('token recibido.....', token)
      this.recaptchaToken = token;
      this.credentials.recaptchaToken = token;
      console.log('✅ reCAPTCHA resuelto.');
  }
  handleRecaptchaError() {
      this.recaptchaToken = null;
      this.credentials.recaptchaToken = '';
      console.error('❌ Error en reCAPTCHA. Intente de nuevo.');
      this.errorMessage = 'Hubo un problema con la verificación de seguridad.'; 
  }

  login() {
    // 🎯 5. Validar que el token de reCAPTCHA exista
    if (!this.recaptchaToken) {
        this.errorMessage = 'Por favor, completa la verificación reCAPTCHA.';
        return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.authService.login(this.credentials).pipe(
      finalize(() => {
        this.isLoading = false;
        this.resetRecaptcha();
      })
    ).subscribe({
      next: (res) => {
        if (res.success) {
         
          console.log('✅ LOGIN EXITOSO. Intentando redireccionar a /tab1');
          // Navegar a la página principal de la app (ej: /tabs/explore)
         setTimeout(() => {
            this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
          }, 100);
        }
      },
      error: (err) => {
        // Manejo de errores de la API (401 Unauthorized o 422 Validation Failed)
        if (err.status === 401) {
          this.errorMessage = 'Credenciales inválidas. Verifica tu correo y contraseña.';
        } else if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Ocurrió un error en el servidor. Inténtalo de nuevo.';
        }
        this.resetRecaptcha();
      }
    });
    
  }
  resetRecaptcha() {
      // Usar la referencia al componente para llamar al método reset()
      if (this.captchaRef) { 
          this.recaptchaToken = null;
          this.credentials.recaptchaToken = '';
          console.log('🔄 reCAPTCHA reseteado. Requiere nueva interacción.');
      }
  }

}