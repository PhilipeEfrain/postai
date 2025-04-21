import { Component, inject, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Auth } from 'firebase/auth';
import { UserConfigService } from './user-config.service'; // Certifique-se de importar o serviço correto
import { CommonModule } from '@angular/common';
import { AUTH_TOKEN } from '../../core/firebase.tokens';

@Component({
  selector: 'app-user-config',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-config.component.html',
})
export class UserConfigComponent {

  private fb = inject(FormBuilder);
  private userConfigService = inject(UserConfigService);

  constructor(@Inject(AUTH_TOKEN) private auth: Auth) { }

  form: FormGroup = this.fb.group({
    businessName: [''],
    businessCategory: [''],
    instagram: [false],
    facebook: [false],
    whatsapp: [false],
  });

  ngOnInit() {
    this.loadUserConfig();
  }

  async loadUserConfig() {
    const config = await this.userConfigService.getUserConfig();
    if (config) {
      this.form.patchValue({
        businessName: config['businessName'],
        businessCategory: config['businessCategory'],
        instagram: config['channels'].instagram,
        facebook: config['channels'].facebook,
        whatsapp: config['channels'].whatsapp,
      });
    }
  }


  async onSubmit() {
    const user = this.auth.currentUser;
    if (!user) return;

    // Preparar os dados para salvar
    const config = {
      uid: user.uid,
      businessName: this.form.value.businessName,
      businessCategory: this.form.value.businessCategory,
      channels: {
        instagram: this.form.value.instagram,
        facebook: this.form.value.facebook,
        whatsapp: this.form.value.whatsapp,
      },
    };

    // Chamar o serviço para salvar os dados no Firestore
    console.log('Salvando configuração:', config);
    await this.userConfigService.saveUserConfig(config);
  }


}
