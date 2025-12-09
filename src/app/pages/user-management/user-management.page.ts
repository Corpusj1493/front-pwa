// src/app/pages/admin/user-management/user-management.page.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { UserService, User } from '../../services/user';
import { finalize } from 'rxjs/operators';
import { UserFormModalPage } from './user-form-modal/user-form-modal.page';
// Importaremos el componente Modal de Formulario de Usuario aquí (Lo crearemos después)


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.page.html',
  styleUrls: ['./user-management.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class UserManagementPage implements OnInit {
  
  users: User[] = [];
  isLoading = false;

  constructor(
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers() {
    this.isLoading = true;
    const loading = await this.loadingCtrl.create({ message: 'Cargando usuarios...' });
    await loading.present();

    this.userService.getUsers().pipe(
      finalize(() => {
        this.isLoading = false;
        loading.dismiss();
      })
    ).subscribe({
      next: (res) => {
        this.users = res.data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.presentAlert('Error', 'No se pudieron cargar los usuarios.');
        this.users = [];
      }
    });
  }

  async openUserForm(userToEdit?: User) {
    const modal = await this.modalCtrl.create({
      component: UserFormModalPage,
      // Pasamos el usuario a editar (será 'undefined' si estamos creando)
      componentProps: { user: userToEdit } 
    });
    
    await modal.present();

    // Esperar a que el modal se cierre
    const { role } = await modal.onWillDismiss();

    // Si el rol es 'submit', significa que hubo una creación/actualización exitosa
    if (role === 'submit') {
      this.loadUsers(); // Recargar la lista para mostrar el cambio
    }
}

  async deleteUser(user: User) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro de que deseas eliminar al usuario ${user.name} (${user.email})?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Eliminar', 
          cssClass: 'danger',
          handler: async () => {
            const loading = await this.loadingCtrl.create({ message: 'Eliminando...' });
            await loading.present();
            
            this.userService.deleteUser(user.id).pipe(
              finalize(() => loading.dismiss())
            ).subscribe({
              next: (res) => {
                this.presentAlert('Éxito', res.message || 'Usuario eliminado.');
                this.loadUsers(); // Recargar la lista
              },
              error: (err) => {
                const msg = err.error?.message || 'Error al eliminar usuario.';
                this.presentAlert('Error', msg);
                console.error(err);
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }
  
  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }
}