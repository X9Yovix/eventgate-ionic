import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  IonIcon,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  homeOutline,
  timerOutline,
  addCircleOutline,
  settings,
} from 'ionicons/icons';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  imports: [IonLabel, IonTabs, IonTabButton, IonIcon, IonTabBar, CommonModule],
  standalone: true,
})
export class MainComponent implements OnInit {
  constructor() {
    addIcons({ homeOutline, timerOutline, addCircleOutline, settings });
  }

  ngOnInit() {}
}
