import * as THREE from 'three';

export interface IView {
  getCamera(): THREE.PerspectiveCamera;

  setCenter(center: THREE.Vector3): void;

  getMainGroup(): THREE.Group;

  dispose(): void;
}