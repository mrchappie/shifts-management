import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddUserComponent } from './pages/admin/add-user/add-user.component';
import { AllUsersComponent } from './pages/admin/all-workers/all-users.component';
import { AllShiftsComponent } from './pages/admin/all-shifts/all-shifts.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { HandleShiftsComponent } from './pages/handle-shifts/handle-shifts.component';
import { MyShiftsComponent } from './pages/my-shifts/my-shifts.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { NotFoundComponent } from './pages/404/404.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ButtonComponent } from './components/button/button.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { HeaderComponent } from './components/header/header.component';
import { CustomFilterPipe } from './utils/pipes/customFilter/customFilter.pipe';
import { CustomSorterPipe } from './utils/pipes/customSorter/customSorter.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { ShiftCardComponent } from './components/shift-card/shift-card.component';
import { UserCardComponent } from './pages/admin/all-workers/user-card/user-card.component';
import { SearchComponent } from './components/search/search.component';
import { SettingsComponent } from './pages/admin/settings/settings.component';
import { EditUserComponent } from './pages/admin/edit-user/edit-user.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AddWorkplaceComponent } from './components/add-workplace/add-workplace.component';

import { ToastService, AngularToastifyModule } from 'angular-toastify';
import { NgChartsModule } from 'ng2-charts';
import { ChartComponent } from './components/chart/chart.component';
import { CountCardComponent } from './components/count-card/count-card.component';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { ChangeCredentialsComponent } from './components/change-credentials/change-credentials.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NotFoundComponent,
    HomepageComponent,
    MyShiftsComponent,
    HandleShiftsComponent,
    ProfileComponent,
    AllShiftsComponent,
    AllUsersComponent,
    AddUserComponent,
    NavbarComponent,
    FooterComponent,
    ButtonComponent,
    HeaderComponent,
    CustomFilterPipe,
    CustomSorterPipe,
    DashboardComponent,
    ShiftCardComponent,
    UserCardComponent,
    SearchComponent,
    SettingsComponent,
    EditUserComponent,
    UserProfileComponent,
    AddWorkplaceComponent,
    ChartComponent,
    CountCardComponent,
    ConfirmationModalComponent,
    ChangeCredentialsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'learn-ang-3a987',
        appId: '1:192008310003:web:dfc33509f0f2bb7083fb86',
        storageBucket: 'learn-ang-3a987.appspot.com',
        apiKey: 'AIzaSyAyon2mKLKrbnOnI9EpoDh4JVIWi2VxWZw',
        authDomain: 'learn-ang-3a987.firebaseapp.com',
        messagingSenderId: '192008310003',
        measurementId: 'G-HPDFTGCPZG',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    BrowserAnimationsModule,
    AngularToastifyModule,
    NgChartsModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [ToastService],
  bootstrap: [AppComponent],
})
export class AppModule {}
