import React, { useState, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import Scene from './components/Scene';
import GestureController from './components/GestureController';

const App: React.FC = () => {
  const [isExploded, setIsExploded] = useState(false);
  const [handPresent, setHandPresent] = useState(false);
  const [handX, setHandX] = useState(0.5);
  const [started, setStarted] = useState(false);

  // Wrap in useCallback so the function reference remains stable 
  // (though GestureController now handles ref stability internally, this is best practice)
  const handleGesture = useCallback((exploded: boolean, present: boolean, x: number) => {
    setIsExploded(exploded);
    setHandPresent(present);
    setHandX(x);
  }, []);

  return (
    <div className="w-full h-screen relative bg-black font-sans overflow-hidden">
      
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ antialias: false, toneMappingExposure: 1.0 }}
          camera={{ position: [0, 2, 22], fov: 45 }}
        >
          <Suspense fallback={null}>
            <Scene isExploded={isExploded} handX={handX} handPresent={handPresent} />
          </Suspense>
        </Canvas>
        <Loader />
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-end pb-12 items-center">
        
        {/* Start / Status UI */}
        <div className="flex flex-col items-center justify-center w-full max-w-md px-4">
          {!started ? (
            <div className="pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 p-8 rounded-lg text-center shadow-[0_0_80px_rgba(255,255,255,0.1)] animate-fade-in-up">
              <p className="text-gray-300 mb-8 font-light tracking-wide text-sm leading-7">
                Interactive Holiday Installation. <br/>
                Allow camera to begin.
              </p>
              <button
                onClick={() => setStarted(true)}
                className="px-10 py-3 bg-white text-black font-semibold uppercase tracking-[0.2em] text-xs hover:bg-cyan-100 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                Start Experience
              </button>
            </div>
          ) : (
            <div className={`transition-all duration-500 ease-out transform ${handPresent ? 'opacity-100 translate-y-0' : 'opacity-60 translate-y-4'}`}>
              <div className="flex flex-col items-center">
                 <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent mb-4"></div>
                 <p className="text-white font-serif italic text-2xl tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                  {isExploded 
                    ? "Stardust Galaxy"
                    : "Frosty Wonderland"
                  }
                </p>
                <div className="flex gap-4 mt-2">
                    <span className={`text-[10px] uppercase tracking-[0.2em] transition-colors ${!isExploded ? 'text-cyan-200' : 'text-gray-500'}`}>
                        Move Hand to Rotate
                    </span>
                    <span className="text-gray-600">|</span>
                    <span className={`text-[10px] uppercase tracking-[0.2em] transition-colors ${isExploded ? 'text-cyan-200' : 'text-gray-500'}`}>
                        Open Palm to Scatter
                    </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gesture Controller */}
      {started && <GestureController onGestureChange={handleGesture} />}
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
