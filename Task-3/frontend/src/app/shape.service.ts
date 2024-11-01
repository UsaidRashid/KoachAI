import { Injectable } from '@angular/core';
import { CanvasComponent } from './canvas/canvas.component';
import * as Colyseus from 'colyseus.js';

interface Shape {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number; z: number };
}

@Injectable({
  providedIn: 'root',
})
export class ShapeService {
  private shapes: Shape[] = [];
  private canvasComponent: CanvasComponent | null = null;
  private client: Colyseus.Client;
  private room: Colyseus.Room | null = null;

  constructor() {
    this.client = new Colyseus.Client('ws://localhost:5000');
  }

  public isConnected: boolean = false;

  async connect() {
    console.log('Attempting to connect to game room...');
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      try {
        this.room = await this.client.joinOrCreate('game_room');
        this.isConnected = true;
        console.log('Connected to the game room');
        this.room.onMessage('move', (message) =>
          this.updateShapePosition(message)
        );
        this.room.onMessage('extrude', (message) =>
          this.createShapeOnCanvas(message)
        );
        return;
      } catch (error) {
        console.error('Failed to connect to Colyseus room:', error);
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.error(
      'Max connection attempts reached. Unable to connect to the room.'
    );
  }

  async addShape(shape: Shape) {
    if (!this.isConnected) {
      console.warn('Cannot add shape: not connected to room');
      return;
    }
    this.shapes.push(shape);
    await this.room?.send('extrude', shape);
  }

  async setCanvasComponent(canvas: CanvasComponent) {
    this.canvasComponent = canvas;
  }

  async extrudeShape(shape: Shape) {
    if (this.canvasComponent) {
      this.canvasComponent.extrudeShape(shape.type);
    }
  }

  async moveShape(direction: string) {
    if (this.canvasComponent && this.canvasComponent.currentShape) {
      this.canvasComponent.moveShape(direction);
      const position = {
        x: this.canvasComponent.currentShape.position.x,
        y: this.canvasComponent.currentShape.position.y,
        z: this.canvasComponent.currentShape.position.z,
      };
      if (this.room) {
        this.room.send('move', {
          id: this.canvasComponent.currentShape.id,
          position,
        });
      }
    }
  }

  private updateShapePosition(data: any) {
    if (this.canvasComponent) {
      this.canvasComponent.updateOtherShapes(data);
    }
  }

  private createShapeOnCanvas(data: any) {
    if (this.canvasComponent) {
      this.canvasComponent.createShape(data);
    }
  }

  getShapes() {
    return this.shapes;
  }
}
