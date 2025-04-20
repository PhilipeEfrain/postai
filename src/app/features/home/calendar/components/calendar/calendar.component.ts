import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBR from '@fullcalendar/core/locales/pt-br';


@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})

export class CalendarComponent implements OnInit {
  @Output() dateSelected = new EventEmitter<any>();
  @Input() events: EventInput[] = [];
  calendarPlugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];

  calendarOptions: CalendarOptions = {
    locale: ptBR,
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    dateClick: this.handleDateClick.bind(this),
    events: this.events,
    slotDuration: '00:15:00',
    editable: true,
    eventClick: this.handleEventClick.bind(this),
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'timeGridWeek,timeGridDay' // user can switch between the two
    },
    views: {
      timeGridFourDay: {
        type: 'timeGrid',
        duration: { days: 7 }
      }
    }
  };

  constructor() { }

  ngOnInit(): void {
    // Qualquer lógica adicional necessária durante a inicialização do componente
  }

  // Função de clique na data (pode ser personalizada conforme necessidade)
  handleDateClick(event: any) {
    this.dateSelected.emit(event.date);  // Passa a data clicada para o componente pai
  }

  handleEventClick(clickInfo: any) {
    // Emite os dados do evento para abrir o modal de edição
    console.log('enviei', clickInfo.event.id);
    this.dateSelected.emit(clickInfo.event.id);
  }

}
