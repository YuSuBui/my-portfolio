import * as THREE from 'three';

export const points: THREE.Vector3[] = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, -10)
];

export const intersections: THREE.Vector3[][] = [
    [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1.0, 5.0, -12),
    ],
    [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-5, -5, -12),
    ],
    [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1.0, -5.0, -12),
    ]
]