import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { IViewer } from 'src/app/core/IViewer';
import { Viewer } from 'src/app/core/Viewer';
import { points } from 'src/app/data/intersect-plane-data';
import * as THREE from 'three';

@Component({
  selector: 'app-particle-point',
  templateUrl: './particle-point.component.html',
  styleUrls: ['./particle-point.component.scss']
})
export class ParticlePointComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private viewer!: IViewer;
  private path = new THREE.CatmullRomCurve3(points);

  private readonly root = new THREE.Object3D();
  private particles: ParticlePointGraphic[] = [];
  private particleCount = 1000;
  private outerRadius = 1.0;
  private speed = 0.001;
  private requestAnimationFrameID = -1;

  constructor() {
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

      this.animate();
    }
    console.log("ParticlePoint - ngAfterViewInit");
  }

  ngOnDestroy(): void {
    console.log("ParticlePoint - ngOnDestroy");
    cancelAnimationFrame(this.requestAnimationFrameID);

    this.viewer.getView().dispose();
    this.viewer.getView().getMainGroup().remove(this.root);
    this.disposeNode(this.particles);
  }

  ngOnInit(): void {
    this.buildExtrudeGraphic(this.root);
    this.buildParticles(this.root);
    console.log("ParticlePoint - ngOnInit");
  }

  private buildExtrudeGraphic(object: THREE.Object3D) {
    const mesh = new ExtrudeGraphic(this.path, this.outerRadius + 0.1, this.outerRadius);
    object.add(mesh);
  }

  private buildParticles(object: THREE.Object3D) { 
    for (let i = 0; i < this.particleCount; i++) {
        const particle = new ParticlePointGraphic(Math.random() * 0.2);
        particle.t = Math.random();
        object.add(particle);
        this.particles.push(particle);
    }
  }

  private animate(): void {
    this.requestAnimationFrameID = requestAnimationFrame(this.animate.bind(this));

    const timer = Date.now();

    this.particles.forEach((particle, index) => {
      particle.t -= this.speed;
      if (particle.t < 0) particle.t = 1.0;

      const position = this.path.getPointAt(particle.t);
      const tangent = this.path.getTangentAt(particle.t);
      const angle = Math.atan2(tangent.y, tangent.x);

      position.x += Math.cos(timer * this.speed + index) * this.outerRadius;
      position.y += Math.sin(timer * this.speed + index) * this.outerRadius;

      particle.position.copy(position);
      particle.rotation.z = angle;
    });
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

class ExtrudeGraphic extends THREE.Mesh {
  constructor(curve: THREE.Curve<THREE.Vector3>, outerRadius: number, innerRadius: number) {
    super();
    this.geometry = this.createExtrudeGeometry(outerRadius, innerRadius, curve);
    this.material = new THREE.MeshLambertMaterial({
      color: new THREE.Color(0x63666A),
      opacity: 1.0,
      side: THREE.DoubleSide,
      transparent: false
    });
  }

  private createExtrudeGeometry(
    outerRadius: number,
    innerRadius: number,
    curve: THREE.Curve<THREE.Vector3>
  ): THREE.ExtrudeGeometry {
    const thetaStart = THREE.MathUtils.degToRad(0);
    const thetaEnd = THREE.MathUtils.degToRad(-180);

    const shape = new THREE.Shape();
    shape.absarc(0, 0, outerRadius, thetaStart, thetaEnd, false);
    shape.absarc(0, 0, innerRadius, thetaEnd, thetaStart, true);

    const flowSteps = Math.max(1, Math.round(curve.getLength()));

    return new THREE.ExtrudeGeometry(shape, {
      bevelEnabled: false,
      curveSegments: 8.0,
      extrudePath: curve,
      steps: flowSteps
    });
  }
}

class ParticlePointGraphic extends THREE.Points {
  public t = 0;

  constructor(radius = 0.1) {
    super();
    const texture = new THREE.TextureLoader().load("assets/textures/spark.png");

    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    for (let i = 0; i < 1; i++) {
      vertices.push(0, 0, 0);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    this.geometry = geometry;
    this.material = new THREE.PointsMaterial({
      color: 0x555555,
      depthTest: true,
      depthWrite: false,
      size: radius,
      transparent: true,
      map: texture
    });
  }
}