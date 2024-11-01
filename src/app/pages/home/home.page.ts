import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonIcon,
  IonCardContent,
  IonChip,
  IonLabel,
  IonButton,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonTitle,
  IonToolbar,
  IonProgressBar,
  InfiniteScrollCustomEvent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, timeOutline, eyeOutline } from 'ionicons/icons';
import { EventService } from 'src/app/services/event/event.service';
import { environment } from 'src/environments/environment';
import { register } from 'swiper/element/bundle';
import { ShortTimePipe } from 'src/app/pipes/short-time.pipe';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription, take } from 'rxjs';

register();

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonProgressBar,
    IonToolbar,
    IonTitle,
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonButton,
    IonLabel,
    IonChip,
    IonCardContent,
    IonIcon,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonList,
    IonItem,
    IonHeader,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ShortTimePipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage implements OnInit, OnDestroy {
  isLoading: boolean = false;
  events: any[] = [];
  page: number = 1;
  page_size: number = 5;
  total_pages: number = 0;
  tokenLoadedSubscription: Subscription | undefined;

  @ViewChild(IonInfiniteScroll) infiniteScroll?: IonInfiniteScroll;

  constructor(
    private eventService: EventService,
    private authService: AuthService
  ) {
    addIcons({ calendarOutline, timeOutline, eyeOutline });
  }

  ngOnInit() {
    /* this.fetchEvents(); */
  }

  ngOnDestroy() {
    if (this.tokenLoadedSubscription) {
      this.tokenLoadedSubscription.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.tokenLoadedSubscription = this.authService.isTokenLoaded.subscribe(
      (loaded) => {
        if (loaded) {
          this.fetchEvents();
        }
      }
    );
  }

  fetchEvents() {
    this.isLoading = true;
    this.eventService.getRecentEvents(this.page, this.page_size).subscribe({
      next: (response) => {
        console.log(response);
        this.events = [...this.events, ...response.events];
        this.total_pages = response.total_pages;
        this.isLoading = false;
        if (this.infiniteScroll) {
          this.infiniteScroll.disabled = this.page >= this.total_pages;
          console.log(this.infiniteScroll.disabled);
        }
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      },
    });
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.page++;
    this.fetchEvents();
    /* if (this.page < this.total_pages) {
      this.page++;
      this.fetchEvents();
    } else {
      if (this.infiniteScroll) {
        this.infiniteScroll.disabled = true;
      }
    }
    setTimeout(() => {
      event.target.complete();
    }, 500); */
  }

  getFullImageUrl(imagePath: string) {
    return environment.eventgateUri + imagePath;
  }

  viewEvent(event: any) {
    console.log('view event:', event);
  }
}
