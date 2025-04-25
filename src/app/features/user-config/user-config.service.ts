import { inject, Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { Inject } from '@angular/core';
import { Auth } from 'firebase/auth';
import { AUTH_TOKEN, FIRESTORE_TOKEN } from '../../core/firebase.tokens';
import { ModalService } from '../../shared/modal.service';

@Injectable({
  providedIn: 'root',
})
export class UserConfigService {
  private firestore = inject<Firestore>(FIRESTORE_TOKEN);
  private auth = inject<Auth>(AUTH_TOKEN);
  private modalService = inject(ModalService);


  async saveUserConfig(config: any) {
    try {
      const userRef = doc(this.firestore, `users/${config.uid}/configs/${config.uid}`);
      await setDoc(userRef, config);
      console.log('Configuração salva!');
    } catch (error) {
      this.modalService.showModal({
        type: 'error',
        title: 'Erro',
        message: error || 'Erro ao salvar configuração',
      })
    }
  }

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
      this.modalService.showModal({
        type: 'error',
        title: 'Erro',
        message: error || 'Erro ao obter configuração',
      })
      return null;
    }
  }
}
