// src\app\core\auth.service.ts
import { Injectable, inject } from "@angular/core";
import { Auth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Firestore, doc, setDoc, getDoc } from "firebase/firestore";
import { Observable } from "rxjs";
import { UserConfig } from "../interface/user-config.model";
import { AUTH_TOKEN, FIRESTORE_TOKEN } from "./firebase.tokens";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firestore = inject(FIRESTORE_TOKEN);
  private auth = inject(AUTH_TOKEN);

  getCurrentUser() {
    return new Observable<any>((observer) => {
      onAuthStateChanged(this.auth, (user) => {
        observer.next(user);
      });
    });
  }

  login(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  async saveUserConfig(config: UserConfig): Promise<void> {
    const docRef = doc(this.firestore, `users/${config.uid}`);
    await setDoc(docRef, config);
  }

  async getUserConfig(uid: string): Promise<UserConfig | null> {
    const docRef = doc(this.firestore, `users/${uid}`);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? (snapshot.data() as UserConfig) : null;
  }
}
