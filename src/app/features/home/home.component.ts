// src/app/features/home/home.component.ts
import { Component, OnInit, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../core/firestore.service';
import { AuthService } from '../../core/auth.service';
import { Auth, signOut } from 'firebase/auth';
import { AUTH_TOKEN } from '../../core/firebase.tokens';
import { EventInput } from '@fullcalendar/core';
import { filter, switchMap, first } from 'rxjs/operators';
import { UserConfigComponent } from '../user-config/user-config.component';
import { CalendarPageComponent } from './calendar/calendar-page.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, UserConfigComponent, CalendarPageComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private fs = inject(FirestoreService);
  private authService = inject(AuthService);
  private auth = inject<Auth>(AUTH_TOKEN);

  clients$ = this.authService.getCurrentUser().pipe(
    filter(user => !!user),
    switchMap(() => this.fs.listClients())
  );

  newClient = '';

  events: EventInput[] = [];

  ngOnInit(): void {
    this.authService.getCurrentUser().pipe(
      filter(user => !!user),
      first(),
      switchMap(() => this.fs.listClients())
    ).subscribe(clients => {
      this.events = clients.map(client => ({
        title: client.text,
        date: client.date.toDate().toISOString().split('T')[0]
      }));
    });
  }

  add() {
    const text = this.newClient.trim();
    if (!text) return;

    this.fs.addClient(text)
      .then(() => this.newClient = '')
      .catch(err => console.error('Erro ao adicionar ideia:', err));
  }

  async logout() {
    await signOut(this.auth);
    alert('Você saiu com sucesso!');
  }


  onDateClick(dateStr: string) {
    // ex: abrir modal pré-preenchido com a data selecionada
  }
}
