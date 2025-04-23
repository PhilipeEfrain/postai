import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Output,
  ViewChild,
  AfterViewInit,
  OnInit
} from '@angular/core';
import { Auth, signOut } from 'firebase/auth';
import { AUTH_TOKEN } from '../../../core/firebase.tokens';
import { AuthService } from '../../../core/auth.service';
import { filter, first, switchMap } from 'rxjs/operators';
import { FirestoreService } from '../../../core/firestore.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../../shared/modal.service';

@Component({
  selector: 'app-settings-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-sidebar.component.html',
  styleUrl: './settings-sidebar.component.scss'
})
export class SettingsSidebarComponent implements OnInit, AfterViewInit {
  @ViewChild('offcanvasRef') offcanvasRef!: ElementRef;
  @Output() clients = new EventEmitter<any[]>();

  private auth = inject<Auth>(AUTH_TOKEN);
  private authService = inject(AuthService);
  private modalService = inject(ModalService);
  private fs = inject(FirestoreService);
  private offcanvasInstance: any;

  newClient = '';
  clientsList: any[] = [];

  ngOnInit(): void {
    this.loadClients();
  }

  ngAfterViewInit() {
    this.offcanvasInstance = new (window as any).bootstrap.Offcanvas(this.offcanvasRef.nativeElement);
  }

  open() {
    this.offcanvasInstance.show();
  }

  close() {
    this.offcanvasInstance.hide();
  }

  async logout() {
    await signOut(this.auth);
    this.modalService.showModal({
      type: 'success',
      title: 'Logout realizado!',
      message: 'Você foi desconectado com sucesso.',
    });
  }

  loadClients() {
    this.authService.getCurrentUser().pipe(
      filter(user => !!user),
      first(),
      switchMap(() => this.fs.listClients())
    ).subscribe(clients => {
      this.clientsList = clients;
      this.clients.emit(clients);
    });
  }

  add() {
    const text = this.newClient.trim();
    if (!text) return;

    this.fs.addClient(text)
      .then(() => {
        this.newClient = '';
        this.loadClients();
      })
      .catch(err => this.modalService.showModal({
        type: 'error',
        title: 'Erro',
        message: err || 'Erro ao adicionar cliente',
      })
      );
  }

  deleteClient(clientId: string) {
    if (!clientId) return;

    const confirmar = confirm('Tem certeza que deseja deletar este cliente?');
    if (!confirmar) return;

    this.fs.deleteClient(clientId)
      .then(() => {
        this.clientsList = this.clientsList.filter(c => c.id !== clientId);
      })
      .catch(err => this.modalService.showModal({
        type: 'error',
        title: 'Erro',
        message: err || 'Erro ao deletar cliente',
      })
      );
  }

  changePassword() {
    this.modalService.showModal({
      type: 'success',
      title: 'Redefinir senha',
      message: 'Enviamos um link para seu e-mail para redefinir a senha.',
    });

    const user = this.auth.currentUser;
    if (user?.email) {
      this.authService.sendPasswordResetEmail(user.email);
    }
  }

}
