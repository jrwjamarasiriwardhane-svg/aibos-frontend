import { useEffect, useRef } from "react";
import { ShieldCheck, Zap, Radio, MapPin, CheckCircle2 } from "lucide-react";

export default function WorkerNetworkGlobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 460);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 460);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || 460;
      height = canvas.height = canvas.parentElement.clientHeight || 460;
    };
    window.addEventListener("resize", handleResize);

    // Globe coordinates and worker nodes
    const globeRadius = Math.min(width, height) * 0.38;
    let rotationAngle = 0;

    // Fixed realistic network sample nodes
    const workerPoints: { phi: number; theta: number; role: string; city: string; status: "available" | "en-route" | "matched"; color: string }[] = [
      { phi: 0.35, theta: 0.8, role: "Electrician", city: "Mumbai", status: "available", color: "#38bdf8" },
      { phi: 0.45, theta: 1.1, role: "HVAC Specialist", city: "Delhi", status: "en-route", color: "#06b6d4" },
      { phi: 0.6, theta: 0.5, role: "Master Plumber", city: "Bangalore", status: "available", color: "#10b981" },
      { phi: 0.25, theta: 2.3, role: "Carpenter", city: "Dubai", status: "available", color: "#818cf8" },
      { phi: -0.3, theta: 1.6, role: "Emergency Repair", city: "Singapore", status: "matched", color: "#f59e0b" },
      { phi: -0.4, theta: 0.9, role: "Precision Painter", city: "Colombo", status: "available", color: "#34d399" },
      { phi: 0.1, theta: 2.8, role: "Appliance Tech", city: "London", status: "available", color: "#60a5fa" },
      { phi: -0.2, theta: 3.4, role: "Solar Electrician", city: "Frankfurt", status: "en-route", color: "#06b6d4" },
    ];

    // Background constellation particles around the globe
    const particles: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.2 + 0.05,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    let pulseTimer = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      rotationAngle += 0.004;
      pulseTimer += 0.03;

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw background cosmic dust particles
      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < 0) p.y = height;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 163, 184, ${p.opacity * 0.4})`;
        ctx.fill();
      });

      // Globe ambient backdrop aura
      const auraGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        globeRadius * 0.2,
        centerX,
        centerY,
        globeRadius * 1.3
      );
      auraGradient.addColorStop(0, "rgba(30, 58, 138, 0.25)");
      auraGradient.addColorStop(0.6, "rgba(6, 182, 212, 0.08)");
      auraGradient.addColorStop(1, "rgba(15, 23, 42, 0)");

      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius * 1.25, 0, Math.PI * 2);
      ctx.fillStyle = auraGradient;
      ctx.fill();

      // Outer radar scanning ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius * 1.08, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.15)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Rotating latitude rings
      for (let lat = -60; lat <= 60; lat += 30) {
        const radLat = (lat * Math.PI) / 180;
        const r = globeRadius * Math.cos(radLat);
        const yOffset = globeRadius * Math.sin(radLat);

        ctx.beginPath();
        ctx.ellipse(centerX, centerY + yOffset, r, r * 0.32, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(59, 130, 246, 0.12)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Rotating longitude meridians
      for (let lon = 0; lon < 6; lon++) {
        const angle = (lon * Math.PI) / 3 + rotationAngle;
        ctx.beginPath();
        const rx = Math.abs(Math.sin(angle) * globeRadius);
        ctx.ellipse(centerX, centerY, rx, globeRadius, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(6, 182, 212, 0.12)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Projected node points
      const projectedNodes: {
        x: number;
        y: number;
        z: number;
        visible: boolean;
        role: string;
        city: string;
        status: string;
        color: string;
      }[] = [];

      workerPoints.forEach((pt) => {
        const curTheta = pt.theta + rotationAngle;
        const x = globeRadius * Math.cos(pt.phi) * Math.sin(curTheta);
        const y = -globeRadius * Math.sin(pt.phi);
        const z = globeRadius * Math.cos(pt.phi) * Math.cos(curTheta);

        const screenX = centerX + x;
        const screenY = centerY + y;
        const visible = z > -globeRadius * 0.2;

        projectedNodes.push({
          x: screenX,
          y: screenY,
          z,
          visible,
          role: pt.role,
          city: pt.city,
          status: pt.status,
          color: pt.color,
        });
      });

      // Draw connection arcs between visible nearby nodes
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const a = projectedNodes[i];
          const b = projectedNodes[j];
          if (a.visible && b.visible) {
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            if (dist < globeRadius * 1.1) {
              const alpha = (1 - dist / (globeRadius * 1.1)) * 0.35;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              // Slight arc curve
              const midX = (a.x + b.x) / 2 + (centerY - (a.y + b.y) / 2) * 0.15;
              const midY = (a.y + b.y) / 2 - 15;
              ctx.quadraticCurveTo(midX, midY, b.x, b.y);
              ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
      }

      // Draw active nodes with pulsing rings
      projectedNodes.forEach((node) => {
        if (!node.visible) return;

        const depthScale = Math.max(0.4, (node.z + globeRadius) / (2 * globeRadius));
        const pulse = Math.sin(pulseTimer + node.x * 0.05) * 3;

        // Outer pulse glow ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, (8 + pulse) * depthScale, 0, Math.PI * 2);
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = 0.5 * depthScale;
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Core solid dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4 * depthScale, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center justify-center select-none">
      {/* HUD Decorative Outer Corner Brackets */}
      <div className="pointer-events-none absolute -inset-3 rounded-3xl border border-cyan-500/20 bg-slate-950/40 backdrop-blur-md shadow-2xl">
        <div className="absolute -top-1 -left-1 h-3 w-3 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute -top-1 -right-1 h-3 w-3 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-cyan-400" />
      </div>

      {/* Top HUD Telemetry Status Header */}
      <div className="relative z-10 w-full flex items-center justify-between px-5 pt-4 pb-2 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-300 font-bold">
            Live Worker Mesh
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[10px] text-cyan-400/90 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
          <Radio size={12} className="animate-pulse text-cyan-400" />
          <span>AUTONOMOUS DISPATCH</span>
        </div>
      </div>

      {/* Canvas Visualization Area */}
      <div className="relative w-full h-[340px] sm:h-[380px] flex items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Real-time Match Telemetry Floating Badge */}
        <div className="absolute bottom-3 left-4 right-4 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 backdrop-blur-xl shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Zap size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">Live AI Dispatch</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Matching verified skills by GPS proximity
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-xl">
            <ShieldCheck size={13} />
            <span>Verified</span>
          </div>
        </div>
      </div>

      {/* Bottom Live Capability Indicators (Honest qualitative value props, no fake counts) */}
      <div className="relative z-10 w-full grid grid-cols-3 gap-2 px-4 py-3 border-t border-slate-800/80 bg-slate-950/60 rounded-b-2xl text-center">
        <div className="px-1 py-1">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Matching Mode</p>
          <p className="text-xs font-bold text-cyan-300 mt-0.5 flex items-center justify-center gap-1">
            <Zap size={12} /> AI Proximity
          </p>
        </div>
        <div className="px-1 py-1 border-x border-slate-800">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Specialists</p>
          <p className="text-xs font-bold text-emerald-300 mt-0.5 flex items-center justify-center gap-1">
            <CheckCircle2 size={12} /> Verified ID
          </p>
        </div>
        <div className="px-1 py-1">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Availability</p>
          <p className="text-xs font-bold text-blue-300 mt-0.5 flex items-center justify-center gap-1">
            <MapPin size={12} /> Live On-Demand
          </p>
        </div>
      </div>
    </div>
  );
}
