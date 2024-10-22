import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonLabel,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonThumbnail,
  IonTextarea,
  IonIcon,
  IonGrid,
  IonCol,
  IonRow,
} from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  callOutline,
  fingerPrintOutline,
  calendarOutline,
  informationCircleOutline,
  checkmarkCircleOutline,
  cloudOfflineOutline,
} from 'ionicons/icons';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.page.html',
  styleUrls: ['./complete-profile.page.scss'],
  standalone: true,
  imports: [
    IonRow,
    IonCol,
    IonGrid,
    IonIcon,
    IonTextarea,
    IonThumbnail,
    IonSelectOption,
    IonSelect,
    IonInput,
    IonItem,
    IonLabel,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class CompleteProfilePage {
  form!: FormGroup;
  isLoading: boolean = false;
  imgSelected: string | ArrayBuffer | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService
  ) {
    this.setUpForm();
    addIcons({
      calendarOutline,
      fingerPrintOutline,
      callOutline,
      informationCircleOutline,
      checkmarkCircleOutline,
      cloudOfflineOutline,
    });
  }

  setUpForm() {
    this.form = this.formBuilder.group({
      profile_picture: [null],
      birth_date: [''],
      gender: [''],
      phone_number: [''],
      bio: [''],
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
    });

    await toast.present();
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
      } else {
        errorMessages.push(errorObj[key]);
      }
    }

    return errorMessages;
  }

  atLeastOneElementValidator() {
    return Object.values(this.form.controls).some((control) => control.value);
  }

  async onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.form.patchValue({ profile_picture: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.imgSelected = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onCompleteProfile() {
    this.isLoading = true;
    const formData = new FormData();
    const formValue = this.form.value;

    for (const [key, value] of Object.entries(formValue)) {
      if (value) {
        formData.append(key, value instanceof Blob ? value : value.toString());
      }
    }
    /* for (const [key, value] of (formData as any).entries()) {
      console.log(`${key}: ${value}`);
    } */

    this.authService.completeProfile(formData).subscribe({
      next: (response) => {
        console.log(response);
        this.isLoading = false;
        this.presentToast(response.message);
        this.storageService.set('profile', response.profile);
        this.router.navigateByUrl('/home');
      },
      error: (error) => {
        this.isLoading = false;
        this.handleErrors(error);
      },
    });
  }

  onSkip() {
    console.log('here');
    this.isLoading = true;
    this.authService.skipCompleteProfile().subscribe({
      next: (response) => {
        console.log(response);
        this.isLoading = false;
        this.presentToast(response.message);
        this.router.navigateByUrl('/home');
      },
      error: (error) => {
        this.isLoading = false;
        this.handleErrors(error);
      },
    });
  }
}
