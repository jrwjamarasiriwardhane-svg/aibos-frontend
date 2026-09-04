import { useEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  Zap,
  Radio,
  MapPin,
  CheckCircle2,
  Globe as GlobeIcon,
  RotateCw,
  Sparkles,
  Navigation,
} from "lucide-react";

export interface CountryNode {
  id: string;
  country: string;
  flag: string;
  city: string;
  lat: number;
  lng: number;
  role: string;
  status: "available" | "en-route" | "matched";
  color: string;
  rating: number;
}

// Global Country & City Network Nodes with real Lat/Lng
export const WORLD_NODES: CountryNode[] = [
  // 🇱🇰 Sri Lanka
  { id: "sl-col", country: "Sri Lanka", flag: "🇱🇰", city: "Colombo", lat: 6.9271, lng: 79.8612, role: "Precision Electrician", status: "available", color: "#38bdf8", rating: 4.9 },
  { id: "sl-kan", country: "Sri Lanka", flag: "🇱🇰", city: "Kandy", lat: 7.2906, lng: 80.6337, role: "Master Plumber", status: "available", color: "#10b981", rating: 4.8 },
  { id: "sl-gal", country: "Sri Lanka", flag: "🇱🇰", city: "Galle", lat: 6.0535, lng: 80.2210, role: "HVAC Specialist", status: "en-route", color: "#06b6d4", rating: 4.9 },
  { id: "sl-amb", country: "Sri Lanka", flag: "🇱🇰", city: "Ambalangoda", lat: 6.2361, lng: 80.0537, role: "Solar Energy Tech", status: "available", color: "#f59e0b", rating: 5.0 },

  // 🇮🇳 India
  { id: "in-mum", country: "India", flag: "🇮🇳", city: "Mumbai", lat: 19.0760, lng: 72.8777, role: "Industrial Electrician", status: "available", color: "#38bdf8", rating: 4.9 },
  { id: "in-del", country: "India", flag: "🇮🇳", city: "New Delhi", lat: 28.6139, lng: 77.2090, role: "HVAC Diagnostics", status: "en-route", color: "#06b6d4", rating: 4.8 },
  { id: "in-blr", country: "India", flag: "🇮🇳", city: "Bengaluru", lat: 12.9716, lng: 77.5946, role: "Automation Engineer", status: "available", color: "#818cf8", rating: 5.0 },
  { id: "in-chn", country: "India", flag: "🇮🇳", city: "Chennai", lat: 13.0827, lng: 80.2707, role: "Certified Carpenter", status: "matched", color: "#ec4899", rating: 4.7 },

  // 🇦🇪 United Arab Emirates
  { id: "ae-dxb", country: "UAE", flag: "🇦🇪", city: "Dubai", lat: 25.2048, lng: 55.2708, role: "Smart Home Technician", status: "available", color: "#38bdf8", rating: 4.9 },
  { id: "ae-auh", country: "UAE", flag: "🇦🇪", city: "Abu Dhabi", lat: 24.4539, lng: 54.3773, role: "Chiller & HVAC Master", status: "available", color: "#10b981", rating: 4.9 },

  // 🇸🇬 Singapore
  { id: "sg-sin", country: "Singapore", flag: "🇸🇬", city: "Singapore", lat: 1.3521, lng: 103.8198, role: "Precision Robotics Tech", status: "matched", color: "#f59e0b", rating: 5.0 },

  // 🇬🇧 United Kingdom
  { id: "gb-lon", country: "United Kingdom", flag: "🇬🇧", city: "London", lat: 51.5074, lng: -0.1278, role: "Gas Safe Master", status: "available", color: "#60a5fa", rating: 4.9 },
  { id: "gb-man", country: "United Kingdom", flag: "🇬🇧", city: "Manchester", lat: 53.4808, lng: -2.2426, role: "Commercial Electrician", status: "en-route", color: "#06b6d4", rating: 4.8 },

  // 🇩🇪 Germany
  { id: "de-fra", country: "Germany", flag: "🇩🇪", city: "Frankfurt", lat: 50.1109, lng: 8.6821, role: "Solar & Heat Pump Tech", status: "available", color: "#10b981", rating: 4.9 },
  { id: "de-ber", country: "Germany", flag: "🇩🇪", city: "Berlin", lat: 52.5200, lng: 13.4050, role: "Building Automation", status: "available", color: "#818cf8", rating: 4.9 },

  // 🇯🇵 Japan
  { id: "jp-tyo", country: "Japan", flag: "🇯🇵", city: "Tokyo", lat: 35.6762, lng: 139.6503, role: "Fiber Optic Specialist", status: "available", color: "#38bdf8", rating: 5.0 },
  { id: "jp-osa", country: "Japan", flag: "🇯🇵", city: "Osaka", lat: 34.6937, lng: 135.5023, role: "High-Voltage Tech", status: "en-route", color: "#06b6d4", rating: 4.9 },

  // 🇦🇺 Australia
  { id: "au-syd", country: "Australia", flag: "🇦🇺", city: "Sydney", lat: -33.8688, lng: 151.2093, role: "Solar Grid Electrician", status: "available", color: "#10b981", rating: 4.9 },
  { id: "au-mel", country: "Australia", flag: "🇦🇺", city: "Melbourne", lat: -37.8136, lng: 144.9631, role: "Commercial Plumber", status: "available", color: "#38bdf8", rating: 4.8 },

  // 🇺🇸 United States
  { id: "us-nyc", country: "United States", flag: "🇺🇸", city: "New York", lat: 40.7128, lng: -74.0060, role: "Master Electrician", status: "available", color: "#38bdf8", rating: 4.9 },
  { id: "us-sfo", country: "United States", flag: "🇺🇸", city: "San Francisco", lat: 37.7749, lng: -122.4194, role: "Smart Grid Installer", status: "en-route", color: "#06b6d4", rating: 5.0 },

  // 🇨🇦 Canada
  { id: "ca-tor", country: "Canada", flag: "🇨🇦", city: "Toronto", lat: 43.6532, lng: -79.3832, role: "HVAC Systems Expert", status: "available", color: "#60a5fa", rating: 4.9 },

  // 🇫🇷 France
  { id: "fr-par", country: "France", flag: "🇫🇷", city: "Paris", lat: 48.8566, lng: 2.3522, role: "Eco-Energy Architect", status: "available", color: "#818cf8", rating: 4.8 },

  // 🇧🇷 Brazil
  { id: "br-sao", country: "Brazil", flag: "🇧🇷", city: "São Paulo", lat: -23.5505, lng: -46.6333, role: "Emergency Repair Specialist", status: "matched", color: "#f59e0b", rating: 4.8 },

  // 🇿🇦 South Africa
  { id: "za-cpt", country: "South Africa", flag: "🇿🇦", city: "Cape Town", lat: -33.9249, lng: 18.4241, role: "Solar Infrastructure Tech", status: "available", color: "#10b981", rating: 4.9 },
];

export const COUNTRY_LIST = [
  { name: "Sri Lanka", code: "LK", flag: "🇱🇰", centerLat: 7.8, centerLng: 80.7, city: "Colombo" },
  { name: "India", code: "IN", flag: "🇮🇳", centerLat: 20.5, centerLng: 78.9, city: "Mumbai" },
  { name: "UAE", code: "AE", flag: "🇦🇪", centerLat: 23.4, centerLng: 53.8, city: "Dubai" },
  { name: "Singapore", code: "SG", flag: "🇸🇬", centerLat: 1.35, centerLng: 103.8, city: "Singapore" },
  { name: "UK", code: "GB", flag: "🇬🇧", centerLat: 54.0, centerLng: -2.0, city: "London" },
  { name: "Germany", code: "DE", flag: "🇩🇪", centerLat: 51.1, centerLng: 10.4, city: "Frankfurt" },
  { name: "Japan", code: "JP", flag: "🇯🇵", centerLat: 36.2, centerLng: 138.2, city: "Tokyo" },
  { name: "Australia", code: "AU", flag: "🇦🇺", centerLat: -25.2, centerLng: 133.7, city: "Sydney" },
  { name: "USA", code: "US", flag: "🇺🇸", centerLat: 37.0, centerLng: -95.7, city: "New York" },
];

// Helper: Convert Lat/Lng to 3D Cartesian spherical coordinates
function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return { x, y, z };
}

// Generate stylized continent landmass points for high-tech Earth matrix
function generateContinentPoints(): { lat: number; lng: number }[] {
  const points: { lat: number; lng: number }[] = [];
  
  // Landmass bounding approximation boxes for matrix dots
  const landmasses = [
    // Asia & South Asia & Sri Lanka
    { minLat: 5, maxLat: 55, minLng: 65, maxLng: 145, step: 4 },
    { minLat: 5.5, maxLat: 10, minLng: 79.5, maxLng: 82, step: 1.2 }, // Sri Lanka high-res
    // Europe
    { minLat: 35, maxLat: 65, minLng: -10, maxLng: 40, step: 4.5 },
    // Africa
    { minLat: -35, maxLat: 35, minLng: -15, maxLng: 50, step: 5 },
    // North America
    { minLat: 15, maxLat: 65, minLng: -130, maxLng: -60, step: 5 },
    // South America
    { minLat: -55, maxLat: 12, minLng: -80, maxLng: -35, step: 5 },
    // Australia & NZ
    { minLat: -42, maxLat: -12, minLng: 112, maxLng: 155, step: 4.5 },
    // Middle East
    { minLat: 15, maxLat: 35, minLng: 35, maxLng: 65, step: 3.5 },
  ];

  landmasses.forEach((box) => {
    for (let lat = box.minLat; lat <= box.maxLat; lat += box.step) {
      for (let lng = box.minLng; lng <= box.maxLng; lng += box.step) {
        // Organic land jitter
        const jLat = lat + (Math.sin(lat * 3 + lng) * box.step * 0.2);
        const jLng = lng + (Math.cos(lat + lng * 2) * box.step * 0.2);
        points.push({ lat: jLat, lng: jLng });
      }
    }
  });

  return points;
}

export default function WorkerNetworkGlobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("Sri Lanka");
  const [activeHoverNode, setActiveHoverNode] = useState<CountryNode | null>(null);
  const [isAutoSpin, setIsAutoSpin] = useState<boolean>(true);

  // Rotation angles
  const rotYRef = useRef<number>(1.2); // Initial angle focused on Indian Ocean / Sri Lanka / Asia
  const rotXRef = useRef<number>(0.2);
  const targetRotYRef = useRef<number>(1.2);
  const targetRotXRef = useRef<number>(0.2);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Focus globe to a specific country
  const focusOnCountry = (countryName: string) => {
    setSelectedCountry(countryName);
    const country = COUNTRY_LIST.find((c) => c.name === countryName);
    if (country) {
      // Calculate target rotation to bring this country to the front center
      const targetY = -((country.centerLng + 90) * (Math.PI / 180));
      const targetX = (country.centerLat) * (Math.PI / 180) * 0.5;
      targetRotYRef.current = targetY;
      targetRotXRef.current = Math.max(-0.6, Math.min(0.6, targetX));
    }
  };

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

    const continentDots = generateContinentPoints();
    const globeRadius = Math.min(width, height) * 0.36;

    // Background cosmic particles
    const spaceParticles: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
    for (let i = 0; i < 50; i++) {
      spaceParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.6 + 0.4,
        speed: Math.random() * 0.2 + 0.05,
        opacity: Math.random() * 0.6 + 0.2,
      });
    }

    let pulseTimer = 0;
    let photonOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      pulseTimer += 0.035;
      photonOffset = (photonOffset + 0.012) % 1;

      // Auto-spin unless user is dragging
      if (isAutoSpin && !isDraggingRef.current) {
        targetRotYRef.current += 0.003;
      }

      // Smooth interpolation (lerp) for cinematic camera transitions
      rotYRef.current += (targetRotYRef.current - rotYRef.current) * 0.06;
      rotXRef.current += (targetRotXRef.current - rotXRef.current) * 0.06;

      const rotY = rotYRef.current;
      const rotX = rotXRef.current;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw background cosmic dust particles
      spaceParticles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < 0) p.y = height;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 163, 184, ${p.opacity * 0.35})`;
        ctx.fill();
      });

      // 1. Multi-tier Atmospheric Glow Backdrop
      const auraGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        globeRadius * 0.3,
        centerX,
        centerY,
        globeRadius * 1.35
      );
      auraGradient.addColorStop(0, "rgba(14, 116, 144, 0.28)");
      auraGradient.addColorStop(0.5, "rgba(30, 58, 138, 0.16)");
      auraGradient.addColorStop(0.85, "rgba(56, 189, 248, 0.04)");
      auraGradient.addColorStop(1, "rgba(6, 9, 19, 0)");

      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius * 1.32, 0, Math.PI * 2);
      ctx.fillStyle = auraGradient;
      ctx.fill();

      // 2. Planet Sphere Base Occlusion Fill (Deep Navy Core)
      const planetCore = ctx.createRadialGradient(
        centerX - globeRadius * 0.3,
        centerY - globeRadius * 0.3,
        globeRadius * 0.1,
        centerX,
        centerY,
        globeRadius
      );
      planetCore.addColorStop(0, "#0f1f38");
      planetCore.addColorStop(0.7, "#081022");
      planetCore.addColorStop(1, "#030712");

      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
      ctx.fillStyle = planetCore;
      ctx.fill();

      // Outer HUD Scanning Radar Ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius * 1.1, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.2)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Rotating Radar Beam Line
      const radarAngle = pulseTimer * 0.8;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(radarAngle) * globeRadius * 1.08,
        centerY + Math.sin(radarAngle) * globeRadius * 1.08
      );
      ctx.strokeStyle = "rgba(34, 211, 238, 0.18)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 3. 3D Spherical Coordinate Transformation Helper
      const project3D = (x: number, y: number, z: number) => {
        // Rotate around Y-axis
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;
        // Rotate around X-axis
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        return {
          screenX: centerX + x1,
          screenY: centerY - y2,
          z: z2,
          visible: z2 > -globeRadius * 0.15,
        };
      };

      // 4. Draw Latitude Rings
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let first = true;
        for (let lng = 0; lng <= 360; lng += 10) {
          const v = latLngToVector3(lat, lng, globeRadius);
          const p = project3D(v.x, v.y, v.z);
          if (p.z > 0) {
            if (first) {
              ctx.moveTo(p.screenX, p.screenY);
              first = false;
            } else {
              ctx.lineTo(p.screenX, p.screenY);
            }
          } else {
            first = true;
          }
        }
        ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 5. Draw Longitude Meridians
      for (let lng = 0; lng < 360; lng += 45) {
        ctx.beginPath();
        let first = true;
        for (let lat = -80; lat <= 80; lat += 8) {
          const v = latLngToVector3(lat, lng, globeRadius);
          const p = project3D(v.x, v.y, v.z);
          if (p.z > 0) {
            if (first) {
              ctx.moveTo(p.screenX, p.screenY);
              first = false;
            } else {
              ctx.lineTo(p.screenX, p.screenY);
            }
          } else {
            first = true;
          }
        }
        ctx.strokeStyle = "rgba(6, 182, 212, 0.08)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 6. Draw Continent Matrix Dots (World Map Projection)
      continentDots.forEach((pt) => {
        const v = latLngToVector3(pt.lat, pt.lng, globeRadius * 0.995);
        const p = project3D(v.x, v.y, v.z);
        if (p.visible && p.z > 0) {
          const depthAlpha = Math.max(0.1, (p.z / globeRadius));
          ctx.beginPath();
          ctx.arc(p.screenX, p.screenY, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(103, 232, 249, ${depthAlpha * 0.45})`;
          ctx.fill();
        }
      });

      // 7. Calculate Projected Screen Positions of All World Nodes
      const renderedNodes: (CountryNode & {
        screenX: number;
        screenY: number;
        z: number;
        visible: boolean;
        depthScale: number;
      })[] = [];

      WORLD_NODES.forEach((node) => {
        const v = latLngToVector3(node.lat, node.lng, globeRadius);
        const p = project3D(v.x, v.y, v.z);
        const depthScale = Math.max(0.35, (p.z + globeRadius) / (2 * globeRadius));

        renderedNodes.push({
          ...node,
          screenX: p.screenX,
          screenY: p.screenY,
          z: p.z,
          visible: p.visible && p.z > -globeRadius * 0.1,
          depthScale,
        });
      });

      // 8. Draw High-Speed Laser Connection Arcs Between Nodes
      for (let i = 0; i < renderedNodes.length; i++) {
        for (let j = i + 1; j < renderedNodes.length; j++) {
          const a = renderedNodes[i];
          const b = renderedNodes[j];
          if (a.visible && b.visible && a.z > 0 && b.z > 0) {
            const dist = Math.hypot(a.screenX - b.screenX, a.screenY - b.screenY);
            if (dist < globeRadius * 1.15) {
              const alpha = Math.max(0, 1 - dist / (globeRadius * 1.15)) * 0.4;
              
              // Arc curve calculation
              const midX = (a.screenX + b.screenX) / 2 + (centerX - (a.screenX + b.screenX) / 2) * 0.1;
              const midY = (a.screenY + b.screenY) / 2 - 20;

              ctx.beginPath();
              ctx.moveTo(a.screenX, a.screenY);
              ctx.quadraticCurveTo(midX, midY, b.screenX, b.screenY);
              ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
              ctx.lineWidth = 1.2;
              ctx.stroke();

              // Traveling photon packets along active links
              const t = (photonOffset + (i + j) * 0.15) % 1;
              const px = (1 - t) * (1 - t) * a.screenX + 2 * (1 - t) * t * midX + t * t * b.screenX;
              const py = (1 - t) * (1 - t) * a.screenY + 2 * (1 - t) * t * midY + t * t * b.screenY;

              ctx.beginPath();
              ctx.arc(px, py, 2, 0, Math.PI * 2);
              ctx.fillStyle = "#38bdf8";
              ctx.shadowColor = "#38bdf8";
              ctx.shadowBlur = 8;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }
      }

      // 9. Draw Country Worker Nodes & Badges
      renderedNodes.forEach((node) => {
        if (!node.visible) return;

        const isHighlighted = selectedCountry === node.country;
        const pulse = Math.sin(pulseTimer * 2 + node.lat) * (isHighlighted ? 4 : 2);
        const nodeSize = (isHighlighted ? 5.5 : 4) * node.depthScale;

        // Outer radar ping ring
        ctx.beginPath();
        ctx.arc(node.screenX, node.screenY, (10 + pulse) * node.depthScale, 0, Math.PI * 2);
        ctx.strokeStyle = isHighlighted ? "#38bdf8" : node.color;
        ctx.lineWidth = isHighlighted ? 1.6 : 1;
        ctx.globalAlpha = (isHighlighted ? 0.8 : 0.4) * node.depthScale;
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Node Glow Body
        ctx.beginPath();
        ctx.arc(node.screenX, node.screenY, nodeSize, 0, Math.PI * 2);
        ctx.fillStyle = isHighlighted ? "#ffffff" : node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = isHighlighted ? 16 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // City & Role Label on Front Face
        if (node.z > globeRadius * 0.25 || isHighlighted) {
          ctx.font = `${isHighlighted ? "bold 11px" : "10px"} system-ui, sans-serif`;
          ctx.fillStyle = isHighlighted ? "#ffffff" : "rgba(226, 232, 240, 0.85)";
          ctx.textAlign = "left";
          ctx.fillText(
            `${node.flag} ${node.city}`,
            node.screenX + 9 * node.depthScale,
            node.screenY + 3
          );
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Mouse / Touch Drag interaction for custom 3D rotation
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) {
        // Check hover over rendered nodes
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Find closest visible node
        const rotY = rotYRef.current;
        const rotX = rotXRef.current;
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);

        let hovered: CountryNode | null = null;
        WORLD_NODES.forEach((node) => {
          const v = latLngToVector3(node.lat, node.lng, globeRadius);
          const x1 = v.x * cosY + v.z * sinY;
          const z1 = -v.x * sinY + v.z * cosY;
          const y2 = v.y * cosX - z1 * sinX;
          const z2 = v.y * sinX + z1 * cosX;
          if (z2 > 0) {
            const sx = width / 2 + x1;
            const sy = height / 2 - y2;
            if (Math.hypot(mouseX - sx, mouseY - sy) < 18) {
              hovered = node;
            }
          }
        });
        setActiveHoverNode(hovered);
        return;
      }

      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      targetRotYRef.current += dx * 0.006;
      targetRotXRef.current = Math.max(
        -0.7,
        Math.min(0.7, targetRotXRef.current - dy * 0.006)
      );
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Touch support
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - lastMousePosRef.current.x;
      const dy = e.touches[0].clientY - lastMousePosRef.current.y;
      targetRotYRef.current += dx * 0.008;
      targetRotXRef.current = Math.max(
        -0.7,
        Math.min(0.7, targetRotXRef.current - dy * 0.008)
      );
      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isAutoSpin, selectedCountry]);

  // Selected country active nodes
  const activeCountryNodes = WORLD_NODES.filter((n) => n.country === selectedCountry);

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center justify-center select-none">
      {/* HUD Decorative Outer Corner Brackets & Cyber Glass Frame */}
      <div className="pointer-events-none absolute -inset-3 rounded-3xl border border-cyan-500/25 bg-slate-950/60 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.15)]">
        <div className="absolute -top-1 -left-1 h-3.5 w-3.5 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute -top-1 -right-1 h-3.5 w-3.5 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute -bottom-1 -left-1 h-3.5 w-3.5 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 border-b-2 border-r-2 border-cyan-400" />
      </div>

      {/* Top HUD Telemetry Status Header */}
      <div className="relative z-10 w-full flex items-center justify-between px-5 pt-4 pb-2.5 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-200 font-bold flex items-center gap-1.5">
            <GlobeIcon size={14} className="text-cyan-400" />
            Global AI Satellite Mesh
          </span>
        </div>

        {/* Controls: Auto-spin toggle & Satellite Lock */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAutoSpin(!isAutoSpin)}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono border transition ${
              isAutoSpin
                ? "bg-cyan-950/70 border-cyan-500/40 text-cyan-300"
                : "bg-slate-800 border-slate-700 text-slate-400"
            }`}
            title="Toggle Earth Auto-Rotation"
          >
            <RotateCw size={10} className={isAutoSpin ? "animate-spin" : ""} />
            <span>{isAutoSpin ? "ORBIT ACTIVE" : "MANUAL DRAG"}</span>
          </button>

          <div className="hidden sm:flex items-center gap-1 font-mono text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <Radio size={11} className="animate-pulse text-emerald-400" />
            <span>GPS LOCK</span>
          </div>
        </div>
      </div>

      {/* Country Quick Select Explorer Bar */}
      <div className="relative z-10 w-full px-3 pt-2.5 pb-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar mask-fade-edges">
        <div className="text-[10px] font-mono text-slate-400 px-1 font-bold shrink-0 flex items-center gap-1">
          <Navigation size={11} className="text-cyan-400" />
          FOCUS:
        </div>
        {COUNTRY_LIST.map((c) => {
          const isSelected = selectedCountry === c.name;
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => focusOnCountry(c.name)}
              className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer border ${
                isSelected
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)] scale-105"
                  : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>

      {/* Canvas 3D Visualization Area */}
      <div className="relative w-full h-[360px] sm:h-[400px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Hover Tooltip / Selected Country Floating HUD Telemetry */}
        {activeHoverNode ? (
          <div className="absolute top-4 left-4 bg-slate-900/95 border border-cyan-500/50 rounded-2xl p-3 backdrop-blur-xl shadow-2xl animate-fade-in pointer-events-none z-20 max-w-xs">
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1.5 mb-1.5">
              <span className="text-xs font-bold text-white flex items-center gap-1">
                <span>{activeHoverNode.flag}</span>
                <span>{activeHoverNode.city}, {activeHoverNode.country}</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                ★ {activeHoverNode.rating}
              </span>
            </div>
            <p className="text-xs font-bold text-cyan-300">{activeHoverNode.role}</p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              Status: {activeHoverNode.status.toUpperCase()}
            </p>
          </div>
        ) : (
          /* Live Focus Country Stats Card */
          <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3 backdrop-blur-xl shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Zap size={18} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">
                    {selectedCountry} Regional Mesh
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  {activeCountryNodes.length} Verified Hubs Active &bull; Avg Dispatch &lt; 15 mins
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-xl">
              <ShieldCheck size={13} />
              <span>Verified ID</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Capability Indicators */}
      <div className="relative z-10 w-full grid grid-cols-3 gap-2 px-4 py-2.5 border-t border-slate-800/80 bg-slate-950/80 rounded-b-2xl text-center">
        <div className="px-1 py-1">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Mesh Coverage</p>
          <p className="text-xs font-bold text-cyan-300 mt-0.5 flex items-center justify-center gap-1">
            <Sparkles size={12} /> Global Lat/Lng
          </p>
        </div>
        <div className="px-1 py-1 border-x border-slate-800">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Verification</p>
          <p className="text-xs font-bold text-emerald-300 mt-0.5 flex items-center justify-center gap-1">
            <CheckCircle2 size={12} /> Gov ID & Skills
          </p>
        </div>
        <div className="px-1 py-1">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Proximity Lock</p>
          <p className="text-xs font-bold text-blue-300 mt-0.5 flex items-center justify-center gap-1">
            <MapPin size={12} /> Instant Dispatch
          </p>
        </div>
      </div>
    </div>
  );
}

