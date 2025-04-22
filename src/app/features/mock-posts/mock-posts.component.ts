import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { scheduleInCalendarPost } from '../../interface/user-config.model';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../../shared/safe-url.pipe';

@Component({
  selector: 'app-mock-posts',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './mock-posts.component.html',
  styleUrl: './mock-posts.component.scss'
})
export class MockPostsComponent {
  @Input() post: scheduleInCalendarPost;
  @Output() edit = new EventEmitter<scheduleInCalendarPost>();
  @Output() closePreview = new EventEmitter<any>();
  @Output() deletePost = new EventEmitter<any>();

  handleEdit() {
    this.edit.emit(this.post);
  }

  handleClose() {
    this.closePreview.emit();
  }

  handleDelete() {
    this.deletePost.emit(this.post.id);
  }

  getMediaType(url: string): 'youtube' | 'drive-image' | 'drive-video' | 'image' | 'video' | 'unknown' {
    if (!url) return 'unknown';

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube';
    }

    if (url.includes('drive.google.com')) {
      const ext = url.toLowerCase();
      if (ext.includes('.mp4') || ext.includes('.webm')) return 'drive-video';
      return 'drive-image';
    }

    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return 'image';
    if (url.match(/\.(mp4|webm)$/i)) return 'video';

    return 'unknown';
  }

  getDisplayUrl(url: string): string {
    if (!url) return '';

    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    if (driveMatch) {
      const fileId = driveMatch[1];

      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w500`;
    }

    return url;
  }


}
