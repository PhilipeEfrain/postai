// src/app/core/notification.service.ts
import { Injectable } from '@angular/core';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';


@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    messaging = getMessaging(initializeApp(environment.firebase));

    async requestPermission() {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                const token = await getToken(this.messaging, {
                    vapidKey: environment.firebase.vapidKey,
                });
                console.log('[FCM] Token do dispositivo:', token);
                // TODO: Salvar token no Firestore vinculado ao usuário logado
            } else {
                console.warn('[FCM] Permissão de notificação negada');
            }
        } catch (err) {
            console.error('[FCM] Erro ao solicitar permissão:', err);
        }
    }

    listenMessages() {
        onMessage(this.messaging, (payload) => {
            console.log('[FCM] Mensagem recebida em foreground:', payload);
        });
    }
}
