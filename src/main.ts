import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgChartsModule } from 'ng2-charts';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app/routes/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { ToastService, AngularToastifyModule } from 'angular-toastify';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
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
      AngularToastifyModule,
      NgChartsModule,
      MatIconModule,
      MatButtonModule
    ),
    ToastService,
    provideAnimations(),
  ],
}).catch((err) => console.error(err));
