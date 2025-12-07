import React, { useState, Suspense, useCallback, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import Scene from './components/Scene';
import GestureController from './components/GestureController';
import treeImg from './christmas_tree.png';

const MUSIC_SRC = './music/Christmas.mp3';

const App: React.FC = () => {
  const [isExploded, setIsExploded] = useState(false);
  const [handPresent, setHandPresent] = useState(false);
  const [handX, setHandX] = useState(0.5);
  const [started, setStarted] = useState(false);
  const [musicPaused, setMusicPaused] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Wrap in useCallback so the function reference remains stable 
  // (though GestureController now handles ref stability internally, this is best practice)
  const handleGesture = useCallback((exploded: boolean, present: boolean, x: number) => {
    setIsExploded(exploded);
    setHandPresent(present);
    setHandX(x);
  }, []);

  useEffect(() => {
    const audio = new Audio(MUSIC_SRC);
    audio.loop = true;
    audio.volume = 0.7;
    audio.preload = 'auto';
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (started && !musicPaused) {
      audio.play().catch((err) => {
        console.warn('Background music could not start automatically. Click again to play.', err);
      });
    } else {
      audio.pause();
    }
  }, [started, musicPaused]);

  const handleStart = () => {
    setStarted(true);
    if (audioRef.current && !musicPaused) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        console.warn('Background music blocked by browser autoplay policy.', err);
      });
    }
  };

  const toggleMusic = () => {
    setMusicPaused((prev) => !prev);
  };

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
                onClick={handleStart}
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

      {/* Side Reference Image */}
      <div className="absolute right-4 top-4 z-20 pointer-events-none">
        <img
          src={treeImg}
          alt="Christmas tree reference"
          className="w-36 sm:w-44 md:w-56 h-auto object-cover"
        />
      </div>

      {/* Music Control */}
      {started && (
        <div className="absolute left-4 bottom-4 z-20 pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-3 bg-black/70 backdrop-blur-lg border border-white/10 rounded-full px-4 py-2 shadow-[0_0_50px_rgba(255,255,255,0.12)]">
            <div className="flex flex-col leading-tight text-white">
              <span className="text-[9px] uppercase tracking-[0.3em] text-gray-400">Now Playing</span>
              <span className="text-sm font-semibold">圣诞结 · 陈奕迅</span>
            </div>
            <button
              onClick={toggleMusic}
              className="px-3 py-1 text-[10px] uppercase tracking-[0.25em] bg-white text-black rounded-full hover:bg-cyan-100 hover:scale-105 transition-all"
            >
              {musicPaused ? 'Play' : 'Pause'}
            </button>
          </div>
        </div>
      )}

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
