import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ModalType = 'success' | 'error';

export interface ModalData {
  title: string;
  message: string;
  type: ModalType;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalSubject = new BehaviorSubject<ModalData | null>(null);
  modal$ = this.modalSubject.asObservable();

  showModal(data: ModalData) {
    this.modalSubject.next(data);
  }

  closeModal() {
    this.modalSubject.next(null);
  }
}
