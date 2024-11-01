import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  MeshBuilder,
  Vector3,
  Mesh,
} from '@babylonjs/core';
import { ShapeService } from '../shape.service';

@Component({
  selector: 'app-canvas',
  standalone: true,
  template: '<canvas #canvasElement></canvas>',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent implements OnInit {
  @ViewChild('canvasElement', { static: true })
  canvasElement!: ElementRef<HTMLCanvasElement>;
  private engine!: Engine;
  private scene!: Scene;
  currentShape: Mesh | null = null;
  otherShapes: { [id: string]: Mesh } = {};

  constructor(private shapeService: ShapeService) {}

  ngOnInit() {
    this.engine = new Engine(this.canvasElement.nativeElement);
    this.createScene();
    this.shapeService.setCanvasComponent(this);
    this.shapeService.connect();
    this.engine.runRenderLoop(() => this.scene.render());
  }

  private createScene() {
    this.scene = new Scene(this.engine);
    const camera = new ArcRotateCamera(
      'camera',
      Math.PI / 2,
      Math.PI / 4,
      10,
      new Vector3(0, 0, 0),
      this.scene
    );
    camera.attachControl(this.canvasElement.nativeElement, true);
    new HemisphericLight('light', new Vector3(1, 1, 0), this.scene);
    MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, this.scene);
  }

  extrudeShape(shapeType: string) {
    const height = 1;
    let mesh;
    if (shapeType === 'rectangle') {
      mesh = MeshBuilder.CreateBox(
        'box',
        { width: 1, height, depth: 1 },
        this.scene
      );
    } else if (shapeType === 'cylinder') {
      mesh = MeshBuilder.CreateCylinder(
        'cylinder',
        { height, diameter: 1 },
        this.scene
      );
    } else if (shapeType === 'sphere') {
      mesh = MeshBuilder.CreateSphere('sphere', { diameter: 1 }, this.scene);
    }
    if (mesh) {
      mesh.position.y = height / 2;
      this.currentShape = mesh;
    }
  }

  moveShape(direction: string) {
    if (this.currentShape) {
      switch (direction) {
        case 'up':
          this.currentShape.position.z += 0.1;
          break;
        case 'down':
          this.currentShape.position.z -= 0.1;
          break;
        case 'left':
          this.currentShape.position.x -= 0.1;
          break;
        case 'right':
          this.currentShape.position.x += 0.1;
          break;
      }
    }
  }

  updateOtherShapes(data: any) {
    const { id, position } = data;
    if (this.otherShapes[id]) {
      this.otherShapes[id].position = new Vector3(
        position.x,
        position.y,
        position.z
      );
    }
  }

  createShape(data: any) {
    const { id, type, position } = data;
    let mesh;
    if (type === 'rectangle') {
      mesh = MeshBuilder.CreateBox(
        id,
        { width: 1, height: 1, depth: 1 },
        this.scene
      );
    } else if (type === 'cylinder') {
      mesh = MeshBuilder.CreateCylinder(
        id,
        { height: 1, diameter: 1 },
        this.scene
      );
    } else if (type === 'sphere') {
      mesh = MeshBuilder.CreateSphere(id, { diameter: 1 }, this.scene);
    }
    if (mesh) {
      mesh.position = new Vector3(position.x, position.y, position.z);
      this.otherShapes[id] = mesh;
    }
  }
}
