// src/app/pages/admin/user-management/user-form-modal/user-form-modal.page.ts

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  ModalController, LoadingController, AlertController, 
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, 
  IonIcon, IonContent, IonList, IonListHeader, IonLabel, 
  IonItem, IonInput, IonSpinner // <-- Añadimos todos los componentes usados
} from '@ionic/angular/standalone'; // <-- Usamos /standalone
import { UserService, User, UserCreatePayload, UserUpdatePayload } from '../../../services/user';
import { finalize, Observable } from 'rxjs';


@Component({
  selector: 'app-user-form-modal',
  templateUrl: './user-form-modal.page.html',
  styleUrls: ['./user-form-modal.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, // 🎯 CLAVE: Importaciones individuales para Standalone
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, 
    IonIcon, IonContent, IonList, IonListHeader, IonLabel, 
    IonItem, IonInput, IonSpinner // Añadir todos aquí
  ]
})
export class UserFormModalPage implements OnInit {
  
  // Input para recibir el usuario a editar (opcional)
  @Input() user?: User; 

  // Modelos del formulario
  isEditMode: boolean = false;
  name: string = '';
  last_name: string = '';
  email: string = '';
  password = '';
  password_confirmation = '';
  
  isSubmitting = false;

  constructor(
    private modalCtrl: ModalController,
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.isEditMode = !!this.user;
    
    if (this.isEditMode && this.user) {
      this.name = this.user.name;
      this.last_name = this.user.last_name;
      this.email = this.user.email;
      // Nota: Nunca precargamos la contraseña.
    }
  }
  
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async saveUser() {
    if (this.isSubmitting) return;

    // Validación básica de contraseñas
    if (this.password !== this.password_confirmation) {
        await this.presentAlert('Error', 'Las contraseñas no coinciden.');
        return;
    }
    
    this.isSubmitting = true;
    const loading = await this.loadingCtrl.create({ message: 'Guardando usuario...' });
    await loading.present();

    let apiCall: Observable<any>;
    
    // 🎯 Lógica para Editar (PUT/PATCH)
    if (this.isEditMode && this.user) {
      const payload: UserUpdatePayload = {
        name: this.name,
        last_name: this.last_name,
        email: this.email,
      };
      // Solo añadir contraseña si se proporcionan
      if (this.password) {
        payload.password = this.password;
        // El backend debe manejar la validación de la confirmación
      }
      apiCall = this.userService.updateUser(this.user.id, payload);
      
    // 🎯 Lógica para Crear (POST)
    } else {
      // Validaciones para el modo Crear (los campos de contraseña son requeridos)
      if (!this.password || !this.password_confirmation) {
          await loading.dismiss();
          await this.presentAlert('Error', 'La contraseña y su confirmación son requeridas para crear un nuevo usuario.');
          this.isSubmitting = false;
          return;
      }
      
      const payload: UserCreatePayload = {
        name: this.name,
        last_name: this.last_name,
        email: this.email,
        password: this.password,
        // Asumiendo que el backend del endpoint 6 no requiere 'password_confirmation' 
        // pero lo validamos en el frontend de todas formas.
      };
      apiCall = this.userService.createUser(payload);
    }
    
    // 3. Suscribirse a la llamada API
    apiCall.pipe(finalize(() => {
        loading.dismiss();
        this.isSubmitting = false;
    })).subscribe({
      next: (res) => {
        this.presentAlert('Éxito', res.message || 'Usuario guardado correctamente.');
        // Cerrar el modal y enviar 'submit'
        this.modalCtrl.dismiss(true, 'submit');
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Error al guardar. Verifique los datos.';
        this.presentAlert('Error', errorMessage);
        console.error(err);
      }
    });
  }
  
  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}