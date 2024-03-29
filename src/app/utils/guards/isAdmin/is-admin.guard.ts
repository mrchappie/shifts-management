import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StateService } from '../../services/state/state.service';
import { AuthService } from '../../services/auth/auth.service';

export const isAdminGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const stateService = inject(StateService);

  await authService.getUserState();
  const user = stateService.getState().currentLoggedFireUser;

  if (user?.role === 'admin') {
    stateService.setState({ role: 'admin' });
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
};
