import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, ChevronDown, Download, FileText, Github, Linkedin, Mail, Menu, Pause, Play, X } from "lucide-react";
import { HeroScene } from "../components/HeroScene";
import { HeroHud } from "../components/HeroHud";
import { TechSphere, TECH_DATA, TechNode } from "../components/TechSphere";
import { TechUniverse, TECH_ITEMS, TechCard } from "../components/TechUniverse";

type Project = {
  index: string;
  name: string;
  kind: string;
  stack: string;
  summary: string;
  architecture: string;
  image: string;
  metrics: { label: string; value: string }[];
  tags: string[];
};

const projects: Project[] = [
  {
    index: "01",
    name: "VisionMind",
    kind: "MULTIMODAL INTELLIGENCE",
    stack: "PYTHON · YOLOV8 · OPENCV · RAG · FASTAPI",
    summary: "A multimodal AI reasoning layer that processes high-throughput visual streams and contextual vector retrieval into real-time operational decisions.",
    architecture: "Dual-stream pipeline combining custom YOLOv8 object segmentation with a LangChain/RAG vector context store for domain-specific query reasoning.",
    image: "/visionmind.png",
    metrics: [
      { label: "INFERENCE", value: "32ms / frame" },
      { label: "MODEL CORE", value: "YOLOv8 + ViT" },
      { label: "CONTEXT", value: "RAG Hybrid" },
    ],
    tags: ["Computer Vision", "Multimodal", "Vector Search", "Real-Time API"],
  },
  {
    index: "02",
    name: "Sales Forecasting System",
    kind: "PREDICTIVE DATA INTELLIGENCE",
    stack: "PYTHON · MACHINE LEARNING · XGBOOST · POWER BI",
    summary: "Enterprise time-series forecasting architecture converting high-volume transactional records into 90-day trajectory models with confidence intervals.",
    architecture: "Automated feature engineering pipeline with lag variables and rolling averages, feeding an ensemble XGBoost regressor synced to interactive BI dashboards.",
    image: "/sfssystem.png",
    metrics: [
      { label: "HORIZON", value: "90-Day Curve" },
      { label: "ACCURACY", value: "94.2% Backtested" },
      { label: "PIPELINE", value: "Automated ETL" },
    ],
    tags: ["Time Series", "Feature Eng", "Predictive Analytics", "Power BI"],
  },
  {
    index: "03",
    name: "AquaMapper",
    kind: "GEOGRAPHIC DECISION SYSTEM",
    stack: "GIS · REACT · DJANGO · MONGODB",
    summary: "Spatial intelligence platform analyzing digital elevation contours, hydrological flow lines, and precipitation history to compute optimal rainwater harvesting structures.",
    architecture: "Spatial raster parsing engine calculating runoff accumulation and topological slope gradients, rendered on an interactive map with GeoJSON geometry layers.",
    image: "/aquamapper.png",
    metrics: [
      { label: "RESOLUTION", value: "10m DEM Grid" },
      { label: "SPATIAL ENGINE", value: "Flow Accumulation" },
      { label: "DATABASE", value: "MongoDB Spatial" },
    ],
    tags: ["GIS Spatial", "Hydro Modeling", "React", "Terrain Analysis"],
  },
  {
    index: "04",
    name: "AgriGuard",
    kind: "COMPUTER VISION INSPECTION",
    stack: "YOLOV8 · OPENCV · EMBEDDED C++ · ESP32-CAM",
    summary: "Edge-computed crop pathology detection system pairing real-time optical disease classification with automated microcontroller relay actuators.",
    architecture: "On-device RGB565 optical processing pipeline with lightweight neural weights triggering precision GPIO micro-relays for targeted agricultural mitigation.",
    image: "/agriguard.png",
    metrics: [
      { label: "EDGE RUNTIME", value: "Embedded ESP32" },
      { label: "F1 SCORE", value: "96.4% Precision" },
      { label: "ACTUATION", value: "Hardware Solenoid" },
    ],
    tags: ["Edge AI", "Embedded C++", "Pathology Detection", "IoT Actuators"],
  },
];

const systems = [
  { id: "AI / ML", label: "01", text: "Neural paths activate. Models turn raw signals into predictions and classifications.", glyph: "network" },
  { id: "DATA", label: "02", text: "Point fields, trajectories and relational paths surface from the floor.", glyph: "chart" },
  { id: "GENERATIVE AI", label: "03", text: "Retrieval volumes connect to language interfaces and reasoning layers.", glyph: "orbit" },
  { id: "CLOUD", label: "04", text: "Infrastructure nodes assemble along a deployment spine.", glyph: "cloud" },
  { id: "FULL STACK", label: "05", text: "Client surface, API relay, data vessel and cloud node form one flow.", glyph: "stack" },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function SignalField({ variant = "core", compact = false }: { variant?: string; compact?: boolean }) {
  const points = useMemo(() => Array.from({ length: compact ? 36 : 72 }, (_, i) => {
    const angle = (i / (compact ? 36 : 72)) * Math.PI * 2;
    const radius = 16 + ((i * 19) % 36);
    return {
      left: 50 + Math.cos(angle * (i % 3 ? 1.8 : 1)) * radius,
      top: 50 + Math.sin(angle * (i % 4 ? 1.12 : 0.75)) * radius,
      delay: `${(i % 11) * 0.14}s`,
      scale: 0.55 + (i % 5) * 0.16,
    };
  }), [compact]);

  return (
    <div className={`signal-field signal-${variant} ${compact ? "signal-compact" : ""}`} aria-hidden="true">
      <div className="signal-grid" />
      <div className="signal-orbit orbit-a" />
      <div className="signal-orbit orbit-b" />
      <div className="signal-orbit orbit-c" />
      <div className="signal-core-shell"><div className="signal-core-inner" /></div>
      <div className="signal-needle" />
      {points.map((point, i) => (
        <i
          key={i}
          className="signal-node"
          style={{
            left: `${point.left}%`,
            top: `${point.top}%`,
            animationDelay: point.delay,
            transform: `scale(${point.scale})`,
          }}
        />
      ))}
      <span className="signal-cross cross-a" />
      <span className="signal-cross cross-b" />
      <span className="signal-label label-a">LATENCY 0.04MS</span>
      <span className="signal-label label-b">NODE FIELD / 72</span>
    </div>
  );
}

function MicroLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="micro-label inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#B8B3AA]">
      <span className="micro-dot w-1.5 h-1.5 rounded-full bg-[#D21F26]" />
      {children}
    </span>
  );
}

function AboutPortrait() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotation({ x: y * -16, y: x * 18 });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[440px] mx-auto aspect-[4/5] rounded-sm overflow-hidden flex items-end justify-center cursor-pointer select-none"
      style={{ perspective: "1000px" }}
    >
      <div
        className="relative w-full h-full transition-transform duration-200 ease-out flex items-end justify-center"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090d] via-[#09090d]/60 to-transparent border border-[#1e1e24]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-[#D21F26]/20 animate-spin [animation-duration:40s] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full border border-dashed border-[#D21F26]/30 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] bg-[#D21F26]/20 rounded-full blur-[90px] pointer-events-none" />

        <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D21F26] to-transparent z-30 animate-pulse pointer-events-none" style={{ top: "45%" }} />

        <div className="absolute top-3 left-3 z-30 font-mono text-[9px] uppercase tracking-[0.2em] text-[#B8B3AA] bg-black/80 px-2 py-1 border border-[#222]">
          BIOMETRIC // ARCHITECT
        </div>
        <div className="absolute top-3 right-3 z-30 font-mono text-[9px] uppercase tracking-[0.2em] text-[#33D17A] bg-black/80 px-2 py-1 border border-[#222] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#33D17A] animate-ping" />
          ACTIVE
        </div>

        <img
          src="/myimage.png"
          alt="Fakruddin Syed"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.includes("hero-portrait.png")) {
              target.src = "/hero-portrait.png";
            }
          }}
          className="relative z-20 w-auto h-[90%] object-contain object-bottom filter contrast-110 brightness-100 drop-shadow-[0_0_35px_rgba(210,31,38,0.45)] transition-transform duration-300"
          style={{
            maskImage: "linear-gradient(to bottom, black 0%, black 80%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 80%, transparent 100%)",
            transform: "translateZ(30px)",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-tr from-[#D21F26]/20 via-transparent to-red-500/10 mix-blend-color-dodge pointer-events-none z-20" />

        <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black via-black/80 to-transparent z-30 border-b border-[#D21F26]/40 flex items-center justify-between px-4 font-mono text-[9px] tracking-widest text-[#B8B3AA]">
          <span>INDEX // FAKRUDDIN.SYED</span>
          <span className="text-[#D21F26]">SYS 2026.04</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("WORK");
  const [activeProject, setActiveProject] = useState(0);
  const [activeSystem, setActiveSystem] = useState(0);
  const [introVisible, setIntroVisible] = useState(true);
  const [introReady, setIntroReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [cursor, setCursor] = useState({ x: -100, y: -100, label: "" });
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const [selectedTech, setSelectedTech] = useState<TechNode>(TECH_DATA[0]);
  const [activeUniverseItem, setActiveUniverseItem] = useState<TechCard>(TECH_ITEMS[0]);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const lastSection = useRef("WORK");

  useEffect(() => {
    if (isPausedByUser) return;
    const interval = setInterval(() => {
      setActiveProject((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPausedByUser]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroReady(true), 1200);
    const hideTimer = window.setTimeout(() => setIntroVisible(false), 3200);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    const sections = ["work", "projects", "systems", "experience", "lab", "about", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = sections.indexOf(visible.target.id);
        const name =
          index <= 0
            ? "WORK"
            : index === 1
            ? "PROJECTS"
            : index === 2
            ? "SYSTEMS"
            : index === 3
            ? "EXPERIENCE"
            : index === 4
            ? "LAB"
            : index === 5
            ? "ABOUT"
            : "CONTACT";
        if (lastSection.current !== name) {
          lastSection.current = name;
          setActiveSection(name);
        }
      },
      { threshold: [0.25, 0.5, 0.75] }
    );
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const move = (event: MouseEvent) =>
      setCursor((current) => ({ ...current, x: event.clientX, y: event.clientY }));
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const navItems = [
    ["WORK", "work"],
    ["PROJECTS", "projects"],
    ["SYSTEMS", "systems"],
    ["EXPERIENCE", "experience"],
    ["LAB", "lab"],
    ["ABOUT", "about"],
  ] as const;

  const handleNav = (label: string, id: string) => {
    setMenuOpen(false);
    setActiveSection(label);
    scrollToId(id);
  };

  return (
    <div
      className="site-shell relative min-h-screen text-[#F1EDE5]"
      style={{ backgroundColor: "#050505", color: "#F1EDE5" }}
      onMouseLeave={() => setCursor((current) => ({ ...current, label: "" }))}
    >
      <div className="noise" aria-hidden="true" />
      <div
        className={`custom-cursor ${cursor.label ? "cursor-active" : ""}`}
        style={{ left: cursor.x, top: cursor.y }}
      >
        <span>{cursor.label}</span>
      </div>

      {introVisible && (
        <div className={`intro ${introReady ? "intro-ready" : ""}`}>
          <div className="intro-readout">
            <span>INITIALIZING</span>
            <strong>FAKRUDDIN.SYED</strong>
            <span>AI SYSTEMS / DATA / CLOUD / INTELLIGENCE</span>
          </div>
          <div className="intro-portrait" aria-hidden="true">
            <img 
              src="/hero-portrait.png" 
              alt="" 
              onError={(e) => {
                const t = e.currentTarget;
                if (!t.src.includes("fakhruddin-portrait_d009928d.png")) {
                  t.src = "/manus-storage/fakhruddin-portrait_d009928d.png";
                }
              }}
            />
            <span />
          </div>
          <div className="intro-constellation">
            <SignalField variant="intro" compact />
          </div>
          <button className="intro-skip" onClick={() => setIntroVisible(false)}>
            SKIP INTRO <ArrowUpRight size={13} />
          </button>
          <div className="intro-progress">
            <span />
          </div>
        </div>
      )}

      {/* FIXED NAVIGATION */}
      <header className="topbar">
        <button
          className="wordmark"
          onClick={() => scrollToId("work")}
          onMouseEnter={() => setCursor({ ...cursor, label: "HOME" })}
          onMouseLeave={() => setCursor({ ...cursor, label: "" })}
        >
          FAKRUDDIN<span>.</span>SYED
        </button>
        <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`} aria-label="Primary navigation">
          {navItems.map(([label, id], i) => (
            <button
              key={id}
              className={activeSection === label ? "nav-active" : ""}
              onClick={() => handleNav(label, id)}
            >
              <span>0{i + 1}</span>
              {label}
            </button>
          ))}
        </nav>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <div className="system-status">
          <span className="status-dot" /> SYSTEM ONLINE
        </div>
      </header>

      {/* RAILS */}
      <div className="side-rail side-left">
        <span>AI / DATA / CLOUD</span>
        <span>∞</span>
      </div>
      <div className="side-rail side-right">
        <span>SCROLL TO ENTER</span>
        <ArrowDown size={13} />
      </div>

      <main style={{ backgroundColor: "#050505" }}>
        {/* 1. HERO SECTION */}
        <section id="work" className="relative w-full min-h-screen bg-[#050505] overflow-hidden">
          <HeroScene />
          <HeroHud />
        </section>

        {/* 2. SELECTED WORK SECTION */}
        <section 
          id="projects" 
          style={{ backgroundColor: "#050505", color: "#F1EDE5" }}
          className="relative w-full py-28 border-t border-[#18181c] z-20"
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-[#B8B3AA] uppercase mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D21F26]" />
                  01 // SELECTED WORK
                </div>
                <h2 
                  className="text-6xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-[#F1EDE5] leading-none" 
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  INTELLIGENCE <span className="text-[#D21F26]">IN MOTION.</span>
                </h2>
              </div>
              <p className="font-mono text-xs text-[#B8B3AA] max-w-sm uppercase tracking-wider leading-relaxed">
                Production-grade machine intelligence architectures and telemetry pipelines.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div 
                className="lg:col-span-7 bg-[#09090d] border border-[#1e1e24] p-5 sm:p-7 relative overflow-hidden"
                onMouseEnter={() => setIsPausedByUser(true)}
                onMouseLeave={() => setIsPausedByUser(false)}
              >
                <div className="flex items-center justify-between border-b border-[#1e1e24] pb-3 mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#B8B3AA]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D21F26] animate-ping" />
                    <span>SYSTEM VIEW // {projects[activeProject].index}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500 font-normal">CYCLE: 5S</span>
                    <span className="text-[#D21F26] font-bold tracking-wider">{projects[activeProject].kind}</span>
                  </div>
                </div>

                <div className="relative w-full h-[260px] sm:h-[350px] bg-[#050507] border border-[#1e1e24] overflow-hidden mb-6 group">
                  <div className="absolute top-2.5 left-2.5 z-20 font-mono text-[9px] text-[#B8B3AA]/80 bg-black/80 px-2 py-0.5 border border-[#222]">
                    FEED // {projects[activeProject].name.toUpperCase()}
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 z-20 font-mono text-[9px] text-[#D21F26] bg-black/80 px-2 py-0.5 border border-[#222]">
                    ACTIVE INTERFACE
                  </div>

                  <img
                    key={projects[activeProject].name}
                    src={projects[activeProject].image}
                    alt={projects[activeProject].name}
                    className="w-full h-full object-cover object-center filter contrast-105 brightness-95 transition-all duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6 font-mono">
                  {projects[activeProject].metrics.map((m) => (
                    <div key={m.label} className="border border-[#1a1a20] bg-[#0c0c10] p-3">
                      <span className="block text-[9px] uppercase tracking-[0.2em] text-[#B8B3AA]/60 mb-1">
                        {m.label}
                      </span>
                      <span className="block text-xs sm:text-sm font-bold text-[#F1EDE5] tracking-wide">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 text-xs sm:text-[13px] leading-relaxed font-sans text-[#B8B3AA]">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D21F26] block mb-1 font-bold">
                      // OPERATIONAL OBJECTIVE
                    </span>
                    <p>{projects[activeProject].summary}</p>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F1EDE5] block mb-1 font-bold">
                      // ARCHITECTURE &amp; PIPELINE
                    </span>
                    <p>{projects[activeProject].architecture}</p>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-[#1e1e24] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {projects[activeProject].tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider bg-[#121217] border border-[#222228] text-[#F1EDE5]/90"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D21F26] font-bold">
                    STATUS: VERIFIED
                  </span>
                </div>
              </div>

              <div 
                className="lg:col-span-5 flex flex-col divide-y divide-[#18181c] border-t border-b border-[#18181c]" 
                role="tablist"
                onMouseEnter={() => setIsPausedByUser(true)}
                onMouseLeave={() => setIsPausedByUser(false)}
              >
                {projects.map((project, index) => {
                  const isActive = activeProject === index;
                  return (
                    <button
                      key={project.name}
                      onClick={() => setActiveProject(index)}
                      className={`p-6 text-left transition-all duration-300 relative group cursor-pointer ${
                        isActive ? "bg-[#09090d]" : "hover:bg-[#070709]"
                      }`}
                      role="tab"
                      aria-selected={isActive}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#D21F26] shadow-[0_0_12px_#D21F26]" />
                      )}

                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[10px] tracking-[0.25em] text-[#B8B3AA]/60">
                          {project.index} // ARCHITECTURE
                        </span>
                        <span 
                          className={`font-mono text-xs transition-colors duration-300 ${
                            isActive ? "text-[#D21F26]" : "text-[#B8B3AA]/30 group-hover:text-[#F1EDE5]"
                          }`}
                        >
                          {isActive ? (isPausedByUser ? "[PAUSED]" : "[ACTIVE]") : "[SELECT]"}
                        </span>
                      </div>

                      <h3 
                        className={`text-3xl sm:text-4xl font-black uppercase tracking-tight transition-colors ${
                          isActive ? "text-[#F1EDE5]" : "text-[#B8B3AA]/50 group-hover:text-[#F1EDE5]"
                        }`}
                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                      >
                        {project.name}
                      </h3>

                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D21F26] mt-1">
                        {project.kind}
                      </p>

                      {isActive && (
                        <>
                          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#B8B3AA] mt-3 border-t border-[#1e1e24] pt-3">
                            CORE STACK: <span className="text-[#F1EDE5]">{project.stack}</span>
                          </p>
                          
                          {!isPausedByUser && (
                            <div className="w-full bg-[#18181c] h-[2px] mt-3 overflow-hidden">
                              <div 
                                key={activeProject} 
                                className="bg-[#D21F26] h-full w-full"
                                style={{
                                  animation: "progress 5s linear infinite"
                                }}
                              />
                            </div>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 3. SYSTEMS SECTION */}
        <section id="systems" className="systems section-block dark-section" style={{ backgroundColor: "#050505" }}>
          <div className="systems-top container-wide">
            <div>
              <MicroLabel>02 / CAPABILITY ARCHITECTURE</MicroLabel>
              <h2>
                THE
                <br />
                <span>SYSTEMS.</span>
              </h2>
            </div>
            <div className="systems-copy">
              <span className="chapter-counter">{systems[activeSystem].label} / 05</span>
              <p>{systems[activeSystem].text}</p>
            </div>
          </div>
          <div className="systems-console container-wide">
            <div className="system-orb">
              <div className="orb-ring ring-one" />
              <div className="orb-ring ring-two" />
              <div className="orb-core" />
              <div className={`orb-glyph glyph-${systems[activeSystem].glyph}`}>
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="orb-signal signal-left" />
              <div className="orb-signal signal-right" />
            </div>
            <div className="system-selector">
              {systems.map((system, index) => (
                <button
                  key={system.id}
                  className={activeSystem === index ? "system-active" : ""}
                  onClick={() => setActiveSystem(index)}
                >
                  <span>{system.label}</span>
                  <strong>{system.id}</strong>
                  <i />
                </button>
              ))}
            </div>
          </div>
          <div className="system-footer container-wide">
            <span>INTERACTIVE CAPABILITY MAP</span>
            <span>
              SELECT A SYSTEM TO RECONFIGURE THE ENGINE <ChevronDown size={13} />
            </span>
          </div>
        </section>

        {/* 4. EXPERIENCE & 3D TECH UNIVERSE (MISSION LOG) */}
        <section 
          id="experience" 
          style={{ backgroundColor: "#050505", color: "#F1EDE5" }}
          className="relative w-full py-28 border-t border-[#18181c] z-20"
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-[#B8B3AA] uppercase mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D21F26]" />
                  03 // VERIFIED ARSENAL &amp; SYSTEMS LOG
                </div>
                <h2 
                  className="text-7xl sm:text-8xl lg:text-9xl font-black uppercase tracking-tight text-[#F1EDE5] leading-none" 
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  MISSION <span className="text-[#D21F26]">LOG.</span>
                </h2>
              </div>
              <p className="font-mono text-xs text-[#B8B3AA] max-w-sm uppercase tracking-wider leading-relaxed">
                The complete engineering universe: artificial intelligence models, computer vision pipelines, databases, and interface architectures.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 bg-[#09090d] border border-[#1e1e24] p-4 sm:p-6 relative overflow-hidden">
                <TechUniverse
                  onSelect={setActiveUniverseItem}
                  activeItem={activeUniverseItem}
                />
              </div>

              <div className="lg:col-span-4 flex flex-col space-y-6">
                <div className="bg-[#09090d] border border-[#1e1e24] p-6 sm:p-8 relative">
                  <div
                    className="absolute top-0 left-0 w-full h-[3px]"
                    style={{ backgroundColor: activeUniverseItem.color }}
                  />

                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] tracking-[0.25em] text-[#D21F26] font-bold">
                      {activeUniverseItem.category}
                    </span>
                    <span
                      className="font-mono text-[9px] uppercase px-2 py-0.5 border"
                      style={{ borderColor: activeUniverseItem.color, color: activeUniverseItem.color }}
                    >
                      {activeUniverseItem.badge}
                    </span>
                  </div>

                  <h3
                    className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#F1EDE5] leading-none mb-4"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {activeUniverseItem.name}
                  </h3>

                  <p className="text-xs sm:text-[13px] text-[#B8B3AA] font-sans leading-relaxed mb-6">
                    {activeUniverseItem.summary}
                  </p>

                  <div className="pt-4 border-t border-[#1a1a22] grid grid-cols-2 gap-3 font-mono text-[10px] uppercase tracking-wider">
                    <div>
                      <span className="text-[#B8B3AA]/60 block mb-0.5">DEPLOYMENT</span>
                      <span className="text-[#33D17A]">● PRODUCTION</span>
                    </div>
                    <div>
                      <span className="text-[#B8B3AA]/60 block mb-0.5">INTEGRATION</span>
                      <span className="text-[#F1EDE5]">HIGH-FIDELITY</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#09090d] border border-[#1e1e24] p-6 font-mono text-xs">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8B3AA]/60 block mb-3">
                    ENGINEERING PILLARS
                  </span>
                  <div className="space-y-2.5 text-[11px] text-[#F1EDE5]/90">
                    <div className="flex items-center gap-2">
                      <span className="text-[#D21F26]">01 ›</span>
                      <span>Deep Ideas · Scalable Build · Real-World Impact</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#D21F26]">02 ›</span>
                      <span>Multimodal Reasoning &amp; Low-Latency Inference</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#D21F26]">03 ›</span>
                      <span>Full-Stack Sovereignty from Silicon to Pixel</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. LAB SECTION */}
        <section id="lab" className="lab section-block dark-section" style={{ backgroundColor: "#050505" }}>
          <div className="lab-header container-wide">
            <div>
              <MicroLabel>04 / RESEARCH SPACE</MicroLabel>
              <h2 
      className="text-6xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-[#F1EDE5] leading-none mt-2"
      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
    >
      EXPERIMENT
      <br />
      <span className="text-[#D21F26]">LAB.</span>
    </h2>
            </div>
            <p>
              Unfinished ideas are still useful. This is where the next intelligence systems begin.
            </p>
          </div>
          <div className="lab-grid container-wide">
            {[
              "GENERATIVE AI",
              "RAG",
              "COMPUTER VISION",
              "WEBGL",
              "DATA VISUALIZATION",
              "AI INTERFACES",
            ].map((item, index) => (
              <button
                className="lab-module"
                key={item}
                onMouseEnter={() => setCursor({ ...cursor, label: "EXPLORE" })}
                onMouseLeave={() => setCursor({ ...cursor, label: "" })}
              >
                <span className="lab-index">0{index + 1}</span>
                <span className={`lab-symbol symbol-${index}`}>
                  <i />
                  <i />
                  <i />
                </span>
                <strong>{item}</strong>
                <small>
                  IN EXPLORATION <ArrowUpRight size={12} />
                </small>
              </button>
            ))}
          </div>
        </section>

        {/* 6. ABOUT SECTION (WHO AM I) WITH 3D HOLOGRAPHIC PORTRAIT */}
        <section 
          id="about" 
          style={{ backgroundColor: "#050505", color: "#F1EDE5" }}
          className="relative w-full py-28 border-t border-[#18181c] z-20"
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 flex justify-center">
                <AboutPortrait />
              </div>

              <div className="lg:col-span-7 space-y-7">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-[#B8B3AA] uppercase mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D21F26]" />
                    05 // IDENTITY DOSSIER
                  </div>
                  <h2 
                    className="text-7xl sm:text-8xl lg:text-9xl font-black uppercase tracking-tight text-[#F1EDE5] leading-none mb-3"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    WHO <span className="text-[#D21F26]">AM I?</span>
                  </h2>
                  <div className="font-mono text-xs uppercase tracking-[0.22em] text-[#D21F26] font-bold">
                    FAKRUDDIN SYED // AI &amp; SYSTEMS ARCHITECT
                  </div>
                </div>

                <div className="bg-[#09090d] border border-[#1e1e24] p-6 sm:p-8 space-y-4">
                  <p className="text-sm sm:text-base text-[#F1EDE5] leading-relaxed font-sans font-medium">
                    I build intelligent, production-ready systems that turn raw data streams into decisive action.
                  </p>
                  <p className="text-xs sm:text-[13px] text-[#B8B3AA] leading-relaxed font-sans">
                    My engineering focuses on the intersection of deep learning, computer vision, vector-augmented intelligence, and high-performance full-stack systems. From real-time edge defect inference on bare-metal microcontrollers to automated enterprise forecasting engines backtested to institutional standards, every architecture I ship is engineered with mathematical clarity and execution speed.
                  </p>
                  <p className="text-xs sm:text-[13px] text-[#B8B3AA] leading-relaxed font-sans">
                    I do not merely train isolated neural models; I design the complete lifecycle—hardware ingestion, low-latency API relays, vector embeddings, and real-time interactive user interfaces.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
                  <div className="bg-[#0c0c10] border border-[#1a1a20] p-4">
                    <span className="block text-[9px] text-[#D21F26] uppercase mb-1 font-bold">CORE 01</span>
                    <strong className="text-xs sm:text-sm text-[#F1EDE5] block">AI &amp; ML</strong>
                    <span className="text-[9px] text-[#B8B3AA]/60 uppercase">Deep Models</span>
                  </div>
                  <div className="bg-[#0c0c10] border border-[#1a1a20] p-4">
                    <span className="block text-[9px] text-[#D21F26] uppercase mb-1 font-bold">CORE 02</span>
                    <strong className="text-xs sm:text-sm text-[#F1EDE5] block">RAG &amp; LLMs</strong>
                    <span className="text-[9px] text-[#B8B3AA]/60 uppercase">Reasoning</span>
                  </div>
                  <div className="bg-[#0c0c10] border border-[#1a1a20] p-4">
                    <span className="block text-[9px] text-[#D21F26] uppercase mb-1 font-bold">CORE 03</span>
                    <strong className="text-xs sm:text-sm text-[#F1EDE5] block">EDGE VISION</strong>
                    <span className="text-[9px] text-[#B8B3AA]/60 uppercase">Embedded C++</span>
                  </div>
                  <div className="bg-[#0c0c10] border border-[#1a1a20] p-4">
                    <span className="block text-[9px] text-[#D21F26] uppercase mb-1 font-bold">CORE 04</span>
                    <strong className="text-xs sm:text-sm text-[#F1EDE5] block">FULL STACK</strong>
                    <span className="text-[9px] text-[#B8B3AA]/60 uppercase">GPU / WebGL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. CONTACT & RESUME SECTION */}
        <section
          id="contact"
          className="relative py-28 overflow-hidden z-20"
          style={{ backgroundColor: "#050505", color: "#F1EDE5" }}
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 relative z-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column: Proportional Modern Typography */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-[#B8B3AA] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D21F26] animate-ping" />
                  06 // INITIATE TRANSMISSION
                </div>

                <h2
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-bold text-[#F1EDE5] tracking-tight leading-[1.04] uppercase"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  LET'S BUILD
                  <br />
                  <span className="text-[#D21F26] drop-shadow-[0_0_25px_rgba(210,31,38,0.45)]">
                    SOMETHING
                  </span>
                  <br />
                  INTELLIGENT.
                </h2>

                <p className="text-xs sm:text-sm text-[#B8B3AA] max-w-md leading-relaxed font-sans pt-1">
                  Have a complex problem, a high-throughput signal worth finding, or an intelligent system that needs to become reality?
                </p>

                <div className="pt-6 border-t border-[#1c1c22] flex flex-wrap items-center gap-6 font-mono text-xs">
                  <a
                    href="https://linkedin.com/in/fakruddin-syed-11b867295"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#B8B3AA] hover:text-[#F1EDE5] transition-colors"
                  >
                    <Linkedin size={15} className="text-[#D21F26]" /> LINKEDIN
                  </a>

                  <a
                    href="https://github.com/FakhruBhoi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#B8B3AA] hover:text-[#F1EDE5] transition-colors"
                  >
                    <Github size={15} className="text-[#D21F26]" /> GITHUB
                  </a>

                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=syed.fakru06@gmail.com&su=Project%20Inquiry%20%2F%20Collaboration"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#B8B3AA] hover:text-[#F1EDE5] transition-colors"
                  >
                    <Mail size={15} className="text-[#D21F26]" /> EMAIL
                  </a>
                </div>
              </div>

              {/* Right Column: Tactical Interactive Resume Card */}
              <div className="lg:col-span-5">
                <div className="bg-[#09090d] border border-[#1e1e24] p-6 sm:p-8 relative group hover:border-[#D21F26]/60 transition-all duration-300 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D21F26] to-transparent" />

                  <div className="flex items-center justify-between pb-4 border-b border-[#1c1c22] font-mono text-[10px] tracking-[0.22em] text-[#B8B3AA] uppercase">
                    <span className="flex items-center gap-2">
                      <FileText size={14} className="text-[#D21F26]" />
                      CURRICULUM VITAE
                    </span>
                    <span className="text-[#33D17A]">● READY</span>
                  </div>

                  <div className="py-6">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D21F26] block mb-1">
                      VERIFIED CREDENTIALS
                    </span>
                    <h3
                      className="text-3xl font-black uppercase text-[#F1EDE5] tracking-tight mb-2"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      FAKRUDDIN SYED
                    </h3>
                    <p className="text-xs text-[#B8B3AA] font-sans leading-relaxed">
                      AI &amp; Data Systems Engineer · Machine Learning · Computer Vision · Full Stack Architectures.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#1c1c22] font-mono text-[11px] uppercase tracking-[0.18em]">
                    <button
                      type="button"
                      onClick={() => setIsResumeOpen(true)}
                      className="w-full py-3.5 bg-[#D21F26] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#ff1e2d] transition-all shadow-[0_0_25px_rgba(210,31,38,0.5)] cursor-pointer"
                    >
                      <span>INSPECT</span>
                      <ArrowUpRight size={14} />
                    </button>

                    <a
                      href="/FakruddinsResume.pdf"
                      download="FakruddinsResume.pdf"
                      className="w-full py-3.5 border border-[#26262e] bg-[#0d0d12] text-[#F1EDE5] font-bold flex items-center justify-center gap-2 hover:border-[#D21F26] hover:text-white transition-all cursor-pointer text-center"
                    >
                      <Download size={13} className="text-[#D21F26]" />
                      <span>PDF</span>
                    </a>
                  </div>

                  <div className="mt-4 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-[#B8B3AA]/50">
                    PDF FORMAT // UPDATED 2026.04
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <button
        className="motion-toggle"
        onClick={() => setIsPlaying(!isPlaying)}
        aria-label={isPlaying ? "Pause ambient motion" : "Play ambient motion"}
      >
        {isPlaying ? <Pause size={13} /> : <Play size={13} />}{" "}
        <span>{isPlaying ? "MOTION / ON" : "MOTION / OFF"}</span>
      </button>

      <footer className="footer" style={{ backgroundColor: "#050505" }}>
        <span>FAKRUDDIN.SYED / INTELLIGENCE ENGINE</span>
        <span>AI × DATA × CLOUD × ENGINEERING</span>
        <span>© 2026</span>
      </footer>

      {/* FULL-SCREEN RESUME DOSSIER MODAL */}
      {isResumeOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsResumeOpen(false)}
        >
          <div 
            className="relative w-full max-w-5xl h-[88vh] bg-[#09090d] border border-[#222228] flex flex-col shadow-[0_0_60px_rgba(210,31,38,0.3)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c1c22] bg-[#050507] font-mono text-[11px] uppercase tracking-[0.2em] text-[#B8B3AA]">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#D21F26] animate-ping" />
                <span className="text-[#F1EDE5] font-bold">FAKRUDDINSRESUME.PDF</span>
              </div>
              
              <div className="flex items-center gap-4">
                <a
                  href="/FakruddinsResume.pdf"
                  download="FakruddinsResume.pdf"
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D21F26] text-white font-bold text-[10px] tracking-wider hover:bg-[#ff1e2d] transition-colors"
                >
                  <Download size={13} /> DOWNLOAD PDF
                </a>

                <button 
                  onClick={() => setIsResumeOpen(false)}
                  className="text-[#B8B3AA] hover:text-[#D21F26] transition-colors p-1 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 w-full bg-[#0d0d12] p-2">
              <iframe
                src="/FakruddinsResume.pdf"
                title="Fakruddin Syed Resume"
                className="w-full h-full border-0 rounded-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}