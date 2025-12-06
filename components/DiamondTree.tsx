import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ParticleData } from '../types';

// Increase count for high fidelity
const COUNT = 8000;
const tempObject = new THREE.Object3D();

// Palette based on the provided image
const COLORS = {
  NEEDLE_BLUE: new THREE.Color('#1565C0'),   // Vibrant Royal Blue
  NEEDLE_SHADOW: new THREE.Color('#0D47A1'), // Deep Blue
  SNOW_WHITE: new THREE.Color('#FFFFFF'),    // Pure White
  SNOW_SHADOW: new THREE.Color('#E3F2FD'),   // Ice White
  TRUNK_BROWN: new THREE.Color('#5D4037'),   // Solid Brown
  TRUNK_DARK: new THREE.Color('#3E2723'),    // Dark Brown
  GARLAND_SILVER: new THREE.Color('#ECEFF1'),// Silver string
  ORNAMENT_GOLD: new THREE.Color('#FFD700'), // Bright Gold
  ORNAMENT_RED: new THREE.Color('#D32F2F'),  // Festive Red
  STAR_GLOW: new THREE.Color('#FFF59D'),     // Star glow
};

interface DiamondTreeProps {
  isExploded: boolean;
  handX: number; // 0 to 1
  handPresent: boolean;
}

export const DiamondTree: React.FC<DiamondTreeProps> = ({ isExploded, handX, handPresent }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const { particles, colorArray } = useMemo(() => {
    const data: ParticleData[] = [];
    const colors = new Float32Array(COUNT * 3);
    const _color = new THREE.Color();
    let idx = 0;

    const addParticle = (
      x: number, y: number, z: number, 
      colorBase: THREE.Color, 
      scaleBase: number, 
      type: 'snow' | 'ornament' | 'needle' | 'trunk'
    ) => {
      if (idx >= COUNT) return;
      
      const initialPos: [number, number, number] = [x, y, z];
      
      // Explosion logic
      const explodeRadius = 15 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const ex = explodeRadius * Math.sin(phi) * Math.cos(theta);
      const ey = explodeRadius * Math.sin(phi) * Math.sin(theta);
      const ez = explodeRadius * Math.cos(phi);

      // Color variation
      _color.copy(colorBase);
      if (type === 'needle') _color.offsetHSL(0, 0, (Math.random() - 0.5) * 0.05);
      if (type === 'snow') _color.offsetHSL(0, 0, (Math.random() - 0.5) * 0.02);
      if (type === 'trunk') _color.offsetHSL(0, 0, (Math.random() - 0.5) * 0.1);

      _color.toArray(colors, idx * 3);

      // Shape stretching
      let sX = scaleBase, sY = scaleBase, sZ = scaleBase;
      if (type === 'needle') { sY *= 3.0; sX *= 0.6; sZ *= 0.6; } // Thicker needles for visibility
      if (type === 'trunk') { sY *= 1.2; sX *= 1.2; sZ *= 1.2; }
      if (type === 'ornament') { sX *= 2.0; sY *= 2.0; sZ *= 2.0; } 

      data.push({
        initialPos,
        explodePos: [ex, ey, ez],
        speed: 0.2 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        color: _color.clone(),
        scale: 1.0,
        type: type,
        scaleDims: [sX, sY, sZ]
      });
      idx++;
    };

    // 1. TRUNK (Shortened as requested)
    // Was 4.5, now 3.5 (approx 3/4)
    const TRUNK_HEIGHT = 3.5;
    // Start lower to ensure ground contact, overlap into tree
    const TRUNK_BASE_Y = -6.0; 
    
    for (let i = 0; i < 600; i++) {
      const h = Math.random() * TRUNK_HEIGHT; 
      const theta = Math.random() * Math.PI * 2;
      const r = 0.3 + Math.random() * 0.5; 
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      const y = TRUNK_BASE_Y + h;
      
      addParticle(x, y, z, Math.random() > 0.4 ? COLORS.TRUNK_BROWN : COLORS.TRUNK_DARK, 0.15, 'trunk');
    }

    // 2. TREE LAYERS (Blue Needles + White Snow)
    const LAYERS = 22;
    const TOP_Y = 8;
    const BOTTOM_Y = -4.0; // Slightly higher bottom for tree
    
    for (let l = 0; l < LAYERS; l++) {
      const t = l / (LAYERS - 1);
      const layerY = THREE.MathUtils.lerp(TOP_Y, BOTTOM_Y, t);
      const maxR = THREE.MathUtils.lerp(0.5, 9.0, t); 
      
      const branchesInLayer = 8 + Math.floor(t * 22);
      
      for (let b = 0; b < branchesInLayer; b++) {
        const angleBase = (b / branchesInLayer) * Math.PI * 2;
        const angle = angleBase + (Math.random() - 0.5) * 0.25;
        const length = maxR * (0.6 + Math.random() * 0.4);
        
        const particlesPerBranch = 18 + Math.floor(t * 35);
        
        for (let p = 0; p < particlesPerBranch; p++) {
          const dist = p / particlesPerBranch;
          const r = dist * length;
          
          const droop = Math.pow(dist, 2.2) * (1 + t * 2.2);
          
          const baseX = Math.cos(angle) * r;
          const baseZ = Math.sin(angle) * r;
          const baseY = layerY - droop;

          const spread = 0.4 * t;
          
          // 2.1 BLUE NEEDLES (The Body)
          const nx = baseX + (Math.random() - 0.5) * spread;
          const nz = baseZ + (Math.random() - 0.5) * spread;
          const ny = baseY - (Math.random() * 0.4);

          addParticle(nx, ny, nz, Math.random()>0.3 ? COLORS.NEEDLE_BLUE : COLORS.NEEDLE_SHADOW, 0.12, 'needle');

          // 2.2 WHITE SNOW (The Cap)
          // Strictly on top
          const snowChance = 0.65; 
          if (Math.random() < snowChance) {
             const sx = baseX + (Math.random() - 0.5) * spread * 0.9;
             const sz = baseZ + (Math.random() - 0.5) * spread * 0.9;
             const sy = baseY + 0.2 + (Math.random() * 0.1); // Explicitly above
             
             addParticle(sx, sy, sz, Math.random() > 0.1 ? COLORS.SNOW_WHITE : COLORS.SNOW_SHADOW, 0.13, 'snow');
          }

          // 2.3 ORNAMENTS (Red & Gold)
          if (dist > 0.3 && Math.random() < 0.035) {
             const isGold = Math.random() > 0.3; // 70% Gold, 30% Red
             const pColor = isGold ? COLORS.ORNAMENT_GOLD : COLORS.ORNAMENT_RED;
             const ox = baseX + (Math.random() - 0.5) * 0.5;
             const oz = baseZ + (Math.random() - 0.5) * 0.5;
             addParticle(ox, baseY - 0.4, oz, pColor, 0.22, 'ornament');
          }
          
          // 2.4 ICICLES
          if (dist > 0.9 && t > 0.2 && Math.random() < 0.12) {
             const len = 3 + Math.floor(Math.random()*3);
             for(let k=0; k<len; k++) {
                addParticle(baseX, baseY - 0.3 - (k*0.15), baseZ, COLORS.SNOW_SHADOW, 0.08 - (k*0.015), 'snow');
             }
          }
        }
      }
    }

    // 3. GARLANDS (Silver)
    for (let l = 2; l < LAYERS - 2; l+=2) {
       const t = l / (LAYERS - 1);
       const r = THREE.MathUtils.lerp(1, 8, t) * 0.85;
       const y = THREE.MathUtils.lerp(TOP_Y, BOTTOM_Y, t);
       
       const segs = 50;
       for(let s=0; s<segs; s++) {
          const theta = (s/segs) * Math.PI * 4; 
          const gx = Math.cos(theta) * r;
          const gz = Math.sin(theta) * r;
          const drape = Math.sin(theta * 8) * 0.4; 
          const gy = y + drape - (theta * 0.6); 

          if (gy > BOTTOM_Y + 1) {
             addParticle(gx, gy, gz, COLORS.GARLAND_SILVER, 0.06, 'snow');
          }
       }
    }

    // 4. TOP STAR (Warm Gold)
    const STAR_Y = TOP_Y + 0.5;
    for(let i=0; i<180; i++) {
       const r = Math.random() * 0.9;
       const theta = Math.random() * Math.PI * 2;
       const phi = Math.random() * Math.PI;
       const x = r * Math.sin(phi) * Math.cos(theta);
       const y = r * Math.sin(phi) * Math.sin(theta);
       const z = r * Math.cos(phi);
       
       addParticle(x, STAR_Y + y + 1.2, z * 0.3, COLORS.STAR_GLOW, 0.15, 'ornament');
    }

    return { particles: data, colorArray: colors };
  }, []);

  const transition = useRef(0);
  const currentRotation = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Smooth Transition
    const target = isExploded ? 1 : 0;
    transition.current = THREE.MathUtils.lerp(transition.current, target, delta * 2.0);
    const t = transition.current;
    
    // Rotation Logic
    let targetRot = 0;
    if (handPresent) {
      targetRot = (handX - 0.5) * Math.PI * 2.5; 
      currentRotation.current = THREE.MathUtils.lerp(currentRotation.current, targetRot, delta * 3.0);
    } else {
      currentRotation.current += delta * 0.08; 
    }
    
    const cosRot = Math.cos(currentRotation.current);
    const sinRot = Math.sin(currentRotation.current);
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < COUNT; i++) {
      if (!particles[i]) continue;
      const p = particles[i];
      const { scaleDims } = p;

      // 1. Idle Animation
      let swayX = 0, swayZ = 0;
      if (p.type !== 'trunk') {
         const wind = Math.sin(time * 1.0 + p.initialPos[1] * 0.4) * 0.06;
         const heightFactor = Math.max(0, p.initialPos[1] + 6) / 14; 
         swayX = wind * heightFactor;
         swayZ = Math.cos(time * 0.6 + p.initialPos[1]) * 0.02 * heightFactor;
      }

      const treeX = p.initialPos[0] + swayX;
      const treeY = p.initialPos[1];
      const treeZ = p.initialPos[2] + swayZ;

      // 2. Rotation
      const rotX = treeX * cosRot - treeZ * sinRot;
      const rotZ = treeX * sinRot + treeZ * cosRot;

      // 3. Explosion
      const expX = p.explodePos[0];
      const expY = p.explodePos[1];
      const expZ = p.explodePos[2];
      
      tempObject.position.set(
        THREE.MathUtils.lerp(rotX, expX, t),
        THREE.MathUtils.lerp(treeY, expY, t),
        THREE.MathUtils.lerp(rotZ, expZ, t)
      );

      // 4. Scaling
      let s = p.scale;
      // Pulse glow
      if (p.type === 'ornament') s *= (1 + Math.sin(time * 4 + p.phase) * 0.15); 
      
      const explodeScale = s * 0.2; 
      const idleScale = s;
      const currentScale = THREE.MathUtils.lerp(idleScale, explodeScale, t);
      
      tempObject.scale.set(
          currentScale * scaleDims[0], 
          currentScale * scaleDims[1], 
          currentScale * scaleDims[2]
      );
      
      tempObject.rotation.set(
          p.phase + (t * time), 
          currentRotation.current + p.phase, 
          p.phase * 0.5
      );
      
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} frustumCulled={false}>
      <sphereGeometry args={[1, 4, 4]} /> 
      <meshStandardMaterial
        color="#ffffff"
        roughness={0.3}
        metalness={0.5}
        emissive="#ffffff"
        emissiveIntensity={0.15}
      />
      <instancedBufferAttribute attach="instanceColor" args={[colorArray, 3]} />
    </instancedMesh>
  );
};