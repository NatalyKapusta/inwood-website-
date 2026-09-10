"use client";

import { useEffect, useRef, useState } from "react";
import PhoneInput from "@/components/PhoneInput";
import { collections } from "@/lib/products";
import { STANDARD_WIDTHS, STANDARD_HEIGHTS, NONSTD_WIDTHS, NONSTD_HEIGHTS, NONSTD_SURCHARGE } from "@/lib/doorSizes";
import { submitPartnerForm, submitCatalogForm } from "./actions";

const STANDARD_WIDTHS_TEXT = STANDARD_WIDTHS.join(", ") + " мм";
const STANDARD_HEIGHTS_TEXT = `${STANDARD_HEIGHTS[0]}–${STANDARD_HEIGHTS[STANDARD_HEIGHTS.length - 1]} мм`;
const NONSTD_HEIGHTS_TEXT = `${NONSTD_HEIGHTS[0]} мм до ${NONSTD_HEIGHTS[NONSTD_HEIGHTS.length - 1]} мм`;

const DEMO_MODEL_CODES = ["ET-01", "ET-02"];
const demoModels = (collections.etalon.models ?? []).filter((m) => DEMO_MODEL_CODES.includes(m.code));

function fmtUah(n: number) {
  return n.toLocaleString("uk-UA", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " ₴";
}

export default function PartnershipLanding({ sentState }: { sentState: "partner" | "catalog" | null }) {
  // ---- scroll reveal ----
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const els = rootRef.current?.querySelectorAll<HTMLElement>(".reveal") ?? [];
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const seenParents = new Map<Element, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = Number(el.dataset.delayIndex || 0) * 60;
            setTimeout(() => el.classList.add("in"), delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => {
      const p = el.parentElement;
      const idx = (p && seenParents.get(p)) || 0;
      el.dataset.delayIndex = String(idx);
      if (p) seenParents.set(p, idx + 1);
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // ---- animated counters ----
  useEffect(() => {
    const counters = rootRef.current?.querySelectorAll<HTMLElement>("[data-count]") ?? [];
    function animate(el: HTMLElement) {
      const target = parseInt(el.dataset.count || "0", 10);
      const suffix = el.dataset.suffix || "";
      let start: number | null = null;
      const duration = 1400;
      function step(ts: number) {
        if (start === null) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if (!("IntersectionObserver" in window) || counters.length === 0) {
      counters.forEach((el) => (el.textContent = (el.dataset.count || "") + (el.dataset.suffix || "")));
      return;
    }
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target as HTMLElement);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );
    counters.forEach((el) => cio.observe(el));
    return () => cio.disconnect();
  }, []);

  // ---- hero parallax + floating door tilt ----
  const heroBgRef = useRef<HTMLDivElement>(null);
  const floatingDoorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const offset = Math.min(y * 0.18, 90);
        if (heroBgRef.current) heroBgRef.current.style.transform = `translateY(${offset}px)`;
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    const canHover = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    function onMouseMove(e: MouseEvent) {
      if (!floatingDoorRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      floatingDoorRef.current.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`;
    }
    if (canHover) document.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (canHover) document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  // ---- demo calculator ----
  const [demoModelCode, setDemoModelCode] = useState(demoModels[0]?.code ?? "");
  const demoModel = demoModels.find((m) => m.code === demoModelCode) ?? demoModels[0];
  const [demoColorSlug, setDemoColorSlug] = useState(demoModel?.colors[0]?.slug ?? "");
  const demoColor = demoModel?.colors.find((c) => c.slug === demoColorSlug) ?? demoModel?.colors[0];
  const [demoWidth, setDemoWidth] = useState(String(STANDARD_WIDTHS[STANDARD_WIDTHS.length - 1]));
  const [demoHeight, setDemoHeight] = useState(String(STANDARD_HEIGHTS[0]));
  const demoNonstd = NONSTD_WIDTHS.includes(Number(demoWidth)) || NONSTD_HEIGHTS.includes(Number(demoHeight));
  const demoPrice = demoModel ? (demoNonstd ? demoModel.basePrice * NONSTD_SURCHARGE : demoModel.basePrice) : 0;

  return (
    <div ref={rootRef} className="pl">
      {/* dangerouslySetInnerHTML замість тексту-children — інакше React по-різному
          нормалізує вміст <style> на сервері й клієнті й падає з hydration mismatch */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .pl{
          --navy:#6670AC; --navy-strong:#4E5684; --navy-dark:#3A4066;
          --gold:#E3CCA1; --gold-dim:#B7935A;
          --bg:#0F1016; --panel:#181923; --panel2:#1F212D;
          --text:#F2F1EC; --text-dim:#A9A9B8;
          font-family:'Manrope',Arial,sans-serif;background:var(--bg);color:var(--text);line-height:1.5;overflow-x:hidden;
        }
        .pl *{box-sizing:border-box;}
        .pl img{max-width:100%;display:block;}
        .pl .wrap{max-width:1160px;margin:0 auto;padding:0 24px;}
        .pl a{color:inherit;}
        .pl h1,.pl h2,.pl h3,.pl .serif{font-family:'Playfair Display',Georgia,serif;}

        .pl header{position:sticky;top:0;z-index:50;background:rgba(15,16,22,0.85);backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,255,255,0.06);}
        .pl header .wrap{display:flex;align-items:center;justify-content:space-between;padding:14px 24px;gap:14px;flex-wrap:wrap;}
        .pl .logo{display:flex;align-items:center;gap:10px;}
        .pl .logo img{height:36px;width:auto;}
        .pl .logo span{font-weight:800;font-size:18px;letter-spacing:.02em;}
        .pl .btn{display:inline-block;background:var(--gold);color:#14151C;border:none;padding:12px 24px;border-radius:8px;font-weight:800;font-size:14px;cursor:pointer;text-decoration:none;white-space:nowrap;transition:transform .25s ease, background .25s ease, box-shadow .25s ease;}
        .pl .btn:hover{background:#f0dcb4;transform:translateY(-2px);box-shadow:0 10px 24px -8px rgba(227,204,161,0.45);}
        .pl .btn:active{transform:translateY(0);}
        .pl .btn-outline{background:transparent;border:1px solid var(--gold-dim);color:var(--gold);}
        .pl .btn-outline:hover{background:rgba(227,204,161,0.1);}

        .pl .reveal{opacity:0;transform:translateY(30px);transition:opacity .8s cubic-bezier(.2,.6,.2,1), transform .8s cubic-bezier(.2,.6,.2,1);}
        .pl .reveal.in{opacity:1;transform:translateY(0);}

        .pl .hero{position:relative;padding:100px 0 76px;overflow:hidden;}
        .pl .hero-bg{position:absolute;inset:-6% 0 0 0;z-index:0;}
        .pl .hero-bg img{width:100%;height:112%;object-fit:cover;opacity:0.28;will-change:transform;}
        .pl .hero-bg::after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 50% 30%, rgba(15,16,22,0.35), rgba(15,16,22,0.85) 65%, rgba(15,16,22,0.98) 100%), linear-gradient(180deg, rgba(15,16,22,0.5) 0%, rgba(15,16,22,0.95) 88%);}
        .pl .hero .wrap{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:40px;text-align:left;}
        .pl .hero-text{flex:1 1 480px;position:relative;}
        .pl .hero-text::before{content:"";position:absolute;top:-60px;left:-40px;width:420px;height:320px;background:radial-gradient(ellipse at center, rgba(227,204,161,0.14), transparent 70%);filter:blur(6px);z-index:-1;pointer-events:none;}
        .pl .hero-visual{flex:0 1 340px;display:flex;justify-content:center;perspective:1400px;}
        .pl .eyebrow{display:inline-block;color:var(--gold);text-transform:uppercase;letter-spacing:.16em;font-size:12px;font-weight:800;margin-bottom:20px;padding:7px 16px;border:1px solid rgba(227,204,161,0.35);border-radius:20px;background:rgba(227,204,161,0.06);}
        .pl h1{font-size:42px;font-weight:800;margin:0 0 22px;letter-spacing:.005em;max-width:640px;line-height:1.14;}
        .pl h1 .accent{background:linear-gradient(100deg, var(--gold) 10%, #fff 50%, var(--gold-dim) 90%);-webkit-background-clip:text;background-clip:text;color:transparent;}
        .pl .hero p.lead{color:var(--text-dim);font-size:17.5px;max-width:560px;margin:0 0 34px;}
        .pl .hero-cta{display:flex;gap:14px;flex-wrap:wrap;}

        .pl .floating-door{width:280px;max-width:60vw;transition:transform .35s ease-out;transform-style:preserve-3d;}
        .pl .floating-door-inner{animation:pl-floatY 5.5s ease-in-out infinite;filter:drop-shadow(0 35px 45px rgba(0,0,0,0.55)) drop-shadow(0 8px 14px rgba(0,0,0,0.4));}
        .pl .floating-door-inner img{width:100%;display:block;border-radius:16px;}
        @keyframes pl-floatY{ 0%,100%{transform:translateY(0) rotate(-1.4deg);} 50%{transform:translateY(-18px) rotate(1.4deg);} }
        @media (prefers-reduced-motion: reduce){ .pl .floating-door-inner{animation:none;} }

        .pl .stats{background:var(--panel);border-top:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06);}
        .pl .stats .wrap{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;padding:36px 24px;}
        .pl .stat{text-align:center;}
        .pl .stat b{display:block;font-family:'Playfair Display',serif;font-size:34px;font-weight:800;color:var(--gold);letter-spacing:.01em;}
        .pl .stat span{font-size:12.5px;color:var(--text-dim);}

        .pl section{padding:76px 0;position:relative;}
        .pl .section-head{text-align:center;max-width:700px;margin:0 auto 44px;position:relative;}
        .pl .section-head::before{content:"";position:absolute;top:-30px;left:50%;transform:translateX(-50%);width:360px;height:170px;background:radial-gradient(ellipse at center, rgba(227,204,161,0.10), transparent 70%);z-index:-1;pointer-events:none;}
        .pl .section-head .eyebrow{margin-bottom:14px;}
        .pl .section-head h2{font-size:30px;font-weight:800;margin:0 0 14px;text-transform:uppercase;letter-spacing:.01em;}
        .pl .h2-count{color:var(--gold);font-style:normal;}
        .pl .section-head p{color:var(--text-dim);font-size:15.5px;margin:0;}
        .pl .watermark{position:absolute;top:6px;right:24px;font-family:'Playfair Display',serif;font-size:140px;font-weight:900;color:rgba(227,204,161,0.05);line-height:1;user-select:none;pointer-events:none;z-index:0;}

        .pl #audience{background:var(--panel);}
        .pl .audience-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;position:relative;z-index:1;}
        .pl .aud-card{background:var(--panel2);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:22px 18px;display:flex;flex-direction:column;gap:12px;transition:transform .3s ease, border-color .3s ease, background .3s ease;box-shadow:0 16px 34px -22px rgba(0,0,0,0.7);}
        .pl .aud-card:hover{transform:translateY(-4px);border-color:rgba(227,204,161,0.35);background:#242636;}
        .pl .aud-card .ico{width:36px;height:36px;border-radius:50%;background:var(--navy-dark);border:1px solid var(--navy);display:flex;align-items:center;justify-content:center;font-weight:800;color:var(--gold);font-size:14px;}
        .pl .aud-card span{font-size:14px;font-weight:600;}

        .pl .marquee-wrap{overflow:hidden;margin:0 0 44px;-webkit-mask-image:linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);mask-image:linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);}
        .pl .marquee{display:flex;gap:14px;width:max-content;animation:pl-marquee 22s linear infinite;}
        .pl .marquee-wrap:hover .marquee{animation-play-state:paused;}
        @keyframes pl-marquee{ from{transform:translateX(0);} to{transform:translateX(-50%);} }
        .pl .m-pill{background:var(--panel2);border:1px solid rgba(227,204,161,0.25);color:var(--gold);font-size:13.5px;font-weight:700;padding:10px 22px;border-radius:24px;white-space:nowrap;}

        .pl .segments-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
        .pl .seg-card{background:var(--panel);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:26px 24px;transition:transform .3s ease, border-color .3s ease;box-shadow:0 16px 34px -22px rgba(0,0,0,0.7);}
        .pl .seg-card:hover{transform:translateY(-4px);border-color:rgba(227,204,161,0.3);box-shadow:0 22px 40px -20px rgba(0,0,0,0.65);}
        .pl .seg-card .ico{width:44px;height:44px;border-radius:12px;background:var(--navy-dark);border:1px solid var(--navy);display:flex;align-items:center;justify-content:center;margin-bottom:16px;font-weight:800;color:var(--gold);font-size:14px;}
        .pl .seg-card h4{font-size:16px;margin:0 0 8px;font-weight:700;font-family:'Manrope',sans-serif;}
        .pl .seg-card p{font-size:13.5px;color:var(--text-dim);margin:0;}

        .pl #strengths{background:var(--panel);}
        .pl .strengths-list{position:relative;z-index:1;display:flex;flex-direction:column;}
        .pl .strength-item{display:grid;grid-template-columns:52px 1fr;gap:22px;padding:28px 0;border-bottom:1px solid rgba(255,255,255,0.08);}
        .pl .strength-item:last-child{border-bottom:none;padding-bottom:0;}
        .pl .strength-item:first-child{padding-top:0;}
        .pl .strength-item .circle{width:44px;height:44px;border-radius:50%;background:var(--navy-dark);border:1px solid var(--navy);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-weight:800;color:var(--gold);font-size:17px;}
        .pl .strength-item h4{font-size:17.5px;margin:0 0 10px;font-weight:700;font-family:'Manrope',sans-serif;}
        .pl .strength-item p{color:var(--text-dim);font-size:14px;margin:0;line-height:1.75;}
        .pl .strength-item .note{display:block;margin-top:8px;font-size:12.5px;color:var(--text-dim);opacity:.8;}
        .pl .strength-item ul{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(2,1fr);gap:8px 24px;}
        .pl .strength-item ul li{color:var(--text-dim);font-size:14px;line-height:1.6;padding-left:22px;position:relative;}
        .pl .strength-item ul li::before{content:"✔";position:absolute;left:0;color:var(--gold);font-size:11px;top:3px;}
        @media (max-width:640px){ .pl .strength-item ul{grid-template-columns:1fr;} .pl .strength-item{grid-template-columns:40px 1fr;gap:14px;} }

        .pl .benefits{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;position:relative;z-index:1;}
        .pl .benefit{background:var(--panel);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:28px 26px;transition:transform .3s ease, border-color .3s ease;box-shadow:0 16px 34px -22px rgba(0,0,0,0.7);}
        .pl .benefit:hover{transform:translateY(-4px);border-color:rgba(227,204,161,0.3);box-shadow:0 22px 40px -20px rgba(0,0,0,0.65);}
        .pl .benefit .num{font-family:'Playfair Display',serif;font-size:22px;font-weight:800;color:var(--gold);letter-spacing:.05em;margin-bottom:12px;}
        .pl .benefit h3{font-size:17px;margin:0 0 8px;font-weight:700;font-family:'Manrope',sans-serif;}
        .pl .benefit p{color:var(--text-dim);font-size:14px;margin:0;}

        .pl .collections{display:grid;grid-template-columns:repeat(auto-fit, minmax(200px,1fr));gap:18px;}
        .pl .coll{background:var(--panel);border:1px solid rgba(255,255,255,0.06);border-radius:14px;overflow:hidden;transition:transform .35s ease, box-shadow .35s ease;box-shadow:0 16px 34px -22px rgba(0,0,0,0.7);}
        .pl .coll:hover{transform:translateY(-6px);box-shadow:0 20px 40px -20px rgba(0,0,0,0.6);}
        .pl .coll .ph{background:#fff;aspect-ratio:4/5;display:flex;align-items:center;justify-content:center;overflow:hidden;}
        .pl .coll .ph img{width:100%;height:100%;object-fit:contain;padding:14px;transition:transform .5s ease;}
        .pl .coll .ph img.cover{object-fit:cover;padding:0;}
        .pl .coll:hover .ph img{transform:scale(1.05);}
        .pl .coll .cap{padding:16px 18px;}
        .pl .coll .cap b{display:block;font-family:'Playfair Display',serif;font-size:16px;letter-spacing:.03em;margin-bottom:6px;}
        .pl .coll .cap span{font-size:12.5px;color:var(--text-dim);line-height:1.5;}

        .pl .steps{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;position:relative;z-index:1;}
        .pl .step{position:relative;padding:30px 22px 22px;background:var(--panel);border-radius:14px;border:1px solid rgba(255,255,255,0.06);transition:transform .3s ease, border-color .3s ease;box-shadow:0 16px 34px -22px rgba(0,0,0,0.7);}
        .pl .step:hover{transform:translateY(-4px);border-color:rgba(227,204,161,0.3);box-shadow:0 22px 40px -20px rgba(0,0,0,0.65);}
        .pl .step .circle{width:38px;height:38px;border-radius:50%;background:var(--navy-dark);border:1px solid var(--navy);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-weight:800;color:var(--gold);font-size:16px;margin-bottom:16px;}
        .pl .step h4{font-size:15.5px;margin:0 0 8px;font-weight:700;font-family:'Manrope',sans-serif;}
        .pl .step p{font-size:13.5px;color:var(--text-dim);margin:0;}

        .pl #catalog-section{background:var(--panel);}
        .pl .catalog-card{max-width:640px;margin:0 auto;background:var(--panel2);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:36px 34px;display:flex;gap:26px;flex-wrap:wrap;align-items:center;}
        .pl .catalog-card .cinfo{flex:1 1 260px;}
        .pl .catalog-card h3{font-size:21px;margin:0 0 8px;font-weight:800;}
        .pl .catalog-card p{color:var(--text-dim);font-size:14px;margin:0 0 18px;}
        .pl .catalog-gate{flex:1 1 260px;min-width:240px;}
        .pl .catalog-gate .field{margin-bottom:12px;}
        .pl .catalog-gate .btn{width:100%;}
        .pl .catalog-unlocked{text-align:center;}
        .pl .catalog-unlocked .check{font-size:32px;margin-bottom:8px;}
        .pl .catalog-unlocked p{margin:0 0 16px;}

        .pl #form-section{background:var(--panel);}
        .pl .form-card{max-width:580px;margin:0 auto;background:var(--panel2);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:38px 34px;}
        .pl .form-card h2{font-size:24px;margin:0 0 8px;font-weight:800;text-transform:none;}
        .pl .form-card p.sub{color:var(--text-dim);font-size:14px;margin:0 0 26px;}
        .pl label{display:block;font-size:12px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;}
        .pl .field{margin-bottom:16px;}
        .pl input, .pl textarea, .pl select{width:100%;background:var(--panel);border:1px solid rgba(255,255,255,0.12);color:var(--text);padding:12px 14px;border-radius:8px;font-family:inherit;font-size:14.5px;transition:border-color .25s ease;}
        .pl select{appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6'><path d='M0 0l5 6 5-6z' fill='%23A9A9B8'/></svg>");background-repeat:no-repeat;background-position:right 14px center;padding-right:34px;}
        .pl input:focus, .pl textarea:focus, .pl select:focus{outline:none;border-color:var(--gold-dim);}
        .pl textarea{resize:vertical;min-height:80px;}
        .pl .form-card .btn{width:100%;padding:14px;font-size:15px;margin-top:6px;}
        .pl .privacy-note{font-size:11.5px;color:var(--text-dim);text-align:center;margin-top:14px;}
        .pl .success-msg{text-align:center;padding:30px 10px;}
        .pl .success-msg .check{font-size:40px;margin-bottom:12px;}
        .pl .success-msg h3{margin:0 0 8px;font-size:19px;}
        .pl .success-msg p{color:var(--text-dim);font-size:14px;margin:0;}

        .pl #demo-calc{background:linear-gradient(180deg, rgba(227,204,161,0.05), transparent 60%), var(--bg);border-top:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06);}
        .pl .demo-card{max-width:880px;width:100%;margin:0 auto;background:var(--panel2);border:1px solid rgba(227,204,161,0.28);border-radius:16px;padding:34px 32px;position:relative;z-index:1;box-shadow:0 24px 55px -25px rgba(0,0,0,0.75);box-sizing:border-box;}
        .pl .demo-layout{display:grid;grid-template-columns:220px 1fr;gap:30px;align-items:start;min-width:0;}
        .pl .demo-photo-wrap{position:sticky;top:90px;min-width:0;}
        .pl .demo-photo{background:#fff;border-radius:12px;aspect-ratio:3/4;display:flex;align-items:center;justify-content:center;overflow:hidden;}
        .pl .demo-photo img{width:100%;height:100%;object-fit:contain;padding:12px;}
        .pl .demo-fields-col{min-width:0;}
        .pl .demo-fields{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;min-width:0;}
        .pl .demo-fields .field{min-width:0;}
        .pl .demo-fields select{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
        .pl .demo-result{display:flex;align-items:baseline;gap:14px;background:rgba(227,204,161,0.08);border:1px solid rgba(227,204,161,0.3);border-radius:10px;padding:18px 22px;margin:20px 0 22px;flex-wrap:wrap;}
        .pl .demo-result span{font-size:12.5px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.07em;font-weight:700;}
        .pl .demo-result b{font-family:'Playfair Display',serif;font-size:30px;color:var(--gold);}
        .pl .demo-result small{width:100%;color:var(--text-dim);font-size:12px;}
        .pl .demo-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(227,204,161,0.12);border:1px solid rgba(227,204,161,0.35);color:var(--gold);font-size:12.5px;font-weight:700;padding:9px 16px;border-radius:20px;margin-bottom:16px;}
        .pl .demo-card .btn{width:100%;text-align:center;padding:14px;font-size:15px;}
        .pl .demo-hint{font-size:11.5px;color:var(--text-dim);text-align:center;margin:20px 0 0;line-height:1.6;}
        @media (max-width:720px){ .pl .demo-layout{grid-template-columns:1fr;} .pl .demo-photo-wrap{position:static;width:100%;max-width:220px;margin:0 auto;} .pl .demo-fields{grid-template-columns:1fr;} }

        .pl footer{border-top:1px solid rgba(255,255,255,0.06);padding:34px 0;}
        .pl footer .wrap{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:20px;}
        .pl footer .fcontact{font-size:13px;color:var(--text-dim);line-height:1.9;}
        .pl footer .fcontact a{color:var(--text-dim);text-decoration:none;}
        .pl footer .fcontact a:hover{color:var(--gold);}
        .pl footer .fnote{font-size:12.5px;color:var(--text-dim);text-align:right;}

        @media (max-width:860px){
          .pl .benefits, .pl .collections, .pl .steps, .pl .audience-grid, .pl .segments-grid{grid-template-columns:repeat(2,1fr);}
          .pl .stats .wrap{grid-template-columns:repeat(2,1fr);}
          .pl .hero .wrap{flex-direction:column;text-align:center;}
          .pl .hero-text{text-align:center;}
          .pl .hero-text::before{left:50%;transform:translateX(-50%);}
          .pl h1{font-size:30px;max-width:100%;}
          .pl .hero p.lead{margin:0 auto 34px;}
          .pl .hero-cta{justify-content:center;}
          .pl .hero-visual{display:none;}
          .pl .hero{padding-top:20px;}
          .pl .watermark{font-size:90px;}
          .pl footer .wrap{flex-direction:column;}
          .pl footer .fnote{text-align:left;}
        }
        @media (max-width:520px){
          .pl .benefits, .pl .collections, .pl .steps, .pl .audience-grid, .pl .segments-grid{grid-template-columns:1fr;}
          .pl .form-card, .pl .catalog-card{padding:28px 22px;}
          .pl .watermark{display:none;}
        }
      `,
        }}
      />

      <header>
        <div className="wrap">
          <div className="logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/inwood-logo-white.svg" alt="IN WOOD" />
            <span>IN WOOD</span>
          </div>
          <a href="#form-section" className="btn">Стати партнером</a>
        </div>
      </header>

      <section className="hero">
        <div className="hero-bg" ref={heroBgRef}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/photos/interiors/etalon-et-01-zriz-kameniu.jpg" alt="" />
        </div>
        <div className="wrap">
          <div className="hero-text">
            <div className="eyebrow">Партнерська програма IN WOOD</div>
            <h1>Партнерство, яке <span className="accent">відчиняє нові двері</span> для вашого бізнесу</h1>
            <p className="lead">
              IN WOOD — виробник міжкімнатних дверей із 20-річним досвідом. Власне виробництво в м. Полтава, широкий
              асортимент продукції, зручний калькулятор вартості та персональний менеджер, який супроводжує вас на
              кожному етапі співпраці.
            </p>
            <div className="hero-cta">
              <a href="#form-section" className="btn">Стати партнером</a>
              <a href="#catalog-section" className="btn btn-outline">Отримати каталог</a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-door" ref={floatingDoorRef}>
              <div className="floating-door-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/photos/etalon/et-01-dub-shato.png" alt="Двері IN WOOD, колекція Etalon" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {demoModel && (
        <section id="demo-calc">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">Спробуйте прямо зараз</div>
              <h2>Прорахунок КП — за <b className="h2-count">5</b> хвилин, а не за години</h2>
              <p>
                Ми забираємо на себе 90% вашої рутини. Оберіть модель, колір і розмір — фото дверей одразу
                оновлюється. Це той самий калькулятор (і ті самі актуальні ціни каталогу), який отримує кожен партнер
                IN WOOD.
              </p>
            </div>
            <div className="demo-card reveal">
              <div className="demo-layout">
                <div className="demo-photo-wrap">
                  <div className="demo-photo">
                    {demoColor && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={demoColor.image} alt={`${demoModel.code}, ${demoColor.label}`} />
                    )}
                  </div>
                </div>
                <div className="demo-fields-col">
                  <div className="demo-fields">
                    <div className="field">
                      <label htmlFor="demoModel">Модель, колекція ETALON</label>
                      <select
                        id="demoModel"
                        value={demoModelCode}
                        onChange={(e) => {
                          setDemoModelCode(e.target.value);
                          const m = demoModels.find((mm) => mm.code === e.target.value);
                          setDemoColorSlug(m?.colors[0]?.slug ?? "");
                        }}
                      >
                        {demoModels.map((m) => (
                          <option key={m.code} value={m.code}>ETALON, модель {m.code}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="demoColor">Колір / текстура</label>
                      <select id="demoColor" value={demoColorSlug} onChange={(e) => setDemoColorSlug(e.target.value)}>
                        {demoModel.colors.map((c) => (
                          <option key={c.slug} value={c.slug}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="demoWidth">Ширина, мм</label>
                      <select id="demoWidth" value={demoWidth} onChange={(e) => setDemoWidth(e.target.value)}>
                        {STANDARD_WIDTHS.map((w) => (
                          <option key={w} value={w}>{w} мм</option>
                        ))}
                        {NONSTD_WIDTHS.map((w) => (
                          <option key={w} value={w}>{w} мм (нестандарт +20%)</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="demoHeight">Висота, мм</label>
                      <select id="demoHeight" value={demoHeight} onChange={(e) => setDemoHeight(e.target.value)}>
                        {STANDARD_HEIGHTS.map((h) => (
                          <option key={h} value={h}>{h} мм</option>
                        ))}
                        {NONSTD_HEIGHTS.map((h) => (
                          <option key={h} value={h}>{h} мм (нестандарт +20%)</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="demo-result">
                    <span>Ціна за одиницю</span>
                    <b>{fmtUah(demoPrice)}</b>
                    <small>{demoNonstd ? "Нестандартний розмір: +20% до вартості полотна" : "Стандартний розмір — без надбавки"}</small>
                  </div>
                  <div className="demo-badge">📄 Миттєве вивантаження КП у PDF — одразу до друку</div>
                  <a href="#form-section" className="btn">Хочу такий калькулятор для своїх клієнтів</a>
                </div>
              </div>
              <p className="demo-hint">
                * Це реальні роздрібні ціни каталогу IN WOOD (як на inwood.com.ua/catalog). Повний калькулятор із
                коробом, лиштвою, врізкою фурнітури, партнерськими знижками та миттєвим вивантаженням готової КП у
                PDF отримує кожен партнер IN WOOD.
              </p>
            </div>
          </div>
        </section>
      )}

      <div className="stats">
        <div className="wrap">
          <div className="stat reveal"><b data-count="20" data-suffix="+">0</b><span>років виробничого досвіду</span></div>
          <div className="stat reveal"><b data-count="50" data-suffix="+">0</b><span>партнерів вже працюють з IN WOOD</span></div>
          <div className="stat reveal"><b>%</b><span>конкурентна партнерська знижка</span></div>
          <div className="stat reveal"><b data-count="50" data-suffix="+">0</b><span>моделей дверей в асортименті</span></div>
        </div>
      </div>

      <section id="audience">
        <div className="wrap">
          <div className="section-head reveal">
            <h2>Партнерство для будь-якого формату бізнесу</h2>
            <p>
              Від роздрібних магазинів до великих дилерських мереж, забудовників і міжнародних партнерів — IN WOOD
              пропонує умови співпраці, адаптовані до масштабу та потреб вашого бізнесу.
            </p>
          </div>
          <div className="audience-grid">
            {[
              "Дилери",
              "Дистриб'ютори",
              "Житлове будівництво",
              "Комерційна нерухомість",
              "Готельний бізнес",
              "Апарт-комплекси",
              "Міжнародне партнерство",
              "Дизайнери",
            ].map((label, i) => (
              <div className="aud-card reveal" key={label}>
                <div className="ico">{i + 1}</div>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="segments">
        <div className="wrap">
          <div className="section-head reveal">
            <h2>Широкий вибір дверей для різних сегментів ринку</h2>
            <p>
              Асортимент IN WOOD охоплює різні конструкції дверей та варіанти оздоблення: щитові полотна з декором,
              двері прихованого монтажу, фрезеровані й фарбовані моделі, двері з ПВХ-покриттям та дзеркальними
              вставками. Це дозволяє закривати потреби різних клієнтів — від приватних замовлень до масштабних
              проєктів.
            </p>
          </div>
          <div className="marquee-wrap reveal">
            <div className="marquee">
              {[...Array(2)].flatMap((_, rep) =>
                ["Щитові", "Прихований монтаж", "Фрезерування", "ПВХ-покриття", "Фарбування", "Дзеркальні вставки"].map(
                  (label) => (
                    <div className="m-pill" key={`${rep}-${label}`}>{label}</div>
                  )
                )
              )}
            </div>
          </div>
          <div className="segments-grid">
            {[
              ["Щитові", "Міцний дерев'яний каркас із МДФ-облицюванням та сотовим наповнювачем, який забезпечує стабільність конструкції та стійкість полотна."],
              ["Прихований монтаж", "Конструкція без видимої коробки — полотно та коробка інтегровані в площину стіни, що створює преміальний вигляд сучасного інтер'єру."],
              ["Фрезерування", "Декоративні рельєфні елементи на поверхні полотна, що додають дверям виразності та дозволяють реалізовувати унікальні дизайнерські рішення."],
              ["ПВХ-покриття", "Надійне покриття для дверей у різних цінових сегментах — поєднання практичності, довговічності та широкого вибору декорів."],
              ["Фарбування", "Естетичне покриття з можливістю вибору кольору за палітрами RAL / NCS — для створення індивідуальних дверей під дизайн будь-якого проєкту."],
              ["Дзеркальні вставки", "Додає дверям естетики та виразності, розширюючи можливості дизайну й адаптації під стиль інтер'єру."],
            ].map(([h, p], i) => (
              <div className="seg-card reveal" key={h}>
                <div className="ico">{i + 1}</div>
                <h4>{h}</h4>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="strengths">
        <div className="watermark">01</div>
        <div className="wrap">
          <div className="section-head reveal">
            <h2>Сильні сторони продукту</h2>
            <p>Технічні рішення, що забезпечують комфорт і якість, відчутні з першого дотику.</p>
          </div>
          <div className="strengths-list">
            <div className="strength-item reveal">
              <div className="circle">1</div>
              <div>
                <h4>Максимальна заводська підготовка</h4>
                <ul>
                  <li>Врізка замка на виробництві</li>
                  <li>Підготовка посадочних місць під петлі</li>
                  <li>Врізка відповідної планки в дверну коробку</li>
                  <li>Зарізка коробки під 45°</li>
                  <li>Точна геометрія всіх елементів</li>
                  <li>Повна готовність до швидкого монтажу</li>
                </ul>
              </div>
            </div>
            <div className="strength-item reveal">
              <div className="circle">2</div>
              <div>
                <h4>Нестандартні розміри з кроком в 50 мм без доплати</h4>
                <ul>
                  <li>Ширина без доплати: {STANDARD_WIDTHS_TEXT} (крок 50 мм)</li>
                  <li>Висота без доплати: {STANDARD_HEIGHTS_TEXT} (крок 50 мм)</li>
                </ul>
                <span className="note">*Максимальна висота: від {NONSTD_HEIGHTS_TEXT} (за додаткову оплату)</span>
              </div>
            </div>
            <div className="strength-item reveal">
              <div className="circle">3</div>
              <div>
                <h4>Короб із комбінованого матеріалу (натуральна сосна + МДФ)</h4>
                <p>
                  Поєднання натуральної сосни та МДФ забезпечує міцність конструкції, стабільну геометрію та акуратний
                  зовнішній вигляд. Сосна надає коробу жорсткість і надійність, а МДФ забезпечує ідеально рівну
                  поверхню для якісного покриття. Завдяки такій конструкції короб стійкий до деформації та зберігає
                  свої властивості протягом багатьох років.
                </p>
              </div>
            </div>
            <div className="strength-item reveal">
              <div className="circle">4</div>
              <div>
                <h4>Товстий шар МДФ (6 мм)</h4>
                <p>Підвищена жорсткість дверного полотна, стійкість до деформації та довший термін служби.</p>
              </div>
            </div>
            <div className="strength-item reveal">
              <div className="circle">5</div>
              <div>
                <h4>Каркас із сухої деревини</h4>
                <p>Міцність конструкції та довговічність дверей навіть після багатьох років експлуатації.</p>
              </div>
            </div>
            <div className="strength-item reveal">
              <div className="circle">6</div>
              <div>
                <h4>Щільний стільниковий наповнювач 18 мм</h4>
                <p>Краща стабільність конструкції та дверного полотна в цілому.</p>
              </div>
            </div>
            <div className="strength-item reveal">
              <div className="circle">7</div>
              <div>
                <h4>Алюмінієва крайка</h4>
                <p>Надійний захист від ударів, сколів, вологи та механічних пошкоджень.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="benefits">
        <div className="watermark">02</div>
        <div className="wrap">
          <div className="section-head reveal">
            <h2>Умови, які працюють на ваш прибуток</h2>
            <p>Прямі ціни від виробника без посередників, конкурентна пропозиція для клієнтів і готові інструменти для ефективного продажу.</p>
          </div>
          <div className="benefits">
            {[
              ["Каталог продукції", "Повний асортимент дверей із колекціями, варіантами виконання та технічними характеристиками для зручної презентації."],
              ["Прайс", "Актуальні ціни та умови співпраці для формування конкурентної пропозиції."],
              ["Онлайн-калькулятор IN WOOD", "Забирає на себе 90% рутинних розрахунків: комерційна пропозиція, яка раніше займала години, тепер готується за 5 хвилин."],
              ["Персональний менеджер", "Повний супровід партнера: консультації, допомога з підбором рішень та оперативне вирішення робочих питань."],
              ["Забезпечення інформаційними матеріалами", "Готові електронні та друковані матеріали для просування продукції IN WOOD: презентація, каталог, листівки, прайс та інші інструменти продажу."],
              ["Миттєве вивантаження КП в PDF", "Готова комерційна пропозиція з фото, цінами та всіма позиціями замовлення — одним кліком у PDF, готова до друку чи надсилання клієнту."],
            ].map(([h, p], i) => (
              <div className="benefit reveal" key={h}>
                <div className="num">{String(i + 1).padStart(2, "0")}</div>
                <h3>{h}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="collections">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="eyebrow">Асортимент</div>
            <h2>Асортимент, який працює на ваші продажі</h2>
            <p>
              Натуральна деревина, якісні МДФ-полотна, оздоблення ПВХ-плівкою або фарбування за каталогами RAL/NCS —
              широкий вибір кольорів і текстур для реалізації будь-якого інтер'єрного рішення.
            </p>
          </div>
          <div className="collections">
            {[
              { name: "Etalon", desc: "Щитові, гладкі або декоровані молдингом та дзеркальними вставками, покриття – ПВХ.", img: "/photos/etalon/et-01-dub-shato.png", cover: false },
              { name: "Nominal", desc: "Щитові, бюджетна лінійка, декор — молдинг, покриття – ПВХ.", img: "/photos/nominal/nl-01-antratsyt.png", cover: false },
              { name: "Frezzatti", desc: "Щитові, декор — фрезерування, покриття – ПВХ-плівка або фарбування за картами RAL / NCS.", img: "/photos/frezzatti/fz-01-antratsyt.png", cover: false },
              { name: "Perfetto", desc: "Щитові, декор — фрезерування, покриття — фарбування за картами RAL / NCS.", img: "/photos/perfetto/pf-01.png", cover: false },
              { name: "Hidden Doors", desc: "Щитові, прихований монтаж, звичайне відкривання або INSIDE, покриття — фарбування за картами RAL / NCS.", img: "/photos/hidden-doors/primer.jpg", cover: true },
            ].map((c) => (
              <div className="coll reveal" key={c.name}>
                <div className="ph">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={c.cover ? "cover" : ""} src={c.img} alt={`Колекція ${c.name} IN WOOD`} />
                </div>
                <div className="cap">
                  <b>{c.name}</b>
                  <span>{c.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how">
        <div className="wrap">
          <div className="section-head reveal">
            <h2>Чотири кроки від першого звернення до запуску продажів</h2>
          </div>
          <div className="steps">
            {[
              ["Заявка", "Заповніть коротку форму — менеджер IN WOOD зв'яжеться з Вами для обговорення деталей співпраці."],
              ["Умови співпраці", "Визначення формату роботи, регіону, асортименту та загальних умов партнерства."],
              ["Матеріали для продажу", "Каталог продукції, партнерський прайс, унікальний калькулятор вартості від IN WOOD та інші інструменти для роботи з клієнтами."],
              ["Старт співпраці", "Разом із персональним менеджером оформлюєте перше замовлення та отримуєте супровід на всіх етапах співпраці."],
            ].map(([h, p], i) => (
              <div className="step reveal" key={h}>
                <div className="circle">{i + 1}</div>
                <h4>{h}</h4>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="catalog-section">
        <div className="wrap">
          <div className="catalog-card reveal">
            <div className="cinfo">
              <h3>Каталог продукції IN WOOD</h3>
              <p>Залиште своє ім'я та контактний номер телефону — каталог IN WOOD відразу відкриється для перегляду.</p>
            </div>
            {sentState === "catalog" ? (
              <div className="catalog-gate catalog-unlocked">
                <div className="check">✓</div>
                <p>Дякуємо! Ось ваш каталог:</p>
                <a className="btn" href="/documents/catalog-ua.pdf" target="_blank" rel="noopener noreferrer">
                  Переглянути каталог
                </a>
              </div>
            ) : (
              <div className="catalog-gate">
                <form action={submitCatalogForm}>
                  <div className="field">
                    <label htmlFor="cname">Ім&apos;я</label>
                    <input type="text" id="cname" name="name" placeholder="Ваше ім'я" required />
                  </div>
                  <div className="field">
                    <label htmlFor="cphone">Телефон</label>
                    <PhoneInput
                      name="phone"
                      required
                      manualLabel="Немає моєї країни в списку — ввести номер вручну"
                      chooseCountryLabel="Обрати країну зі списку"
                      invalidLabel="Перевірте номер телефону"
                    />
                  </div>
                  <button type="submit" className="btn">Отримати каталог</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="form-section">
        <div className="wrap">
          <div className="form-card reveal">
            {sentState === "partner" ? (
              <div className="success-msg">
                <div className="check">✓</div>
                <h3>Заявку надіслано</h3>
                <p>Дякуємо! Менеджер IN WOOD зв&apos;яжеться з вами найближчим часом.</p>
              </div>
            ) : (
              <div>
                <h2>Стати партнером IN WOOD</h2>
                <p className="sub">Заповніть форму та надішліть заявку — Ваш персональний менеджер зателефонує та проведе конструктивну консультацію.</p>
                <form action={submitPartnerForm}>
                  <div className="field">
                    <label htmlFor="name">ПІБ та компанія</label>
                    <input type="text" id="name" name="name" placeholder="ПІБ, назва компанії" required />
                  </div>
                  <div className="field">
                    <label htmlFor="role">Варіанти співпраці</label>
                    <select id="role" name="role" required defaultValue="">
                      <option value="" disabled>Оберіть варіант...</option>
                      <option value="Дилер">Дилер</option>
                      <option value="Дистриб'ютор">Дистриб&apos;ютор</option>
                      <option value="Забудовник житлової нерухомості">Забудовник житлової нерухомості</option>
                      <option value="Забудовник комерційної нерухомості">Забудовник комерційної нерухомості</option>
                      <option value="Міжнародне партнерство">Міжнародне партнерство</option>
                      <option value="Дизайнер">Дизайнер</option>
                      <option value="Інше">Інше</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="phone">Телефон</label>
                    <PhoneInput
                      name="phone"
                      required
                      manualLabel="Немає моєї країни в списку — ввести номер вручну"
                      chooseCountryLabel="Обрати країну зі списку"
                      invalidLabel="Перевірте номер телефону"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="city">Населений пункт</label>
                    <input type="text" id="city" name="city" placeholder="Населений пункт, район, область" required />
                  </div>
                  <div className="field">
                    <label htmlFor="message">Коментар (необов&apos;язково)</label>
                    <textarea id="message" name="message" placeholder="Формат партнерства, орієнтовний обсяг закупівель тощо" />
                  </div>
                  <button type="submit" className="btn">Надіслати заявку</button>
                </form>
                <p className="privacy-note">Натискаючи «Надіслати заявку», Ви погоджуєтесь на обробку контактних даних для зв&apos;язку щодо партнерства.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div>
            <div className="logo" style={{ marginBottom: 12 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo/inwood-logo-white.svg" alt="IN WOOD" style={{ height: 28, width: "auto" }} />
              <span style={{ fontSize: 15 }}>IN WOOD</span>
            </div>
            <div className="fcontact">
              м. Полтава, провулок Спортивний, 4<br />
              <a href="mailto:info@inwood.com.ua">info@inwood.com.ua</a><br />
              <a href="tel:+380508803841">+380 (50) 880-38-41</a>
            </div>
          </div>
          <div className="fnote">Виробник міжкімнатних дверей<br />Партнерська програма 2026</div>
        </div>
      </footer>
    </div>
  );
}
