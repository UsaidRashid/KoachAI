import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShapeService } from '../shape.service';
import { FormsModule } from '@angular/forms';

interface Shape {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number; z: number };
}

@Component({
  selector: 'app-shape-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shape-editor.component.html',
  styleUrls: ['./shape-editor.component.css'],
})
export class ShapeEditorComponent {
  shapes: Shape[] = [];
  selectedShape: Shape | null = null;
  selectedShapeType: string = 'rectangle';
  shapeCreated: boolean = false;

  constructor(private shapeService: ShapeService) {}

  async drawShape() {
    if (this.shapeCreated) {
      alert('Shape can only be created once.');
      return;
    }

    const newShape: Shape = {
      id: `shape_${Date.now()}`,
      name: 'Shape',
      type: this.selectedShapeType,
      position: { x: 0, y: 0, z: 0 },
    };

    this.shapes.push(newShape);
    this.shapeService.addShape(newShape);
    this.selectedShape = newShape;

    if (this.shapeService.isConnected) {
      await this.extrudeShape(newShape);
    } else {
      console.warn('Not connected to the room. Please try again later.');
    }

    this.shapeCreated = true;
  }

  async extrudeShape(shape: Shape | null) {
    if (shape) {
      await this.shapeService.extrudeShape(shape);
    } else {
      console.warn('No shape selected for extrusion');
    }
  }

  async moveShape(direction: string) {
    await this.shapeService.moveShape(direction);
  }
}
