// feedback-modal.component.ts
import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { collection, addDoc, getFirestore, serverTimestamp } from 'firebase/firestore';
import { ModalService } from '../modal.service';
import { FIREBASE_AUTH } from '../../core/firebase.tokens';
import { Auth, getAuth } from 'firebase/auth';

@Component({
  selector: 'app-feedback-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback-modal.component.html',
  styleUrls: ['./feedback-modal.component.scss'],
})
export class FeedbackModalComponent {
  constructor(private modalService: ModalService, @Inject(FIREBASE_AUTH) private auth: Auth,) { }

  name = '';
  title = '';
  message = '';
  showModal = false;

  db = getFirestore();

  open() {
    this.showModal = true;
  }

  close() {
    this.showModal = false;
    this.name = '';
    this.title = '';
    this.message = '';
  }

  async sendFeedback() {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) throw new Error('Usuário não autenticado');

      await addDoc(collection(this.db, 'feedback'), {
        name: this.name,
        title: this.title,
        message: this.message,
        userId: user.uid, // <-- isso é obrigatório para a regra funcionar
        createdAt: new Date(),
      });

      this.modalService.showModal({
        type: 'success',
        title: 'Feedback enviado!',
        message: 'Obrigado pelo seu feedback.',
      });

      this.close();
    } catch (err) {
      this.modalService.showModal({
        type: 'error',
        title: 'Erro ao enviar feedback',
        message: 'Houve um erro ao enviar seu feedback. Tente novamente mais tarde.',
      });
      console.error('Erro ao enviar feedback:', err);
    }
  }

}
