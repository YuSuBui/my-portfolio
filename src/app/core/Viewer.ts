import * as THREE from "three";
import { IViewer } from "./IViewer";
import { ViewCanvas } from "./ViewCanvas";
import { View } from "./View";
import { IView } from "./IView";

export class Viewer implements IViewer {
  private canvas!: ViewCanvas;
  private view!: View;
  private requestAnimationFrameID = -1;

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = new ViewCanvas(canvasElement);
    this.view = new View(this.canvas);
    this.canvas.setView(this.view);

    this.animationLoop();
  }

  getView(): IView {
    return this.view;
  }

  private animationLoop() {
    this.canvas.updateCanvasSize();
    // repaint the ViewCanvas when it's View is dirty
    if (this.view.isDirty()) {
      this.canvas.render();
    }
    // tells the browser to schedule a next iteration
    this.requestAnimationFrameID = requestAnimationFrame(this.animationLoop.bind(this));
  }

}