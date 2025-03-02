import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { IViewer } from 'src/app/core/IViewer';
import { Viewer } from 'src/app/core/Viewer';
import { points, intersections } from 'src/app/data/intersect-plane-data';
import * as THREE from 'three';

@Component({
  selector: 'app-intersect-plane',
  templateUrl: './intersect-plane.component.html',
  styleUrls: ['./intersect-plane.component.scss']
})
export class IntersectPlaneComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private viewer!: IViewer;

  constructor() {
  }

  ngOnDestroy(): void {
    console.log("IntersectPlane - ngOnDestroy");
  }

  ngAfterViewInit(): void {
    console.log("IntersectPlane - ngAfterViewInit");
    const canvasElement = document.getElementsByClassName("canvas-wrapper")[0];
    if (canvasElement) {
      this.canvas.nativeElement.width = canvasElement.clientWidth;
      this.canvas.nativeElement.height = canvasElement.clientHeight;

      const object = new THREE.Object3D();
      this.viewer = new Viewer(this.canvas.nativeElement);
      this.viewer.getView().getMainGroup().add(object);

      this.buildLine(points, "#ffffff", object);
      intersections.forEach(intersection => {
        this.buildLine(intersection, this.getRandomColor(), object);
      });

      const geometry = new THREE.SphereGeometry(.1, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      const sphere = new THREE.Mesh(geometry, material);
      object.add(sphere);
    }
  }

  private buildLine(points: THREE.Vector3[], colour: string, root: THREE.Object3D) {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    //create a white LineBasicMaterial
    const material = new THREE.LineBasicMaterial({ color: colour });
    const line = new THREE.Line(geometry, material);
    root.add(line);
  }

  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
