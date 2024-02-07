import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { StateService } from '../../services/state/state.service';

export const isEnabledGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const stateService = inject(StateService);

  await authService.getUserState();
  const user = stateService.getState().currentLoggedFireUser;

  if (user?.role != 'disabled') {
    stateService.setState({ role: user?.role });
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
};
