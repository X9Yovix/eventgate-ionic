import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonFooter,
  IonIcon,
  IonToolbar,
  IonButtons,
  IonButton,
  IonText,
  IonContent,
  IonCol,
  IonGrid,
  IonRow,
  IonCardHeader,
  IonCardContent,
  IonCard,
  IonCardTitle,
  IonicSlides,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonCardTitle,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonRow,
    IonGrid,
    IonCol,
    IonContent,
    IonText,
    IonButton,
    IonButtons,
    IonToolbar,
    IonIcon,
    IonFooter,
    CommonModule,
    RouterLink,
  ],
})
export class LandingPage implements OnInit {
  displayedPictures = [
    {
      image: 'assets/landing/backgrounds/1.jpg',
      title: 'Welcome to Event Gate',
      body: 'Your gateway to amazing events. Discover and join events to create unforgettable memories.',
    },
    {
      image: 'assets/landing/backgrounds/2.jpg',
      title: 'Discover Events',
      body: 'Explore events near you and join them to have a great time with friends and family.',
    },
    {
      image: 'assets/landing/backgrounds/4.jpg',
      title: 'Create Events',
      body: 'Host your own events and invite others to join the fun and make lasting memories together.',
    },
  ];

  swiperModules = [IonicSlides];

  constructor() {}

  ngOnInit() {}
}
