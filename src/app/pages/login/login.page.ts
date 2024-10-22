import { Component } from '@angular/core';
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
  IonItem,
  IonText,
  IonLabel,
  IonButton,
  IonIcon,
  IonInput,
  IonButtons,
  IonBackButton,
  IonProgressBar,
  IonImg,
  IonRow,
  IonGrid,
  IonCol,
  ToastController,
} from '@ionic/angular/standalone';
import {
  personAddOutline,
  accessibilityOutline,
  peopleOutline,
  personCircleOutline,
  mailOutline,
  lockClosedOutline,
  logInOutline,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonCol,
    IonGrid,
    IonRow,
    IonImg,
    IonProgressBar,
    IonBackButton,
    IonButtons,
    IonIcon,
    IonButton,
    IonLabel,
    IonText,
    IonItem,
    IonInput,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
})
export class LoginPage {
  form!: FormGroup;
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) {
    this.setUpForm();
    addIcons({
      personAddOutline,
      accessibilityOutline,
      peopleOutline,
      personCircleOutline,
      mailOutline,
      lockClosedOutline,
      logInOutline,
    });
  }

  setUpForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
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

  onLogin() {
    if (this.form.valid) {
      this.isLoading = true;
      const data = this.form.value;
      this.authService.login(data).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.storageService.set('token', response.token);
          this.storageService.set('user', response.user);
          this.storageService.set('profile', response.profile);
          this.presentToast(response.message);

          if (
            !response.profile.is_profile_complete &&
            !response.profile.skip_is_profile_complete
          ) {
            this.authService.loadToken();
            this.router.navigateByUrl('/complete-profile');
            return;
          }

          this.router.navigateByUrl('/home');
        },
        error: (error) => {
          this.isLoading = false;
          this.handleErrors(error);
        },
      });
    }
  }
}
