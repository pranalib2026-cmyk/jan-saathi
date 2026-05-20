"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollProvider() {
  useEffect(() => {
    // Init Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      direction: "vertical",
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Connect Lenis and GSAP's ScrollTrigger
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        return arguments.length ? lenis.scrollTo(value) : lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      // pinType: document.documentElement.style.transform ? "transform" : "fixed"
    });

    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // Basic entrance animations for elements marked with data-anim
    gsap.utils.toArray("[data-anim]").forEach((el) => {
      const type = el.getAttribute("data-anim") || "fade-up";
      if (type === "fade-up") {
        gsap.from(el, {
          y: 18,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      } else if (type === "fade-left") {
        gsap.from(el, {
          x: -24,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      } else if (type === "stagger") {
        gsap.from(el.children, {
          y: 16,
          opacity: 0,
          stagger: 0.06,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      }
    });

    // Refresh ScrollTrigger after images/video load
    const imgs = document.images;
    let loaded = 0;
    const check = () => {
      loaded++;
      if (loaded >= imgs.length) ScrollTrigger.refresh();
    };
    for (const img of imgs) img.complete ? (loaded++) : img.addEventListener("load", check);

    // Cleanup
    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
