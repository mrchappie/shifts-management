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
import { firebaseAPIConfig } from 'firebase.config';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      provideFirebaseApp(() => initializeApp(firebaseAPIConfig)),
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore()),
      NgChartsModule,
      MatIconModule,
      MatButtonModule
    ),

    provideAnimations(),
  ],
}).catch((err) => console.error(err));
