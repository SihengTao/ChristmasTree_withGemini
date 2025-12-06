import React, { useEffect, useRef } from 'react';

interface GestureControllerProps {
  onGestureChange: (isExploded: boolean, handPresent: boolean, handX: number) => void;
}

const GestureController: React.FC<GestureControllerProps> = ({ onGestureChange }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraRef = useRef<any>(null);
  const handsRef = useRef<any>(null);
  
  // Use a ref for the callback to prevent the useEffect from re-running when parent state changes
  const onGestureChangeRef = useRef(onGestureChange);
  
  // State refs for the internal loop logic
  const isExplodedRef = useRef(false);
  const smoothedHandX = useRef(0.5);

  // Update the ref whenever the prop changes
  useEffect(() => {
    onGestureChangeRef.current = onGestureChange;
  }, [onGestureChange]);

  useEffect(() => {
    if (!window.Hands || !window.Camera || !videoRef.current) {
      console.warn("MediaPipe modules not loaded yet.");
      return;
    }

    const hands = new window.Hands({
      locateFile: (file: string) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((results: any) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        
        // 0: Wrist, 9: Middle MCP, 12: Middle Tip
        const wrist = landmarks[0];
        const middleMcp = landmarks[9];
        const middleTip = landmarks[12];

        // Gesture Detection Logic (Open Palm vs Closed)
        const palmSize = Math.sqrt(
          Math.pow(middleMcp.x - wrist.x, 2) +
          Math.pow(middleMcp.y - wrist.y, 2) +
          Math.pow(middleMcp.z - wrist.z, 2)
        );

        const fingerExtension = Math.sqrt(
          Math.pow(middleTip.x - wrist.x, 2) +
          Math.pow(middleTip.y - wrist.y, 2) +
          Math.pow(middleTip.z - wrist.z, 2)
        );

        const ratio = fingerExtension / palmSize;
        
        // Hysteresis / Thresholds
        // Harder to open (higher threshold), harder to close (lower threshold)
        // This prevents flickering when hand is "in between"
        const OPEN_THRESHOLD = 1.6;
        const CLOSE_THRESHOLD = 1.3;

        if (!isExplodedRef.current && ratio > OPEN_THRESHOLD) {
          isExplodedRef.current = true;
        } else if (isExplodedRef.current && ratio < CLOSE_THRESHOLD) {
          isExplodedRef.current = false;
        }

        // Rotation Control Calculation
        // MediaPipe x is 0..1. 
        // Mirroring logic: 
        // If I move my hand to the right of the screen, I want value -> 1.
        // Camera feed is mirrored via CSS scale-x-100.
        // Raw MediaPipe data corresponds to the un-mirrored image.
        // If I move right, raw x (wrist.x) decreases (goes towards 0).
        // So handX = 1 - wrist.x gives us 0 (left) to 1 (right) on screen.
        const rawHandX = 1 - wrist.x;
        
        // Smooth the input to prevent jitters
        const alpha = 0.15; // smoothing factor
        smoothedHandX.current = THREE.MathUtils.lerp(smoothedHandX.current, rawHandX, alpha);

        // Call the latest callback
        onGestureChangeRef.current(isExplodedRef.current, true, smoothedHandX.current);
      } else {
        // No hand detected
        // We keep the last known 'isExploded' state usually, or reset?
        // Let's reset rotation control but keep explosion state to avoid sudden collapses
        // actually, let's inform parent hand is missing
        onGestureChangeRef.current(isExplodedRef.current, false, smoothedHandX.current);
      }
    });

    handsRef.current = hands;

    const camera = new window.Camera(videoRef.current, {
      onFrame: async () => {
        if (handsRef.current && videoRef.current) {
          await handsRef.current.send({ image: videoRef.current });
        }
      },
      width: 640,
      height: 480,
    });

    camera.start();
    cameraRef.current = camera;

    return () => {
      // Cleanup only on unmount
      if (cameraRef.current) cameraRef.current.stop();
      if (handsRef.current) handsRef.current.close();
    };
  }, []); // Empty dependency array ensures this runs ONCE.

  return (
    <div className="fixed bottom-4 right-4 w-48 h-36 rounded-lg overflow-hidden border-2 border-white/20 z-50 opacity-60 hover:opacity-100 transition-opacity bg-black shadow-lg">
      <video
        ref={videoRef}
        className="w-full h-full object-cover transform -scale-x-100"
        playsInline
        muted
      />
    </div>
  );
};

import * as THREE from 'three'; // Needed for MathUtils inside the effect
export default GestureController;
