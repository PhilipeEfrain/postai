import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBR from '@fullcalendar/core/locales/pt-br';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';


@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})

export class CalendarComponent {
  @Output() dateSelected = new EventEmitter<any>();
  @Input() events: EventInput[] = [];
  calendarPlugins = [dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrap5Plugin];

  calendarOptions: CalendarOptions = {
    locale: ptBR,
    themeSystem: 'bootstrap5',
    initialView: 'dayGridMonth',
    plugins: this.calendarPlugins,
    dateClick: this.handleDateClick.bind(this),
    events: this.events,
    slotDuration: '00:15:00',
    editable: false,
    eventClick: this.handleEventClick.bind(this),
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    views: {
      timeGridFourDay: {
        type: 'timeGrid',
        duration: { days: 7 }
      }
    }
  };


  handleDateClick(event: any) {
    this.dateSelected.emit(event.date);
  }

  handleEventClick(clickInfo: any) {
    this.dateSelected.emit(clickInfo.event.id);
  }

}
