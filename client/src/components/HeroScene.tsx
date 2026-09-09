import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

/**
 * Full-viewport WebGL hero scene.
 * Layers: background reactor rings -> portrait plane -> occlusion shards -> embers.
 */
export function HeroScene({ onReady }: { onReady?: () => void }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 768;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.055);

    const camera = new THREE.PerspectiveCamera(
      42,
      width / height,
      0.1,
      100
    );
    
    // Set initial camera position adjusted for mobile vs desktop
    const initialCamZ = isMobile ? 8.2 : 7.5;
    const targetCamZ = isMobile ? 7.0 : 5.8;
    camera.position.set(0, 0, initialCamZ);
    camera.lookAt(isMobile ? 0 : 0.3, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x050505, 1);
    mount.appendChild(renderer.domElement);

    // ---------- Lights ----------
    scene.add(new THREE.AmbientLight(0x1a1a1e, 1.2));
    const keyLight = new THREE.PointLight(0xd21f26, 40, 30);
    keyLight.position.set(2.6, 1.2, 2.2);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0xf1ede5, 12, 24);
    rimLight.position.set(-3, 2, 3);
    scene.add(rimLight);

    // ---------- 1. Background reactor ----------
    const reactor = new THREE.Group();
    reactor.position.set(isMobile ? 0.3 : 1.4, -0.1, -1.5);
    reactor.scale.setScalar(0.01);
    const ringColors = [0x800a12, 0xa1141b, 0xba1a21, 0xd21f26];
    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const geo = new THREE.TorusGeometry(1.4 + i * 0.5, 0.01 + i * 0.003, 6, 96);
      const mat = new THREE.MeshBasicMaterial({
        color: ringColors[i] ?? 0xd21f26,
        wireframe: true,
        transparent: true,
        opacity: 0.55 - i * 0.07,
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = THREE.MathUtils.degToRad(80);
      ring.rotation.y = i * 0.35;
      ring.position.z = -0.5 - i * 0.33;
      rings.push(ring);
      reactor.add(ring);
    }
    // inner core glow
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xd21f26,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.9, 32, 32), coreMat);
    core.position.z = -1.0;
    reactor.add(core);
    scene.add(reactor);

    // ---------- 2. Portrait plane ----------
    const portraitUniforms = {
      uMap: { value: null as THREE.Texture | null },
      uOpacity: { value: 0 },
      uRim: { value: 0 },
      uTime: { value: 0 },
    };
    const portraitMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: portraitUniforms,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uMap;
        uniform float uOpacity;
        uniform float uRim;
        uniform float uTime;
        varying vec2 vUv;

        void main() {
          vec4 tex = texture2D(uMap, vUv);
          // vertical fade at the base so the cut-off dissolves into the void
          float baseFade = smoothstep(0.0, 0.22, vUv.y);
          // soft edge fade left/right
          float sideFade = smoothstep(0.0, 0.06, vUv.x) * smoothstep(1.0, 0.94, vUv.x);
          float alpha = tex.a * baseFade * sideFade;

          // red rim light along the silhouette (alpha gradient edges)
          float e = 0.006;
          float ax = abs(texture2D(uMap, vUv + vec2(e, 0.0)).a - texture2D(uMap, vUv - vec2(e, 0.0)).a);
          float ay = abs(texture2D(uMap, vUv + vec2(0.0, e)).a - texture2D(uMap, vUv - vec2(0.0, e)).a);
          float edge = clamp((ax + ay) * 1.6, 0.0, 1.0);
          float pulse = 0.82 + 0.18 * sin(uTime * 1.6);
          vec3 rim = vec3(0.824, 0.122, 0.149) * edge * uRim * pulse * 0.75;

          vec3 color = tex.rgb * 1.3 + rim;
          gl_FragColor = vec4(color, alpha * uOpacity);
        }
      `,
    });
    const portrait = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), portraitMat);
    
    // Position portrait responsively:
    // Mobile: x=0.55 (framed neatly inside view), Desktop: x=1.75
    let currentPortraitBaseX = isMobile ? 0.55 : 1.75;
    portrait.position.set(currentPortraitBaseX, isMobile ? -0.75 : -0.45, 0);
    portrait.visible = false;
    scene.add(portrait);

    const loader = new THREE.TextureLoader();
    let portraitTl: gsap.core.Tween | null = null;
    loader.load("/hero-portrait.png", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      portraitUniforms.uMap.value = tex;
      const aspect = (tex.image?.width || 1) / (tex.image?.height || 1);
      
      // Scale height responsively
      const h = isMobile ? 3.3 : 3.9;
      portrait.scale.set(h * aspect, h, 1);
      portrait.visible = true;

      // On mobile, dim the face to 0.42 max opacity so text is readable
      const targetOpacity = isMobile ? 0.42 : 1.0;

      portraitTl = gsap.to(portraitUniforms.uOpacity, {
        value: targetOpacity,
        duration: 1.4,
        delay: 0.2,
        ease: "power2.out",
      });
      gsap.to(portraitUniforms.uRim, { value: 1, duration: 1.8, delay: 0.4, ease: "sine.out" });
    });

    // ---------- 3. Foreground occlusion shards ----------
    const shardGroup = new THREE.Group();
    const shardMat = new THREE.MeshStandardMaterial({
      color: 0x08080a,
      metalness: 0.9,
      roughness: 0.2,
    });
    type Shard = { mesh: THREE.Mesh; radius: number; speed: number; angle: number; yBase: number; spin: THREE.Vector3 };
    const shards: Shard[] = [];
    for (let i = 0; i < 18; i++) {
      const s = 0.07 + Math.random() * 0.22;
      const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(s, 0), shardMat);
      const radius = 1.6 + Math.random() * 2.6;
      const angle = Math.random() * Math.PI * 2;
      const yBase = (Math.random() - 0.5) * 3.4;
      mesh.position.set(Math.cos(angle) * radius, yBase, 0.4 + Math.random() * 1.2);
      shardGroup.add(mesh);
      shards.push({
        mesh,
        radius,
        speed: (Math.random() - 0.5) * 0.22,
        angle,
        yBase,
        spin: new THREE.Vector3(Math.random() * 0.4, Math.random() * 0.4, Math.random() * 0.4),
      });
    }
    scene.add(shardGroup);

    // ---------- 4. Ember particle field ----------
    const COUNT = 200;
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      speeds[i] = 0.12 + Math.random() * 0.35;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xd21f26,
      size: 0.035,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const embers = new THREE.Points(pGeo, pMat);
    scene.add(embers);

    // ---------- Entrance timeline ----------
    const camState = { z: initialCamZ };
    const tl = gsap.timeline();
    tl.to(pMat, { opacity: 0.8, duration: 1.2, ease: "power2.out" }, 0.8)
      .to(reactor.scale, { x: 0.85, y: 0.85, z: 0.85, duration: 1.6, ease: "back.out(1.7)" }, 1.4)
      .to(camState, { z: targetCamZ, duration: 2.6, ease: "power3.inOut" }, 0.6);
    tl.call(() => onReady?.(), undefined, 0.2);

    // ---------- Interaction ----------
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mobile = w < 768;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h);

      // Adjust positioning live on orientation change / resize
      currentPortraitBaseX = mobile ? 0.55 : 1.75;
      portrait.position.x = currentPortraitBaseX;
      portrait.position.y = mobile ? -0.75 : -0.45;
      reactor.position.x = mobile ? 0.3 : 1.4;
      camState.z = mobile ? 7.0 : 5.8;
    };
    window.addEventListener("resize", onResize);

    // ---------- Loop ----------
    const clock = new THREE.Clock();
    let raf = 0;
    const lookAt = new THREE.Vector3(isMobile ? 0 : 0.3, 0, 0);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();

      mouse.x += (target.x - mouse.x) * 0.04;
      mouse.y += (target.y - mouse.y) * 0.04;

      const scrollDolly = Math.min(window.scrollY / 600, 1) * 2.2;

      camera.position.x = mouse.x * 0.3;
      camera.position.y = -mouse.y * 0.25;
      camera.position.z = camState.z - scrollDolly;
      camera.lookAt(lookAt);

      rings.forEach((r, i) => {
        r.rotation.z += dt * (0.12 + i * 0.07) * (i % 2 === 0 ? 1 : -1);
        r.rotation.y += dt * 0.03 * (i % 2 === 0 ? -1 : 1);
      });
      core.material.opacity = 0.12 + Math.sin(t * 1.4) * 0.05;

      shards.forEach((s) => {
        s.angle += dt * s.speed;
        s.mesh.position.x = Math.cos(s.angle) * s.radius;
        s.mesh.position.y = s.yBase + Math.sin(t * 0.5 + s.radius) * 0.18;
        s.mesh.rotation.x += dt * s.spin.x;
        s.mesh.rotation.y += dt * s.spin.y;
        s.mesh.rotation.z += dt * s.spin.z;
      });

      const pos = pGeo.attributes["position"] as THREE.BufferAttribute;
      for (let i = 0; i < COUNT; i++) {
        let y = pos.getY(i) + (speeds[i] ?? 0.2) * dt;
        if (y > 5) y = -5;
        pos.setY(i, y);
        pos.setX(i, pos.getX(i) + Math.sin(t * 0.4 + i) * 0.0006);
      }
      pos.needsUpdate = true;

      portraitUniforms.uTime.value = t;
      portrait.position.x = currentPortraitBaseX + mouse.x * 0.04;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      tl.kill();
      portraitTl?.kill();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      scene.traverse((obj) => {
        const m = obj as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      portraitUniforms.uMap.value?.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [onReady]);

  return <div ref={mountRef} className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true" />;
}