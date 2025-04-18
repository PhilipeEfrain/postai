import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { Inject } from '@angular/core';
import { Auth } from 'firebase/auth';
import { AUTH_TOKEN, FIRESTORE_TOKEN } from '../../core/firebase.tokens';

@Injectable({
  providedIn: 'root',
})
export class UserConfigService {
  constructor(
    @Inject(FIRESTORE_TOKEN) private firestore: Firestore,
    @Inject(AUTH_TOKEN) private auth: Auth
) {}

 // Função para salvar a configuração do usuário
 async saveUserConfig(config: any) {
    try {
      const userRef = doc(this.firestore, `users/${config.uid}/configs/${config.uid}`);
      await setDoc(userRef, config);
      console.log('Configuração salva!');
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
    }
  }

  // Método para obter a configuração do usuário
  async getUserConfig() {
    const user = this.auth.currentUser;
    if (!user) return null;

    try {
      const userRef = doc(this.firestore, `users/${user.uid}/configs/${user.uid}`);
      const docSnapshot = await getDoc(userRef);
      if (docSnapshot.exists()) {
        return docSnapshot.data();
      } else {
        return null; // Caso não exista a configuração
      }
    } catch (error) {
      console.error('Erro ao obter configuração:', error);
      return null;
    }
  }
}
