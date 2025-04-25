import { InjectionToken } from '@angular/core';
import { Auth, getAuth } from 'firebase/auth';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';
import { Firestore, getFirestore } from 'firebase/firestore';

// Inicializando o Firebase
const firebaseApp = initializeApp(environment.firebase);

// Criando um token de injeção para o Auth
export const FIREBASE_AUTH = new InjectionToken<Auth>('firebase-auth', {
  providedIn: 'root',
  factory: () => getAuth(firebaseApp),
});

export const FIRESTORE_TOKEN = new InjectionToken<Firestore>('firebase-firestore', {
  providedIn: 'root',
  factory: () => getFirestore(firebaseApp), // Corrigido para inicializar o Firestore
});

export const AUTH_TOKEN = new InjectionToken<Auth>('firebase-auth', {
  providedIn: 'root',
  factory: () => getAuth(firebaseApp),
});

export const FIREBASE_APP = new InjectionToken<FirebaseApp>('FirebaseApp', {
  providedIn: 'root',
  factory: () => firebaseApp,
});