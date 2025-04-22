import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CreatePostModalComponent } from '../home/calendar/components/calendar-form/create-post-form.component';
import { ListClientsInterface, scheduleInCalendarPost } from '../../interface/user-config.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post-sidebar',
  standalone: true,
  imports: [CreatePostModalComponent],
  templateUrl: './post-sidebar.component.html',
  styleUrl: './post-sidebar.component.scss'
})
export class PostSidebarComponent implements AfterViewInit {
  @Input() postToEdit?: scheduleInCalendarPost;
  @Input() listClients!: Observable<ListClientsInterface[]>;

  @ViewChild('offcanvasRef') offcanvasRef!: ElementRef;

  private offcanvasInstance: any;

  ngAfterViewInit(): void {
    this.offcanvasInstance = new (window as any).bootstrap.Offcanvas(this.offcanvasRef.nativeElement);
  }

  open() {
    this.offcanvasInstance.show();
  }

  close() {
    this.offcanvasInstance.hide();
  }
}
