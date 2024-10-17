import { Routes } from '@angular/router';
import { authGuard } from './guards/auth/auth.guard';
import { notAuthGuard } from './guards/not-auth/not-auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
  {
    path: 'landing',
    loadComponent: () =>
      import('./pages/landing/landing.page').then((m) => m.LandingPage),
    canActivate: [notAuthGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then((m) => m.RegisterPage),
    canActivate: [notAuthGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
    canActivate: [notAuthGuard],
  },
  {
    path: 'verify-account',
    loadComponent: () =>
      import('./pages/verify-account/verify-account.page').then(
        (m) => m.VerifyAccountPage
      ),
    canActivate: [notAuthGuard],
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
    canActivate: [authGuard],
  },
];
