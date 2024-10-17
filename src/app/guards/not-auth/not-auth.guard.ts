import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';

export const notAuthGuard: CanActivateFn = async (route, state) => {
  const storageService = inject(StorageService);
  const router = inject(Router);

  await storageService.init();
  const token = await storageService.get('token');

  if (!token) {
    return true;
  } else {
    router.navigateByUrl('/home');
    return false;
  }
};
