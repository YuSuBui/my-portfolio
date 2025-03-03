import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { IView } from './IView';
import { ViewCanvas } from "./ViewCanvas";

export class View implements IView {
  private camera!: THREE.PerspectiveCamera;
  private scene = new THREE.Scene();
  private controls!: OrbitControls;

  // Lights
  private ambientLight = new THREE.AmbientLight(0x404040);
  private directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);

  // Main object
  private group = new THREE.Group();

  private dirty = false;

  constructor(private readonly viewCanvas: ViewCanvas) {
    // set up a perspective camera
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
    this.camera.position.set(0, 1, 0);
    this.camera.up = new THREE.Vector3(0, 0, 1);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    // add objects into scene
    this.scene.add(this.ambientLight);
    this.scene.add(this.directionalLight);
    this.scene.add(this.group);

    this.controls = new OrbitControls(this.camera, this.viewCanvas.getElement());
    this.controls.enableDamping = true;
  }

  setCenter(center: THREE.Vector3): void {
    this.camera.lookAt(center);
    this.controls.target.set(center.x, center.y, center.z);
    this.controls.update();
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  getMainGroup(): THREE.Group {
    return this.group;
  }

  dispose(): void {
    // remove all objects from scene
    this.scene.remove(this.group);
    this.controls.dispose();
    this.disposeNode(this.group);
    
    this.viewCanvas.getRenderer().dispose();
  }

  public setDirty(dirty: boolean): void {
    this.dirty = dirty;
  }

  public isDirty(): boolean {
    return this.dirty;
  }

  public onResize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  public render(renderer: THREE.WebGLRenderer): void {
    const wd = this.camera.getWorldDirection(new THREE.Vector3());
    this.directionalLight.position.set(-wd.x, -wd.y, -wd.z);

    renderer.render(this.scene, this.camera);
    this.controls.update();
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