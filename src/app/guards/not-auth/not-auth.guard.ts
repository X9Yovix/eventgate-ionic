import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';

export const notAuthGuard: CanActivateFn = async (route, state) => {
  /* const authService = inject(AuthService);
  const router = inject(Router);


  if (!authService.isAuthenticated.value) {
    router.navigateByUrl('/login');
    return false;
  }

  return true; */
  const storageService = inject(StorageService);
  const router = inject(Router);

  await storageService.init();
  const token = await storageService.get('token');

  if (!token) {
    return true;
  }
  router.navigateByUrl('/home');
  return false;
};
