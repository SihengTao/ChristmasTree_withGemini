import * as THREE from 'three';

export interface GestureState {
  isExploded: boolean;
  handPresent: boolean;
  handX: number; // 0 to 1, relative to screen width
}

export interface ParticleData {
  initialPos: [number, number, number]; // Base position in tree
  explodePos: [number, number, number]; // Target position in explosion
  speed: number;
  phase: number;
  color: THREE.Color;
  scale: number;
  type: 'snow' | 'ornament' | 'needle' | 'trunk';
  scaleDims: [number, number, number];
}

// Global types for MediaPipe attached to window
declare global {
  interface Window {
    Hands: any;
    Camera: any;
  }
}