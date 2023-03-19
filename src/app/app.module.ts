import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {provideAuth, getAuth} from '@angular/fire/auth';
import {provideFunctions, getFunctions, connectFunctionsEmulator} from '@angular/fire/functions';

import { provideFirestore,getFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { AuthService } from './services/auth.service';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { connectAuthEmulator } from 'firebase/auth';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularFireAuthModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatSnackBarModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => {
      const Firestore = getFirestore()

      if (!environment.production) {
        // connectFirestoreEmulator(Firestore, 'localhost', 8080)
      }

      return Firestore
    }),    
    provideStorage(() => getStorage()),
    provideAuth(() => {
      const auth = getAuth();

      if (!environment.production) {
        // connectAuthEmulator(auth, 'http://localhost:9099')
      }

      return auth
    }),
    provideFunctions(() => {
      const Functions = getFunctions();
      Functions.region = 'europe-west1';

      if (!environment.production) {
        // connectFunctionsEmulator(Functions, 'localhost', 5001)
      }

      return Functions
    }),
  ],
  
  providers: [AuthService],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AppModule { }
