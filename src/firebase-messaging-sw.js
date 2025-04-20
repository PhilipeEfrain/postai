importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');
import { credentials } from './credentials.js';

firebase.initializeApp({
    apiKey: credentials.apiKey,
    authDomain: credentials.authDomain,
    projectId: credentials.projectId,
    storageBucket: credentials.credentials,
    messagingSenderId: credentials.messagingSenderId,
    appId: credentials.appId,
    measurementId: credentials.measurementId
}
);

const messaging = firebase.messaging();

