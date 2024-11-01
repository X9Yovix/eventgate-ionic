import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonFooter,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { addIcons } from 'ionicons';
import {
  logOutOutline,
  notificationsOutline,
  personCircleOutline,
  informationCircleOutline,
} from 'ionicons/icons';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    IonFooter,
    IonCol,
    IonRow,
    IonGrid,
    IonButton,
    IonIcon,
    IonLabel,
    IonItem,
    IonList,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class SettingsPage {
  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService
  ) {
    addIcons({
      personCircleOutline,
      notificationsOutline,
      informationCircleOutline,
      logOutOutline,
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.storageService.clear();
        this.router.navigateByUrl('/login');
      },
      error: (error) => {
        console.error('error logging out', error);
      },
    });
  }
}
