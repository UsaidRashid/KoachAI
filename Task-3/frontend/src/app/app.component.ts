import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShapeEditorComponent } from './shape-editor/shape-editor.component';
import { CanvasComponent } from './canvas/canvas.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ShapeEditorComponent, CanvasComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'frontend';
}
