// src/app/core/notification.service.ts
import { inject, Injectable } from '@angular/core';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';
import { ModalService } from '../shared/modal.service';


@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private modalService = inject(ModalService);

    messaging = getMessaging(initializeApp(environment.firebase));

    async requestPermission() {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                const token = await getToken(this.messaging, {
                    vapidKey: environment.firebase.vapidKey,
                });

            } else {
                this.modalService.showModal({
                    title: 'Permissão de Notificação',
                    message: 'Você precisa permitir notificações para receber atualizações.',
                    type: 'error',
                })
            }
        } catch (err) {
            this.modalService.showModal({
                title: 'Erro ao solicitar permissão',
                message: err.message,
                type: 'error',
            });

        }
    }

    listenMessages() {
        onMessage(this.messaging, (payload) => {
            this.modalService.showModal({
                title: payload.notification?.title || 'Nova Notificação',
                message: payload.notification?.body || 'Você tem uma nova notificação.',
                type: 'success',
            });
        });
    }
}
