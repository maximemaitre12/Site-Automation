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
          drawFrame(INITIAL_FRAME);
        }
      };
      images.push(img);
    }

    return () => { mounted = false; };
  }, []);

  const drawFrame = (frameNumber: number) => {
    if (frameNumber === lastFrameRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imagesRef.current[FRAME_NUMBERS.indexOf(frameNumber)];
    if (!canvas || !ctx || !img) return;
    canvas.width = 720;
    canvas.height = 720;
    ctx.drawImage(img, 0, 0, 720, 720);
    lastFrameRef.current = frameNumber;
  };

  // Scroll-driven frame selection
  useEffect(() => {
    if (!loaded) return;

    let rafId: number;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const viewH = window.innerHeight;

        // Only track the pinned part of the section.
        // progress 0 = sticky section arrives, 0.5 = section centered, 1 = sticky section ends.
        const stickyTravel = Math.max(1, rect.height - viewH);
        const progress = Math.max(0, Math.min(1, -rect.top / stickyTravel));

        const logoIndex = FRAME_NUMBERS.indexOf(LOGO_FRAME);
        const centeredOffset = logoIndex - Math.round(TOTAL_FRAMES * 0.5);
        const rawIndex = Math.round(progress * TOTAL_FRAMES) + centeredOffset;
        const frameIndex = ((rawIndex % TOTAL_FRAMES) + TOTAL_FRAMES) % TOTAL_FRAMES;
        drawFrame(FRAME_NUMBERS[frameIndex]);
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
    <div ref={containerRef} className="relative" style={{ height: "300vh" }}>
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
