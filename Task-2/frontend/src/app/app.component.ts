import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventManagerComponent } from './event-manager/event-manager.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, EventManagerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Task-2';
}
