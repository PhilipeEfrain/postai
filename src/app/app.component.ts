// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ModalComponent } from './shared/components/modal.component';
import { AuthService } from './core/auth.service';
import { FullCalendarModule } from '@fullcalendar/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ModalComponent, FullCalendarModule ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // Verificar se o usuário está autenticado
    this.authService.getCurrentUser().subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']); // Redirecionar para login caso não esteja autenticado
      }
    });
  }
}
