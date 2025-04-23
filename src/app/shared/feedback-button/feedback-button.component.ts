import { Component, ViewChild } from '@angular/core';
import { FeedbackModalComponent } from '../feedback-modal/feedback-modal.component';

@Component({
  selector: 'app-feedback-button',
  standalone: true,
  imports: [FeedbackModalComponent],
  templateUrl: './feedback-button.component.html',
  styleUrl: './feedback-button.component.scss'
})
export class FeedbackButtonComponent {
  @ViewChild(FeedbackModalComponent) feedbackModal!: FeedbackModalComponent;

  openFeedbackModal() {
    this.feedbackModal.open();
  }
}
