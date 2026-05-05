import { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 242;

function getFrameSrc(index: number): string {
  const padded = String(index).padStart(3, "0");
  return `/bracelet-frames/frame-${padded}.jpg`;
}

export default function ScrollVideoPlayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

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
          // Draw first frame
          drawFrame(0);
        }
      };
      images.push(img);
    }

    return () => { mounted = false; };
  }, []);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imagesRef.current[index];
    if (!canvas || !ctx || !img) return;
    canvas.width = 720;
    canvas.height = 720;
    ctx.drawImage(img, 0, 0, 720, 720);
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

        // Remap so frame 60 (logo facing user) lands at progress=0.5 (center of viewport)
        // Animation plays from frame 60+121=181 down to frame 60-121=0, wrapping around
        const scrollRange = rect.height + viewH;
        const scrolled = viewH - rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / scrollRange));

        // Map progress to frame: at 0.5 we want frame 60 (logo facing)
        // Full rotation is 242 frames. Offset so center = frame 60
        const LOGO_FRAME = 60;
        const mapped = (LOGO_FRAME + Math.round((progress - 0.5) * TOTAL_FRAMES) + TOTAL_FRAMES) % TOTAL_FRAMES;
        const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, mapped));
        drawFrame(frameIndex);
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
        style={{ background: "#082b6c" }}
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
