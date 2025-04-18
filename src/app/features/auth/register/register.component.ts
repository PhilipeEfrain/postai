import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { createUserWithEmailAndPassword, Auth } from 'firebase/auth';
import { Inject } from '@angular/core'; // Import necessário para usar @Inject
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { ModalService } from '../../../shared/modal.service';
import { AUTH_TOKEN } from '../../../core/firebase.tokens';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],

})
export class RegisterComponent implements OnInit {
  form!: FormGroup<any>

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    @Inject(AUTH_TOKEN) private auth: Auth,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async register() {
    const { email, password } = this.form.value;

    try {
      // Cria o usuário no Firebase
      await createUserWithEmailAndPassword(this.auth, email, password);
      
      // Exibe o modal de sucesso
      this.modalService.showModal({
        type: 'success',
        title: 'Cadastro realizado!',
        message: 'Usuário cadastrado com sucesso.',
      });
    } catch (error: any) {
      // Exibe o modal de erro
      this.modalService.showModal({
        type: 'error',
        title: 'Erro no cadastro',
        message: error.message || 'Erro ao cadastrar usuário.',
      });
    }
  }
}