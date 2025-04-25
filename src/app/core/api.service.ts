// src/app/core/api.service.ts
import { Injectable, Inject, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from 'firebase/auth';
import { firstValueFrom } from 'rxjs';
import { AUTH_TOKEN, FIREBASE_AUTH } from './firebase.tokens';
import { ModalService } from '../shared/modal.service';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:4200/api';
  private auth = inject<Auth>(AUTH_TOKEN)
  private http = inject(HttpClient);
  private modalService = inject(ModalService);

  async addClient(text: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      this.modalService.showModal({
        type: 'error',
        title: 'Erro',
        message: 'Usuário não autenticado',
      })
    };

    await firstValueFrom(this.http.post(`${this.baseUrl}/client`, {
      uid: user.uid,
      text,
    }));
  }

  listClients(uid: string) {
    return this.http.get(`${this.baseUrl}/client?uid=${uid}`);
  }
}
