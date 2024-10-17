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
import { addIcons } from 'ionicons';
import {
  lockClosedOutline,
  personCircleOutline,
  mailOutline,
  accessibilityOutline,
  peopleOutline,
  personAddOutline,
} from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
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
  ],
})
export class RegisterPage {
  form!: FormGroup;
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastController: ToastController,
    private router: Router
  ) {
    this.setUpForm();
    addIcons({
      lockClosedOutline,
      personCircleOutline,
      mailOutline,
      accessibilityOutline,
      peopleOutline,
      personAddOutline,
    });
  }

  setUpForm() {
    this.form = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
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
      }
    }

    return errorMessages;
  }

  onRegister() {
    if (this.form.valid) {
      this.isLoading = true;
      const data = this.form.value;
      this.authService.register(data).subscribe({
        next: (response) => {
          console.log(response);
          this.isLoading = false;
          this.presentToast(response.message);
          const extras = { queryParams: { email: data.email } };
          this.router.navigate(['/verify-account'], extras);
        },
        error: (error) => {
          this.isLoading = false;
          this.handleErrors(error);
        },
      });
    }
  }
}
