import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ModalData, ModalService } from '../modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  modalData: ModalData | null = null;
  private sub: Subscription;

  constructor(private modalService: ModalService) {
    this.sub = this.modalService.modal$.subscribe((data) => {
      this.modalData = data;
    });
  }

  onClose() {
    this.modalService.closeModal();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
