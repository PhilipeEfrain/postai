// src/app/core/firebase.tokens.ts
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
export const FIRESTORE_TOKEN = new InjectionToken<Firestore>('FIRESTORE');
export const AUTH_TOKEN = new InjectionToken<Auth>('AUTH');


export const FIREBASE_APP = new InjectionToken<FirebaseApp>('FirebaseApp', {
  providedIn: 'root',
  factory: () => initializeApp(environment.firebase),
});

export const FIREBASE_FIRESTORE = new InjectionToken('FirebaseFirestore', {
  providedIn: 'root',
  factory: () => getFirestore(initializeApp(environment.firebase)),
});