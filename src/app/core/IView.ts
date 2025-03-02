import * as THREE from 'three';

export interface IView {
  getCamera(): THREE.PerspectiveCamera;

  getMainGroup(): THREE.Group;

}