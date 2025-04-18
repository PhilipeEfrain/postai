// src/app/features/auth/login/login.component.ts
import { Component, Inject } from '@angular/core';
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

  constructor(
    private router: Router,
    @Inject(AUTH_TOKEN) private auth: Auth,
    private modalService: ModalService,
    private authService: AuthService
  ) { }

  async login() {
    try {
      // 1) Faça o login e receba a credencial
      const credential = await this.authService.login(this.email, this.password);
  
      // 2) Aguarde o Firebase Auth confirmar o usuário
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          // 3) Agora sim, modal + navegação
          this.modalService.showModal({
            type: 'success',
            title: 'Login realizado!',
            message: 'Você está agora logado.',
          });
          this.router.navigate(['/home']);
        }
      });
    } catch (error: any) {
      console.error('Erro ao fazer login', error);
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
}
