import { Injectable, inject } from "@angular/core";
import { Firestore, collection, Timestamp, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { scheduleInCalendarPost } from "../../../interface/user-config.model";
import { AUTH_TOKEN, FIREBASE_FIRESTORE } from "../../../core/firebase.tokens";


@Injectable({
  providedIn: 'root',
})
export class CalendarPostService {
  private firestore = inject(FIREBASE_FIRESTORE);
  private auth = inject(AUTH_TOKEN);

  private async getUserUid(): Promise<string> {
    const user = this.auth.currentUser;
    console.log('[DEBUG] Usuário atual:', user); // <--- Adicione isso
    if (!user) throw new Error('Usuário não autenticado');
    return user.uid;
  }

  async addPost(post: Omit<scheduleInCalendarPost, 'createdAt' | 'updatedAt'>): Promise<void> {
    const uid = await this.getUserUid();
    const ref = collection(this.firestore, `users/${uid}/posts`);
    const now = Timestamp.now();
    await addDoc(ref, {
      ...post,
      clientId: post.clientId,
      createdAt: now,
      updatedAt: now,
    });
  }

  async getAllPosts(): Promise<(scheduleInCalendarPost & { id: string })[]> {
    const uid = await this.getUserUid();
    const ref = collection(this.firestore, `users/${uid}/posts`);
    const snapshot = await getDocs(ref);
    return snapshot.docs.map((doc) => ({
      ...(doc.data() as scheduleInCalendarPost),
      id: doc.id,
    }));
  }

  async updatePost(postId: string, changes: Partial<scheduleInCalendarPost>): Promise<void> {
    const uid = await this.getUserUid();
    const ref = doc(this.firestore, `users/${uid}/posts/${postId}`);

    // Certifique-se de que as propriedades que você está passando sejam válidas
    const validChanges = {
      ...changes,
      updatedAt: Timestamp.now()
    };

    try {
      await updateDoc(ref, validChanges);
    } catch (error) {
      console.error('[ERRO] Falha ao atualizar post:', error);
      throw error;
    }
  }

  async deletePost(postId: string): Promise<void> {
    const uid = await this.getUserUid();
    const ref = doc(this.firestore, `users/${uid}/posts/${postId}`);
    await deleteDoc(ref);
  }

  async getPostById(id: string): Promise<scheduleInCalendarPost & { id: string }> {
    const uid = await this.getUserUid();  // Obtém o UID do usuário autenticado
    const docRef = doc(this.firestore, `users/${uid}/posts`, id);  // Corrige a referência para a subcoleção do usuário
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id } as scheduleInCalendarPost & { id: string };
    } else {
      throw new Error('Post não encontrado');
    }
  }



}
