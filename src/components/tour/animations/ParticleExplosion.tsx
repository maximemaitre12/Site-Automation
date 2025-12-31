import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { randomInRange } from '@/lib/animation-utils';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  angle: number;
  velocity: number;
  opacity: number;
  delay: number;
}

interface ParticleExplosionProps {
  active: boolean;
  count?: number;
  colors?: string[];
  duration?: number;
  spread?: number;
  className?: string;
  originX?: number;
  originY?: number;
}

/**
 * Particle explosion effect for celebrations
 */
export function ParticleExplosion({
  active,
  count = 20,
  colors = ['#FFD700', '#FFA500', '#FF6347', '#00CED1', '#9370DB'],
  duration = 1000,
  spread = 100,
  className,
  originX = 50,
  originY = 50,
}: ParticleExplosionProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isExploding, setIsExploding] = useState(false);

  useEffect(() => {
    if (active && !isExploding) {
      setIsExploding(true);
      
      const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: originX,
        y: originY,
        size: randomInRange(4, 12),
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: randomInRange(0, 360),
        velocity: randomInRange(spread * 0.5, spread),
        opacity: 1,
        delay: randomInRange(0, 100),
      }));
      
      setParticles(newParticles);

      // Clear particles after animation
      const timeout = setTimeout(() => {
        setParticles([]);
        setIsExploding(false);
      }, duration + 200);

      return () => clearTimeout(timeout);
    }
  }, [active, count, colors, duration, spread, originX, originY, isExploding]);

  if (particles.length === 0) return null;

  return (
    <div className={cn('absolute inset-0 pointer-events-none overflow-hidden', className)}>
      {particles.map((particle) => {
        const radians = (particle.angle * Math.PI) / 180;
        const endX = particle.x + Math.cos(radians) * particle.velocity;
        const endY = particle.y + Math.sin(radians) * particle.velocity;

        return (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              transform: 'translate(-50%, -50%)',
              animation: `particleMove ${duration}ms ease-out ${particle.delay}ms forwards`,
              boxShadow: `0 0 ${particle.size}px ${particle.color}`,
              '--end-x': `${endX - particle.x}%`,
              '--end-y': `${endY - particle.y}%`,
            } as React.CSSProperties}
          />
        );
      })}

      <style>{`
        @keyframes particleMove {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
