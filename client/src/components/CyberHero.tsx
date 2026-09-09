import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";

const CAPABILITIES = [
  "MACHINE LEARNING",
  "GENERATIVE AI",
  "LLMs & RAG",
  "COMPUTER VISION",
  "DATA SCIENCE",
  "FULL STACK",
];

export const CyberHero: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const bootRef = useRef<HTMLDivElement>(null);
  const [booted, setBooted] = useState(false);

  // --- THREE.JS 3D ENVIRONMENT ---
  useEffect(() => {
    if (!canvasRef.current || !mountRef.current) return;
    const canvas = canvasRef.current;
    const container = mountRef.current;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050507, 0.045);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7.0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const world = new THREE.Group();
    scene.add(world);

    // 3D Anchor shifted to the right to frame the portrait
    const heroAnchor = new THREE.Group();
    heroAnchor.position.set(1.5, -0.4, 0);
    world.add(heroAnchor);

    // 1. AI CORE REACTOR PEDESTAL (Below Bust)
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, -1.9, -0.4);
    heroAnchor.add(coreGroup);

    const ringConfigs = [
      { r: 2.2, tube: 0.015, seg: 64, color: 0x660810, speed: 0.002 },
      { r: 1.7, tube: 0.02, seg: 54, color: 0xd91424, speed: -0.003 },
      { r: 1.2, tube: 0.03, seg: 40, color: 0xff2e3d, speed: 0.005 },
      { r: 0.7, tube: 0.04, seg: 28, color: 0xff001a, speed: -0.007 },
    ];
    const rings: THREE.Mesh[] = [];

    ringConfigs.forEach((cfg) => {
      const geom = new THREE.TorusGeometry(cfg.r, cfg.tube, 8, cfg.seg);
      const mat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        wireframe: true,
        transparent: true,
        opacity: 0.65,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.rotation.x = Math.PI / 2.18;
      coreGroup.add(mesh);
      rings.push(mesh);
    });

    // 2. CYBER LASER SPLINE COIL
    const curvePoints = [];
    for (let i = 0; i <= 60; i++) {
      const theta = (i / 60) * Math.PI * 3.6;
      curvePoints.push(
        new THREE.Vector3(
          Math.cos(theta) * (1.45 + (i / 60) * 0.3),
          (i / 60) * 2.8 - 1.3,
          Math.sin(theta) * (1.1 + (i / 60) * 0.2)
        )
      );
    }
    const spline = new THREE.CatmullRomCurve3(curvePoints);
    const laserGeom = new THREE.TubeGeometry(spline, 64, 0.014, 8, false);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0xd21f26,
      transparent: true,
      opacity: 0.85,
    });
    const laserCoil = new THREE.Mesh(laserGeom, laserMat);
    laserCoil.rotation.y = 0.5;
    heroAnchor.add(laserCoil);

    // 3. FLOATING RUBY & OBSIDIAN SHARDS
    const shardGeom = new THREE.OctahedronGeometry(0.12, 0);
    const shardMat = new THREE.MeshStandardMaterial({
      color: 0x12080a,
      emissive: 0x44050a,
      emissiveIntensity: 0.6,
      roughness: 0.25,
      metalness: 0.9,
      flatShading: true,
    });

    const shards: { mesh: THREE.Mesh; rot: THREE.Vector3; speed: number; y: number }[] = [];
    for (let i = 0; i < 18; i++) {
      const mesh = new THREE.Mesh(shardGeom, shardMat);
      const angle = (i / 18) * Math.PI * 2;
      const radius = 1.45 + ((i % 4) * 0.25);
      const zPos = ((i % 5) - 2) * 0.45;

      mesh.position.set(
        Math.cos(angle) * radius,
        (i / 18) * 3.0 - 1.5,
        Math.sin(angle) * 0.75 + zPos
      );

      const s = 0.45 + ((i % 3) * 0.25);
      mesh.scale.set(s, s * 1.3, s);
      heroAnchor.add(mesh);

      shards.push({
        mesh,
        rot: new THREE.Vector3(0.006 + (i % 3) * 0.003, 0.009, 0.005),
        speed: 1.1 + (i % 3) * 0.35,
        y: mesh.position.y,
      });
    }

    // 4. RISING EMBERS & PARTICLES
    const pCount = 180;
    const pGeom = new THREE.BufferGeometry();
    const pCoords = new Float32Array(pCount * 3);
    const pSpeeds = new Float32Array(pCount);

    for (let i = 0; i < pCount * 3; i += 3) {
      pCoords[i] = (Math.random() - 0.5) * 14;
      pCoords[i + 1] = (Math.random() - 0.5) * 8;
      pCoords[i + 2] = (Math.random() - 0.5) * 6;
      pSpeeds[i / 3] = 0.003 + Math.random() * 0.006;
    }
    pGeom.setAttribute("position", new THREE.BufferAttribute(pCoords, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xd21f26,
      size: 0.032,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particleField = new THREE.Points(pGeom, pMat);
    world.add(particleField);

    // 5. LIGHTING
    const redKey = new THREE.PointLight(0xd21f26, 6, 8);
    redKey.position.set(0, -1.0, 1.5);
    heroAnchor.add(redKey);

    const rimLight = new THREE.PointLight(0xff2233, 8, 6);
    rimLight.position.set(1.5, 1.2, -1.2);
    heroAnchor.add(rimLight);

    scene.add(new THREE.AmbientLight(0x220508, 1.6));

    // 6. MOUSE PARALLAX & CAMERA DYNAMICS
    const mouse = { cx: 0, cy: 0, tx: 0, ty: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    let scrollProgress = 0;
    const onScroll = () => {
      scrollProgress = Math.min(window.scrollY / window.innerHeight, 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      mouse.cx += (mouse.tx - mouse.cx) * 0.045;
      mouse.cy += (mouse.ty - mouse.cy) * 0.045;

      camera.position.x = mouse.cx * 0.35;
      camera.position.y = -scrollProgress * 0.8 + mouse.cy * 0.25;
      camera.position.z = 7.0 - scrollProgress * 1.5;
      camera.lookAt(0.3, 0, 0);

      heroAnchor.rotation.y = mouse.cx * 0.05;
      heroAnchor.rotation.x = -mouse.cy * 0.035;

      rings.forEach((r, idx) => {
        r.rotation.z += ringConfigs[idx].speed;
      });

      laserCoil.rotation.y = Math.sin(t * 0.35) * 0.12 + 0.5;

      shards.forEach((s) => {
        s.mesh.rotation.x += s.rot.x;
        s.mesh.rotation.y += s.rot.y;
        s.mesh.position.y = s.y + Math.sin(t * s.speed) * 0.06;
      });

      const posArray = particleField.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < pCount * 3; i += 3) {
        posArray[i] += pSpeeds[Math.floor(i / 3)];
        if (posArray[i] > 4) posArray[i] = -4;
      }
      particleField.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container || !canvas) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []);

  // --- GSAP TIMELINE SEQUENCE ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(
        bootRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.35, ease: "none" },
        0.1
      )
        .to(bootRef.current, { opacity: 0, duration: 0.5, ease: "power2.in" }, 1.3)
        .call(() => setBooted(true), undefined, 1.8)
        .fromTo(
          leftRef.current?.querySelectorAll("[data-reveal]") ?? [],
          { opacity: 0, y: 26, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.9,
            stagger: 0.11,
            ease: "power3.out",
          },
          2.2
        )
        .fromTo(
          rightRef.current?.querySelectorAll("[data-reveal]") ?? [],
          { opacity: 0, x: 22 },
          { opacity: 1, x: 0, duration: 0.7, stagger: 0.07, ease: "power3.out" },
          2.4
        )
        .fromTo(
          railRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: "power2.out" },
          2.9
        );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={mountRef}
      className="relative w-full h-screen bg-[#050505] text-white overflow-hidden select-none flex flex-col justify-between font-mono"
    >
      {/* 1. LAYER: 3D THREE.JS WEBGL CANVAS */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* 2. LAYER: ATMOSPHERIC RED BLOOM */}
      <div className="absolute top-1/4 right-[16%] w-[580px] h-[580px] bg-[#d21f26]/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] right-[12%] w-[480px] h-[300px] bg-[#3a080b]/40 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* 3. LAYER: HIGH-FIDELITY HERO PORTRAIT */}
      <div className="absolute inset-0 flex items-end justify-end pr-8 sm:pr-16 lg:pr-24 pointer-events-none z-20">
        <div className="relative w-[340px] sm:w-[460px] md:w-[540px] lg:w-[620px] max-h-[88vh]">
          {/* Cyber Front Laser Arc */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-30 mix-blend-screen opacity-85 drop-shadow-[0_0_12px_#d21f26]"
            viewBox="0 0 600 800"
            fill="none"
          >
            <path
              d="M 60 590 Q 300 680 540 440"
              stroke="#d21f26"
              strokeWidth="2.2"
              strokeDasharray="8 6"
            />
            <circle cx="320" cy="645" r="3" fill="#ffffff" />
            <circle cx="485" cy="495" r="3.5" fill="#ffffff" />
          </svg>

          {/* Portrait Asset with Fallback */}
          <img
            src="/hero-portrait.png"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes("fakhruddin-portrait_d009928d.png")) {
                target.src = "/manus-storage/fakhruddin-portrait_d009928d.png";
              }
            }}
            alt="Fakhruddin Syed"
            className="w-full h-auto object-cover object-bottom filter contrast-105 brightness-100 drop-shadow-[0_0_40px_rgba(210,31,38,0.35)]"
            style={{
              maskImage: "linear-gradient(to bottom, black 0%, black 72%, transparent 96%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 72%, transparent 96%)",
            }}
          />

          {/* Controlled Red Rim Sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#d21f26]/20 via-transparent to-[#d21f26]/10 mix-blend-color-dodge pointer-events-none" />
        </div>
      </div>

      {/* 4. LAYER: BOOT TEXT OVERLAY */}
      <div
        ref={bootRef}
        className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none opacity-0"
        style={{ display: booted ? "none" : undefined }}
      >
        <span className="text-[11px] uppercase tracking-[0.35em] text-[#B8B3AA]">
          System Initializing<span className="animate-pulse">...</span>
        </span>
      </div>

      {/* 5. LAYER: FOREGROUND HUD INTERACTION & EDITORIAL CONTENT */}
      <div className="relative z-30 container mx-auto px-6 md:px-14 pt-28 pb-8 flex-1 flex flex-col justify-between pointer-events-auto">
        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Title & Actions */}
          <div ref={leftRef} className="lg:col-span-7">
            <p
              data-reveal
              className="text-[11px] uppercase tracking-[0.25em] text-[#B8B3AA] opacity-0 font-medium"
            >
              {"// 01. INTELLIGENCE ENGINE"}
            </p>

            <h1
              className="mt-4 uppercase leading-[0.84] tracking-tight select-none"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              <span
                data-reveal
                className="block text-[clamp(4.2rem,8.5vw,8.5rem)] text-[#F1EDE5] opacity-0 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
              >
                FAKRUDDIN
              </span>
              <span
                data-reveal
                className="block text-[clamp(4.2rem,8.5vw,8.5rem)] text-[#D21F26] opacity-0 drop-shadow-[0_0_35px_rgba(210,31,38,0.55)]"
              >
                SYED
              </span>
            </h1>

            <p
              data-reveal
              className="mt-5 text-[12px] uppercase tracking-[0.22em] text-[#F1EDE5]/85 opacity-0 font-semibold"
            >
              AI <span className="text-[#D21F26]">×</span> DATA{" "}
              <span className="text-[#D21F26]">×</span> CLOUD{" "}
              <span className="text-[#D21F26]">×</span> ENGINEERING
            </p>

            <p
              data-reveal
              className="mt-4 max-w-sm text-[13px] leading-relaxed text-[#B8B3AA] opacity-0 uppercase tracking-wider"
            >
              Building intelligent systems that turn data into decisions.
            </p>

            {/* Tactical Actions */}
            <div data-reveal className="pointer-events-auto mt-8 flex flex-wrap gap-4 opacity-0">
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group inline-flex items-center gap-3 bg-[#D21F26] px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] text-[#F1EDE5] font-bold transition-all duration-300 hover:bg-[#e02830] hover:shadow-[0_0_28px_rgba(210,31,38,0.75)] cursor-pointer"
              >
                Explore Work
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>

              <a
                href="#systems"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("systems")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-3 border border-[#222] bg-[#09090d]/60 px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] text-[#B8B3AA] font-bold transition-all duration-300 hover:border-[#D21F26] hover:text-[#F1EDE5] cursor-pointer"
              >
                View Systems →
              </a>
            </div>
          </div>

          {/* Right Column: Floating Tactical Telemetry */}
          <div
            ref={rightRef}
            className="hidden flex-col items-end gap-3.5 lg:col-span-5 lg:flex pointer-events-none"
          >
            <span
              data-reveal
              className="text-[10px] uppercase tracking-[0.25em] text-[#B8B3AA]/50 opacity-0 mb-1"
            >
              {"// CAPABILITY MATRIX"}
            </span>
            {CAPABILITIES.map((c) => (
              <span
                key={c}
                data-reveal
                className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-[#B8B3AA] opacity-0 font-medium"
              >
                {c}
                <span className="h-1.5 w-1.5 shrink-0 bg-[#D21F26] shadow-[0_0_8px_rgba(210,31,38,0.9)]" />
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Technical Status Rail */}
        <div
          ref={railRef}
          className="border-t border-[#161616] pt-4 mt-8 flex flex-wrap items-center justify-between text-[10px] uppercase tracking-[0.22em] text-[#B8B3AA]/70 opacity-0"
        >
          <div className="flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#33D17A] shadow-[0_0_10px_rgba(51,209,122,0.9)]" />
            <span>System Status: Online</span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span>Ideas</span>
            <span className="text-[#D21F26]">/</span>
            <span>Systems</span>
            <span className="text-[#D21F26]">/</span>
            <span>Impact</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CyberHero;