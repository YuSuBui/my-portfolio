import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IViewer } from 'src/app/core/IViewer';
import { Viewer } from 'src/app/core/Viewer';
import { points, intersections } from 'src/app/data/intersect-plane-data';
import * as THREE from 'three';
import { GUI } from 'dat.gui';

@Component({
  selector: 'app-intersect-plane',
  templateUrl: './intersect-plane.component.html',
  styleUrls: ['./intersect-plane.component.scss']
})
export class IntersectPlaneComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private viewer!: IViewer;

  private readonly root = new THREE.Object3D();
  private baseData: THREE.Vector3[] = points;
  private spline = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0);
  private intersectData: THREE.Vector3[][] = intersections;
  private planeGraphic!: PlaneGraphic;
  private intersectGraphics: Map<THREE.Vector3[], SphereGraphic> = new Map<THREE.Vector3[], SphereGraphic>();
  private gui = new GUI();

  constructor() {
  }

  ngOnInit(): void {
    // create a base line
    this.buildLine(this.baseData, "#ffffff", true, 0.05, this.root);
    // create a plane graphic
    this.planeGraphic = new PlaneGraphic(2.5);
    this.root.add(this.planeGraphic);

    // create some intersect graphics
    this.intersectData.forEach((intersect: THREE.Vector3[]) => {
      this.buildIntersectLine(intersect, this.root);
      const intersectGraphic = new SphereGraphic(0.1, "#ff0000");
      this.root.add(intersectGraphic);

      this.intersectGraphics.set(intersect, intersectGraphic);
    });

    const folderGUI = this.gui.addFolder("IntersectPlane");
    folderGUI.open();
    this.buildGUI(this.planeGraphic, folderGUI);
    console.log("IntersectPlane - ngOnInit");
  }

  ngOnDestroy(): void {
    console.log("IntersectPlane - ngOnDestroy");
    this.viewer.getView().dispose();
    this.viewer.getView().getMainGroup().remove(this.root);
    this.intersectGraphics.forEach(child => this.disposeNode(child));
    this.intersectGraphics.clear();

    this.gui.destroy();
  }

  ngAfterViewInit(): void {
    const canvasElement = document.getElementsByClassName("canvas-wrapper")[0];
    if (canvasElement) {
      this.canvas.nativeElement.width = canvasElement.clientWidth;
      this.canvas.nativeElement.height = canvasElement.clientHeight;

      this.viewer = new Viewer(this.canvas.nativeElement);
      this.viewer.getView().getMainGroup().add(this.root);

      const wellAxis = new THREE.Vector3(1, 0, 0);
      const center = new THREE.Vector3(0, 0, 0);
      const pos = new THREE.Vector3().copy(center).add(wellAxis).multiplyScalar(20);
      this.viewer.getView().getCamera().position.copy(pos);
      this.viewer.getView().setCenter(new THREE.Vector3(0, 0, points[points.length - 1].z * .5));

      // update plane
      this.updatePlanePosition(this.planeGraphic, 0.9);
      this.updateIntersections();
    }
    console.log("IntersectPlane - ngAfterViewInit");
  }

  private buildIntersectLine(data: THREE.Vector3[], object: THREE.Object3D): void {
    this.buildLine(data, this.getRandomColor(), true, 0.05, object);
  }

  private updatePlanePosition(graphic: PlaneGraphic, percent = 1.0): void {
    const position = this.spline.getPointAt(percent);
    const tangent = this.spline.getTangentAt(percent);
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(this.viewer.getView().getCamera().up, tangent);
    // update position and direction of the plane graphic
    graphic.position.copy(position);
    graphic.setRotationFromQuaternion(quaternion);
    graphic.updatePlane();
  }

  private updateIntersections(): void {
    this.intersectGraphics.forEach((graphic, data) => {
      const point = this.planeGraphic.getNearestPoint(data);
      if (point) {
        graphic.visible = true;
        graphic.position.copy(point);
      } else {
        graphic.visible = false;
      }
    });
  }

  private buildGUI(graphic: PlaneGraphic, gui: GUI): void {
    const properties = {
      depth: 0.9,
      scale: 1.0,
      rotation: 0
    };
    
    gui.add(properties, "depth", 0, 1.0, 0.1).name("Depth").onChange((value: number) => {
      this.updatePlanePosition(graphic, value);
      graphic.updatePlane();
      this.updateIntersections();
    });

    gui.add(properties, "rotation", 0, 90, 10).name("Rotate by X").onChange((value: number) => {
      graphic.rotateByXAxis(THREE.MathUtils.degToRad(value));
      graphic.updatePlane();
      this.updateIntersections();
    });

    gui.add(properties, "rotation", 0, 90, 10).name("Rotate by Y").onChange((value: number) => {
      graphic.rotateByYAxis(THREE.MathUtils.degToRad(value));
      graphic.updatePlane();
      this.updateIntersections();
    });

    gui.add(properties, "scale", 1.0, 2.0, 0.1).name("Scale").onChange((value: number) => {
      graphic.setRadiusScale(value);
      graphic.updatePlane();
      this.updateIntersections();
    });
  }

  private buildLine(points: THREE.Vector3[], colour: string, pointed: boolean, radius: number, root: THREE.Object3D): void {
    if (pointed) {
      points.forEach(point => {
        const sphere = new SphereGraphic(radius, "#ffff00");
        sphere.position.copy(point);
        root.add(sphere);
      });
    }
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

  private disposeNode(node: any): void {
    if (!node) return;
    if (node.children) { 
      node.children.forEach((child: any) => {
        this.disposeNode(child);
      });
      node.children = [];
    }
    if (node.geometry && node.geometry instanceof THREE.BufferGeometry) {
      node.geometry.dispose();
    }
    if (node.material && node.material instanceof THREE.Material) {
      node.material.dispose();
      if (node.material.texture && node.material.texture instanceof THREE.Texture) {
        node.material.texture.dispose();
      }
    }
  }
}

class PlaneGraphic extends THREE.Object3D {
  private circle!: THREE.Mesh;
  private plane!: THREE.Plane;
  private helper!: THREE.PlaneHelper;
  private radius = 0;

  constructor(radius: number) {
    super();
    this.radius = radius;
    const geometry = new THREE.CircleGeometry(radius, 64);
    const material = new THREE.MeshPhongMaterial({
      color: 0x558800,
      depthWrite: false,
      side: THREE.DoubleSide,
      opacity: .5,
      transparent: true
    });
    this.circle = new THREE.Mesh(geometry, material);
    this.add(this.circle);
    
    this.plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    this.helper = new THREE.PlaneHelper(this.plane, radius * 2, 0x0000ff);
    this.helper.visible = false;

    this.add(this.helper);
  }

  rotateByYAxis(angle: number): void {
    this.circle.rotation.y = angle;
  }

  rotateByXAxis(angle: number): void {
    this.circle.rotation.x = angle;
  }

  rotateByZAxis(angle: number): void {
    this.circle.rotation.z = angle;
  }

  setRadiusScale(radiusScale: number) {
    this.circle.scale.x = radiusScale;
    this.circle.scale.y = radiusScale;
  }

  updatePlane() {
    const childWorldQuaternion = this.circle.quaternion;
    const parentWorldQuaternion = this.quaternion;
    const quaternion = new THREE.Quaternion().multiplyQuaternions(parentWorldQuaternion, childWorldQuaternion);
    const normal = new THREE.Vector3(0, 0, 1);
    normal.applyQuaternion(quaternion);
    this.plane.setFromNormalAndCoplanarPoint(normal, this.position);
  }

  getNearestPoint(points: THREE.Vector3[]): THREE.Vector3 | null {
    let nearestPlus = null;
    let nearestMinus = null;
    let plus = Infinity;
    let minus = -Infinity;
    const radius = this.radius * this.circle.scale.x;

    for (const point of points) {
      const distance = (this.plane.normal.dot(point) + this.plane.constant);

      if (distance > 0 && distance < plus) {
        nearestPlus = point;
        plus = distance;
      }
      if (distance < 0 && distance > minus) {
        nearestMinus = point;
        minus = distance;
      }
    }
    const intersect = new THREE.Vector3();
    let exist = false;

    if (nearestMinus && nearestPlus) {
      const line = new THREE.Line3(nearestMinus, nearestPlus);
      this.plane.intersectLine(line, intersect);
      exist = true;
    }

    return exist && intersect.distanceTo(this.position) <= radius ? intersect : null;
  }
}

class SphereGraphic extends THREE.Mesh {
  constructor(radius = 0.1, colour = "ffff00") {
    super();
    this.geometry = new THREE.SphereGeometry(radius, 16, 16);
    this.geometry.center();
    this.geometry.computeBoundingBox();

    this.material = new THREE.MeshPhongMaterial({ color: colour });
  }
}