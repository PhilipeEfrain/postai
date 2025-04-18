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

  // Só carrega as ideias depois que o usuário estiver autenticado
  ideas$ = this.authService.getCurrentUser().pipe(
    filter(user => !!user),
    switchMap(() => this.fs.listIdeas())
  );

  newIdea = '';

  // Eventos exibidos no calendário
  events: EventInput[] = [];

  ngOnInit(): void {
    // Popula o calendário assim que o auth e as ideias estiverem disponíveis
    this.authService.getCurrentUser().pipe(
      filter(user => !!user),
      first(),
      switchMap(() => this.fs.listIdeas())
    ).subscribe(ideas => {
      this.events = ideas.map(idea => ({
        title: idea.text,
        date: idea.date.toDate().toISOString().split('T')[0]
      }));
    });
  }

  add() {
    const text = this.newIdea.trim();
    if (!text) return;

    this.fs.addIdea(text)
      .then(() => this.newIdea = '')
      .catch(err => console.error('Erro ao adicionar ideia:', err));
  }

  async logout() {
    await signOut(this.auth);
    alert('Você saiu com sucesso!');
    // redirecione à vontade, ex:
    // this.router.navigate(['/login']);
  }

  // Caso queira reagir a cliques de data no calendário
  onDateClick(dateStr: string) {
    // ex: abrir modal pré-preenchido com a data selecionada
  }
}
