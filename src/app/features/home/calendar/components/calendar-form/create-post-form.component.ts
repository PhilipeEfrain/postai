import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ListClientsInterface, scheduleInCalendarPost } from '../../../../../interface/user-config.model';
import { Observable, take } from 'rxjs';
import flatpickr from 'flatpickr';
import { Portuguese } from 'flatpickr/dist/l10n/pt';

@Component({
  selector: 'app-create-post-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-post-form.component.html',
  styleUrls: ['./create-post-form.component.scss']
})
export class CreatePostModalComponent implements AfterViewInit, OnChanges {
  @Input() listClients!: Observable<ListClientsInterface[]>;
  @Input() postToEdit: scheduleInCalendarPost | null = null;
  @Output() created = new EventEmitter<any>();
  @Output() updated = new EventEmitter<{ id: string; changes: Partial<scheduleInCalendarPost> }>();
  @Output() modalClosed = new EventEmitter<void>();
  @Output() postDeleted = new EventEmitter<string>();

  @ViewChild('dateInput') dateInputRef!: ElementRef;

  clients$: ListClientsInterface[] = [];

  form = this.fb.group({
    title: ['', Validators.required],
    clientId: ['', Validators.required],
    description: [''],
    hashtags: [''],
    links: [''],
    url: [''],
    type: ['feed', Validators.required],
    date: [null as Date | null, Validators.required],
    end: [null as Date | null],
    remindBefore: [1, Validators.required],
  });

  constructor(private fb: FormBuilder) { }

  ngAfterViewInit() {
    flatpickr(this.dateInputRef.nativeElement, {
      enableTime: true,
      dateFormat: 'd/m/Y H:i',
      time_24hr: true,
      minuteIncrement: 15,
      locale: Portuguese,
      onChange: ([selectedDate]) => {
        this.form.get('date')?.setValue(selectedDate);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.createListClients();

    if (changes['postToEdit'] && this.postToEdit) {
      const post = this.postToEdit;
      const formattedDate = post.date instanceof Date ? post.date : new Date(post.date);
      const endDate = new Date(formattedDate.getTime() + 15 * 60 * 1000);

      this.form.patchValue({
        title: post.title,
        clientId: post.clientId,
        description: post.description,
        hashtags: post.hashtags?.join(', '),
        links: post.links?.join(', '),
        url: post.url,
        type: post.type,
        date: formattedDate,
        end: endDate,
        remindBefore: post.remindBefore,
      });
    }
  }

  createListClients() {
    this.listClients?.pipe(take(1)).subscribe((resp) => {
      this.clients$ = resp;
      if (resp.length === 1) {
        this.form.get('clientId')?.setValue(resp[0].id);
      }
    });
  }

  submit() {
    if (this.form.invalid) return;

    const value = this.form.value;
    const startDate = new Date(value.date!);
    const endDate = new Date(startDate.getTime() + 15 * 60 * 1000);

    const post: Partial<scheduleInCalendarPost> = {
      title: value.title!,
      description: value.description ?? '',
      hashtags: value.hashtags?.split(',').map(h => h.trim()).filter(Boolean) ?? [],
      links: value.links?.split(',').map(l => l.trim()).filter(Boolean) ?? [],
      url: value.url ?? '',
      type: value.type!,
      date: startDate,
      end: endDate,
      remindBefore: Number(value.remindBefore ?? 1),
      clientId: value.clientId!,
    };

    this.postToEdit
      ? this.updated.emit({ id: this.postToEdit.id, changes: post })
      : this.created.emit(post);

    this.form.reset();
  }

  delete() {
    if (this.postToEdit?.id) {
      this.postDeleted.emit(this.postToEdit.id);
    }
  }

  close() {
    this.modalClosed.emit();
    this.form.reset();
  }
}
