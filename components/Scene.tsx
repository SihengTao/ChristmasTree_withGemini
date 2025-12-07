import React, { useRef } from 'react';
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
  const backgroundRef = useRef<THREE.Group>(null);
  const parallaxRef = useRef({ x: 0, tilt: 0 });
  const parallaxX = useRef(0);
  const parallaxTilt = useRef(0);
  
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

    // Background parallax when the palm is open
    const targetParallax = handPresent && isExploded ? (handX - 0.5) * 4 * 1.3 : 0;
    const targetTilt = handPresent && isExploded ? (handX - 0.5) * 0.25 * 1.3 : 0;
    parallaxX.current = THREE.MathUtils.lerp(parallaxX.current, targetParallax, 0.02);
    parallaxTilt.current = THREE.MathUtils.lerp(parallaxTilt.current, targetTilt, 0.02);

    parallaxRef.current.x = parallaxX.current;
    parallaxRef.current.tilt = parallaxTilt.current;

    if (backgroundRef.current) {
      backgroundRef.current.position.x = parallaxX.current;
      backgroundRef.current.rotation.y = parallaxTilt.current;
    }
  });

  return (
    <>
      <color attach="background" args={['#02040a']} />
      <fog attach="fog" args={['#02040a', 15, 60]} />

      {/* Brighter ambient to show blue needles */}
      <ambientLight intensity={2.5} />
      
      {/* Main White Light (Moonlight) */}
      <pointLight position={[-10, 20, 10]} intensity={4} color="#ffffff" distance={50} decay={2} />
      
      {/* Warm fill for ornaments */}
      <pointLight position={[5, 5, 5]} intensity={2} color="#fff8e1" distance={30} decay={2} />
      
      {/* Backlight for silhouette */}
      <spotLight position={[0, 10, -15]} angle={0.8} intensity={8} color="#aaddff" />
      
      <Environment preset="city" blur={0.8} />

      <group position={[0, -3, 0]}>
        <DiamondTree
          isExploded={isExploded}
          handX={handX}
          handPresent={handPresent}
          parallaxRef={parallaxRef}
        />
      </group>

      <group ref={backgroundRef}>
        <Stars radius={100} depth={80} count={9000} factor={5} saturation={0} fade speed={0.2} />
        
        <Sparkles count={300} scale={15} size={3} speed={0.2} opacity={0.6} color="#e0f7fa" />
        <Sparkles count={500} scale={30} size={5} speed={0.1} opacity={0.3} color="#ffffff" position={[0, 0, -10]} />
      </group>

      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.65} mipmapBlur intensity={0.5} radius={0.5} />
        <Vignette eskil={false} offset={0.1} darkness={0.6} />
      </EffectComposer>
    </>
  );
};

export default Scene;
