import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { AuthService } from '../../services/auth/auth.service';

export const isLoggedInGuard: CanActivateFn = async (route, state) => {
  const firestore = inject(FirestoreService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = await authService.getUserState();

  if (user) {
    return true;
  } else {
    router.navigate(['']);
    firestore.clearLocalStorage();
    return false;
  }
};
