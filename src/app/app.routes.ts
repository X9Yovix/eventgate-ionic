import { Routes } from '@angular/router';
import { authGuard } from './guards/auth/auth.guard';
import { notAuthGuard } from './guards/not-auth/not-auth.guard';
import { MainComponent } from './components/main/main.component';

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
    path: 'complete-profile',
    loadComponent: () =>
      import('./pages/complete-profile/complete-profile.page').then(
        (m) => m.CompleteProfilePage
      ),
    canActivate: [authGuard],
  },
  {
    path: '',
    component: MainComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'history',
        loadComponent: () =>
          import('./pages/history/history.page').then((m) => m.HistoryPage),
      },
      {
        path: 'manage-events',
        loadComponent: () =>
          import('./pages/manage-events/manage-events.page').then(
            (m) => m.ManageEventsPage
          ),
      },
      {
        path: 'manage-events/add-event',
        loadComponent: () =>
          import('./pages/manage-events/add-event/add-event.page').then(
            (m) => m.AddEventPage
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings.page').then((m) => m.SettingsPage),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
    ],
  },
];
