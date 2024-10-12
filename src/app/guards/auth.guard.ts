import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from '../services/storage/storage.service';
import { lastValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  const storageService = inject(StorageService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = await storageService.get('token');
  console.log(token);

  if (!token) {
    router.navigateByUrl('/login');
    console.log('no token found');
    return false;
  }

  try {
    const isValid = await lastValueFrom(authService.verifyToken(token.access));

    console.log(isValid);

    if (isValid) {
      return true;
    } else {
      router.navigateByUrl('/login');
      return false;
    }
  } catch (error) {
    router.navigateByUrl('/login');
    return false;
  }
};
