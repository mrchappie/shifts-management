import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HandleDBService } from '../../services/handleDB/handle-db.service';
import { StateService } from '../../services/state/state.service';

export const isAdminGuard: CanActivateFn = async (route, state) => {
  const db = inject(HandleDBService);
  const router = inject(Router);
  const stateService = inject(StateService);

  await db.getUserState();
  const user = stateService.getState().currentLoggedFireUser;

  if (user?.adminPanel.isAdmin) {
    stateService.setState({ isAdmin: true });
    return true;
  } else {
    router.navigate(['']);
    return false;
  }
};
