import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export type TechCard = {
  name: string;
  category: "AI & REASONING" | "VISION & EMBEDDED" | "DATA & CLOUD" | "ENGINEERING & UI";
  badge: string;
  color: string;
  summary: string;
};

export const TECH_ITEMS: TechCard[] = [
  { name: "Python", category: "AI & REASONING", badge: "CORE", color: "#3776AB", summary: "Primary language for high-throughput model architectures, inference pipelines, and algorithmic automation." },
  { name: "PyTorch", category: "AI & REASONING", badge: "DEEP LEARNING", color: "#EE4C2C", summary: "Neural network training routines, tensor operations, backprop tuning, and custom loss functions." },
  { name: "Claude / LLMs", category: "AI & REASONING", badge: "GEN AI", color: "#D97757", summary: "Context retrieval loops, multi-agent reasoning, prompt instrumentation, and vector synthesis." },
  { name: "RAG & Vector", category: "AI & REASONING", badge: "SEARCH", color: "#E61424", summary: "Dense vector indexing, hybrid BM25 search, embeddings retrieval, and knowledge routing." },
  { name: "YOLOv8", category: "VISION & EMBEDDED", badge: "VISION", color: "#00FFFF", summary: "Real-time bounding box segmentation, object detection matrices, and inference optimizations." },
  { name: "OpenCV", category: "VISION & EMBEDDED", badge: "VISION", color: "#5C3EE8", summary: "Matrix image convolutions, spatial transformations, edge kernels, and multi-threaded video ingest." },
  { name: "ESP32-CAM", category: "VISION & EMBEDDED", badge: "HARDWARE", color: "#E7352C", summary: "Embedded C/C++ firmware, RGB565 optical processing, and precision GPIO relay actuation." },
  { name: "PostgreSQL", category: "DATA & CLOUD", badge: "DATABASE", color: "#336791", summary: "Relational indexing, transactional isolation, schema constraints, and performance tuning." },
  { name: "MongoDB", category: "DATA & CLOUD", badge: "SPATIAL", color: "#47A248", summary: "GeoJSON spatial queries, unstructured document storage, and geospatial hydro rasters." },
  { name: "Docker", category: "DATA & CLOUD", badge: "INFRA", color: "#2496ED", summary: "Containerized deployment stages, multi-container orchestration, and isolated model runtimes." },
  { name: "React & Next.js", category: "ENGINEERING & UI", badge: "FRONTEND", color: "#61DAFB", summary: "Component life cycles, reactive state management, and performant web applications." },
  { name: "Three.js / WebGL", category: "ENGINEERING & UI", badge: "3D", color: "#E61424", summary: "Shader passes, 3D math transformations, scene graphs, and interactive GPU rendering." },
  { name: "Figma", category: "ENGINEERING & UI", badge: "DESIGN", color: "#F24E1E", summary: "Design systems, interactive prototyping, information architecture, and UI/UX artboards." },
];

export const TechUniverse: React.FC<{
  onSelect: (item: TechCard) => void;
  activeItem: TechCard;
}> = ({ onSelect, activeItem }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !mountRef.current) return;
    const canvas = canvasRef.current;
    const container = mountRef.current;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.06);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0.4, 4.8);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Floor Grid Wireframe
    const grid = new THREE.GridHelper(10, 20, 0xd21f26, 0x1a1a1a);
    grid.position.y = -1.2;
    rootGroup.add(grid);

    // Central Architect Silhouette Marker (Glowing pedestal)
    const pedestalGeom = new THREE.CylinderGeometry(0.4, 0.5, 0.1, 32);
    const pedestalMat = new THREE.MeshBasicMaterial({ color: 0xd21f26, wireframe: true });
    const pedestal = new THREE.Mesh(pedestalGeom, pedestalMat);
    pedestal.position.set(0, -1.15, 0);
    rootGroup.add(pedestal);

    // Central Core Pulse Light
    const coreLight = new THREE.PointLight(0xd21f26, 5, 8);
    coreLight.position.set(0, -0.6, 0);
    rootGroup.add(coreLight);

    // Build Floating Curved Hologram Panels
    const cardMeshes: { mesh: THREE.Mesh; item: TechCard; originPos: THREE.Vector3 }[] = [];
    const total = TECH_ITEMS.length;
    const cardGeom = new THREE.PlaneGeometry(0.55, 0.38);

    TECH_ITEMS.forEach((item, i) => {
      // Semi-circle curved amphitheater distribution
      const angle = -Math.PI * 0.75 + (i / (total - 1)) * Math.PI * 1.5;
      const radius = 2.4 + (i % 2 === 0 ? 0.2 : -0.2);
      const x = Math.sin(angle) * radius;
      const z = -Math.cos(angle) * radius + 0.6;
      const y = (i % 3) * 0.4 - 0.3;

      // Canvas dynamic texture with item name & badge
      const textCanvas = document.createElement("canvas");
      textCanvas.width = 256;
      textCanvas.height = 160;
      const ctx = textCanvas.getContext("2d")!;

      // Background Panel Styling
      ctx.fillStyle = "rgba(10, 10, 14, 0.92)";
      ctx.fillRect(0, 0, 256, 160);
      ctx.strokeStyle = item.color;
      ctx.lineWidth = 4;
      ctx.strokeRect(4, 4, 248, 152);

      // Category / Badge
      ctx.fillStyle = "#B8B3AA";
      ctx.font = "bold 14px monospace";
      ctx.fillText(item.badge, 18, 36);

      // Title
      ctx.fillStyle = "#F1EDE5";
      ctx.font = "bold 26px sans-serif";
      ctx.fillText(item.name, 18, 85);

      // Accent Bar
      ctx.fillStyle = item.color;
      ctx.fillRect(18, 110, 80, 4);

      const texture = new THREE.CanvasTexture(textCanvas);
      const cardMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
      });

      const card = new THREE.Mesh(cardGeom, cardMat);
      card.position.set(x, y, z);
      // Face towards center architect
      card.lookAt(0, 0, 0);

      rootGroup.add(card);
      cardMeshes.push({ mesh: card, item, originPos: new THREE.Vector3(x, y, z) });
    });

    // Synapse lines connecting each card to center base
    const lineMat = new THREE.LineBasicMaterial({ color: 0xd21f26, transparent: true, opacity: 0.35 });
    cardMeshes.forEach((c) => {
      const lineGeom = new THREE.BufferGeometry().setFromPoints([
        c.mesh.position,
        new THREE.Vector3(0, -1.1, 0),
      ]);
      const line = new THREE.Line(lineGeom, lineMat);
      rootGroup.add(line);
    });

    // Raycaster for Hover & Click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-100, -100);

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(cardMeshes.map((c) => c.mesh));
      if (hits.length > 0) {
        const selected = cardMeshes.find((c) => c.mesh === hits[0].object);
        if (selected) onSelect(selected.item);
      }
    };

    container.addEventListener("mousemove", onMove);
    container.addEventListener("click", onClick);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth camera perspective sway
      camera.position.x += (mouse.x * 0.7 - camera.position.x) * 0.04;
      camera.position.y += (mouse.y * 0.4 + 0.4 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Card hovering & bobbing
      cardMeshes.forEach((c, idx) => {
        const isSelected = activeItem.name === c.item.name;
        c.mesh.position.y = c.originPos.y + Math.sin(elapsed * 1.5 + idx) * 0.04;

        const targetScale = isSelected ? 1.35 : 1.0;
        c.mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      });

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
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [activeItem]);

  return (
    <div ref={mountRef} className="relative w-full h-[450px] sm:h-[550px] cursor-pointer">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute top-3 left-3 z-10 font-mono text-[9px] uppercase tracking-[0.25em] text-[#B8B3AA]/70 bg-black/60 px-2 py-1 border border-[#222]">
        THE ARCHITECTURAL UNIVERSE // 3D SYNAPSE FIELD
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 font-mono text-[9px] uppercase tracking-[0.2em] text-[#D21F26] pointer-events-none">
        [ MOVE MOUSE TO ROTATE PERSPECTIVE · CLICK ANY HOLOGRAM ]
      </div>
    </div>
  );
};