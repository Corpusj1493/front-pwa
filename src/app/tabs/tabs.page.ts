import { Component, EnvironmentInjector, inject, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, personOutline, locationOutline, hammer } from 'ionicons/icons';

import { CommonModule } from '@angular/common'; // ⬅️ 1. Importar CommonModule
// Importa íconos adicionales necesarios, incluyamos settings o hammer para el admin

import { AuthService } from '../services/auth.service'; // ⬅️ 1. Importar AuthService

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, CommonModule, ],
  //schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);
  // ⬅️ 2. Inyectar AuthService y hacerlo público
  public authService = inject(AuthService);

  constructor() {
    addIcons({ homeOutline, personOutline, locationOutline, hammer });
  }
}
