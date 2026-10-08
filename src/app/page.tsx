"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useAnimationFrame } from "framer-motion";
import { Code, Briefcase, GraduationCap, Heart, Download, ArrowDownToLine } from "lucide-react";

// Updated coordinates matching the new AI background
const cvZones = [
  {
    id: "tech",
    title: "TECH HUB",
    icon: <Code className="w-6 h-6 text-blue-500" />,
    color: "bg-blue-500",
    glow: "shadow-[0_0_40px_rgba(59,130,246,0.8)]",
    position: { left: "25%", top: "25%" },
    content: (
      <div className="space-y-3">
        <div>
          <h3 className="font-bold text-xl text-blue-400">Software Developer Intern</h3>
          <p className="text-sm text-gray-400">Hellenic Drones</p>
          <ul className="list-disc ml-5 mt-1 text-sm text-gray-300">
            <li>Enhanced e-learning/LMS platform for drone pilot exams.</li>
            <li>Launched new company website & automated APIs.</li>
          </ul>
        </div>
        <div className="border-t border-blue-500/30 pt-2">
          <h4 className="font-bold text-blue-400 mb-1">Tech Stack</h4>
          <p className="text-sm text-gray-300">Python (Flask, Django, FastAPI), React, Next.js, Tailwind, MySQL, MongoDB</p>
        </div>
      </div>
    )
  },
  {
    id: "experience",
    title: "EXPERIENCE",
    icon: <Briefcase className="w-6 h-6 text-purple-500" />,
    color: "bg-purple-500",
    glow: "shadow-[0_0_40px_rgba(168,85,247,0.8)]",
    position: { left: "75%", top: "25%" },
    content: (
      <div className="space-y-3">
        <div>
          <h3 className="font-bold text-xl text-purple-400">Sales Assistant & Warehouse Operator</h3>
          <p className="text-sm text-gray-400">Cosmossport</p>
          <p className="text-sm text-gray-300">Delivered excellent customer service and organized stock.</p>
        </div>
        <div>
          <h3 className="font-bold text-xl text-purple-400">Personal Trainer</h3>
          <p className="text-sm text-gray-400">Miha Bodytech</p>
        </div>
        <div>
          <h3 className="font-bold text-xl text-purple-400">Office Assistant</h3>
          <p className="text-sm text-gray-400">Paterakis Pharmacy</p>
        </div>
      </div>
    )
  },
  {
    id: "education",
    title: "EDUCATION",
    icon: <GraduationCap className="w-6 h-6 text-amber-500" />,
    color: "bg-amber-500",
    glow: "shadow-[0_0_40px_rgba(245,158,11,0.8)]",
    position: { left: "25%", top: "75%" },
    content: (
      <div className="space-y-3">
        <div>
          <h3 className="font-bold text-xl text-amber-400">BSc in Digital Systems</h3>
          <p className="text-sm text-gray-400">University of Piraeus</p>
          <p className="text-sm text-gray-300 mt-2">
            Focus on full-stack web development, software engineering, and AI.
          </p>
        </div>
      </div>
    )
  },
  {
    id: "hobbies",
    title: "SOFT SKILLS",
    icon: <Heart className="w-6 h-6 text-rose-500" />,
    color: "bg-rose-500",
    glow: "shadow-[0_0_40px_rgba(243,64,121,0.8)]",
    position: { left: "75%", top: "75%" },
    content: (
      <div className="space-y-3">
        <div>
          <h3 className="font-bold text-xl text-rose-400">Soft Skills</h3>
          <ul className="list-disc ml-5 text-sm text-gray-300">
            <li>Communication & Interpersonal Skills</li>
            <li>Teamwork, Collaboration & Sportsmanship</li>
            <li>Organization & Time Management</li>
            <li>Discipline & Strong Work Ethic</li>
            <li>Adaptability & Problem Solving</li>
          </ul>
        </div>
        <div className="border-t border-rose-500/30 pt-2">
          <h3 className="font-bold text-xl text-rose-400">Volunteering & Hobbies</h3>
          <p className="text-sm text-gray-300">
            <strong className="text-rose-300">Coach:</strong> Volunteer Basketball Coach<br />
            <strong className="text-rose-300">Interests:</strong> Basketball, Fitness, Tech
          </p>
        </div>
      </div>
    )
  },
  {
    id: "download",
    title: "GET CV",
    icon: <Download className="w-6 h-6 animate-bounce text-emerald-500" />,
    color: "bg-emerald-500",
    glow: "shadow-[0_0_40px_rgba(16,185,129,0.9)]",
    position: { left: "50%", top: "50%" },
    content: (
      <div className="text-center space-y-4">
        <p className="text-sm text-gray-300">
          Get the full print-ready version of my CV in PDF format.
        </p>
        <a 
          href="/GeorgiosZervas_cv.pdf" 
          download="GeorgiosZervas_cv.pdf"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors pointer-events-auto shadow-lg shadow-emerald-900/50"
        >
          <ArrowDownToLine className="w-5 h-5" />
          Download PDF
        </a>
      </div>
    )
  }
];

export default function RpgCV() {
  const [mounted, setMounted] = useState(false);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  
  // Character Animation States
  const [isMoving, setIsMoving] = useState(false);
  const [facingRight, setFacingRight] = useState(true);
  
  // Game Refs
  const keys = useRef<{ [key: string]: boolean }>({});
  const zoneRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const charRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const animState = useRef({ moving: false, right: true });

  const x = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 500);
  const y = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 500);

  useEffect(() => {
    setMounted(true);
    // Guarantee character spawns exactly in the center after layout settles
    setTimeout(() => {
      if (mapRef.current) {
        x.set(mapRef.current.clientWidth / 2);
        y.set(mapRef.current.clientHeight / 2); 
      }
    }, 150);

    const handleKeyDown = (e: KeyboardEvent) => { 
      keys.current[e.key.toLowerCase()] = true; 
      if (e.code) keys.current[e.code.toLowerCase()] = true; // Supports Greek layout!
    };
    const handleKeyUp = (e: KeyboardEvent) => { 
      keys.current[e.key.toLowerCase()] = false; 
      if (e.code) keys.current[e.code.toLowerCase()] = false; 
    };
    
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [x, y]);

  useAnimationFrame((time, delta) => {
    if (!mounted || !mapRef.current) return;

    let moveX = 0;
    let moveY = 0;
    
    // Scale speed relative to the container width
    const baseSpeed = (delta / 16) * 4.5; 
    const scaleFactor = mapRef.current.clientWidth / 1920; 
    const speed = baseSpeed * Math.max(0.5, scaleFactor);

    if (keys.current["w"] || keys.current["keyw"] || keys.current["arrowup"]) moveY -= speed;
    if (keys.current["s"] || keys.current["keys"] || keys.current["arrowdown"]) moveY += speed;
    if (keys.current["a"] || keys.current["keya"] || keys.current["arrowleft"]) moveX -= speed;
    if (keys.current["d"] || keys.current["keyd"] || keys.current["arrowright"]) moveX += speed;

    const mapWidth = mapRef.current.clientWidth;
    const mapHeight = mapRef.current.clientHeight;

    // Boundary function: Much smoother and perfectly tailored to the 2D isometric layout
    const isWalkable = (px: number, py: number) => {
      // 1. Safe Room Bounds (Generous squares for each room)
      if (px > 0.08 && px < 0.45 && py > 0.08 && py < 0.45) return true; // Top Left (Tech)
      if (px > 0.55 && px < 0.92 && py > 0.08 && py < 0.45) return true; // Top Right (Experience)
      if (px > 0.08 && px < 0.45 && py > 0.55 && py < 0.92) return true; // Bottom Left (Education)
      if (px > 0.55 && px < 0.92 && py > 0.55 && py < 0.92) return true; // Bottom Right (Sports)
      
      // 2. Central Isometric Diamond (Smoothes out the sharp inner corners of the intersection)
      // Math.abs(x) + Math.abs(y) creates a perfect diamond shape in 2D space!
      if (Math.abs(px - 0.5) + Math.abs(py - 0.5) < 0.35) return true;
      
      // 3. Thick Diagonal Corridors (Allows easy walking without falling off the glass)
      if (px >= 0.25 && px <= 0.75 && py >= 0.25 && py <= 0.75) {
         if (Math.abs(px - py) < 0.15) return true; // Path TL to BR
         if (Math.abs((1 - px) - py) < 0.15) return true; // Path TR to BL
      }
      
      return false;
    };

    // ANTI-STUCK SYSTEM: If robot spawns or gets pushed outside valid area, pull it to center
    if (mapWidth > 0 && mapHeight > 0 && !isWalkable(x.get() / mapWidth, y.get() / mapHeight)) {
       x.set(mapWidth / 2);
       y.set(mapHeight / 2);
    }

    let targetX = x.get() + moveX;
    let targetY = y.get() + moveY;
    
    // Movement applying Wall Sliding collision logic
    const check = (tx: number, ty: number) => isWalkable(tx / mapWidth, ty / mapHeight);

    if (check(targetX, targetY)) {
      x.set(targetX);
      y.set(targetY);
    } else if (moveX !== 0 && check(targetX, y.get())) {
      x.set(targetX);
    } else if (moveY !== 0 && check(x.get(), targetY)) {
      y.set(targetY);
    }

    // Animation State Sync
    const movingNow = (moveX !== 0 || moveY !== 0);
    if (movingNow !== animState.current.moving) {
      animState.current.moving = movingNow;
      setIsMoving(movingNow);
    }

    if (moveX > 0 && !animState.current.right) {
      animState.current.right = true;
      setFacingRight(true);
    } else if (moveX < 0 && animState.current.right) {
      animState.current.right = false;
      setFacingRight(false);
    }

    // Collision Detection for Popups
    let collidingZone: string | null = null;
    if (charRef.current) {
      const charRect = charRef.current.getBoundingClientRect();
      for (const zone of cvZones) {
        const zoneElement = zoneRefs.current[zone.id];
        if (zoneElement) {
          const zoneRect = zoneElement.getBoundingClientRect();
          if (
            charRect.left < zoneRect.right &&
            charRect.right > zoneRect.left &&
            charRect.top < zoneRect.bottom &&
            charRect.bottom > zoneRect.top
          ) {
            collidingZone = zone.id;
            break;
          }
        }
      }
    }
    
    if (collidingZone !== activeZone) {
      setActiveZone(collidingZone);
    }
  });

  if (!mounted) return null;

  const activeZoneData = cvZones.find(z => z.id === activeZone);

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-slate-950 font-mono select-none overflow-hidden">
      
      {/* Dynamic CSS for the walking animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes walk {
          0% { transform: rotate(-25deg); }
          100% { transform: rotate(25deg); }
        }
        .animate-walk {
          animation: walk 0.25s ease-in-out infinite alternate;
        }
        .animate-walk-reverse {
          animation: walk 0.25s ease-in-out infinite alternate-reverse;
        }
      `}} />

      {/* --- ASPECT-RATIO LOCKED GAME MAP CONTAINER --- */}
      <div 
        ref={mapRef}
        className="relative w-full aspect-video bg-black overflow-hidden shadow-2xl shadow-blue-900/20"
        style={{ maxWidth: 'calc(100vh * 16 / 9)' }}
      >
        
        {/* Isometric Image Background - 110% Zoom for slightly wider feel */}
        <div className="absolute inset-0 bg-[url('/ai-map.jpg')] bg-cover bg-center bg-no-repeat opacity-100 scale-110" />
        
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.35)_100%)] pointer-events-none" />

        {/* Title Header (Smaller and higher up) */}
        <div className="absolute top-[3%] left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none bg-slate-900/90 px-6 py-3 rounded-xl border border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)] backdrop-blur-md">
          <h1 className="text-xl md:text-2xl font-black text-white tracking-widest drop-shadow-md">GEORGIOS ZERVAS</h1>
          <h2 className="text-blue-400 font-bold tracking-[0.3em] text-xs md:text-sm mt-0.5">INTERACTIVE CV</h2>
          
          <div className="mt-2.5 flex items-center justify-center gap-2 text-slate-300 text-[10px] md:text-xs bg-slate-800/80 py-1.5 px-4 rounded-full border border-slate-600 shadow-inner">
            <span className="font-bold text-white bg-slate-700 px-1.5 py-0.5 rounded shadow-sm border border-slate-600">Arrows</span>
            <span className="text-slate-400 font-semibold">to move</span>
          </div>
        </div>

        {/* --- MAP ZONES (INVISIBLE HITBOXES WITH ISOMETRIC LABELS) --- */}
        {cvZones.map((zone) => (
          <div 
            key={zone.id}
            ref={(el) => { zoneRefs.current[zone.id] = el; }}
            /* Invisible massive hitbox over the room */
            className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full flex flex-col items-center justify-center z-10 -translate-x-1/2 -translate-y-1/2"
            style={zone.position}
          >
            {/* Isometric Floor Decal */}
            <div 
              className={`
                px-4 md:px-6 py-2 md:py-4 rounded-xl backdrop-blur-md flex flex-col items-center gap-2 transition-all duration-500
                ${activeZone === zone.id 
                    ? "bg-slate-900/95 text-white border-2 border-white shadow-2xl " + zone.glow 
                    : "bg-white/90 text-slate-800 border-4 border-slate-300 shadow-lg"}
              `}
              style={{
                transform: activeZone === zone.id 
                  ? "rotateX(0deg) rotateZ(0deg) translateY(-40px) scale(1.1)" 
                  : "rotateX(60deg) rotateZ(-45deg) translateY(0px) scale(1.3)",
                transformStyle: "preserve-3d"
              }}
            >
              <div className={`transition-transform duration-500 ${activeZone === zone.id ? "scale-100" : "scale-125 mb-1"}`}>
                {zone.icon}
              </div>
              <span className="font-bold text-xs md:text-sm tracking-widest">{zone.title}</span>
            </div>
            
            {/* Small glowing spot on the floor when active */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl -z-10 transition-opacity duration-300 ${activeZone === zone.id ? zone.color + ' opacity-40' : 'opacity-0'}`} />
          </div>
        ))}

        {/* --- THE ANIMATED CHARACTER (ROBOT) --- */}
        <motion.div
          ref={charRef}
          style={{ x, y }}
          className="absolute top-0 left-0 -ml-4 -mt-5 z-50 pointer-events-none"
        >
          {/* Made Robot slightly bigger as requested: scale-[0.65] md:scale-[0.75] */}
          <div className="scale-[0.65] md:scale-[0.75] origin-bottom drop-shadow-[0_15px_10px_rgba(0,0,0,0.6)]">
            
            <div className={`relative w-16 h-20 transition-transform duration-150 ${facingRight ? 'scale-x-100' : '-scale-x-100'}`}>
              {/* Jetpack / Backpack */}
              <div className="absolute top-4 -left-2 w-4 h-10 bg-slate-400 rounded-l-lg border-2 border-slate-800" />
              
              {/* Head */}
              <div className="absolute top-0 left-2 w-12 h-10 bg-white rounded-2xl border-4 border-slate-800 z-20 overflow-hidden shadow-lg">
                {/* Visor */}
                <div className="absolute top-2 left-2 w-8 h-4 bg-slate-900 rounded-full flex items-center justify-around px-1">
                  <div className={`w-2 h-2 rounded-full ${isMoving ? 'emerald-400' : 'bg-cyan-400'} animate-pulse`} />
                  <div className={`w-2 h-2 rounded-full ${isMoving ? 'emerald-400' : 'bg-cyan-400'} animate-pulse`} />
                </div>
              </div>

              {/* Body */}
              <div className="absolute top-9 left-3 w-10 h-8 bg-cyan-500 rounded-lg border-4 border-slate-800 z-10 overflow-hidden">
                <div className="w-full h-full opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#000_2px,#000_4px)]" />
              </div>

              {/* Arms */}
              <div className={`absolute top-10 left-1 w-3 h-6 bg-slate-300 rounded-full border-2 border-slate-800 z-20 origin-top ${isMoving ? 'animate-walk-reverse' : ''}`} />
              <div className={`absolute top-10 right-0 w-3 h-6 bg-slate-300 rounded-full border-2 border-slate-800 z-0 origin-top ${isMoving ? 'animate-walk' : ''}`} />

              {/* Legs */}
              <div className={`absolute top-16 left-4 w-3 h-5 bg-slate-700 rounded-full border-2 border-slate-900 origin-top z-0 ${isMoving ? 'animate-walk' : ''}`} />
              <div className={`absolute top-16 right-3 w-3 h-5 bg-slate-700 rounded-full border-2 border-slate-900 origin-top z-0 ${isMoving ? 'animate-walk-reverse' : ''}`} />
            </div>
            
            {/* Ground shadow explicitly locked to feet */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-3 bg-black/60 rounded-full blur-[2px] z-0" />
          </div>
        </motion.div>
      </div>

      {/* --- CENTRAL DIALOGUE POPUP (LEFT SIDEBAR) --- */}
      <AnimatePresence>
        {activeZoneData && (
          <motion.div
            initial={{ opacity: 0, x: -40, y: "-50%" }}
            animate={{ opacity: 1, x: 0, y: "-50%" }}
            exit={{ opacity: 0, x: -40, y: "-50%" }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`pointer-events-auto fixed top-1/2 left-4 md:left-8 w-[92vw] md:w-[380px] lg:w-[420px] max-h-[90vh] overflow-y-auto z-50`}
          >
            <div className={`p-5 md:p-7 rounded-3xl border-2 bg-slate-900/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col ${activeZoneData.color.replace('bg-', 'border-').replace('500', '500/50')}`}>
              <div className="flex items-center gap-4 mb-4 border-b border-slate-700/50 pb-4">
                <div className="scale-110">{activeZoneData.icon}</div>
                <h2 className="text-xl font-bold uppercase tracking-widest text-white">{activeZoneData.title}</h2>
              </div>
              <div className="text-left text-slate-200">
                {activeZoneData.content}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
