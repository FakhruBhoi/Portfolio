import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export type TechNode = {
  name: string;
  category: "AI / ML" | "VISION & EMBEDDED" | "DATA & CLOUD" | "FULL STACK";
  level: string;
  experience: string;
  color: number;
};

export const TECH_DATA: TechNode[] = [
  // AI / ML / RAG
  { name: "Python", category: "AI / ML", level: "CORE", experience: "Primary architecture & model prototyping", color: 0xd21f26 },
  { name: "PyTorch", category: "AI / ML", level: "ADVANCED", experience: "Neural training pipelines & loss functions", color: 0xd21f26 },
  { name: "TensorFlow", category: "AI / ML", level: "PROD", experience: "Deep learning deployment & inference", color: 0xd21f26 },
  { name: "Scikit-Learn", category: "AI / ML", level: "CORE", experience: "Statistical models & baseline regression", color: 0xd21f26 },
  { name: "LangChain", category: "AI / ML", level: "APPLIED", experience: "Multi-agent RAG context routing", color: 0xff3b47 },
  { name: "FastAPI", category: "AI / ML", level: "CORE", experience: "High-throughput async inference microservices", color: 0xd21f26 },

  // Vision & Hardware
  { name: "YOLOv8", category: "VISION & EMBEDDED", level: "CORE", experience: "Custom dataset training & real-time segmentation", color: 0xff2535 },
  { name: "OpenCV", category: "VISION & EMBEDDED", level: "CORE", experience: "Matrix convolutions, filtering, RTSP buffers", color: 0xff2535 },
  { name: "ESP32-CAM", category: "VISION & EMBEDDED", level: "EMBEDDED", experience: "C++ firmware, RGB565 optical processing, GPIOs", color: 0xff4d5a },
  { name: "C / C++", category: "VISION & EMBEDDED", level: "SYSTEMS", experience: "Hardware timing loops & memory optimization", color: 0xff4d5a },

  // Data & Cloud
  { name: "PostgreSQL", category: "DATA & CLOUD", level: "PROD", experience: "Relational schema indexing & query planning", color: 0xb8b3aa },
  { name: "MongoDB", category: "DATA & CLOUD", level: "PROD", experience: "GeoJSON spatial rasters & document pipelines", color: 0xb8b3aa },
  { name: "Docker", category: "DATA & CLOUD", level: "PROD", experience: "Containerized model workflows & multi-stage builds", color: 0xb8b3aa },
  { name: "Power BI", category: "DATA & CLOUD", level: "ANALYTICS", experience: "Interactive decision telemetry & trend surfaces", color: 0xb8b3aa },

  // Full Stack
  { name: "React", category: "FULL STACK", level: "CORE", experience: "Custom reactive state machines & UI orchestration", color: 0xf1ede5 },
  { name: "Next.js", category: "FULL STACK", level: "PROD", experience: "SSR architectures & API proxy bridges", color: 0xf1ede5 },
  { name: "TypeScript", category: "FULL STACK", level: "CORE", experience: "Strict type contracts across client & API relays", color: 0xf1ede5 },
  { name: "Three.js / WebGL", category: "FULL STACK", level: "APPLIED", experience: "Custom GLSL shaders, camera choreography, buffers", color: 0xd21f26 },
  { name: "Tailwind CSS", category: "FULL STACK", level: "CORE", experience: "Design tokens & adaptive UI scaffolding", color: 0xf1ede5 },
];

export const TechSphere: React.FC<{
  onSelectNode: (node: TechNode) => void;
  activeNode: TechNode | null;
}> = ({ onSelectNode, activeNode }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !mountRef.current) return;
    const canvas = canvasRef.current;
    const container = mountRef.current;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.08);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // Outer Gyroscope Rings
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x3a080b, wireframe: true, transparent: true, opacity: 0.35 });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.012, 6, 64), ringMat);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.008, 6, 48), ringMat);
    ring1.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 4;
    sphereGroup.add(ring1);
    sphereGroup.add(ring2);

    // Generate Nodes Distributed on a Fibonacci Sphere
    const nodesCount = TECH_DATA.length;
    const nodeMeshes: { mesh: THREE.Mesh; data: TechNode; pos: THREE.Vector3 }[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    const nodeGeom = new THREE.OctahedronGeometry(0.08, 0);

    for (let i = 0; i < nodesCount; i++) {
      const y = 1 - (i / (nodesCount - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      const pos = new THREE.Vector3(x * 1.7, y * 1.5, z * 1.7);

      const mat = new THREE.MeshStandardMaterial({
        color: TECH_DATA[i].color,
        emissive: TECH_DATA[i].color,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8,
      });

      const mesh = new THREE.Mesh(nodeGeom, mat);
      mesh.position.copy(pos);
      sphereGroup.add(mesh);

      nodeMeshes.push({ mesh, data: TECH_DATA[i], pos });
    }

    // Connective Synaptic Lines between close nodes
    const lineMat = new THREE.LineBasicMaterial({ color: 0xd21f26, transparent: true, opacity: 0.22 });
    const lineGeom = new THREE.BufferGeometry();
    const linePositions: number[] = [];

    for (let i = 0; i < nodeMeshes.length; i++) {
      for (let j = i + 1; j < nodeMeshes.length; j++) {
        const dist = nodeMeshes[i].pos.distanceTo(nodeMeshes[j].pos);
        if (dist < 1.3) {
          linePositions.push(
            nodeMeshes[i].pos.x, nodeMeshes[i].pos.y, nodeMeshes[i].pos.z,
            nodeMeshes[j].pos.x, nodeMeshes[j].pos.y, nodeMeshes[j].pos.z
          );
        }
      }
    }
    lineGeom.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeom, lineMat);
    sphereGroup.add(lines);

    // Raycaster for Hover & Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-100, -100);

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map((n) => n.mesh));
      if (intersects.length > 0) {
        const hit = nodeMeshes.find((n) => n.mesh === intersects[0].object);
        if (hit) onSelectNode(hit.data);
      }
    };

    container.addEventListener("mousemove", onPointerMove);
    container.addEventListener("click", onClick);

    // Animation Loop
    let animId: number;
    let rotX = 0;
    let rotY = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth subtle auto-rotation with mouse acceleration
      sphereGroup.rotation.y += 0.003 + (mouse.x * 0.006);
      sphereGroup.rotation.x += 0.001 - (mouse.y * 0.004);
      ring1.rotation.z += 0.002;
      ring2.rotation.z -= 0.003;

      // Raycast hover highlighting
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map((n) => n.mesh));

      nodeMeshes.forEach((n) => {
        const isHovered = intersects.length > 0 && intersects[0].object === n.mesh;
        const isSelected = activeNode?.name === n.data.name;

        const targetScale = isSelected ? 1.8 : isHovered ? 1.4 : 1.0;
        n.mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

        const mat = n.mesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = isSelected ? 1.5 : isHovered ? 1.1 : 0.6;
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
      container.removeEventListener("mousemove", onPointerMove);
      container.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [activeNode]);

  return (
    <div ref={mountRef} className="relative w-full h-[400px] sm:h-[500px] cursor-crosshair">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.25em] text-[#B8B3AA]/50 pointer-events-none">
        [ DRAG / HOVER / SELECT 3D ARSENAL NODE ]
      </div>
    </div>
  );
};