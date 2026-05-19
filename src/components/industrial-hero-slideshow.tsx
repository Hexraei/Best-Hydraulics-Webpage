"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import bg1 from "../../images/bg/bg1.webp";
import bg2 from "../../images/bg/bg2.webp";
import bg3 from "../../images/bg/bg3.webp";
import bg4 from "../../images/bg/bg4.webp";

const slides = [
  {
    src: bg1,
    alt: "Industrial warehouse and procurement operations",
  },
  {
    src: bg2,
    alt: "Hydraulic components and systems",
  },
  {
    src: bg3,
    alt: "Pneumatic machinery and valve assemblies",
  },
  {
    src: bg4,
    alt: "Industrial fitting and maintenance workspace",
  },
];

export function IndustrialHeroSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5600);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative h-full min-h-[36rem] overflow-hidden bg-slate-900 lg:min-h-[calc(100vh-4rem)]">
      {slides.map((slide, index) => (
        <div
          key={slide.alt}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className={`object-cover transition-transform duration-[9000ms] ease-out ${
              index === activeIndex ? "scale-105" : "scale-100"
            }`}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.08)_0%,rgba(2,6,23,0.08)_100%)]" />
        </div>
      ))}
    </div>
  );
}
