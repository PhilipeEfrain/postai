// src\app\features\home\calendar\components\calendar-modal\create-post-modal.component.ts
import { Component, EventEmitter, Input, OnChanges, SimpleChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { sheduleInCalendarPost } from '../../../../../interface/user-config.model';
import dayjs from 'dayjs';

@Component({
  selector: 'app-create-post-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-post-modal.component.html',
  styleUrls: ['./create-post-modal.component.scss']
})
export class CreatePostModalComponent implements OnChanges {
  @Input() postToEdit: (sheduleInCalendarPost & { id: string }) | null = null;
  @Output() postCreated = new EventEmitter<any>();
  @Output() postUpdated = new EventEmitter<{ id: string; changes: Partial<sheduleInCalendarPost> }>();
  @Output() modalClosed = new EventEmitter<void>();

  form = this.fb.group({
    title: ['', Validators.required],
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
    if (changes['postToEdit'] && this.postToEdit) {
      const post = this.postToEdit;
      this.form.patchValue({
        title: post.title,
        description: post.description,
        hashtags: post.hashtags?.join(', '),
        links: post.links?.join(', '),
        url: post.url,
        type: post.type,
        date: dayjs(post.date).toDate(),
        remindBefore: post.remindBefore
      });
    }
  }

  submit() {
    if (this.form.invalid) return;

    const value = this.form.value;
    const post: Partial<sheduleInCalendarPost> = {
      title: value.title ?? '',
      description: value.description ?? '',
      hashtags: value.hashtags?.split(',').map((h: string) => h.trim()).filter(Boolean) ?? [],
      links: value.links?.split(',').map((l: string) => l.trim()).filter(Boolean) ?? [],
      url: value.url ?? '',
      type: value.type ?? 'feed',
      date: dayjs(value.date).toDate(),
      remindBefore: Number(value.remindBefore ?? 1),
    };

    if (this.postToEdit) {
      this.postUpdated.emit({ id: this.postToEdit.id, changes: post });
    } else {
      this.postCreated.emit(post);
    }

    this.form.reset();
  }

  closeModal() {
    this.modalClosed.emit();
    this.form.reset();
  }
}
