import { Component, inject, Input, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Observable } from "rxjs";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { PostSidebarComponent } from "../../post-sidebar/post-sidebar.component";
import { MockPostsComponent } from "../../mock-posts/mock-posts.component";
import { CalendarPostService } from "../../../shared/services/calendar-post.service/calendar-post.service";
import { ListClientsInterface, scheduleInCalendarPost } from "../../../interface/user-config.model";
import { ModalService } from "../../../shared/modal.service";

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
  openPost!: scheduleInCalendarPost;
  selectedPost: scheduleInCalendarPost | null = null;
  openPreview = false;

  private deletePostId: string | null = null;
  confirmModalInstance: any = null;

  private calendarService = inject(CalendarPostService);
  private modalService = inject(ModalService);

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
      this.modalService.showModal({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Falha ao carregar eventos.',
      })
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

  async onPostCreated(post: Omit<scheduleInCalendarPost, 'createdAt' | 'updatedAt'>) {
    try {
      await this.calendarService.addPost(post);
      this.events = [...this.events, {
        clientId: post.clientId,
        title: post.title,
        start: post.date
      }];
      this.postSidebar.close();
    } catch (error) {
      this.modalService.showModal({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Falha ao criar post.',
      })
    }
  }

  async onPostUpdated(event: { id: string, changes: Partial<scheduleInCalendarPost> }) {
    try {
      await this.calendarService.updatePost(event.id, event.changes);
      await this.loadEvents();
      this.selectedPost = null;
      this.postSidebar.close();
    } catch (error) {
      this.modalService.showModal({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Falha ao atualizar post.',
      })
    }
  }

  async onEventClicked(postId: string) {
    if (!postId || typeof postId !== 'string') {
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
      this.modalService.showModal({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Falha ao carregar post.',
      })
    }
  }

  openSidebarToEdit() {
    this.postSidebar.open();
  }

  onEditPost(post: scheduleInCalendarPost) {
    this.openPost = post;
    this.openPreview = true;
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
      this.openPost = null!;
      this.openPreview = false;
      this.postSidebar.close();
    } catch (error) {
      this.modalService.showModal({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Falha ao deletar post.',
      })
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
