importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyAnrzN8tANHQLkP81en-SN-P2LeFwhbFnk",
    authDomain: "linkhub-eff86.firebaseapp.com",
    projectId: "linkhub-eff86",
    storageBucket: "linkhub-eff86.firebasestorage.app",
    messagingSenderId: "930936841932",
    appId: "1:930936841932:web:9adb9dabfbe29848d2c469",
    measurementId: "G-1MJ2C877K2",
    vapidKey: "BCWutv3PpT5AMbTxpna9UuXh7l4bh5cjkMEqcX55OCss1j_et4Qn4Y-ICE_ZNJDitJpF4AlhPlDXN3JcvSdpmjw"
}
);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Mensagem recebida em background:', payload);
    const { title, body } = payload.notification;
    self.registration.showNotification(title, {
        body,
        icon: '/assets/icons/icon-72x72.png',
    });
});
