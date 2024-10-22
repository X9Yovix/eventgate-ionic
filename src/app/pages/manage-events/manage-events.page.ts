import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonCol,
  IonRow,
  IonGrid,
  IonRouterOutlet,
  IonFab,
  IonIcon,
  IonFabButton,
} from '@ionic/angular/standalone';
import { RouterLink, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { addCircleOutline, addOutline } from 'ionicons/icons';

@Component({
  selector: 'app-manage-events',
  templateUrl: './manage-events.page.html',
  styleUrls: ['./manage-events.page.scss'],
  standalone: true,
  imports: [
    IonFabButton,
    IonIcon,
    IonFab,
    IonRouterOutlet,
    IonGrid,
    IonRow,
    IonCol,
    IonCardContent,
    IonCardTitle,
    IonCardSubtitle,
    IonCardHeader,
    IonCard,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    RouterLink,
    RouterModule,
  ],
})
export class ManageEventsPage implements OnInit {
  constructor() {
    addIcons({ addOutline, addCircleOutline });
  }

  ngOnInit() {}
}
