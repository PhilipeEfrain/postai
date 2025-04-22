import { Component, Input, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Observable } from "rxjs";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { PostSidebarComponent } from "../../post-sidebar/post-sidebar.component";
import { MockPostsComponent } from "../../mock-posts/mock-posts.component";
import { CalendarPostService } from "../../../shared/services/calendar-post.service/calendar-post.service";
import { ListClientsInterface, sheduleInCalendarPost } from "../../../interface/user-config.model";

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [CommonModule, CalendarComponent, MockPostsComponent, PostSidebarComponent],
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss']
})
export class CalendarPageComponent {
  @Input() listClients!: Observable<ListClientsInterface[]>;
  @ViewChild('postSidebar') postSidebar!: PostSidebarComponent;
  events: any[] = [];
  openPost!: sheduleInCalendarPost;
  selectedPost: sheduleInCalendarPost | null = null;
  openPreview = false;

  private deletePostId: string | null = null;
  confirmModalInstance: any = null;

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

  async onPostCreated(post: Omit<sheduleInCalendarPost, 'createdAt' | 'updatedAt'>) {
    try {
      await this.calendarService.addPost(post);
      this.events = [...this.events, {
        clientId: post.clientId,
        title: post.title,
        start: post.date
      }];
      this.postSidebar.close();
    } catch (error) {
      console.error('[ERRO] Falha ao adicionar post:', error);
    }
  }

  async onPostUpdated(event: { id: string, changes: Partial<sheduleInCalendarPost> }) {
    try {
      await this.calendarService.updatePost(event.id, event.changes);
      await this.loadEvents();
      this.selectedPost = null;
      this.postSidebar.close();
    } catch (error) {
      console.error('[ERRO] Falha ao atualizar post:', error);
    }
  }

  async onEventClicked(postId: string) {
    if (!postId || typeof postId !== 'string') {
      this.postSidebar.open();
      return;
    }

    try {
      const post = await this.calendarService.getPostById(postId);
      this.selectedPost = {
        ...post,
        date: this.convertTimestampToDate(post.date),
        end: this.convertTimestampToDate(post.end)
      };
      this.onEditPost(this.selectedPost);
    } catch (error) {
      console.error('[ERRO] ao carregar post:', error);
    }
  }

  onEditPost(post: sheduleInCalendarPost) {
    this.openPost = post;
    this.openPreview = true;
    this.postSidebar.open();
  }

  onDateClicked(date?: Date) {
    if (!date) {
      this.postSidebar.close();
      return;
    }

    const post = this.events.find(event => new Date(event.start).toDateString() === date.toDateString());

    this.selectedPost = post ?? null;
    this.postSidebar.open();
  }

  closePreview() {
    this.openPreview = false;
    this.openPost = null!;
  }

  openDeleteConfirmationModal(postId: string) {
    this.deletePostId = postId;
    const modalElement = document.getElementById('confirmDeleteModal');
    if (modalElement) {
      this.confirmModalInstance = new (window as any).bootstrap.Modal(modalElement);
      this.confirmModalInstance.show();
    }
  }

  async delete() {
    if (!this.deletePostId) return;

    try {
      await this.calendarService.deletePost(this.deletePostId);
      this.events = this.events.filter(e => e.id !== this.deletePostId);
      this.selectedPost = null;
      this.postSidebar.close();
    } catch (error) {
      console.error('[ERRO] Falha ao deletar post:', error);
    } finally {
      this.confirmModalInstance?.hide();
      this.deletePostId = null;
    }
  }

  handleDelete() {
    const modal = document.getElementById('confirmDeleteModal');
    if (modal) {
      const bsModal = new (window as any).bootstrap.Modal(modal);
      bsModal.show();
    }
  }


}
