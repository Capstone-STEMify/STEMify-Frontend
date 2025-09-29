'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaCarouselType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

type Slide = {
  id: string;
  src: string;
  alt?: string;
};

const SLIDES: Slide[] = [
  {
    id: 'sale-1',
    src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2000&auto=format&fit=crop',
    alt: 'Robotics back to school'
  },
  {
    id: 'sale-2',
    src: 'https://cdn.shopify.com/s/files/1/0070/5901/3716/files/PC_US_47efac92-8850-4c9f-b2f9-b11cd286cdbe.png?v=1754650791',
    alt: 'STEM kits'
  },
  {
    id: 'sale-3',
    src: 'https://cdn.shopify.com/s/files/1/0070/5901/3716/files/mBot2_7c8e01e3-188d-488c-a3ca-411420be4fdd.jpg?v=1745475642',
    alt: 'Coding lab'
  },
  {
    id: 'sale-4',
    src: 'https://cdn.shopify.com/s/files/1/0070/5901/3716/files/banner_f911a697-7f1c-47d0-adbe-79a2dff7064f.png?v=1757055291',
    alt: 'Makerspace'
  }
];

export default function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      skipSnaps: false,
      dragFree: false
    },
    [
      Autoplay({
        delay: 3500,
        stopOnInteraction: false,
        playOnInit: true,
        stopOnMouseEnter: true
      })
    ]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect(emblaApi);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((idx: number) => emblaApi?.scrollTo(idx), [emblaApi]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative w-full bg-black text-white mb-10"
      aria-label="Hero Carousel"
    >
      {/* Carousel */}
      <div className="group relative">
        <div className="embla__viewport overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex touch-pan-y">
            {SLIDES.map((s) => (
              <div
                key={s.id}
                className="embla__slide relative min-w-full flex-[0_0_100%] h-[60vh]"
              >
                <img
                  src={s.src}
                  alt={s.alt ?? 'slide'}
                  className="h-full w-full object-cover"
                  draggable={false}
                />

                <div className="pointer-events-none absolute inset-0" />
              </div>
            ))}
          </div>
        </div>

        <button
          aria-label="Previous slide"
          onClick={scrollPrev}
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 text-black shadow-lg backdrop-blur transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 md:left-5 opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          aria-label="Next slide"
          onClick={scrollNext}
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 text-black shadow-lg backdrop-blur transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 md:right-5 opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`pointer-events-auto h-2.5 w-2.5 rounded-full transition
                ${i === selectedIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/80'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
