// src\app\features\home\calendar\components\calendar-modal\create-post-modal.component.ts
import { Component, EventEmitter, Input, OnChanges, SimpleChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ListClientsInterface, scheduleInCalendarPost } from '../../../../../interface/user-config.model';
import { Observable, take } from 'rxjs';
import { CalendarPostService } from '../../../../../shared/services/calendar-post.service/calendar-post.service';

@Component({
  selector: 'app-create-post-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-post-form.component.html',
  styleUrls: ['./create-post-form.component.scss']
})
export class CreatePostModalComponent implements OnChanges {
  @Input() listClients: Observable<ListClientsInterface[]>;
  @Input() postToEdit: scheduleInCalendarPost | null = null;
  @Output() postCreated = new EventEmitter<any>();
  @Output() postUpdated = new EventEmitter<{ id: string; changes: Partial<scheduleInCalendarPost> }>();
  @Output() modalClosed = new EventEmitter<void>();
  @Output() postDeleted = new EventEmitter<string>();
  clients$: ListClientsInterface[]

  form = this.fb.group({
    title: ['', Validators.required],
    clientId: ['', Validators.required],
    description: [''],
    hashtags: [''],
    links: [''],
    url: [''],
    type: ['feed', Validators.required],
    date: ['', Validators.required],
    end: [null as Date | null], // <--- adicionado
    remindBefore: [1, Validators.required],
  });
  selectedPost: null;
  postSidebar: any;

  constructor(private fb: FormBuilder, private calendarService: CalendarPostService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.createListClients();
    if (changes['postToEdit'] && this.postToEdit) {
      const post = this.postToEdit;

      const formattedDate = this.formatDate(post.date); // Formatar a data

      this.form.patchValue({
        title: post.title,
        clientId: post.clientId,
        description: post.description,
        hashtags: post.hashtags?.join(', '),
        links: post.links?.join(', '),
        url: post.url,
        type: post.type,
        date: formattedDate,
        remindBefore: post.remindBefore
      });
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  createListClients() {
    if (!this.listClients) return;

    this.listClients.pipe(take(1)).subscribe((resp) => {
      this.clients$ = resp;

      if (resp.length === 1) {
        this.form.get('clientId')?.setValue(resp[0].id);
      }
    });
  }

  submit() {
    console.log('submit', this.form);
    console.log('submit', this.form.value);
    if (this.form.invalid) return;

    const value = this.form.value;

    const startDate = new Date(value.date); // <-- aqui é a correção
    const endDate = new Date(startDate.getTime() + 15 * 60 * 1000); // +15 minutos

    const post: Partial<scheduleInCalendarPost> = {
      title: value.title ?? '',
      description: value.description ?? '',
      hashtags: value.hashtags?.split(',').map((h: string) => h.trim()).filter(Boolean) ?? [],
      links: value.links?.split(',').map((l: string) => l.trim()).filter(Boolean) ?? [],
      url: value.url ?? '',
      type: value.type ?? 'feed',
      date: startDate,
      end: endDate,
      remindBefore: Number(value.remindBefore ?? 1),
      clientId: value.clientId,
    };

    if (this.postToEdit) {
      this.postUpdated.emit({ id: this.postToEdit.id, changes: post });
    } else {
      this.postCreated.emit(post);
    }

    this.form.reset();
  }

  delete() {
    if (this.postToEdit?.id) {
      this.postDeleted.emit(this.postToEdit.id);
    }
  }

  loadEvents() {
    throw new Error('Method not implemented.');
  }

  close() {
    this.modalClosed.emit();
    this.form.reset();
  }
}
