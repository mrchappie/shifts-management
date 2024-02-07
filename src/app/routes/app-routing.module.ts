import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isLoggedInGuard } from '../utils/guards/isLoggedIn/is-logged-in.guard';
import { isNotLoggedInGuard } from '../utils/guards/isNotLoggedIn/is-not-logged-in.guard';
import { isAdminGuard } from '../utils/guards/isAdmin/is-admin.guard';
import { isEnabledGuard } from '../utils/guards/isEnabled/is-enabled.guard';

const routes: Routes = [
  // landing page
  {
    path: '',
    loadComponent: () =>
      import('../pages/landing-page/landing-page.component').then(
        (comp) => comp.LandingPageComponent
      ),
    canActivate: [isNotLoggedInGuard],
  },

  // login / register routes
  {
    path: 'login',
    loadComponent: () =>
      import('../pages/login/login.component').then(
        (comp) => comp.LoginComponent
      ),
    canActivate: [isNotLoggedInGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('../pages/register/register.component').then(
        (comp) => comp.RegisterComponent
      ),
    canActivate: [isNotLoggedInGuard],
  },

  // user routes

  {
    path: 'home',
    loadComponent: () =>
      import('../pages/homepage/homepage.component').then(
        (comp) => comp.HomepageComponent
      ),
    canActivate: [isLoggedInGuard, isEnabledGuard],
  },
  {
    path: 'my-shifts',
    loadComponent: () =>
      import('../pages/my-shifts/my-shifts.component').then(
        (comp) => comp.MyShiftsComponent
      ),
    canActivate: [isLoggedInGuard, isEnabledGuard],
  },
  {
    path: 'add-shift',
    loadComponent: () =>
      import('../pages/handle-shifts/handle-shifts.component').then(
        (comp) => comp.HandleShiftsComponent
      ),
    canActivate: [isLoggedInGuard, isEnabledGuard],
  },
  {
    path: 'my-shifts/edit-shift',
    loadComponent: () =>
      import('../pages/handle-shifts/handle-shifts.component').then(
        (comp) => comp.HandleShiftsComponent
      ),
    canActivate: [isLoggedInGuard, isEnabledGuard],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('../pages/profile/profile.component').then(
        (comp) => comp.ProfileComponent
      ),
    canActivate: [isLoggedInGuard, isEnabledGuard],
  },

  // admin routes
  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import('../pages/admin/dashboard/dashboard.component').then(
        (comp) => comp.DashboardComponent
      ),
    canActivate: [isLoggedInGuard, isEnabledGuard, isAdminGuard],
  },
  {
    path: 'admin/all-shifts',
    loadComponent: () =>
      import('../pages/admin/all-shifts/all-shifts.component').then(
        (comp) => comp.AllShiftsComponent
      ),
    canActivate: [isLoggedInGuard, isEnabledGuard, isAdminGuard],
  },
  {
    path: 'admin/all-shifts/edit-shift',
    loadComponent: () =>
      import('../pages/handle-shifts/handle-shifts.component').then(
        (comp) => comp.HandleShiftsComponent
      ),
    canActivate: [isLoggedInGuard, isEnabledGuard, isAdminGuard],
  },
  {
    path: 'admin/all-users',
    loadComponent: () =>
      import('../pages/admin/all-users/all-users.component').then(
        (comp) => comp.AllUsersComponent
      ),
    canActivate: [isLoggedInGuard, isEnabledGuard, isAdminGuard],
  },
  {
    path: 'admin/all-users/edit-user',
    loadComponent: () =>
      import('../pages/admin/edit-user/edit-user.component').then(
        (comp) => comp.EditUserComponent
      ),
    canActivate: [isLoggedInGuard, isEnabledGuard, isAdminGuard],
  },
  {
    path: 'admin/all-users/edit-user-shift',
    loadComponent: () =>
      import('../pages/handle-shifts/handle-shifts.component').then(
        (comp) => comp.HandleShiftsComponent
      ),
    canActivate: [isLoggedInGuard, isEnabledGuard, isAdminGuard],
  },
  {
    path: 'admin/settings',
    loadComponent: () =>
      import('../pages/admin/settings/settings.component').then(
        (comp) => comp.SettingsComponent
      ),
    canActivate: [isLoggedInGuard, isEnabledGuard, isAdminGuard],
  },

  // 404 route
  {
    path: '**',
    loadComponent: () =>
      import('../pages/404/404.component').then(
        (comp) => comp.NotFoundComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
