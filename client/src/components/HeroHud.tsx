import { useEffect, useRef, useState } from "react";
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

export function HeroHud() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const bootRef = useRef<HTMLDivElement>(null);
  const [booted, setBooted] = useState(false);

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
          2.4
        )
        .fromTo(
          rightRef.current?.querySelectorAll("[data-reveal]") ?? [],
          { opacity: 0, x: 22 },
          { opacity: 1, x: 0, duration: 0.7, stagger: 0.07, ease: "power3.out" },
          2.5
        )
        .fromTo(
          railRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: "power2.out" },
          3.0
        );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="pointer-events-none relative z-10 flex min-h-screen flex-col font-mono select-none overflow-hidden">
      {/* Boot readout */}
      <div
        ref={bootRef}
        className="absolute inset-0 flex items-center justify-center opacity-0"
        style={{ display: booted ? "none" : undefined }}
      >
        <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#B8B3AA]">
          System Initializing<span className="animate-pulse">...</span>
        </span>
      </div>

      <div className="flex flex-1 items-start md:items-center px-5 pt-28 pb-20 sm:px-10 lg:px-20">
        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* LEFT COLUMN: TITLE & IDENTITY */}
          <div ref={leftRef} className="lg:col-span-7 relative z-30 max-w-full">
            <p
              data-reveal
              className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#B8B3AA] opacity-0 font-medium"
            >
              {"// 01. INTELLIGENCE ENGINE"}
            </p>

            <h1 className="mt-3 leading-[0.88] select-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              <span
                data-reveal
                className="block text-[clamp(2.8rem,13vw,7.5rem)] font-black tracking-tight text-[#F1EDE5] opacity-0 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
              >
                FAKRUDDIN
              </span>
              <span
                data-reveal
                className="block text-[clamp(2.8rem,13vw,7.5rem)] font-black tracking-tight text-[#D21F26] opacity-0 drop-shadow-[0_0_35px_rgba(210,31,38,0.55)]"
              >
                SYED
              </span>
            </h1>

            <p
              data-reveal
              className="mt-4 sm:mt-5 text-[10px] sm:text-[12px] uppercase tracking-[0.2em] text-[#F1EDE5]/85 opacity-0 font-semibold leading-relaxed"
            >
              AI <span className="text-[#D21F26]">×</span> DATA{" "}
              <span className="text-[#D21F26]">×</span> CLOUD{" "}
              <span className="text-[#D21F26]">×</span> ENGINEERING
            </p>

            <p
              data-reveal
              className="mt-3 sm:mt-4 max-w-xs sm:max-w-sm text-[11px] sm:text-[13px] leading-relaxed text-[#B8B3AA] opacity-0 uppercase tracking-wider"
            >
              Building intelligent systems that turn data into decisions.
            </p>

            {/* ACTION BUTTONS */}
            <div data-reveal className="pointer-events-auto mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 opacity-0 max-w-xs sm:max-w-none">
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group inline-flex items-center justify-center gap-3 bg-[#D21F26] px-6 py-3.5 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#F1EDE5] font-bold transition-all duration-300 hover:bg-[#ff1e2d] hover:shadow-[0_0_28px_rgba(210,31,38,0.75)] cursor-pointer text-center"
              >
                View Systems
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center gap-3 border border-[#222] bg-[#09090d]/80 backdrop-blur-sm px-6 py-3.5 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#B8B3AA] font-bold transition-all duration-300 hover:border-[#D21F26] hover:text-[#F1EDE5] cursor-pointer text-center"
              >
                Establish Contact
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: HUD TELEMETRY (Hidden on Mobile) */}
          <div
            ref={rightRef}
            className="hidden flex-col items-end gap-3 lg:col-span-5 lg:flex pointer-events-none"
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
                className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-[#B8B3AA] opacity-0"
              >
                {c}
                <span className="h-1.5 w-1.5 shrink-0 bg-[#D21F26] shadow-[0_0_8px_rgba(210,31,38,0.9)]" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM STATUS RAIL */}
      <div
        ref={railRef}
        className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-[#161616] px-5 py-3.5 text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-[#B8B3AA]/70 opacity-0 sm:px-10 lg:px-20 bg-[#050505]/60 backdrop-blur-sm"
      >
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#33D17A] shadow-[0_0_10px_rgba(51,209,122,0.9)]" />
          System Status: Online
        </span>
        <span className="hidden sm:inline">Ideas / Systems / Impact</span>
      </div>
    </div>
  );
}