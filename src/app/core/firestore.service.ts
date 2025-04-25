import { Injectable, Inject, inject } from '@angular/core';
import { Firestore, collection, addDoc, query, orderBy, CollectionReference, deleteDoc, doc } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { collectionData } from 'rxfire/firestore';
import { Observable } from 'rxjs';
import { AUTH_TOKEN, FIRESTORE_TOKEN } from './firebase.tokens';
import { ModalService } from '../shared/modal.service';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private auth = inject<Auth>(AUTH_TOKEN);
  private db = inject<Firestore>(AUTH_TOKEN);
  private modalService = inject<ModalService>(ModalService);

  addClient(text: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      this.modalService.showModal({
        type: 'error',
        title: 'Erro',
        message: 'Usuário não autenticado',
      })
    }

    const clientRef = collection(this.db, `users/${user.uid}/client`);
    return addDoc(clientRef, {
      text,
      date: new Date(),
    }).then(() => { });
  }

  listClients(): Observable<any[]> {
    const user = this.auth.currentUser;
    if (!user) {
      this.modalService.showModal({
        type: 'error',
        title: 'Erro',
        message: 'Usuário não autenticado',
      })
    }

    const clientRef = collection(this.db, `users/${user.uid}/client`);
    const q = query(clientRef, orderBy('date', 'desc'));
    return collectionData(q, { idField: 'id' });
  }

  deleteClient(clientId: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      this.modalService.showModal({
        type: 'error',
        title: 'Erro',
        message: 'Usuário não autenticado',
      })
    }

    const docRef = doc(this.db, `users/${user.uid}/client/${clientId}`);
    return deleteDoc(docRef);
  }
}
