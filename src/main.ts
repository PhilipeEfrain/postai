// Angular Core & Bootstrap
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Firebase Core
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getMessaging } from 'firebase/messaging';

// App Modules
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environments/env-config';
import { FIRESTORE_TOKEN, AUTH_TOKEN } from './app/core/firebase.tokens';

async function main() {
  // 🔥 Inicializa o Firebase App
  const firebaseApp: FirebaseApp = initializeApp(environment.firebase);

  // 📦 Serviços Firebase
  const firestore: Firestore = getFirestore(firebaseApp);
  const auth: Auth = getAuth(firebaseApp);
  const messaging = getMessaging(firebaseApp); // Pode ser usado em serviço depois

  // 💾 Configura persistência de autenticação
  await setPersistence(auth, browserLocalPersistence)
    .then(() => console.log('✅ Persistência local configurada com sucesso'))
    .catch((error) => console.error('❌ Erro ao configurar persistência:', error));

  // 🚀 Inicializa o app Angular
  await bootstrapApplication(AppComponent, {
    providers: [
      provideRouter(routes),
      importProvidersFrom(BrowserAnimationsModule),
      { provide: FIRESTORE_TOKEN, useValue: firestore },
      { provide: AUTH_TOKEN, useValue: auth },
    ],
  });

  // 🔔 Registra o Service Worker para notificações push
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

main().catch((err) => console.error('❌ Erro ao iniciar o app:', err));
