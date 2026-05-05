import { ReactNode } from "react";
import { motion } from "framer-motion";

interface IPhoneMockupProps {
  children: ReactNode;
  className?: string;
  float?: boolean;
  scale?: number;
}

export default function IPhoneMockup({ children, className = "", float = true, scale = 1 }: IPhoneMockupProps) {
  const frameW = 320 * scale;
  const frameH = 660 * scale;
  const borderRadius = 56 * scale;
  const innerRadius = 44 * scale;
  const frameX = 12 * scale;
  const frameY = 14 * scale;

  const Wrapper = float ? motion.div : ("div" as any);
  const floatProps = float
    ? {
        animate: { y: [0, -4, 0] },
        transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
      }
    : {};

  return (
    <Wrapper
      className={`relative ${className}`}
      style={{
        width: frameW,
        height: frameH,
        perspective: 1200,
      }}
      {...floatProps}
    >
      {/* Phone frame */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(145deg, #1A1D24, #2A2D34, #1A1D24)",
          borderRadius,
          boxShadow: `
            0 24px 48px rgba(0,0,0,0.4),
            0 0 0 1px rgba(255,255,255,0.08),
            inset 0 1px 0 rgba(255,255,255,0.06)
          `,
          transform: "rotateY(-2deg)",
        }}
      >
        {/* Left side buttons */}
        {/* Action button */}
        <div
          className="absolute"
          style={{
            left: -2 * scale,
            top: 120 * scale,
            width: 3 * scale,
            height: 28 * scale,
            background: "linear-gradient(180deg, #2A2D34, #1A1D24)",
            borderRadius: `${2 * scale}px 0 0 ${2 * scale}px`,
          }}
        />
        {/* Volume up */}
        <div
          className="absolute"
          style={{
            left: -2 * scale,
            top: 170 * scale,
            width: 3 * scale,
            height: 44 * scale,
            background: "linear-gradient(180deg, #2A2D34, #1A1D24)",
            borderRadius: `${2 * scale}px 0 0 ${2 * scale}px`,
          }}
        />
        {/* Volume down */}
        <div
          className="absolute"
          style={{
            left: -2 * scale,
            top: 224 * scale,
            width: 3 * scale,
            height: 44 * scale,
            background: "linear-gradient(180deg, #2A2D34, #1A1D24)",
            borderRadius: `${2 * scale}px 0 0 ${2 * scale}px`,
          }}
        />
        {/* Power button */}
        <div
          className="absolute"
          style={{
            right: -2 * scale,
            top: 180 * scale,
            width: 3 * scale,
            height: 64 * scale,
            background: "linear-gradient(180deg, #2A2D34, #1A1D24)",
            borderRadius: `0 ${2 * scale}px ${2 * scale}px 0`,
          }}
        />

        {/* Inner bezel */}
        <div
          className="absolute"
          style={{
            left: frameX - 1,
            top: frameY - 1,
            right: frameX - 1,
            bottom: frameY - 1,
            borderRadius: innerRadius + 1,
            border: "1px solid #444",
          }}
        />

        {/* Screen */}
        <div
          className="absolute overflow-hidden"
          style={{
            left: frameX,
            top: frameY,
            right: frameX,
            bottom: frameY,
            borderRadius: innerRadius,
            background: "linear-gradient(180deg, #0A1C3A, #14225C)",
          }}
        >
          {/* Dynamic Island */}
          <div
            className="absolute z-20"
            style={{
              top: 12 * scale,
              left: "50%",
              transform: "translateX(-50%)",
              width: 120 * scale,
              height: 32 * scale,
              background: "#000",
              borderRadius: 16 * scale,
            }}
          />

          {/* Screen content */}
          <div className="relative w-full h-full overflow-y-auto overflow-x-hidden" style={{ fontSize: `${scale * 100}%` }}>
            {children}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
