import React, { useEffect, useRef, useState } from 'react';

interface ReactiveLogoProps {
  size?: number;
  theme?: 'neon' | 'minimal';
}

export const ReactiveLogo: React.FC<ReactiveLogoProps> = ({ size = 36, theme = 'neon' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ rotX: 0, rotY: 0, pupilX: 0, pupilY: 0, intensity: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const maxDistance = 600;
      const dist = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), maxDistance);
      const angle = Math.atan2(deltaY, deltaX);

      const pull = dist / maxDistance;
      const pupilX = Math.cos(angle) * pull * 5;
      const pupilY = Math.sin(angle) * pull * 5;

      const rotY = Math.max(-25, Math.min(25, (deltaX / window.innerWidth) * 40));
      const rotX = Math.max(-25, Math.min(25, -(deltaY / window.innerHeight) * 40));

      setCoords({ rotX, rotY, pupilX, pupilY, intensity: pull });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const isNeon = theme === 'neon';
  const glowIntensity = 0.3 + coords.intensity * 0.7;

  return (
    <div
      ref={containerRef}
      style={{
        width: size,
        height: size,
        perspective: '800px',
      }}
      className="relative flex items-center justify-center cursor-pointer select-none group"
    >
      {/* Ambient Outer Glow */}
      <div
        className="absolute inset-[-6px] rounded-2xl pointer-events-none"
        style={{
          background: isNeon
            ? `radial-gradient(circle, rgba(0,240,255,${glowIntensity * 0.25}) 0%, rgba(99,102,241,${glowIntensity * 0.15}) 50%, transparent 75%)`
            : `radial-gradient(circle, rgba(200,200,220,${glowIntensity * 0.15}) 0%, transparent 60%)`,
          transition: 'all 0.15s ease-out',
        }}
      />

      {/* 3D Rotating Lens Body */}
      <div
        style={{
          transform: `rotateX(${coords.rotX}deg) rotateY(${coords.rotY}deg) scale(${1 + coords.intensity * 0.04})`,
          transition: 'transform 0.1s cubic-bezier(0.2, 0.8, 0.4, 1)',
        }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Outer Ring — Gradient Border */}
        <div
          className={`absolute inset-0 rounded-xl ${
            isNeon
              ? 'bg-gradient-to-br from-[#6366f1] via-[#00f0ff] to-[#f72585]'
              : 'bg-gradient-to-br from-white/30 via-slate-500 to-white/10'
          }`}
          style={{
            padding: '1.5px',
          }}
        >
          <div className="w-full h-full bg-[#050810] rounded-[10px]" />
        </div>

        {/* Inner Body */}
        <div className="absolute inset-[1.5px] bg-[#050810] rounded-[10px] overflow-hidden flex items-center justify-center">
          {/* Pulsing Concentric Rings */}
          <div
            className={`absolute w-[85%] h-[85%] rounded-full border ${
              isNeon ? 'border-accent-cyan/20' : 'border-white/10'
            }`}
            style={{
              animation: 'logoPulseRing 3s ease-in-out infinite',
            }}
          />
          <div
            className={`absolute w-[65%] h-[65%] rounded-full border border-dashed ${
              isNeon ? 'border-[#6366f1]/30' : 'border-white/15'
            }`}
            style={{
              animation: 'logoSpinRing 12s linear infinite',
            }}
          />
          <div
            className={`absolute w-[45%] h-[45%] rounded-full border ${
              isNeon ? 'border-accent-neon/15' : 'border-white/8'
            }`}
            style={{
              animation: 'logoPulseRing 2.5s ease-in-out infinite reverse',
            }}
          />

          {/* Tracking Iris — Gradient Glow */}
          <div
            className={`absolute w-4 h-4 rounded-full ${
              isNeon
                ? 'bg-gradient-to-br from-[#00f0ff]/30 to-[#6366f1]/20'
                : 'bg-white/10'
            }`}
            style={{
              transform: `translate(${coords.pupilX * 0.6}px, ${coords.pupilY * 0.6}px)`,
              transition: 'transform 0.08s ease-out',
              filter: isNeon ? `blur(3px)` : 'blur(2px)',
            }}
          />

          {/* Core Pupil — Mouse Tracking */}
          <div
            className={`relative w-3 h-3 rounded-full flex items-center justify-center ${
              isNeon
                ? 'bg-gradient-to-br from-[#00f5d4] to-[#00f0ff]'
                : 'bg-slate-200'
            }`}
            style={{
              transform: `translate(${coords.pupilX}px, ${coords.pupilY}px)`,
              transition: 'transform 0.06s ease-out',
              boxShadow: isNeon
                ? `0 0 ${8 + coords.intensity * 12}px rgba(0,245,212,${0.5 + coords.intensity * 0.5}), 0 0 ${16 + coords.intensity * 20}px rgba(0,240,255,${0.3 + coords.intensity * 0.3})`
                : `0 0 6px rgba(200,200,220,0.4)`,
            }}
          >
            {/* Glint — Specular Highlight */}
            <div className="w-1.5 h-1.5 rounded-full bg-white" style={{
              animation: 'logoGlint 2s ease-in-out infinite',
            }} />
          </div>

          {/* Counter-Tracking Lens Reflection */}
          <div
            style={{
              transform: `translate(${-coords.pupilX * 0.7}px, ${-coords.pupilY * 0.7}px)`,
              transition: 'transform 0.1s ease-out',
            }}
            className="absolute -top-0.5 -right-0.5 w-3 h-2 rounded-full bg-white/15 blur-[2px] pointer-events-none"
          />

          {/* Bottom-left subtle reflection */}
          <div
            style={{
              transform: `translate(${-coords.pupilX * 0.3}px, ${-coords.pupilY * 0.3}px)`,
            }}
            className="absolute bottom-0 left-0.5 w-2 h-1.5 rounded-full bg-white/8 blur-[1px] pointer-events-none"
          />
        </div>
      </div>

      {/* Keyframe Animations (injected inline) */}
      <style>{`
        @keyframes logoPulseRing {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.08); }
        }
        @keyframes logoSpinRing {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes logoGlint {
          0%, 100% { opacity: 0.7; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};
