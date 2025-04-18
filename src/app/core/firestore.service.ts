import { Injectable, Inject } from '@angular/core';
import { Firestore, collection, addDoc, query, orderBy, CollectionReference } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { collectionData } from 'rxfire/firestore';
import { Observable } from 'rxjs';
import { AUTH_TOKEN, FIRESTORE_TOKEN } from './firebase.tokens';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(
    @Inject(FIRESTORE_TOKEN) private db: Firestore,
    @Inject(AUTH_TOKEN) private auth: Auth
  ) {}

  addIdea(text: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      return Promise.reject('Usuário não autenticado');
    }

    const ideasRef = collection(this.db, `users/${user.uid}/ideas`);
    return addDoc(ideasRef, {
      text,
      date: new Date(),
    }).then(() => {});
  }

  listIdeas(): Observable<any[]> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const ideasRef = collection(this.db, `users/${user.uid}/ideas`);
    const q = query(ideasRef, orderBy('date', 'desc'));
    return collectionData(q, { idField: 'id' });
  }
}
