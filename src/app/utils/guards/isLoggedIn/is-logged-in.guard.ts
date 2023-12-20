import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HandleDBService } from '../../services/handleDB/handle-db.service';

export const isLoggedInGuard: CanActivateFn = async (route, state) => {
  const db = inject(HandleDBService);
  const router = inject(Router);

  const user = await db.getUserState();

  if (user) {
    return true;
  } else {
    router.navigate(['/login']);
    db.clearLocalStorage();
    return false;
  }
};
