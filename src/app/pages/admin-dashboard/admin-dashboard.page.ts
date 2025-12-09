import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router} from '@angular/router';

import { IonicModule } from '@ionic/angular'; // ⬅️ IMPORTAR IonicModule

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, IonicModule, RouterModule ] // ⬅️ AÑADIR IonicModule
})
export class AdminDashboardPage implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }
  isBaseRoute(): boolean {
      // Verifica si la URL actual termina exactamente en '/tab4'
      return this.router.url.endsWith('/tab4');
  }

}
