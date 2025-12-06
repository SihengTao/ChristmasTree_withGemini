import React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Stars, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { DiamondTree } from './DiamondTree';
import * as THREE from 'three';

interface SceneProps {
  isExploded: boolean;
  handX: number; // 0 to 1
  handPresent: boolean;
}

const Scene: React.FC<SceneProps> = ({ isExploded, handX, handPresent }) => {
  const { camera } = useThree();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const t = isExploded ? 1 : 0;
    
    // Cinematic camera drift
    const targetZ = 24 + (t * 12);
    const targetY = 1 + (t * 4);
    
    camera.position.x = Math.sin(time * 0.05) * 4; 
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.04);
    
    camera.lookAt(0, 0, 0); 
  });

  return (
    <>
      <color attach="background" args={['#02040a']} />
      <fog attach="fog" args={['#02040a', 15, 60]} />

      {/* Brighter ambient to show blue needles */}
      <ambientLight intensity={0.5} />
      
      {/* Main White Light (Moonlight) */}
      <pointLight position={[-10, 20, 10]} intensity={4} color="#ffffff" distance={50} decay={2} />
      
      {/* Warm fill for ornaments */}
      <pointLight position={[5, 5, 5]} intensity={2} color="#fff8e1" distance={30} decay={2} />
      
      {/* Backlight for silhouette */}
      <spotLight position={[0, 10, -15]} angle={0.8} intensity={8} color="#aaddff" />

      <Environment preset="city" blur={0.8} />

      <group position={[0, -2, 0]}>
        <DiamondTree isExploded={isExploded} handX={handX} handPresent={handPresent} />
      </group>

      <Stars radius={100} depth={80} count={9000} factor={5} saturation={0} fade speed={0.2} />
      
      <Sparkles count={300} scale={15} size={3} speed={0.2} opacity={0.6} color="#e0f7fa" />
      <Sparkles count={500} scale={30} size={5} speed={0.1} opacity={0.3} color="#ffffff" position={[0, 0, -10]} />

      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.65} mipmapBlur intensity={0.5} radius={0.5} />
        <Vignette eskil={false} offset={0.1} darkness={0.6} />
      </EffectComposer>
    </>
  );
};

export default Scene;