import { Component, inject, Inject, OnInit } from '@angular/core';
import {
  FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn
} from '@angular/forms';
import { createUserWithEmailAndPassword, Auth, sendEmailVerification } from 'firebase/auth';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalService } from '../../../shared/modal.service';
import { AUTH_TOKEN } from '../../../core/firebase.tokens';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  isLoading = false;
  showPassword = false;
  private fb = inject(FormBuilder);
  private modalService = inject(ModalService);
  private router = inject(Router);
  private auth = inject<Auth>(AUTH_TOKEN);

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  };

  async register() {
    const { email, password } = this.form.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

      await sendEmailVerification(userCredential.user);

      this.modalService.showModal({
        type: 'success',
        title: 'Verifique seu e-mail',
        message: 'Enviamos um link de verificação para seu e-mail. Verifique antes de prosseguir.',
      });

      this.router.navigate(['/login']);

    } catch (error: any) {
      this.modalService.showModal({
        type: 'error',
        title: 'Erro no cadastro',
        message: error.message || 'Erro ao cadastrar usuário.',
      });
    }
  }


}
