import { IViewCanvas } from "./IViewCanvas";
import * as THREE from 'three';
import { View } from "./View";

export class ViewCanvas implements IViewCanvas {
  private canvas!: HTMLCanvasElement;
  private renderer!: THREE.WebGLRenderer;
  private view!: View;
  private lastClientWidth = -1;
  private lastClientHeight = -1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
  }

  getWidth(): number {
    return this.canvas.width;
  }

  getHeight(): number {
    return this.canvas.height;
  }

  getElement(): HTMLCanvasElement {
    return this.canvas;
  }

  public setView(view: View): void {
    this.view = view;
  }

  public updateCanvasSize(): void {
    if (this.canvas.clientWidth !== this.lastClientWidth ||
      this.canvas.clientHeight !== this.lastClientHeight
    ) {
      this.lastClientWidth = this.canvas.clientWidth;
      this.lastClientHeight = this.canvas.clientHeight;
      const pixelRatio = window.devicePixelRatio;
      const width = this.lastClientWidth * pixelRatio;
      const height = this.lastClientHeight * pixelRatio;
      this.renderer.setSize(width, height, false);
      if (this.view) {
        this.view.onResize(width, height);
        this.view.setDirty(true);
      }
    }
  }

  public render(): void {
    this.view.render(this.renderer);
  }
}