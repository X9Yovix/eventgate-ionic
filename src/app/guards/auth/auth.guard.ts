import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { StorageService } from 'src/app/services/storage/storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { lastValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  const storageService = inject(StorageService);
  const authService = inject(AuthService);
  const router = inject(Router);

  await storageService.init();

  const token = await storageService.get('token');
  console.log(token);

  if (!token) {
    router.navigateByUrl('/login');
    return false;
  }

  try {
    const isValid = await lastValueFrom(authService.verifyToken(token.access));
    console.log(isValid);
    if (isValid) {
      return true;
    }
  } catch (error) {
    console.log('token verification failed');
    console.log(error);
    if ((error as any).code === 'token_not_valid') {
      const res = await lastValueFrom(
        await authService.refreshToken(token.refresh)
      );
      const updatedToken = { ...token, access: res.access };
      await storageService.set('token', updatedToken);
      console.log('token refreshed');
      return true;
    }

    await storageService.remove('user');
    await storageService.remove('token');
    router.navigateByUrl('/login');
    return false;
  }
  return false;
};
