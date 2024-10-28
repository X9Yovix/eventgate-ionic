import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonIcon,
  IonProgressBar,
  IonLabel,
  IonItem,
  IonText,
  IonButton,
  IonInput,
  IonDatetime,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardSubtitle,
  IonList,
  IonChip,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  locationOutline,
  timeOutline,
  addCircleOutline,
  closeCircle,
  todayOutline,
  closeCircleOutline,
  informationCircleOutline,
  locateOutline,
  imagesOutline,
  pricetagsOutline,
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { EventService } from 'src/app/services/event/event.service';
import { Geolocation } from '@capacitor/geolocation';
import * as L from 'leaflet';
import { tagLengthValidator } from 'src/app/services/utils/tag_length_validator';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.page.html',
  styleUrls: ['./add-event.page.scss'],
  standalone: true,
  imports: [
    IonChip,
    IonList,
    IonCardSubtitle,
    IonCardHeader,
    IonCardTitle,
    IonCard,
    IonCol,
    IonRow,
    IonGrid,
    IonDatetime,
    IonInput,
    IonButton,
    IonText,
    IonItem,
    IonLabel,
    IonProgressBar,
    IonIcon,
    IonButtons,
    IonBackButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AddEventPage implements OnInit {
  form!: FormGroup;
  isLoading: boolean = false;
  map: L.Map | undefined;
  marker: L.Marker | undefined;
  markerIcon: L.Icon | undefined;
  images: File[] = [];
  imagePreviews: string[] = [];

  filteredTags: string[] = [];
  allTags: string[] = [];

  @ViewChild('fileUploadInput') fileUploadInput!: ElementRef<HTMLInputElement>;

  constructor(
    private formBuilder: FormBuilder,
    private eventService: EventService,
    private toastController: ToastController,
    private router: Router,
    private authService: AuthService
  ) {
    this.setUpForm();
    addIcons({
      closeCircleOutline,
      informationCircleOutline,
      locationOutline,
      locateOutline,
      todayOutline,
      timeOutline,
      pricetagsOutline,
      addCircleOutline,
      closeCircle,
      imagesOutline,
      calendarOutline,
    });
  }

  ngOnInit() {
    this.authService.isTokenLoaded.subscribe((isLoaded: boolean) => {
      if (isLoaded) {
        this.getAllTags();
      }
    });
  }

  getAllTags() {
    this.isLoading = true;
    this.eventService.getAllTags().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.allTags = response.tags;
      },
      error: (error) => {
        this.isLoading = false;
        this.handleErrors(error);
      },
    });
  }

  setUpForm() {
    this.form = this.formBuilder.group({
      event_name: ['', Validators.required],
      location: [{ value: '', disabled: true }, Validators.required],
      day: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      tag: [''],
      selected_tags: [null, tagLengthValidator()],
    });
  }

  isDayEnaled(dateString: string) {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today ? false : true;
  }

  // --------------------------------------
  // handle map
  ionViewDidEnter() {
    this.initMap();
  }

  ionViewDidLeave() {
    this.map?.remove();
  }

  initMap() {
    this.map = L.map('map').setView([36.77, 10.19], 5);

    L.tileLayer(
      'https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}',
      {
        minZoom: 0,
        maxZoom: 20,
        ext: 'jpg',
      } as L.TileLayerOptions
    ).addTo(this.map);

    this.map.on('click', (event: L.LeafletMouseEvent) => {
      this.getLocation(event.latlng);
    });

    this.markerIcon = L.icon({
      iconUrl: 'assets/map/marker-icon.png',
      shadowUrl: 'assets/map/marker-shadow.png',
      iconSize: [25, 41],
      shadowSize: [41, 41],
      iconAnchor: [12, 41],
      shadowAnchor: [13, 41],
      popupAnchor: [1, -34],
    });
  }

  async getCurrentLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = coordinates.coords;
      this.form.patchValue({
        location: `${latitude}, ${longitude}`,
      });
      this.presentToast('Current location selected');
      this.setMapLocation(latitude, longitude);
    } catch (error) {
      this.presentToast('Error getting location');
    }
  }

  setMapLocation(lat: number, lng: number): void {
    const latLng = new L.LatLng(lat, lng);
    this.map?.setView(latLng, 19);
    if (this.marker) {
      this.marker.remove();
    }

    if (this.map) {
      this.marker = L.marker(latLng, { icon: this.markerIcon }).addTo(this.map);
    }

    this.form.get('location')?.enable();
    this.form.patchValue({
      location: `${latLng.lat}, ${latLng.lng}`,
    });
    console.log('value location;', this.form.value.location);
    this.form.get('location')?.disable();
  }

  getLocation(latlng: L.LatLng) {
    console.log('selected location:', latlng);
    this.setMapLocation(latlng.lat, latlng.lng);
  }
  // --------------------------------------

  // --------------------------------------
  // handle imgs
  onImageSelected(event: any) {
    const files: FileList = event.target.files;
    const fileArray = Array.from(files);
    this.images.push(...fileArray);

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  getImagePreview(index: number): string {
    return this.imagePreviews[index];
  }
  // --------------------------------------

  // --------------------------------------
  // handle tags
  onTagInputChange(value: string) {
    if (value.trim() === '') {
      this.filteredTags = [];
    } else {
      this.filteredTags = this.allTags.filter((tag) =>
        tag.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  selectTag(tag: string) {
    const currentTags = this.form.get('selected_tags')?.value || [];
    if (!currentTags.includes(tag)) {
      currentTags.push(tag);
      this.form.get('selected_tags')?.setValue(currentTags);
      this.form.patchValue({ tag: '' });
    }
    this.filteredTags = [];
  }

  addTag() {
    const tagInputValue = this.form.get('tag')?.value;
    if (tagInputValue) {
      const currentTags = this.form.get('selected_tags')?.value || [];
      if (!currentTags.includes(tagInputValue)) {
        currentTags.push(tagInputValue);
        this.form.get('selected_tags')?.setValue(currentTags);
        this.form.patchValue({ tag: '' });
      }
    }
    this.filteredTags = [];
  }

  removeTag(tag: string) {
    const currentTags = this.form.get('selected_tags')?.value || [];
    const updatedTags = currentTags.filter((t: string) => t !== tag);
    this.form.get('selected_tags')?.setValue(updatedTags);
  }
  // --------------------------------------

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
    });
    await toast.present();
  }

  clearData() {
    this.form.reset({
      event_name: '',
      location: '',
      day: '',
      start_time: '',
      end_time: '',
      tags: '',
    });

    if (this.fileUploadInput) {
      this.fileUploadInput.nativeElement.value = '';
    }
    this.images = [];

    if (this.marker) {
      this.marker.remove();
      this.map?.setView([36.77, 10.19], 5);
    }
  }

  handleErrors(error: any) {
    if (typeof error === 'object') {
      const errors = this.extractErrorMessages(error);
      errors.forEach((err) => {
        this.presentToast(err);
      });
    } else {
      this.presentToast('An unknown error occurred');
    }
  }

  extractErrorMessages(errorObj: any): string[] {
    let errorMessages: string[] = [];
    for (let key in errorObj) {
      if (Array.isArray(errorObj[key])) {
        errorMessages = errorMessages.concat(errorObj[key]);
      } else if (typeof errorObj[key] === 'object') {
        errorMessages = errorMessages.concat(
          this.extractErrorMessages(errorObj[key])
        );
      }
    }
    return errorMessages;
  }

  async onAddEvent() {
    if (this.form.valid) {
      this.isLoading = true;
      const data = new FormData();

      const day = this.form.value.day.split('T')[0];
      const startTime = this.form.value.start_time.split('T')[1];
      const endTime = this.form.value.end_time.split('T')[1];

      data.append('event_name', this.form.value.event_name);
      this.form.get('location')?.enable();
      data.append('location', this.form.value.location);
      this.form.get('location')?.disable();
      data.append('day', day);
      data.append('start_time', startTime);
      data.append('end_time', endTime);

      this.form.value.selected_tags.forEach((tag: string) => {
        data.append('tags', tag);
      });

      this.images.forEach((image) => {
        data.append('images', image);
      });

      this.eventService.addEvent(data).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.presentToast(response.message);
          //this.clearData();
          this.router.navigate(['/manage-events']);
        },
        error: (error) => {
          this.isLoading = false;
          this.handleErrors(error);
        },
      });
    }
  }
}
