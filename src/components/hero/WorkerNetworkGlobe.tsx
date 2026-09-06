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
  isPrimary?: boolean;
}

export const WORLD_NODES: CountryNode[] = [
  // 🇱🇰 Sri Lanka
  { id: "sl-col", country: "Sri Lanka", flag: "🇱🇰", city: "Colombo", lat: 6.9271, lng: 79.8612, role: "Precision Electrician", status: "available", color: "#38bdf8", rating: 4.9, isPrimary: true },
  { id: "sl-kan", country: "Sri Lanka", flag: "🇱🇰", city: "Kandy", lat: 7.2906, lng: 80.6337, role: "Master Plumber", status: "available", color: "#10b981", rating: 4.8 },
  { id: "sl-gal", country: "Sri Lanka", flag: "🇱🇰", city: "Galle", lat: 6.0535, lng: 80.2210, role: "HVAC Specialist", status: "en-route", color: "#06b6d4", rating: 4.9 },
  { id: "sl-jaf", country: "Sri Lanka", flag: "🇱🇰", city: "Jaffna", lat: 9.6615, lng: 80.0255, role: "Solar Energy Tech", status: "available", color: "#f59e0b", rating: 5.0 },

  // 🇮🇳 India
  { id: "in-mum", country: "India", flag: "🇮🇳", city: "Mumbai", lat: 19.0760, lng: 72.8777, role: "Industrial Electrician", status: "available", color: "#38bdf8", rating: 4.9, isPrimary: true },
  { id: "in-del", country: "India", flag: "🇮🇳", city: "New Delhi", lat: 28.6139, lng: 77.2090, role: "HVAC Diagnostics", status: "en-route", color: "#06b6d4", rating: 4.8 },
  { id: "in-blr", country: "India", flag: "🇮🇳", city: "Bengaluru", lat: 12.9716, lng: 77.5946, role: "Automation Engineer", status: "available", color: "#818cf8", rating: 5.0 },
  { id: "in-chn", country: "India", flag: "🇮🇳", city: "Chennai", lat: 13.0827, lng: 80.2707, role: "Certified Carpenter", status: "matched", color: "#ec4899", rating: 4.7 },

  // 🇦🇪 United Arab Emirates
  { id: "ae-dxb", country: "UAE", flag: "🇦🇪", city: "Dubai", lat: 25.2048, lng: 55.2708, role: "Smart Home Technician", status: "available", color: "#38bdf8", rating: 4.9, isPrimary: true },
  { id: "ae-auh", country: "UAE", flag: "🇦🇪", city: "Abu Dhabi", lat: 24.4539, lng: 54.3773, role: "Chiller & HVAC Master", status: "available", color: "#10b981", rating: 4.9 },

  // 🇸🇬 Singapore
  { id: "sg-sin", country: "Singapore", flag: "🇸🇬", city: "Singapore", lat: 1.3521, lng: 103.8198, role: "Precision Robotics Tech", status: "matched", color: "#f59e0b", rating: 5.0, isPrimary: true },

  // 🇬🇧 United Kingdom
  { id: "gb-lon", country: "United Kingdom", flag: "🇬🇧", city: "London", lat: 51.5074, lng: -0.1278, role: "Gas Safe Master", status: "available", color: "#60a5fa", rating: 4.9, isPrimary: true },
  { id: "gb-man", country: "United Kingdom", flag: "🇬🇧", city: "Manchester", lat: 53.4808, lng: -2.2426, role: "Commercial Electrician", status: "en-route", color: "#06b6d4", rating: 4.8 },

  // 🇩🇪 Germany
  { id: "de-fra", country: "Germany", flag: "🇩🇪", city: "Frankfurt", lat: 50.1109, lng: 8.6821, role: "Solar & Heat Pump Tech", status: "available", color: "#10b981", rating: 4.9, isPrimary: true },
  { id: "de-ber", country: "Germany", flag: "🇩🇪", city: "Berlin", lat: 52.5200, lng: 13.4050, role: "Building Automation", status: "available", color: "#818cf8", rating: 4.9 },

  // 🇯🇵 Japan
  { id: "jp-tyo", country: "Japan", flag: "🇯🇵", city: "Tokyo", lat: 35.6762, lng: 139.6503, role: "Fiber Optic Specialist", status: "available", color: "#38bdf8", rating: 5.0, isPrimary: true },
  { id: "jp-osa", country: "Japan", flag: "🇯🇵", city: "Osaka", lat: 34.6937, lng: 135.5023, role: "High-Voltage Tech", status: "en-route", color: "#06b6d4", rating: 4.9 },

  // 🇦🇺 Australia
  { id: "au-syd", country: "Australia", flag: "🇦🇺", city: "Sydney", lat: -33.8688, lng: 151.2093, role: "Solar Grid Electrician", status: "available", color: "#10b981", rating: 4.9, isPrimary: true },
  { id: "au-mel", country: "Australia", flag: "🇦🇺", city: "Melbourne", lat: -37.8136, lng: 144.9631, role: "Commercial Plumber", status: "available", color: "#38bdf8", rating: 4.8 },

  // 🇺🇸 United States
  { id: "us-nyc", country: "United States", flag: "🇺🇸", city: "New York", lat: 40.7128, lng: -74.0060, role: "Master Electrician", status: "available", color: "#38bdf8", rating: 4.9, isPrimary: true },
  { id: "us-sfo", country: "United States", flag: "🇺🇸", city: "San Francisco", lat: 37.7749, lng: -122.4194, role: "Smart Grid Installer", status: "en-route", color: "#06b6d4", rating: 5.0 },

  // 🇨🇦 Canada
  { id: "ca-tor", country: "Canada", flag: "🇨🇦", city: "Toronto", lat: 43.6532, lng: -79.3832, role: "HVAC Systems Expert", status: "available", color: "#60a5fa", rating: 4.9, isPrimary: true },

  // 🇫🇷 France
  { id: "fr-par", country: "France", flag: "🇫🇷", city: "Paris", lat: 48.8566, lng: 2.3522, role: "Eco-Energy Architect", status: "available", color: "#818cf8", rating: 4.8, isPrimary: true },

  // 🇧🇷 Brazil
  { id: "br-sao", country: "Brazil", flag: "🇧🇷", city: "São Paulo", lat: -23.5505, lng: -46.6333, role: "Emergency Repair Specialist", status: "matched", color: "#f59e0b", rating: 4.8, isPrimary: true },

  // 🇿🇦 South Africa
  { id: "za-cpt", country: "South Africa", flag: "🇿🇦", city: "Cape Town", lat: -33.9249, lng: 18.4241, role: "Solar Infrastructure Tech", status: "available", color: "#10b981", rating: 4.9, isPrimary: true },
];

// Curated high-speed mesh backbone routes
const NETWORK_ROUTES: [string, string][] = [
  ["sl-col", "in-blr"],
  ["sl-col", "ae-dxb"],
  ["sl-col", "sg-sin"],
  ["sl-col", "sl-kan"],
  ["sl-col", "sl-gal"],
  ["sl-col", "sl-jaf"],
  ["in-blr", "in-mum"],
  ["in-mum", "in-del"],
  ["in-del", "ae-dxb"],
  ["ae-dxb", "de-fra"],
  ["de-fra", "gb-lon"],
  ["de-fra", "fr-par"],
  ["gb-lon", "us-nyc"],
  ["us-nyc", "ca-tor"],
  ["us-nyc", "us-sfo"],
  ["us-nyc", "br-sao"],
  ["us-sfo", "jp-tyo"],
  ["jp-tyo", "sg-sin"],
  ["sg-sin", "au-syd"],
  ["au-syd", "au-mel"],
  ["gb-lon", "za-cpt"],
  ["za-cpt", "ae-dxb"],
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

// High-resolution vector polygon paths for global landmasses
const CONTINENT_POLYGONS: [number, number][][] = [
  // North America
  [[70,-160],[70,-100],[60,-60],[45,-65],[30,-80],[25,-100],[30,-120],[50,-130],[60,-165],[70,-160]],
  // South America
  [[10,-75],[0,-50],[-10,-35],[-30,-50],[-55,-70],[-40,-75],[-20,-70],[0,-80],[10,-75]],
  // Europe
  [[70,20],[60,30],[45,40],[36,30],[36,0],[45,-10],[60,5],[70,20]],
  // Africa
  [[35,0],[30,32],[10,42],[-10,40],[-35,20],[-30,15],[0,9],[15,-17],[35,0]],
  // Asia
  [[70,40],[75,100],[60,170],[40,145],[25,120],[10,100],[8,77],[25,65],[40,50],[70,40]],
  // Sri Lanka
  [[9.8,80.2],[8.5,81.8],[5.9,80.5],[7.0,79.8],[9.8,80.2]],
  // Australia
  [[-12,130],[-15,145],[-25,153],[-38,148],[-32,115],[-20,114],[-12,130]],
];

function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return { x, y, z };
}

function generateHighDensityPoints(): { lat: number; lng: number }[] {
  const points: { lat: number; lng: number }[] = [];
  CONTINENT_POLYGONS.forEach((poly) => {
    let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
    poly.forEach(([lat, lng]) => {
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    });

    const step = poly.length <= 5 ? 0.9 : 2.0;
    for (let lat = minLat; lat <= maxLat; lat += step) {
      for (let lng = minLng; lng <= maxLng; lng += step) {
        const jLat = lat + (Math.sin(lat * 4 + lng) * 0.2);
        const jLng = lng + (Math.cos(lat + lng * 3) * 0.2);
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

  const isAutoSpinRef = useRef<boolean>(isAutoSpin);
  const selectedCountryRef = useRef<string>(selectedCountry);

  useEffect(() => {
    isAutoSpinRef.current = isAutoSpin;
  }, [isAutoSpin]);

  useEffect(() => {
    selectedCountryRef.current = selectedCountry;
  }, [selectedCountry]);

  const rotYRef = useRef<number>(1.2);
  const rotXRef = useRef<number>(0.2);
  const targetRotYRef = useRef<number>(1.2);
  const targetRotXRef = useRef<number>(0.2);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const focusOnCountry = (countryName: string) => {
    setSelectedCountry(countryName);
    const country = COUNTRY_LIST.find((c) => c.name === countryName);
    if (country) {
      const targetY = -((country.centerLng + 90) * (Math.PI / 180));
      const targetX = country.centerLat * (Math.PI / 180) * 0.5;
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
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const updateDimensions = () => {
      if (!canvas.parentElement) return;
      const clientW = canvas.parentElement.clientWidth || 360;
      const clientH = canvas.parentElement.clientHeight || 360;

      canvas.width = clientW * dpr;
      canvas.height = clientH * dpr;
      ctx.scale(dpr, dpr);
    };

    updateDimensions();

    const handleResize = () => updateDimensions();
    window.addEventListener("resize", handleResize);

    const continentDots = generateHighDensityPoints();

    const spaceParticles: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
    for (let i = 0; i < 35; i++) {
      spaceParticles.push({
        x: Math.random() * 600,
        y: Math.random() * 600,
        size: Math.random() * 1.5 + 0.4,
        speed: Math.random() * 0.2 + 0.05,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    let pulseTimer = 0;
    let photonOffset = 0;

    const render = () => {
      const parent = canvas.parentElement;
      const width = parent?.clientWidth || 360;
      const height = parent?.clientHeight || 360;
      const globeRadius = Math.min(width, height) * (width < 420 ? 0.34 : 0.36);

      ctx.clearRect(0, 0, width, height);
      pulseTimer += 0.035;
      photonOffset = (photonOffset + 0.008) % 1;

      if (isAutoSpinRef.current && !isDraggingRef.current) {
        targetRotYRef.current += 0.0025;
      }

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

      // Render Ambient Star Particles
      spaceParticles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < 0) p.y = height;
        ctx.beginPath();
        ctx.arc(p.x % width, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 163, 184, ${p.opacity * 0.35})`;
        ctx.fill();
      });

      // Atmospheric Glow Outer Rings
      const auraGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        globeRadius * 0.4,
        centerX,
        centerY,
        globeRadius * 1.35
      );
      auraGradient.addColorStop(0, "rgba(14, 116, 144, 0.25)");
      auraGradient.addColorStop(0.5, "rgba(30, 58, 138, 0.14)");
      auraGradient.addColorStop(0.85, "rgba(56, 189, 248, 0.03)");
      auraGradient.addColorStop(1, "rgba(6, 9, 19, 0)");

      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius * 1.32, 0, Math.PI * 2);
      ctx.fillStyle = auraGradient;
      ctx.fill();

      // Deep Planet Core Sphere
      const planetCore = ctx.createRadialGradient(
        centerX - globeRadius * 0.25,
        centerY - globeRadius * 0.25,
        globeRadius * 0.1,
        centerX,
        centerY,
        globeRadius
      );
      planetCore.addColorStop(0, "#0e1e38");
      planetCore.addColorStop(0.65, "#081022");
      planetCore.addColorStop(1, "#030712");

      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
      ctx.fillStyle = planetCore;
      ctx.fill();

      // Atmosphere Horizon Rim Outline
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      const project3D = (x: number, y: number, z: number) => {
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        return {
          screenX: centerX + x1,
          screenY: centerY - y2,
          z: z2,
          visible: z2 > -globeRadius * 0.15,
        };
      };

      // Latitude and Longitude Grid Rings for authentic 3D spherical depth
      const latSteps = [-45, -20, 0, 20, 45];
      latSteps.forEach((lat) => {
        ctx.beginPath();
        let first = true;
        for (let lng = -180; lng <= 180; lng += 15) {
          const v = latLngToVector3(lat, lng, globeRadius * 0.992);
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
        ctx.strokeStyle = lat === 0 ? "rgba(56, 189, 248, 0.15)" : "rgba(56, 189, 248, 0.05)";
        ctx.lineWidth = lat === 0 ? 1 : 0.6;
        ctx.stroke();
      });

      // Render 3D Vector Outlines of Continents
      CONTINENT_POLYGONS.forEach((poly) => {
        ctx.beginPath();
        let isDrawing = false;
        poly.forEach(([lat, lng]) => {
          const v = latLngToVector3(lat, lng, globeRadius * 1.002);
          const p = project3D(v.x, v.y, v.z);
          if (p.z > 0) {
            if (!isDrawing) {
              ctx.moveTo(p.screenX, p.screenY);
              isDrawing = true;
            } else {
              ctx.lineTo(p.screenX, p.screenY);
            }
          } else {
            isDrawing = false;
          }
        });
        ctx.closePath();
        ctx.strokeStyle = "rgba(56, 189, 248, 0.28)";
        ctx.lineWidth = 1.0;
        ctx.fillStyle = "rgba(14, 116, 144, 0.10)";
        ctx.fill();
        ctx.stroke();
      });

      // Render High-Density Matrix Dots
      continentDots.forEach((pt) => {
        const v = latLngToVector3(pt.lat, pt.lng, globeRadius * 0.995);
        const p = project3D(v.x, v.y, v.z);
        if (p.visible && p.z > 0) {
          const depthAlpha = Math.max(0.12, p.z / globeRadius);
          ctx.beginPath();
          ctx.arc(p.screenX, p.screenY, width < 420 ? 0.9 : 1.1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(103, 232, 249, ${depthAlpha * 0.45})`;
          ctx.fill();
        }
      });

      // Project all nodes
      const projectedNodesMap = new Map<string, CountryNode & {
        screenX: number;
        screenY: number;
        z: number;
        visible: boolean;
        depthScale: number;
      }>();

      WORLD_NODES.forEach((node) => {
        const v = latLngToVector3(node.lat, node.lng, globeRadius);
        const p = project3D(v.x, v.y, v.z);
        const depthScale = Math.max(0.35, (p.z + globeRadius) / (2 * globeRadius));

        projectedNodesMap.set(node.id, {
          ...node,
          screenX: p.screenX,
          screenY: p.screenY,
          z: p.z,
          visible: p.visible && p.z > -globeRadius * 0.1,
          depthScale,
        });
      });

      const renderedNodes = Array.from(projectedNodesMap.values());

      // Render Curated Mesh Backbone Routes with Animated Photons
      NETWORK_ROUTES.forEach(([fromId, toId], idx) => {
        const a = projectedNodesMap.get(fromId);
        const b = projectedNodesMap.get(toId);
        if (!a || !b) return;

        if (a.visible && b.visible && a.z > -globeRadius * 0.2 && b.z > -globeRadius * 0.2) {
          const avgZ = (a.z + b.z) / 2;
          if (avgZ <= 0) return;

          const dist = Math.hypot(a.screenX - b.screenX, a.screenY - b.screenY);
          const alpha = Math.min(0.55, Math.max(0.1, (avgZ / globeRadius) * 0.6));
          const arcElevation = Math.min(30, dist * 0.15);
          const midX = (a.screenX + b.screenX) / 2 + (centerX - (a.screenX + b.screenX) / 2) * 0.08;
          const midY = (a.screenY + b.screenY) / 2 - arcElevation;

          // Arc line
          ctx.beginPath();
          ctx.moveTo(a.screenX, a.screenY);
          ctx.quadraticCurveTo(midX, midY, b.screenX, b.screenY);
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.setLineDash([3, 3]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Animated glowing photon packet
          const t = (photonOffset + idx * 0.09) % 1;
          const px = (1 - t) * (1 - t) * a.screenX + 2 * (1 - t) * t * midX + t * t * b.screenX;
          const py = (1 - t) * (1 - t) * a.screenY + 2 * (1 - t) * t * midY + t * t * b.screenY;

          ctx.beginPath();
          ctx.arc(px, py, width < 420 ? 1.6 : 2.2, 0, Math.PI * 2);
          ctx.fillStyle = "#38bdf8";
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Render Hub Nodes (Dots & Pulse Rings)
      renderedNodes.forEach((node) => {
        if (!node.visible || node.z <= 0) return;

        const isSelectedCountry = selectedCountryRef.current === node.country;
        const pulse = Math.sin(pulseTimer * 2.5 + node.lat) * (isSelectedCountry ? 3.5 : 2);
        const nodeSize = (isSelectedCountry ? 4.5 : 3.2) * node.depthScale;

        // Outer pulsing ring
        ctx.beginPath();
        ctx.arc(node.screenX, node.screenY, (8 + pulse) * node.depthScale, 0, Math.PI * 2);
        ctx.strokeStyle = isSelectedCountry ? "#38bdf8" : node.color;
        ctx.lineWidth = isSelectedCountry ? 1.5 : 0.8;
        ctx.globalAlpha = (isSelectedCountry ? 0.75 : 0.35) * node.depthScale;
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Center glowing node
        ctx.beginPath();
        ctx.arc(node.screenX, node.screenY, nodeSize, 0, Math.PI * 2);
        ctx.fillStyle = isSelectedCountry ? "#ffffff" : node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = isSelectedCountry ? 12 : 5;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Collision-Free High-Tech Glass Badge Labels
      // We sort candidate nodes: Selected country first, then primary hubs, then closest to camera (high z)
      const candidateNodes = renderedNodes
        .filter((n) => n.visible && n.z > globeRadius * 0.15)
        .sort((a, b) => {
          const aSelected = a.country === selectedCountryRef.current ? 1 : 0;
          const bSelected = b.country === selectedCountryRef.current ? 1 : 0;
          if (aSelected !== bSelected) return bSelected - aSelected;
          if (a.isPrimary !== b.isPrimary) return (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0);
          return b.z - a.z;
        });

      const placedBoxes: { x: number; y: number; w: number; h: number }[] = [];

      candidateNodes.forEach((node) => {
        const isSelected = selectedCountryRef.current === node.country;
        const isPrimary = !!node.isPrimary;

        // If not selected country and not primary hub, only show if camera is very close and there is plenty of room
        if (!isSelected && !isPrimary && node.z < globeRadius * 0.5) return;

        const labelText = isSelected ? `${node.flag} ${node.city}` : node.city;
        const fontSize = width < 420 ? 9.5 : 10.5;
        ctx.font = `${isSelected ? "bold " : "500 "}${fontSize}px system-ui, -apple-system, sans-serif`;

        const textMetrics = ctx.measureText(labelText);
        const paddingX = 6;
        const paddingY = 3.5;
        const boxW = textMetrics.width + paddingX * 2;
        const boxH = fontSize + paddingY * 2;

        const boxX = node.screenX + 8;
        const boxY = node.screenY - boxH / 2;

        // Check collision against previously placed boxes
        const hasCollision = placedBoxes.some((box) => {
          return !(
            boxX + boxW < box.x - 4 ||
            boxX > box.x + box.w + 4 ||
            boxY + boxH < box.y - 4 ||
            boxY > box.y + box.h + 4
          );
        });

        if (hasCollision && !isSelected) {
          return; // Skip non-selected overlapping labels
        }

        // Draw connecting pointer line
        ctx.beginPath();
        ctx.moveTo(node.screenX + 2, node.screenY);
        ctx.lineTo(boxX, boxY + boxH / 2);
        ctx.strokeStyle = isSelected ? "rgba(56, 189, 248, 0.6)" : "rgba(148, 163, 184, 0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw sleek dark glass pill container
        ctx.beginPath();
        const r = 4;
        ctx.roundRect(boxX, boxY, boxW, boxH, r);
        ctx.fillStyle = isSelected
          ? "rgba(8, 24, 48, 0.92)"
          : "rgba(3, 7, 18, 0.85)";
        ctx.fill();

        ctx.strokeStyle = isSelected
          ? "rgba(56, 189, 248, 0.55)"
          : "rgba(100, 116, 139, 0.25)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw crisp label text
        ctx.fillStyle = isSelected ? "#38bdf8" : "#cbd5e1";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(labelText, boxX + paddingX, boxY + boxH / 2);

        placedBoxes.push({ x: boxX, y: boxY, w: boxW, h: boxH });
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const parent = canvas.parentElement;
      const width = parent?.clientWidth || 360;
      const height = parent?.clientHeight || 360;
      const globeRadius = Math.min(width, height) * (width < 420 ? 0.34 : 0.36);

      if (!isDraggingRef.current) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

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
      targetRotXRef.current = Math.max(-0.7, Math.min(0.7, targetRotXRef.current - dy * 0.006));
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

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
      targetRotXRef.current = Math.max(-0.7, Math.min(0.7, targetRotXRef.current - dy * 0.008));
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
  }, []);

  const activeCountryNodes = WORLD_NODES.filter((n) => n.country === selectedCountry);

  return (
    <div className="relative w-full max-w-full sm:max-w-lg lg:max-w-xl mx-auto flex flex-col items-center justify-center select-none px-1 sm:px-0">
      {/* High-Tech Cyber Frame Glow & Corner Brackets */}
      <div className="pointer-events-none absolute -inset-2 sm:-inset-3 rounded-2xl sm:rounded-3xl border border-cyan-500/25 bg-slate-950/60 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.15)]">
        <div className="absolute -top-1 -left-1 h-3 w-3 sm:h-3.5 sm:w-3.5 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute -top-1 -right-1 h-3 w-3 sm:h-3.5 sm:w-3.5 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute -bottom-1 -left-1 h-3 w-3 sm:h-3.5 sm:w-3.5 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute -bottom-1 -right-1 h-3 w-3 sm:h-3.5 sm:w-3.5 border-b-2 border-r-2 border-cyan-400" />
      </div>

      {/* Top Telemetry Header */}
      <div className="relative z-10 w-full flex items-center justify-between px-3 sm:px-5 pt-3 sm:pt-4 pb-2 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-500" />
          </span>
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-200 font-bold flex items-center gap-1 sm:gap-1.5">
            <GlobeIcon size={13} className="text-cyan-400 shrink-0" />
            <span className="truncate">Global Satellite Mesh</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setIsAutoSpin(!isAutoSpin)}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono border transition ${
              isAutoSpin
                ? "bg-cyan-950/70 border-cyan-500/40 text-cyan-300"
                : "bg-slate-800 border-slate-700 text-slate-400"
            }`}
            title="Toggle Earth Auto-Rotation"
          >
            <RotateCw size={10} className={isAutoSpin ? "animate-spin shrink-0" : "shrink-0"} />
            <span>{isAutoSpin ? "ORBIT" : "DRAG"}</span>
          </button>

          <div className="hidden xs:flex items-center gap-1 font-mono text-[9px] sm:text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <Radio size={10} className="animate-pulse text-emerald-400" />
            <span>GPS LOCK</span>
          </div>
        </div>
      </div>

      {/* Country Focus Chips */}
      <div className="relative z-10 w-full px-2 sm:px-3 pt-2 pb-1 flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="text-[9px] sm:text-[10px] font-mono text-slate-400 px-1 font-bold shrink-0 flex items-center gap-1">
          <Navigation size={10} className="text-cyan-400" />
          <span className="hidden xs:inline">FOCUS:</span>
        </div>
        {COUNTRY_LIST.map((c) => {
          const isSelected = selectedCountry === c.name;
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => focusOnCountry(c.name)}
              className={`shrink-0 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition cursor-pointer border ${
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

      {/* 3D Canvas Area */}
      <div className="relative w-full h-[280px] xs:h-[320px] sm:h-[360px] md:h-[380px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Hover Hub Telemetry Tooltip or Selected Region HUD */}
        {activeHoverNode ? (
          <div className="absolute top-3 left-3 right-3 sm:right-auto bg-slate-900/95 border border-cyan-500/50 rounded-2xl p-2.5 sm:p-3 backdrop-blur-xl shadow-2xl animate-fade-in pointer-events-none z-20 max-w-xs">
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1 mb-1">
              <span className="text-[11px] sm:text-xs font-bold text-white flex items-center gap-1 truncate">
                <span>{activeHoverNode.flag}</span>
                <span className="truncate">
                  {activeHoverNode.city}, {activeHoverNode.country}
                </span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
                ★ {activeHoverNode.rating}
              </span>
            </div>
            <p className="text-xs font-bold text-cyan-300 truncate">{activeHoverNode.role}</p>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
              Status: {activeHoverNode.status.toUpperCase()}
            </p>
          </div>
        ) : (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 bg-slate-900/90 border border-slate-800/90 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 backdrop-blur-xl shadow-xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Zap size={16} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-xs font-bold text-white truncate">
                    {selectedCountry} Regional Mesh
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono truncate">
                  {activeCountryNodes.length} Hubs Active &bull; Dispatch &lt; 15m
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 sm:px-2.5 py-1 rounded-lg sm:rounded-xl shrink-0">
              <ShieldCheck size={12} />
              <span>Verified</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Telemetry Metrics Strip */}
      <div className="relative z-10 w-full grid grid-cols-3 gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 border-t border-slate-800/80 bg-slate-950/80 rounded-b-xl sm:rounded-b-2xl text-center">
        <div className="px-0.5 sm:px-1 py-1">
          <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold truncate">Coverage</p>
          <p className="text-[11px] sm:text-xs font-bold text-cyan-300 mt-0.5 flex items-center justify-center gap-1">
            <Sparkles size={11} className="shrink-0" /> <span className="truncate">Global Lat/Lng</span>
          </p>
        </div>
        <div className="px-0.5 sm:px-1 py-1 border-x border-slate-800">
          <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold truncate">Verified</p>
          <p className="text-[11px] sm:text-xs font-bold text-emerald-300 mt-0.5 flex items-center justify-center gap-1">
            <CheckCircle2 size={11} className="shrink-0" /> <span className="truncate">Gov ID & Skills</span>
          </p>
        </div>
        <div className="px-0.5 sm:px-1 py-1">
          <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold truncate">Dispatch</p>
          <p className="text-[11px] sm:text-xs font-bold text-blue-300 mt-0.5 flex items-center justify-center gap-1">
            <MapPin size={11} className="shrink-0" /> <span className="truncate">Instant GPS</span>
          </p>
        </div>
      </div>
    </div>
  );
}