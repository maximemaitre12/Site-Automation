import { Home, GitMerge, MessageCircle, User, Bell, Wifi, Battery, Signal, Activity, Waves, Zap, Moon } from "lucide-react";
import { motion } from "framer-motion";

export default function AetherAppHomeScreen() {
  return (
    <div className="flex flex-col h-full" style={{ background: "linear-gradient(180deg, #0A1C3A, #14225C)", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Status bar */}
      <div className="flex items-center justify-between px-6 pt-14 pb-1" style={{ height: 50 }}>
        <span className="text-white font-semibold" style={{ fontSize: 14 }}>9:41</span>
        <div className="flex items-center gap-1">
          <Signal className="text-white" style={{ width: 14, height: 14 }} />
          <Wifi className="text-white" style={{ width: 14, height: 14 }} />
          <Battery className="text-white" style={{ width: 18, height: 14 }} />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center justify-center rounded-full" style={{ width: 32, height: 32, background: "linear-gradient(135deg, #0EA5E9, #1A3FB8)" }}>
          <span className="text-white font-bold" style={{ fontSize: 14 }}>Y</span>
        </div>
        <div className="relative">
          <Bell className="text-white/80" style={{ width: 20, height: 20 }} />
          <div className="absolute -top-0.5 -right-0.5 rounded-full" style={{ width: 6, height: 6, background: "#0EA5E9" }} />
        </div>
      </div>

      {/* Greeting */}
      <div className="px-5 pt-1 pb-3">
        <p className="text-white font-semibold" style={{ fontSize: 20 }}>Good morning Alex</p>
        <p className="text-white/60 mt-0.5" style={{ fontSize: 12 }}>You seem calm this morning.</p>
        <div className="flex items-center gap-1 mt-1">
          <motion.div
            className="rounded-full"
            style={{ width: 5, height: 5, background: "#0EA5E9" }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-white/50" style={{ fontSize: 11 }}>High HRV, energy restored.</span>
        </div>
      </div>

      {/* Tap Hero */}
      <div className="flex flex-col items-center py-4">
        <div className="relative flex items-center justify-center" style={{ width: 130, height: 130 }}>
          {[0.3, 0.2, 0.1, 0.05].map((op, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 130 - i * 22,
                height: 130 - i * 22,
                border: `1px solid rgba(14,165,233,${op})`,
              }}
            />
          ))}
          <div className="absolute rounded-full" style={{ width: 60, height: 60, background: "radial-gradient(circle, rgba(14,165,233,0.5), rgba(14,165,233,0) 70%)" }} />
          <motion.div
            className="rounded-full"
            style={{ width: 8, height: 8, background: "#0EA5E9" }}
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <p className="mt-2 uppercase tracking-widest" style={{ fontSize: 8, color: "#0EA5E9" }}>READY TO START</p>
        <p className="text-white font-semibold mt-0.5" style={{ fontSize: 15 }}>Tap for your Moment</p>
        <p className="text-white/40 mt-0.5" style={{ fontSize: 10 }}>Bring your bracelet close to the phone</p>
      </div>

      {/* Biometric row */}
      <div className="px-4 pt-2">
        <p className="uppercase tracking-widest mb-2 px-1" style={{ fontSize: 8, color: "#0EA5E9" }}>TODAY</p>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { icon: Activity, label: "HRV", val: "68", unit: "ms" },
            { icon: Waves, label: "Stress", val: "Low", unit: "22%" },
            { icon: Zap, label: "Energy", val: "92%", unit: "" },
            { icon: Moon, label: "Sleep", val: "7h42", unit: "" },
          ].map((m) => (
            <div
              key={m.label}
              className="flex flex-col items-center py-2 rounded-lg"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <m.icon style={{ width: 12, height: 12, color: "#0EA5E9" }} />
              <span className="text-white font-bold mt-1" style={{ fontSize: 13 }}>{m.val}</span>
              <span className="text-white/40" style={{ fontSize: 8 }}>{m.unit || m.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Aether Coach card */}
      <div className="px-4 pt-3">
        <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(14,165,233,0.2)" }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center justify-center rounded" style={{ width: 14, height: 14, background: "rgba(14,165,233,0.2)" }}>
              <span style={{ fontSize: 7, color: "#0EA5E9", fontWeight: 800 }}>AE</span>
            </div>
            <span className="uppercase tracking-wider" style={{ fontSize: 8, color: "#0EA5E9" }}>AETHER COACH</span>
            <motion.div
              className="rounded-full"
              style={{ width: 4, height: 4, background: "#0EA5E9" }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <p className="text-white font-medium" style={{ fontSize: 12 }}>You have 23% more energy than yesterday.</p>
          <p className="text-white/60 mt-0.5" style={{ fontSize: 10 }}>Now is the perfect time for your focus session.</p>
          <div className="flex gap-2 mt-2">
            <button className="px-3 py-1 rounded-full text-white font-medium" style={{ fontSize: 9, background: "#0EA5E9" }}>YES, START</button>
            <button className="px-3 py-1 rounded-full text-white/60" style={{ fontSize: 9, border: "1px solid rgba(255,255,255,0.15)" }}>LATER</button>
          </div>
        </div>
      </div>

      {/* Recent Moments */}
      <div className="px-4 pt-3 pb-4">
        <p className="uppercase tracking-widest mb-2 px-1" style={{ fontSize: 8, color: "#0EA5E9" }}>RECENT MOMENTS</p>
        {[
          { title: "Wake up", sub: "HRV 68 · Energy restored", time: "8:42" },
          { title: "Sleep preparation", sub: "Low stress · Lights dimmed", time: "22:15 Yesterday" },
          { title: "Post-work decompression", sub: "High stress · 4-7-8 breathing", time: "18:30 Yesterday" },
        ].map((m) => (
          <div
            key={m.title}
            className="flex items-center gap-2.5 p-2.5 rounded-lg mb-1.5"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="rounded-full flex-shrink-0" style={{ width: 6, height: 6, background: "#0EA5E9" }} />
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate" style={{ fontSize: 11 }}>{m.title}</p>
              <p className="text-white/50 truncate" style={{ fontSize: 9 }}>{m.sub}</p>
            </div>
            <span className="text-white/30 flex-shrink-0" style={{ fontSize: 9 }}>{m.time}</span>
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <div
        className="flex-shrink-0 flex items-center justify-around mt-auto"
        style={{ height: 60, background: "rgba(10,28,58,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        {[
          { icon: Home, label: "Home", active: true },
          { icon: GitMerge, label: "Flows", active: false },
          { icon: MessageCircle, label: "Coach", active: false },
          { icon: User, label: "Profile", active: false },
        ].map((t) => (
          <div key={t.label} className="flex flex-col items-center gap-0.5 relative">
            <t.icon style={{ width: 18, height: 18, color: t.active ? "#0EA5E9" : "rgba(255,255,255,0.35)" }} />
            <span style={{ fontSize: 8, color: t.active ? "#0EA5E9" : "rgba(255,255,255,0.35)" }}>{t.label}</span>
            {t.active && (
              <motion.div
                className="absolute -bottom-1 rounded-full"
                style={{ width: 4, height: 4, background: "#0EA5E9" }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
