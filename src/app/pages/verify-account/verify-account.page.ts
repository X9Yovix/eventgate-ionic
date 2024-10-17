import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonButton,
  IonLabel,
  ToastController,
  IonHeader,
  IonItem,
  IonText,
  IonContent,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonProgressBar,
  IonButtons,
  IonInput,
  IonCol,
  IonGrid,
  IonRow,
  AlertController,
  IonBackButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkboxOutline,
  keypadOutline,
  refreshCircleOutline,
  removeCircleOutline,
} from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.page.html',
  styleUrls: ['./verify-account.page.scss'],
  standalone: true,
  imports: [
    IonBackButton,
    IonRow,
    IonGrid,
    IonCol,
    IonIcon,
    IonHeader,
    IonProgressBar,
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
export class VerifyAccountPage {
  form!: FormGroup;
  isLoading: boolean = false;
  email: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router,
    private toastController: ToastController,
    private route: ActivatedRoute
  ) {
    this.setUpForm();

    addIcons({
      keypadOutline,
      refreshCircleOutline,
      checkboxOutline,
      removeCircleOutline,
    });

    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
    });
  }

  setUpForm() {
    this.form = this.formBuilder.group({
      otp_code: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
    });
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

  onVerify() {
    if (this.form.valid) {
      this.isLoading = true;
      let otpCode = this.form.value.otp_code;

      this.authService.verifyOtp(otpCode, this.email).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log(response);
          this.presentToast(response.message);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading = false;
          this.handleErrors(error);
        },
      });
    } else {
      this.presentToast('Please fill in the OTP.');
    }
  }

  async onCancel() {
    const alert = await this.alertController.create({
      header: 'Cancel Verification',
      message: 'Canceling verification will delete your account.',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: () => {
            this.isLoading = true;
            this.authService.cancelAccountCreation(this.email).subscribe({
              next: (response) => {
                this.presentToast(response.message);
                this.isLoading = false;
                this.router.navigate(['/login'], { replaceUrl: true });
              },
              error: (error) => {
                this.isLoading = false;
                this.handleErrors(error);
              },
            });
          },
        },
      ],
    });
    await alert.present();
  }

  async resendOtpCode() {
    this.isLoading = true;
    this.authService.resendOtp(this.email).subscribe({
      next: (response) => {
        this.presentToast(response.message);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.handleErrors(error);
      },
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
}
