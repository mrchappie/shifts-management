import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { HomepageComponent } from '../pages/homepage/homepage.component';
import { LoginComponent } from '../pages/login/login.component';
import { RegisterComponent } from '../pages/register/register.component';
import { MyShiftsComponent } from '../pages/my-shifts/my-shifts.component';
import { HandleShiftsComponent } from '../pages/handle-shifts/handle-shifts.component';
import { ProfileComponent } from '../pages/profile/profile.component';
import { AllShiftsComponent } from '../pages/admin/all-shifts/all-shifts.component';
import { AllUsersComponent } from '../pages/admin/all-workers/all-users.component';
import { NotFoundComponent } from '../pages/404/404.component';
import { isLoggedInGuard } from '../utils/guards/isLoggedIn/is-logged-in.guard';
import { isNotLoggedInGuard } from '../utils/guards/isNotLoggedIn/is-not-logged-in.guard';
import { DashboardComponent } from '../pages/admin/dashboard/dashboard.component';
import { isAdminGuard } from '../utils/guards/isAdmin/is-admin.guard';
import { SettingsComponent } from '../pages/admin/settings/settings.component';
import { EditUserComponent } from '../pages/admin/edit-user/edit-user.component';

const routes: Routes = [
  // main routes
  {
    path: '',
    // component: HomepageComponent,
    loadComponent: () =>
      import('../pages/homepage/homepage.component').then(
        (comp) => comp.HomepageComponent
      ),
    canActivate: [isLoggedInGuard],
  },

  // // login / register routes
  // {
  //   path: 'login',
  //   component: LoginComponent,
  //   canActivate: [isNotLoggedInGuard],
  // },
  // {
  //   path: 'register',
  //   component: RegisterComponent,
  //   canActivate: [isNotLoggedInGuard],
  // },

  // // user routes
  // {
  //   path: 'my-shifts',
  //   component: MyShiftsComponent,
  //   canActivate: [isLoggedInGuard],
  // },
  // {
  //   path: 'add-shift',
  //   component: HandleShiftsComponent,
  //   canActivate: [isLoggedInGuard],
  // },
  // {
  //   path: 'my-shifts/edit-shift/:shiftID',
  //   component: HandleShiftsComponent,
  //   canActivate: [isLoggedInGuard],
  // },
  // {
  //   path: 'profile',
  //   component: ProfileComponent,
  //   canActivate: [isLoggedInGuard],
  // },

  // // admin routes
  // {
  //   path: 'admin/dashboard',
  //   component: DashboardComponent,
  //   canActivate: [isLoggedInGuard, isAdminGuard],
  // },
  // {
  //   path: 'admin/all-shifts',
  //   component: AllShiftsComponent,
  //   canActivate: [isLoggedInGuard, isAdminGuard],
  // },
  // {
  //   path: 'admin/all-shifts/edit-shift/:shiftID',
  //   component: HandleShiftsComponent,
  //   canActivate: [isLoggedInGuard, isAdminGuard],
  // },
  // {
  //   path: 'admin/all-users',
  //   component: AllUsersComponent,
  //   canActivate: [isLoggedInGuard, isAdminGuard],
  // },
  // {
  //   path: 'admin/all-users/edit-user/:userID',
  //   component: EditUserComponent,
  //   canActivate: [isLoggedInGuard, isAdminGuard],
  // },
  // {
  //   path: 'admin/all-users/edit-user/:userID/edit-shift/:shiftID',
  //   component: HandleShiftsComponent,
  //   canActivate: [isLoggedInGuard, isAdminGuard],
  // },
  // {
  //   path: 'admin/settings',
  //   component: SettingsComponent,
  //   canActivate: [isLoggedInGuard, isAdminGuard],
  // },

  // // 404 route
  // { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
