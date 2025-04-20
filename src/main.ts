// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AUTH_TOKEN, FIRESTORE_TOKEN } from './app/core/firebase.tokens';

async function main() {
  const firebaseApp: FirebaseApp = initializeApp(environment.firebase);
  const firestore: Firestore = getFirestore(firebaseApp);
  const auth: Auth = getAuth(firebaseApp);

  await setPersistence(auth, browserLocalPersistence)
    .then(() => console.log('Persistência configurada para Local'))
    .catch((error) => console.error('Erro ao configurar persistência:', error));

  bootstrapApplication(AppComponent, {
    providers: [
      provideRouter(routes),
      importProvidersFrom(BrowserAnimationsModule),
      { provide: FIRESTORE_TOKEN, useValue: firestore },
      { provide: AUTH_TOKEN, useValue: auth },
    ]
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Service Worker registrado com sucesso:', registration);
      })
      .catch((error) => {
        console.error('Erro ao registrar Service Worker:', error);
      });
  }
}

main().catch(err => console.error('Erro ao iniciar o app', err));
