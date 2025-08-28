"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import { BookOpen, Settings, Sparkles, Smile, ChevronUp, Star } from "lucide-react";

export type CarouselItem = {
  id: string;
  title: string;
  image: string;
  bg: string;
  rating?: number;
};

const ITEMS: CarouselItem[] = [
  {
    id: "police",
    title: "Police Car",
    image:
      "https://images.unsplash.com/photo-1542367597-8849ebc2b3b2?q=80&w=1200&auto=format&fit=crop",
    bg: "bg-indigo-400",
    rating: 3.5,
  },
  {
    id: "obstacle",
    title: "Obstacle Avoidance Car",
    image:
      "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=1200&auto=format&fit=crop",
    bg: "bg-rose-400",
    rating: 4.2,
  },
  {
    id: "sweeper",
    title: "Street Sweeper",
    image:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop",
    bg: "bg-amber-300",
    rating: 3.1,
  },
  {
    id: "robotarm",
    title: "Robot Arm",
    image:
      "https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=1200&auto=format&fit=crop",
    bg: "bg-green-400",
    rating: 4.6,
  },
  {
    id: "forklift",
    title: "Forklift",
    image:
      "https://images.unsplash.com/photo-1614680376739-414d95ff43df?q=80&w=1200&auto=format&fit=crop",
    bg: "bg-sky-400",
    rating: 3.8,
  },
];

function RatingStars({ value = 0 }: { value?: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const stars = new Array(5).fill(0).map((_, i) => {
    const active = i < full || (i === full && half);
    return (
      <Star
        key={i}
        className={`h-4 w-4 ${active ? "fill-yellow-400 stroke-yellow-400" : "stroke-zinc-300"}`}
      />
    );
  });
  return <div className="flex items-center gap-1">{stars}</div>;
}

function HeaderBar() {
  return (
    <div className="flex items-center justify-between gap-2 md:gap-6">
      {/* Left badge */}
      <div className="inline-flex items-center gap-3 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
        <BookOpen className="h-5 w-5" />
        <span className="text-lg font-semibold">uKit Advanced</span>
      </div>

      {/* Center tabs */}
      <nav className="hidden md:flex items-center gap-10">
        <button className="group inline-flex flex-col items-center text-zinc-700 hover:text-zinc-900">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            <span className="text-lg font-semibold">Curriculum</span>
          </div>
          <ChevronUp className="mt-1 hidden h-4 w-4 text-zinc-900 group-hover:block" />
        </button>
        <button className="inline-flex flex-col items-center text-zinc-500 hover:text-zinc-900">
          <div className="flex items-center gap-2">
            <Smile className="h-6 w-6" />
            <span className="text-lg font-medium">My Project</span>
          </div>
        </button>
        <button className="inline-flex flex-col items-center text-zinc-500 hover:text-zinc-900">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            <span className="text-lg font-medium">AI Library</span>
          </div>
        </button>
      </nav>

      {/* Settings */}
      <button className="ml-auto inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white/80 p-2 shadow-sm hover:bg-white">
        <Settings className="h-5 w-5" />
      </button>
    </div>
  );
}

export default function CarouselShowcase() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center", dragFree: false, loop: false });
  const [selected, setSelected] = useState(0);
  const [progress, setProgress] = useState(0);

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelected(api.selectedScrollSnap());
  }, []);

  const onScroll = useCallback((api: EmblaCarouselType) => {
    const p = Math.max(0, Math.min(1, api.scrollProgress()));
    setProgress(p);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    onScroll(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect, onScroll]);

  const scrollTo = (i: number) => emblaApi?.scrollTo(i);

  return (
    <div className="min-h-screen w-full bg-neutral-50">
      <div className="mx-auto max-w-7.5xl px-4 py-6 md:py-10">
        <HeaderBar />

        {/* Carousel */}
        <div className="overflow-x-hidden overflow-y-visible py-8" ref={emblaRef}>
          <div className="flex touch-pan-y gap-6">
            {ITEMS.map((item, i) => {
            const active = i === selected;
            return (
              <article
                key={item.id}
                className={`min-w-0 shrink-0 grow-0 basis-[85%] sm:basis-[55%] md:basis-[42%] lg:basis-[33%] transition-transform duration-300 ease-out ${active ? "scale-105 md:scale-110 z-10" : "scale-[.9] opacity-90"}`}>
                <div className={`relative mx-auto aspect-square w-[74vw] max-w-[28rem] rounded-full ${item.bg} shadow-lg sm:w-[60vw] md:w-[28rem]`}></div>
                <div className="pointer-events-none absolute -mt-[calc(min(74vw,28rem))] sm:-mt-[calc(min(60vw,28rem))] md:-mt-[28rem]"/>
                <div className="relative -mt-[calc(min(74vw,28rem))] sm:-mt-[calc(min(60vw,28rem))] md:-mt-[28rem]">
                  <div className={`relative mx-auto aspect-square w-[74vw] max-w-[28rem] overflow-hidden rounded-full ${item.bg} ${active ? "shadow-2xl" : "shadow-lg"} ring-1 ring-black/5 sm:w-[60vw] md:w-[28rem]`}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <h3 className="text-xl font-semibold text-zinc-900">{item.title}</h3>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <RatingStars value={item.rating ?? 0} />
                    <span className="text-sm text-zinc-500">{(item.rating ?? 0).toFixed(1)}</span>
                  </div>
                </div></article>
            )})}
          </div>
        </div>

        {/* Numbered pagination */}
        <div className="mt-8 flex items-center justify-center gap-2 md:gap-3">
          {ITEMS.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`flex h-8 min-w-8 items-center justify-center rounded-full text-sm transition-all md:h-9 md:min-w-9 md:text-base ${
                selected === i
                  ? "bg-zinc-900 px-3 font-semibold text-white"
                  : "text-zinc-700 hover:bg-zinc-100"
              }`}
              aria-label={`Go to item ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="relative mx-auto mt-4 h-2 w-[86%] max-w-xl rounded-full bg-zinc-200">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-zinc-900"
            style={{ width: `${Math.max(10, progress * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
