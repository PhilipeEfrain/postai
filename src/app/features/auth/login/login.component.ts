// src/app/features/auth/login/login.component.ts
import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { Auth, onAuthStateChanged } from 'firebase/auth';
import { ModalService } from '../../../shared/modal.service';
import { AuthService } from '../../../core/auth.service';
import { AUTH_TOKEN } from '../../../core/firebase.tokens';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  private router = inject(Router);
  private auth = inject<Auth>(AUTH_TOKEN);
  private modalService = inject(ModalService);
  private authService = inject(AuthService);

  async login() {
    try {
      const credential = await this.authService.login(this.email, this.password);

      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          this.modalService.showModal({
            type: 'success',
            title: 'Login realizado!',
            message: 'Você está agora logado.',
          });
          this.router.navigate(['/home']);
        }
      });
    } catch (error: any) {
      this.modalService.showModal({
        type: 'error',
        title: 'Erro no login',
        message: error.message || 'Falha ao autenticar.',
      });
    }
  }

  register() {
    return this.router.navigate(['/register']);
  }

  async loginWithGoogle() {
    try {
      await this.authService.loginWithGoogle();

      this.modalService.showModal({
        type: 'success',
        title: 'Login com Google',
        message: 'Você está agora logado.',
      });

      this.router.navigate(['/home']);
    } catch (error: any) {
      this.modalService.showModal({
        type: 'error',
        title: 'Erro ao logar com Google',
        message: error.message || 'Algo deu errado.',
      });
    }
  }
  async forgotPassword() {
    if (!this.email) {
      this.modalService.showModal({
        type: 'error',
        title: 'Informe seu e-mail',
        message: 'Digite o e-mail para enviar o link de recuperação.',
      });
      return;
    }

    try {
      await this.authService.sendPasswordResetEmail(this.email);
      this.modalService.showModal({
        type: 'success',
        title: 'E-mail enviado!',
        message: 'Verifique sua caixa de entrada para redefinir a senha.',
      });
    } catch (error: any) {
      this.modalService.showModal({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Não foi possível enviar o e-mail.',
      });
    }
  }

}
