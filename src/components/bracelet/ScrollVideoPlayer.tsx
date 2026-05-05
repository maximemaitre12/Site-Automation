import { useEffect, useRef, useState } from "react";

const FRAME_NUMBERS = [
  ...Array.from({ length: 242 }, (_, index) => index + 1),
  ...Array.from({ length: 25 }, (_, index) => index + 274),
];
const TOTAL_FRAMES = FRAME_NUMBERS.length;
const LOGO_FRAME = 55; // Actual frame number where the logo faces the user
const INITIAL_FRAME = 205;

function getFrameSrc(index: number): string {
  const padded = String(index).padStart(3, "0");
  return `/bracelet-frames/frame-${padded}.jpg`;
}

export default function ScrollVideoPlayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const lastFrameRef = useRef(-1);

  // Preload all frames
  useEffect(() => {
    let mounted = true;
    const images: HTMLImageElement[] = [];
    let count = 0;

    for (const frameNumber of FRAME_NUMBERS) {
      const img = new Image();
      img.src = getFrameSrc(frameNumber);
      img.onload = () => {
        count++;
        if (count === TOTAL_FRAMES && mounted) {
          imagesRef.current = images;
          setLoaded(true);
          drawFrameByIndex(FRAME_NUMBERS.indexOf(INITIAL_FRAME));
        }
      };
      images.push(img);
    }

    return () => { mounted = false; };
  }, []);

  const drawFrameByIndex = (idx: number) => {
    if (idx === lastFrameRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imagesRef.current[idx];
    if (!canvas || !ctx || !img) return;
    if (canvas.width !== img.naturalWidth) canvas.width = img.naturalWidth;
    if (canvas.height !== img.naturalHeight) canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    lastFrameRef.current = idx;
  };

  // Scroll-driven frame selection
  useEffect(() => {
    if (!loaded) return;

    const LOGO_INDEX = FRAME_NUMBERS.indexOf(LOGO_FRAME);
    const START_INDEX = FRAME_NUMBERS.indexOf(INITIAL_FRAME);

    // Compute shortest rotation path from start to logo
    const forwardDist = ((LOGO_INDEX - START_INDEX) % TOTAL_FRAMES + TOTAL_FRAMES) % TOTAL_FRAMES;
    const backwardDist = TOTAL_FRAMES - forwardDist;
    // direction: +1 = forward, -1 = backward (whichever is shorter)
    const direction = forwardDist <= backwardDist ? 1 : -1;
    const travelFrames = Math.min(forwardDist, backwardDist);

    let rafId: number;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const viewH = window.innerHeight;

        // Start when section is half a viewport away
        const earlyStart = viewH * 0.5;
        const stickyTravel = Math.max(1, rect.height - viewH + earlyStart);
        const progress = Math.max(0, Math.min(1, (earlyStart - rect.top) / stickyTravel));

        // First 80% of scroll: rotate from back to logo. Last 20%: hold on logo.
        const rotateProgress = Math.min(1, progress / 0.8);
        const frameOffset = Math.round(rotateProgress * travelFrames) * direction;
        const frameIndex = ((START_INDEX + frameOffset) % TOTAL_FRAMES + TOTAL_FRAMES) % TOTAL_FRAMES;
        drawFrameByIndex(frameIndex);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [loaded]);

  return (
    <div ref={containerRef} className="relative" style={{ height: "125vh", background: "#0a2d6e" }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
        style={{ background: "#0a2d6e" }}
      >
        <canvas
          ref={canvasRef}
          className="w-full max-w-[600px] max-h-[80vh] object-contain"
          style={{
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.5s",
          }}
        />
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
