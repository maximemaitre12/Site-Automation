import { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 242;
const LOGO_FRAME = 55; // Frame where logo faces user

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

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameSrc(i);
      img.onload = () => {
        count++;
        if (count === TOTAL_FRAMES && mounted) {
          imagesRef.current = images;
          setLoaded(true);
          drawFrame(LOGO_FRAME);
        }
      };
      images.push(img);
    }

    return () => { mounted = false; };
  }, []);

  const drawFrame = (index: number) => {
    if (index === lastFrameRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imagesRef.current[index];
    if (!canvas || !ctx || !img) return;
    canvas.width = 720;
    canvas.height = 720;
    ctx.drawImage(img, 0, 0, 720, 720);
    lastFrameRef.current = index;
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

        // progress 0 = section just entering viewport from bottom
        // progress 0.5 = section perfectly centered
        // progress 1 = section leaving viewport at top
        const scrollRange = rect.height + viewH;
        const scrolled = viewH - rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / scrollRange));

        // At progress 0.5, show LOGO_FRAME (55)
        // Full scroll maps to one full rotation (242 frames)
        // offset so that progress=0.5 → frame 55
        const centerOffset = LOGO_FRAME - Math.floor(TOTAL_FRAMES * 0.5);
        const rawFrame = Math.floor(progress * TOTAL_FRAMES) + centerOffset;
        const frameIndex = ((rawFrame % TOTAL_FRAMES) + TOTAL_FRAMES) % TOTAL_FRAMES;
        drawFrame(Math.min(frameIndex, TOTAL_FRAMES - 1));
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
