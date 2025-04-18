import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CreatePostModalComponent } from "./components/calendar-modal/create-post-modal.component";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { sheduleInCalendarPost } from "../../../interface/user-config.model";
import dayjs, { Dayjs } from "dayjs";
import { CalendarPostService } from "../../../shared/services/calendar-post.service/calendar-post.service";

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [CommonModule, CalendarComponent, CreatePostModalComponent],
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss']
})
export class CalendarPageComponent {
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
        start: dayjs(post.date).toDate(),
        id: post.id
      }));
    } catch (error) {
      console.error('[ERRO] Falha ao carregar eventos:', error);
    }
  }

  async deletePost(postId: string) {
    await this.calendarService.deletePost(postId);
    this.events = this.events.filter(e => e.id !== postId);
  }

  async editPost(postId: string, updatedData: Partial<sheduleInCalendarPost>, post: sheduleInCalendarPost & { id: string }) {
    await this.calendarService.updatePost(postId, updatedData);
    await this.loadEvents(); // recarrega os dados atualizados
    this.selectedPost = post;
    this.showModal = true;
  }

  async onPostUpdated(event: { id: string, changes: Partial<sheduleInCalendarPost> }) {
    await this.calendarService.updatePost(event.id, event.changes);
    this.showModal = false;
    this.selectedPost = null;
    await this.loadEvents(); // recarrega os dados atualizados
  }

  async onPostCreated(post: Omit<sheduleInCalendarPost, 'createdAt' | 'updatedAt'>) {
    try {
      await this.calendarService.addPost(post);

      this.events = [
        ...this.events,
        {
          title: post.title,
          start: dayjs(post.date).toDate()
        }
      ];

      this.showModal = false;
    } catch (error) {
      console.error('[ERRO] Falha ao adicionar post:', error);
    }
  }

  // Novo método para lidar com a seleção do evento para edição
  async onEventClicked(event: any) {
    console.log('Evento clicado:', event);
  
    // Consulta o Firebase para obter os dados completos do post
    try {
      const post = await this.calendarService.getPostById(event);  // Agora busca o post corretamente
        console.log('Post encontrado:', post);  // Adicione esta linha para depuração
      // Passa os dados completos para o modal
      this.selectedPost = post;
      this.showModal = true;
    } catch (error) {
      console.error('[ERRO] Falha ao carregar evento:', error);
    }
  }
  onDateClicked(date?: Dayjs) {
    if (!date) {
      // Se data for nula, fecha o modal
      this.showModal = false;
      return;
    }

    // Verifique se a data clicada possui um post associado
    const post = this.events.find(event => dayjs(event.start).isSame(date, 'day'));

    if (post) {
      // Se existir um post para a data clicada, preenche o post selecionado e abre o modal
      this.selectedPost = post;
      this.showModal = true;
    } else {
      // Caso contrário, abre o modal em modo de criação
      this.selectedPost = null;
      this.showModal = true;
    }
  }
}
