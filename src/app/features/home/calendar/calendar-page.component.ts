import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CreatePostModalComponent } from "./components/calendar-modal/create-post-modal.component";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { ListClientsInterface, sheduleInCalendarPost } from "../../../interface/user-config.model";
import { CalendarPostService } from "../../../shared/services/calendar-post.service/calendar-post.service";
import { Observable } from "rxjs";

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [CommonModule, CalendarComponent, CreatePostModalComponent],
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss']
})
export class CalendarPageComponent {
  @Input() listClients: Observable<ListClientsInterface[]>;
  events: any[] = [];
  showModal = false;
  selectedPost: (sheduleInCalendarPost & { id: string }) | null = null;

  constructor(private calendarService: CalendarPostService) { }

  async ngOnInit() {
    await this.loadEvents();
  }

  async loadEvents() {
    try {
      const posts = await this.calendarService.getAllPosts();
      this.events = posts.map(post => ({
        title: post.title,
        start: this.convertTimestampToDate(post?.date),
        end: this.convertTimestampToDate(post.end),
        allDay: false,
        id: post.id
      }));
      console.log('[DEBUG] Eventos carregados:', this.events);
    } catch (error) {
      console.error('[ERRO] Falha ao carregar eventos:', error);
    }
  }

  convertTimestampToDate(timestamp: any): Date {
    if (typeof timestamp?.toDate === 'function') {
      return timestamp.toDate();
    }

    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000);
    }

    return new Date();
  }

  async deletePost(postId: string) {
    try {
      await this.calendarService.deletePost(postId);
      this.events = this.events.filter(e => e.id !== postId);
      this.showModal = false;
      this.selectedPost = null;
    } catch (error) {
      console.error('[ERRO] Falha ao deletar post:', error);
    }
  }

  async editPost(postId: string, updatedData: Partial<sheduleInCalendarPost>, post: sheduleInCalendarPost & { id: string }) {
    await this.calendarService.updatePost(postId, updatedData);
    await this.loadEvents();
    this.selectedPost = post;
    this.showModal = true;
  }

  async onPostUpdated(event: { id: string, changes: Partial<sheduleInCalendarPost> }) {
    await this.calendarService.updatePost(event.id, event.changes);
    this.showModal = false;
    this.selectedPost = null;
    await this.loadEvents();
  }

  async onPostCreated(post: Omit<sheduleInCalendarPost, 'createdAt' | 'updatedAt'>) {
    try {
      console.log('[DEBUG] Post recebido para criação:', post);
      await this.calendarService.addPost(post);
      console.log('[DEBUG] Post enviado para o serviço com sucesso');

      this.events = [
        ...this.events,
        {
          clientId: post.clientId,
          title: post.title,
          start: post.date
        }
      ];

      this.showModal = false;
    } catch (error) {
      console.error('[ERRO] Falha ao adicionar post:', error);
    }
  }

  async onEventClicked(event: string) {
    const postId = event;

    if (!postId || typeof postId !== 'string') {
      this.showModal = true;
      return;
    }

    try {
      const post = await this.calendarService.getPostById(postId);
      this.selectedPost = post;
      this.showModal = true;
    } catch (error) {
    }
  }

  onDateClicked(date?: Date) {
    if (!date) {
      this.showModal = false;
      return;
    }

    const post = this.events.find(event => event.start.isSame(date, 'day'));

    if (post) {
      this.selectedPost = post;
      this.showModal = true;
    } else {
      this.selectedPost = null;
      this.showModal = true;
    }
  }
}
