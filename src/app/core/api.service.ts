// src/app/core/api.service.ts
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from 'firebase/auth';
import { firstValueFrom } from 'rxjs';
import { FIREBASE_AUTH } from './firebase.tokens';  // Importando o token FIREBASE_AUTH

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:4200/api'; // URL fake, usada para Network

  constructor(
    private http: HttpClient,
    @Inject(FIREBASE_AUTH) private auth: Auth // Corrigido para usar o token FIREBASE_AUTH
  ) { }

  async addClient(text: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');

    await firstValueFrom(this.http.post(`${this.baseUrl}/client`, {
      uid: user.uid,
      text,
    }));
  }

  listClients(uid: string) {
    return this.http.get(`${this.baseUrl}/client?uid=${uid}`);
  }
}
