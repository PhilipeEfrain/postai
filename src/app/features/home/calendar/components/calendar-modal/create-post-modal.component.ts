// src\app\features\home\calendar\components\calendar-modal\create-post-modal.component.ts
import { Component, EventEmitter, Input, OnChanges, SimpleChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ListClientsInterface, sheduleInCalendarPost } from '../../../../../interface/user-config.model';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-create-post-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-post-modal.component.html',
  styleUrls: ['./create-post-modal.component.scss']
})
export class CreatePostModalComponent implements OnChanges {
  @Input() listClients: Observable<ListClientsInterface[]>;
  @Input() postToEdit: (sheduleInCalendarPost & { id: string }) | null = null;
  @Output() postCreated = new EventEmitter<any>();
  @Output() postUpdated = new EventEmitter<{ id: string; changes: Partial<sheduleInCalendarPost> }>();
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
    date: [null as Date | null, Validators.required],
    remindBefore: [1, Validators.required],
  });

  constructor(private fb: FormBuilder) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.createListClients()
    if (changes['postToEdit'] && this.postToEdit) {
      const post = this.postToEdit;
      this.form.patchValue({
        title: post.title,
        clientId: post.clientId,
        description: post.description,
        hashtags: post.hashtags?.join(', '),
        links: post.links?.join(', '),
        url: post.url,
        type: post.type,
        date: post.date,
        remindBefore: post.remindBefore
      });
    }
  }

  createListClients() {
    if (!this.listClients) return;
    this.listClients.pipe(take(1)).subscribe((resp) => {
      console.log('listClients', resp);
      this.clients$ = resp
    })
  }

  submit() {
    console.log('submit', this.form.value);
    if (this.form.invalid) return;

    const value = this.form.value;

    const startDate = new Date(value.date); // <-- aqui é a correção
    const endDate = new Date(startDate.getTime() + 15 * 60 * 1000); // +15 minutos

    const post: Partial<sheduleInCalendarPost> = {
      title: value.title ?? '',
      description: value.description ?? '',
      hashtags: value.hashtags?.split(',').map((h: string) => h.trim()).filter(Boolean) ?? [],
      links: value.links?.split(',').map((l: string) => l.trim()).filter(Boolean) ?? [],
      url: value.url ?? '',
      type: value.type ?? 'feed',
      date: startDate,
      end: endDate,
      remindBefore: Number(value.remindBefore ?? 1),
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

  closeModal() {
    this.modalClosed.emit();
    this.form.reset();
  }
}
