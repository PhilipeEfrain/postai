import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { Calendar, CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBR from '@fullcalendar/core/locales/pt-br';
import { Dayjs } from 'dayjs';

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
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: this.handleDateClick.bind(this),
    events: this.events,
    editable: true,
    eventClick: this.handleEventClick.bind(this),
  };

  constructor() {}

  ngOnInit(): void {
    // Qualquer lógica adicional necessária durante a inicialização do componente
  }

  // Função de clique na data (pode ser personalizada conforme necessidade)
  handleDateClick(event: any) {
    console.log('Evento de data clicado:', event);
    console.log('Data clicada:', event.date);
    this.dateSelected.emit(event.date);  // Passa a data clicada para o componente pai
  }

  handleEventClick(clickInfo: any) { 
    // Emite os dados do evento para abrir o modal de edição
    console.log('enviei', clickInfo.event.id);
    this.dateSelected.emit(clickInfo.event.id);
  }
  
}
