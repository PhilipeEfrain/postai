// src/app/features/home/home.component.ts
import { Component, OnInit, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarPageComponent } from './calendar/calendar-page.component';
import { SettingsSidebarComponent } from './settings-sidebar/settings-sidebar.component';
import { Observable, of } from 'rxjs';
import { ListClientsInterface } from '../../interface/user-config.model';
import { MockPostsComponent } from '../mock-posts/mock-posts.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarPageComponent, SettingsSidebarComponent, MockPostsComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public clients$: Observable<ListClientsInterface[]>;

  handleClients(clientList: ListClientsInterface[]): void {
    this.clients$ = of(clientList);
  }
}

