import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StateService } from '../../services/state/state.service';
import { AuthService } from '../../services/authService/auth.service';

export const isAdminGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const stateService = inject(StateService);

  await authService.getUserState();
  const user = stateService.getState().currentLoggedFireUser;

  if (user?.adminPanel.isAdmin) {
    stateService.setState({ isAdmin: true });
    return true;
  } else {
    router.navigate(['']);
    return false;
  }
};
