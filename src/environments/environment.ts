// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import { credentials } from '../../credentials';

export const environment = {
    production: false,
    firebase: {
        apiKey: credentials.apiKey,
        authDomain: credentials.authDomain,
        projectId: credentials.projectId,
        storageBucket: credentials.storageBucket,
        databaseURL: credentials.databaseURL,
        messagingSenderId: credentials.messagingSenderId,
        appId: credentials.appId,
        measurementId: credentials.measurementId,
    }
};

// // Initialize Firebase
// export const app = initializeApp(environment);
// export const analytics = getAnalytics(app);
