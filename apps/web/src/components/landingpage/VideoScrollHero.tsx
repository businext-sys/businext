"use client";

import { useEffect, useRef, useState } from "react";

// ── Constants ──────────────────────────────────────────────────────────────────
const FRAME_COUNT  = 120;
const FRAME_PATH   = (n: number) => `/frames/frame${String(n).padStart(4, "0")}.jpg`;
const PX_PER_FRAME = 5;

// ── Slide data ─────────────────────────────────────────────────────────────────
const SLIDES_DATA = [
  { line1: "Todo bajo",  accent: "control", subtitle: "Reservas, finanzas y equipo en un solo lugar",       start: -0.10, end: 0.36, phoneZoom: false },
  { line1: "Más tiempo", accent: "para ti", subtitle: "Automatiza la gestión y céntrate en lo que importa", start: 0.28,  end: 0.58, phoneZoom: false },
  { line1: "Listo para", accent: "crecer",  subtitle: "Únete a los negocios que ya confían en Businext",    start: 0.54,  end: 0.97, phoneZoom: true  },
];

// ── Animation positions (vh from bottom) ──────────────────────────────────────
const POS_IN         = -14; // off-screen below viewport
const POS2           = 40;  // center — large
const POS3           = 98;  // exit — top
const PHONE_CENTER   = 46;  // iPhone screen center (vh from bottom)

// ── Easing functions ───────────────────────────────────────────────────────────
const clamp       = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp        = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutExpo = (t: number) => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
const easeInOut   = (t: number) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
const easeOutBack = (t: number) => { const c = 1.70158; return 1 + (c+1)*Math.pow(t-1,3) + c*Math.pow(t-1,2); };

// ──────────────────────────────────────────────────────────────────────────────

export function VideoScrollHero() {
  const [isDesktop,   setIsDesktop]   = useState(false);
  const [loaded,      setLoaded]      = useState(false);
  const [loadPct,     setLoadPct]     = useState(0);
  const [mounted,     setMounted]     = useState(false);
  const [ctaHovered,       setCtaHovered]       = useState(false);
  const [primaryHovered,   setPrimaryHovered]   = useState(false);

  const sectionRef         = useRef<HTMLDivElement>(null);
  const canvasRef          = useRef<HTMLCanvasElement>(null);
  const framesRef          = useRef<HTMLImageElement[]>([]);
  const currentFrame       = useRef(0);
  const targetFrame        = useRef(0);
  const rafId              = useRef<number>(0);
  const mountedRef         = useRef(false);
  const innerWidthRef      = useRef(0);
  const progressBarRef     = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const vignetteCloseRef   = useRef<HTMLDivElement>(null);
  const blackRef           = useRef<HTMLDivElement>(null);
  const ctaRef             = useRef<HTMLDivElement>(null);
  const snapDoneRef        = useRef(false);
  const snapRafRef         = useRef<number>(0);
  const touchStartY        = useRef(0);
  const rafTouch           = useRef<number>(0);

  // Container ref per slide — animates h1+p as a unit
  const slideRefs = useRef<Array<{ container: HTMLDivElement | null }>>(
    SLIDES_DATA.map(() => ({ container: null }))
  );

  // ── Detect desktop ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => {
      setIsDesktop(window.innerWidth > 1024);
      innerWidthRef.current = window.innerWidth;
      document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
    };
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    const onOrientationChange = () => setTimeout(onResize, 150);
    window.addEventListener("orientationchange", onOrientationChange, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrientationChange);
    };
  }, []);

  // ── Mobile canvas animation ────────────────────────────────────────────────
  useEffect(() => {
    if (isDesktop) return;

    const section = sectionRef.current;
    const canvas  = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d")!;

    const setVH = () => {
      document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
      innerWidthRef.current = window.innerWidth;
    };
    setVH();

    section.style.height = `${window.innerHeight + FRAME_COUNT * PX_PER_FRAME}px`;

    // Load frames — sparse array: slots filled only when image is ready
    const frameArr: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null);
    framesRef.current = frameArr as HTMLImageElement[];
    let loadedCount = 0;
    let cancelled = false;
    let shownFirst = false;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const idx = i - 1;
      img.src = FRAME_PATH(i);
      img.onload = () => {
        if (cancelled) return;
        frameArr[idx] = img;
        loadedCount++;
        setLoadPct(Math.round((loadedCount / FRAME_COUNT) * 100));
        // Show canvas as soon as ANY frame is ready — eliminates infinite spinner
        if (!shownFirst) {
          shownFirst = true;
          canvas.width  = img.naturalWidth;
          canvas.height = img.naturalHeight;
          ctx.drawImage(img, 0, 0);
          setLoaded(true);
          setTimeout(() => { mountedRef.current = true; setMounted(true); }, 100);
        }
      };
      img.onerror = () => {
        // Count errors so progress always advances even on network failures
        loadedCount++;
        setLoadPct(Math.round((loadedCount / FRAME_COUNT) * 100));
      };
    }

    let visible = true;
    const observer = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    observer.observe(section);

    // ── Animate slides ─────────────────────────────────────────────────────────
    // MAX = 1.0 → text always renders at native CSS size, never stretched = no blur
    const animateSlides = (progress: number) => {
      const vw = innerWidthRef.current;

      SLIDES_DATA.forEach((slide, i) => {
        const el = slideRefs.current[i].container;
        if (!el) return;

        const raw = (progress - slide.start) / (slide.end - slide.start);
        if (raw < -0.02 || raw > 1.02) { el.style.opacity = "0"; return; }
        const p = clamp(raw, 0, 1);

        // ── Phone zoom — slide 3 ─────────────────────────────────────────────
        if (slide.phoneZoom) {
          let sc: number, bot: number, op: number, blur: number;

          if (p < 0.28) {
            // Slower entry: spreads over 28% of range
            const t = easeOutExpo(p / 0.28);
            sc   = lerp(0.04, 1.0, t);
            bot  = lerp(PHONE_CENTER, POS2, t);
            op   = clamp((p / 0.28) * 6, 0, 1);
            blur = lerp(10, 0, t);
          } else if (p < 0.72) {
            sc = 1.0; bot = POS2; op = 1; blur = 0;
          } else if (p < 0.90) {
            // Slower exit: spreads over 18% of range
            const t = easeInOut((p - 0.72) / 0.18);
            sc = 1.0; bot = POS2; op = 1 - t; blur = 0;
          } else {
            sc = 1.0; bot = POS2; op = 0; blur = 0;
          }

          el.style.bottom          = `${bot}vh`;
          el.style.left            = "50%";
          el.style.transform       = `translateX(-50%) scale(${sc}) translateZ(0)`;
          el.style.transformOrigin = "center bottom";
          el.style.opacity         = String(op);
          el.style.filter          = blur > 0 ? `blur(${blur}px)` : "none";
          el.style.textAlign       = "center";
          return;
        }

        // ── Standard slides — centered glassmorphism panel ───────────────────
        let sc: number, bot: number, op: number;

        if (p < 0.26) {
          const t = easeOutExpo(p / 0.26);
          sc = lerp(0.84, 1.0, t); bot = lerp(POS_IN, POS2, t);
          op = clamp((p / 0.26) * 4, 0, 1);
        } else if (p < 0.70) {
          sc = 1.0; bot = POS2; op = 1;
        } else if (p < 0.88) {
          const t = easeInOut((p - 0.70) / 0.18);
          sc = 1.0; bot = POS2; op = 1 - t;
        } else {
          sc = 1.0; bot = POS2; op = 0;
        }

        el.style.bottom          = `${bot}vh`;
        el.style.left            = "50%";
        el.style.transform       = `translateX(-50%) scale(${sc}) translateZ(0)`;
        el.style.transformOrigin = "center bottom";
        el.style.opacity         = String(op);
        el.style.filter          = "none";
      });
    };

    // ── Finale ────────────────────────────────────────────────────────────────
    const animateFinale = (progress: number) => {
      const vc = vignetteCloseRef.current;
      if (!vc) return;

      if (progress >= 0.86) {
        const t  = clamp((progress - 0.86) / 0.11, 0, 1);
        const e  = easeInOut(t);
        const r  = Math.max(0, 80 - e * 86);
        vc.style.background = `radial-gradient(circle ${r}% at 50% 65%, transparent 40%, rgba(0,0,0,${0.35 + e * 0.65}) 100%)`;
        vc.style.opacity    = String(Math.min(t * 4, 1));
      } else {
        vc.style.opacity = "0";
      }
    };

    // ── RAF loop ───────────────────────────────────────────────────────────────
    const tick = () => {
      if (!visible) { rafId.current = requestAnimationFrame(tick); return; }

      const diff  = targetFrame.current - currentFrame.current;
      const lerpF = "ontouchstart" in window ? 0.13 : 0.16;

      if (Math.abs(diff) > 0.05) {
        currentFrame.current += diff * lerpF;
        const idx = clamp(Math.round(currentFrame.current), 0, FRAME_COUNT - 1);
        if (framesRef.current[idx]) ctx.drawImage(framesRef.current[idx], 0, 0);
      }

      const progress = currentFrame.current / (FRAME_COUNT - 1);

      if (progressBarRef.current)
        progressBarRef.current.style.width = `${progress * 100}%`;

      if (scrollIndicatorRef.current)
        scrollIndicatorRef.current.style.opacity = progress > 0.06 ? "0" : "1";

      if (ctaRef.current) {
        const show = mountedRef.current && progress < 0.08;
        ctaRef.current.style.opacity       = show ? "1" : "0";
        ctaRef.current.style.pointerEvents = show ? "auto" : "none";
      }

      // Snap to next section when user reaches the end
      if (progress >= 0.985 && !snapDoneRef.current) {
        snapDoneRef.current = true;
        const start  = window.scrollY;
        const target = section.offsetTop + section.offsetHeight;
        const dist   = target - start;
        const dur    = 700;
        const t0     = performance.now();
        const ease   = (t: number) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
        const step   = (now: number) => {
          const p = Math.min((now - t0) / dur, 1);
          window.scrollTo(0, start + dist * ease(p));
          if (p < 1) snapRafRef.current = requestAnimationFrame(step);
        };
        snapRafRef.current = requestAnimationFrame(step);
      } else if (progress < 0.92) {
        snapDoneRef.current = false;
        cancelAnimationFrame(snapRafRef.current);
      }

      animateSlides(progress);
      animateFinale(progress);

      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    // ── Scroll ────────────────────────────────────────────────────────────────
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      targetFrame.current = clamp(-rect.top / (rect.height - window.innerHeight), 0, 1) * (FRAME_COUNT - 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── Touch with inertia ────────────────────────────────────────────────────
    let touchVelocity = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      cancelAnimationFrame(rafTouch.current);
      touchVelocity = 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const p     = currentFrame.current / (FRAME_COUNT - 1);
      const delta = touchStartY.current - e.touches[0].clientY;
      if (delta > 0 && p >= 0.97) return;
      if (delta < 0 && p <= 0.01) return;
      e.preventDefault();
      touchVelocity = clamp(delta * 0.55, -80, 80);
      window.scrollBy(0, touchVelocity);
      touchStartY.current = e.touches[0].clientY;
    };
    const onTouchEnd = () => {
      const apply = () => {
        if (Math.abs(touchVelocity) < 0.2) { touchVelocity = 0; return; }
        window.scrollBy(0, touchVelocity);
        touchVelocity *= 0.88;
        rafTouch.current = requestAnimationFrame(apply);
      };
      rafTouch.current = requestAnimationFrame(apply);
    };

    section.addEventListener("touchstart", onTouchStart, { passive: true });
    section.addEventListener("touchmove",  onTouchMove,  { passive: false });
    section.addEventListener("touchend",   onTouchEnd,   { passive: true });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId.current);
      cancelAnimationFrame(rafTouch.current);
      cancelAnimationFrame(snapRafRef.current);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      section.removeEventListener("touchstart", onTouchStart);
      section.removeEventListener("touchmove",  onTouchMove);
      section.removeEventListener("touchend",   onTouchEnd);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop]);

  // ── Desktop ────────────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <section style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", background: "#07080f" }}>

        <video
          autoPlay
          loop
          muted
          playsInline
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "72% 50%" }}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Overlays */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(7,8,15,0.95) 20%, rgba(7,8,15,0.40) 38%, transparent 50%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 25% 50%, rgba(65,217,214,0.08) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 320, background: "linear-gradient(to top, #07080f, transparent)" }} />

        {/* Content — left half, vertically centered */}
        <div style={{
          position: "absolute",
          top: 0, bottom: 0, left: 0,
          width: "52%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "0 clamp(40px, 6vw, 100px)",
          zIndex: 5,
        }}>

          {/* Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-bn.png"
            alt="Businext"
            style={{
              width: "clamp(150px, 17vw, 230px)",
              height: "auto",
              marginBottom: 40,
              animation: "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.08s both",
            }}
          />

          {/* Primary CTA */}
          <div style={{ position: "relative", animation: "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}>
            {/* Glow ring */}
            <span style={{
              position: "absolute",
              inset: -3,
              borderRadius: 15,
              background: "var(--gradient-primary)",
              opacity: primaryHovered ? 0.40 : 0,
              filter: "blur(10px)",
              transition: "opacity 0.3s ease",
              pointerEvents: "none",
            }} />
            <a
              href="/login"
              onMouseEnter={() => setPrimaryHovered(true)}
              onMouseLeave={() => setPrimaryHovered(false)}
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                overflow: "hidden",
                background: "var(--gradient-primary)",
                color: "#fff",
                padding: "16px 36px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 16,
                textDecoration: "none",
                letterSpacing: "0.02em",
                border: "1px solid rgba(255,255,255,0.18)",
                boxShadow: primaryHovered
                  ? "0 8px 40px rgba(65,217,214,0.60), inset 0 1px 0 rgba(255,255,255,0.28)"
                  : "0 4px 24px rgba(65,217,214,0.35), inset 0 1px 0 rgba(255,255,255,0.20)",
                transform: primaryHovered ? "translateY(-2px)" : "translateY(0)",
                transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease",
              }}
            >
              {/* Shimmer */}
              <span style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.20) 50%, transparent 65%)",
                transform: primaryHovered ? "translateX(100%)" : "translateX(-100%)",
                transition: primaryHovered ? "transform 0.5s ease" : "none",
                pointerEvents: "none",
              }} />
              <span style={{ position: "relative", display: "flex", alignItems: "center", gap: 8 }}>
                Empezar
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: primaryHovered ? "translateX(3px)" : "translateX(0)", transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
                >
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </a>
          </div>
        </div>

      </section>
    );
  }

  // ── Mobile / Tablet ────────────────────────────────────────────────────────
  return (
    <div ref={sectionRef} style={{ position: "relative", width: "100%", minHeight: "100vh", background: "#07080f" }}>
      <div style={{ position: "sticky", top: 0, width: "100%", height: "calc(var(--vh, 1vh) * 100)", overflow: "clip" } as React.CSSProperties}>

        {/* Loading */}
        {!loaded && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#07080f", zIndex: 30, gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid #41d9d6", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
            <span style={{ color: "#b0bec5", fontSize: 13 }}>Cargando... {loadPct}%</span>
          </div>
        )}

        {/* Canvas */}
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: loaded ? 1 : 0, transition: "opacity 0.6s ease" }} />

        {/* Vignettes */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)", pointerEvents: "none", zIndex: 2 }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 160, background: "linear-gradient(to top, #07080f, transparent)", pointerEvents: "none", zIndex: 2 }} />

        {/* ── Scroll indicator — TOP ── */}
        <div
          ref={scrollIndicatorRef}
          style={{
            position: "absolute",
            top: 24,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.5s ease",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#41d9d6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "bounceY 1.6s ease-in-out infinite" }}>
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
          <span style={{ color: "#41d9d6", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>scroll</span>
        </div>

        {/* ── 3 Text slides — each is one animated container ── */}
        {SLIDES_DATA.map((slide, i) => (
          <div
            key={i}
            ref={(el) => { slideRefs.current[i].container = el; }}
            style={{
              position: "absolute",
              left: "50%",
              bottom: "7vh",
              transform: "translateX(-50%)",
              willChange: "transform, opacity",
              backfaceVisibility: "hidden" as const,
              opacity: 0,
              pointerEvents: "none",
              zIndex: 5,
              maxWidth: "clamp(220px, 80vw, 400px)",
              width: "max-content",
              borderRadius: "20px",
            }}
          >
            {/* Fondo sólido — backdrop-filter dentro de willChange:transform causa flickering en WebKit */}
            <div style={{
              position: "absolute",
              inset: 0,
              borderRadius: "20px",
              background: "rgba(8, 12, 24, 0.68)",
              border: "1px solid rgba(255,255,255,0.22)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.45), inset 0 1.5px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(255,255,255,0.04)",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "clamp(0.8rem, 2.5vw, 1.4rem) clamp(1rem, 3vw, 1.6rem)",
              textAlign: "center",
            }}>
              <h1 style={{
                margin: 0,
                color: "#f8fafc",
                fontFamily: "var(--font-heading), system-ui, sans-serif",
                fontSize: "clamp(2rem, 8vw, 4rem)",
                fontWeight: 800,
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                WebkitFontSmoothing: "antialiased" as const,
                MozOsxFontSmoothing: "grayscale" as const,
              }}>
                <span style={{ display: "block", marginBottom: "0.1em" }}>{slide.line1}</span>
                <span style={{
                  display: "block",
                  background: "var(--gradient-primary)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>{slide.accent}</span>
              </h1>
              <p style={{
                margin: "clamp(0.6rem, 1.5vh, 1rem) 0 0",
                color: "rgba(255,255,255,0.85)",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontSize: "clamp(0.8rem, 3vw, 0.95rem)",
                fontWeight: 400,
                lineHeight: 1.55,
                WebkitFontSmoothing: "antialiased" as const,
                MozOsxFontSmoothing: "grayscale" as const,
              }}>
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}

        {/* CTA */}
        <div ref={ctaRef} style={{ position: "absolute", bottom: "clamp(80px, 10vh, 120px)", left: "50%", transform: "translateX(-50%)", opacity: 0, transition: "opacity 0.4s ease", pointerEvents: "none", zIndex: 10 }}>
          <a
            href="/login"
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: ctaHovered
                ? "linear-gradient(135deg, rgba(65,217,214,0.38), rgba(34,184,200,0.30))"
                : "linear-gradient(135deg, rgba(18,61,71,0.82), rgba(27,39,51,0.78))",
              color: "#f8fafc",
              padding: "14px 32px",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 16,
              textDecoration: "none",
              border: ctaHovered
                ? "1px solid rgba(255,255,255,0.55)"
                : "1px solid rgba(255,255,255,0.35)",
              boxShadow: ctaHovered
                ? "0 12px 40px rgba(65,217,214,0.50), 0 0 20px rgba(34,184,200,0.25), inset 0 2px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(255,255,255,0.10)"
                : "0 8px 32px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(255,255,255,0.08)",
              transform: ctaHovered ? "translateY(-3px) scale(1.04)" : "translateY(0) scale(1)",
              transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease",
              letterSpacing: "0.01em",
            }}
          >
            Comienza ahora
          </a>
        </div>


        {/* Iris close */}
        <div ref={vignetteCloseRef} style={{ position: "absolute", inset: 0, opacity: 0, pointerEvents: "none", zIndex: 15 }} />


        {/* Progress bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.07)", zIndex: 20 }}>
          <div ref={progressBarRef} style={{ height: "100%", width: "0%", background: "var(--gradient-primary)", transition: "none" }} />
        </div>
      </div>
    </div>
  );
}
