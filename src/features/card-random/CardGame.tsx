'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import type { EmblaCarouselType } from 'embla-carousel'
import AutoScroll from 'embla-carousel-auto-scroll'
import { motion, useAnimationControls } from 'framer-motion'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'

// --- Types ---
export type CardModel = {
  id: string
  frontSrc: string
  label?: string
}

// --- Demo Deck (12 cards) ---
const imagePaths = [
  'https://res.cloudinary.com/dgdi9wvpz/image/upload/v1760092619/res_les_harnessing-wind-energy_cover_djs81j.webp',
  'https://res.cloudinary.com/dgdi9wvpz/image/upload/v1760092619/res_les_intro-dodecahedron-platonic-solid_cover_hhxrvi.webp',
  'https://res.cloudinary.com/dgdi9wvpz/image/upload/v1760092618/res_act_little-friend_cover_qgcgss.webp',
  'https://res.cloudinary.com/dgdi9wvpz/image/upload/v1760092618/res_les_crane-automation_cover_1_u3yo9z.webp',
  'https://res.cloudinary.com/dgdi9wvpz/image/upload/v1760092618/res_act_construct-a-drawbridge-with-microbit_cover_wwxzds.webp',
  'https://res.cloudinary.com/dgdi9wvpz/image/upload/v1760092618/res_act_build-a-mechanical-claw_cover_xwtodz.webp',
  'https://res.cloudinary.com/dgdi9wvpz/image/upload/v1760092618/STEAM_classroom_with_microbit_Bundle_Strawbees_lesson-thumbnail_5_hydropower-inventions_wqhcda.jpg'
]
const DEMO_DECK: CardModel[] = imagePaths.map((src, i) => ({
  id: `card-${i + 1}`,
  frontSrc: src,
  label: `Card ${i + 1}`
}))

// --- Card Back ---
const CardBack: React.FC = () => (
  <div className='relative h-full w-full rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 p-[3px] shadow-2xl'>
    <div className='relative grid h-full w-full place-items-center overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 backdrop-blur-sm'>
      {/* Animated gradient overlay */}
      <div className='absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 opacity-50' />

      {/* Center ornament */}
      <div className='relative z-10'>
        <div className='grid h-16 w-16 animate-pulse place-items-center rounded-full border-2 border-cyan-300/40'>
          <div className='grid h-10 w-10 place-items-center rounded-full border-2 border-blue-300/60'>
            <div className='h-4 w-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-blue-500/50' />
          </div>
        </div>
      </div>

      {/* Decorative corners */}
      <div className='absolute top-4 left-4 h-8 w-8 rounded-tl-lg border-t-2 border-l-2 border-cyan-400/30' />
      <div className='absolute top-4 right-4 h-8 w-8 rounded-tr-lg border-t-2 border-r-2 border-blue-400/30' />
      <div className='absolute bottom-4 left-4 h-8 w-8 rounded-bl-lg border-b-2 border-l-2 border-indigo-400/30' />
      <div className='absolute right-4 bottom-4 h-8 w-8 rounded-br-lg border-r-2 border-b-2 border-cyan-400/30' />
    </div>
  </div>
)

// --- Card Front (uses your image) ---
const CardFront: React.FC<{ src: string; alt?: string }> = ({ src, alt }) => (
  <div className='relative h-full w-full overflow-hidden rounded-3xl shadow-2xl'>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={src} alt={alt ?? 'card'} className='h-full w-full object-cover' />
  </div>
)

// --- Fireworks (celebration) ---
const Fireworks: React.FC<{ shots?: number; size?: number; life?: number } & React.HTMLAttributes<HTMLDivElement>> = ({
  shots = 24,
  size = 10,
  life = 1300,
  className
}) => {
  const particles = useMemo(
    () =>
      Array.from({ length: shots }).map((_, i) => {
        const angle = (360 / shots) * i + Math.random() * 12
        const rad = (angle * Math.PI) / 180
        const dist = 180 + Math.random() * 120
        const x = Math.cos(rad) * dist
        const y = Math.sin(rad) * dist
        const delay = Math.random() * 0.12
        return { id: i, x, y, delay }
      }),
    [shots]
  )

  return (
    <div className={className}>
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.3 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 1 }}
          transition={{ duration: life / 1000, ease: 'easeOut', delay: p.delay }}
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full'
          style={{
            width: size,
            height: size,
            background:
              'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(249,115,22,1) 40%, rgba(192,38,211,1) 100%)',
            boxShadow: '0 0 12px rgba(249,115,22,0.6)'
          }}
        />
      ))}
    </div>
  )
}

// --- Single Card View with Y-axis Flip Animation ---
const FlipCard: React.FC<{
  width: number
  height: number
  frontSrc: string
  isRevealed: boolean
  isActiveSpin: boolean
  onSpinDone?: () => void
}> = ({ width, height, frontSrc, isRevealed, isActiveSpin, onSpinDone }) => {
  const controls = useAnimationControls()

  useEffect(() => {
    let alive = true
    const go = async () => {
      if (isActiveSpin) {
        await controls.start({
          rotateY: [0, 180, 360, 540, 720, 900, 1080, 1260, 1440, 1620],
          transition: { duration: 1.6, ease: 'easeInOut' }
        })
        if (!alive) return
        controls.set({ rotateY: 180 }) // land on front
        onSpinDone?.()
      } else {
        controls.set({ rotateY: isRevealed ? 180 : 0 })
      }
    }
    go()
    return () => {
      alive = false
    }
  }, [isActiveSpin, isRevealed, controls, onSpinDone])

  return (
    <motion.div style={{ perspective: 1200 }} className='select-none'>
      <motion.div
        animate={controls}
        className='relative duration-500 ease-out will-change-transform [transform-style:preserve-3d]'
        style={{ width, height }}
      >
        {/* Back Face */}
        <div className='absolute inset-0 [backface-visibility:hidden]'>
          <CardBack />
        </div>
        {/* Front Face */}
        <div className='absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]'>
          <CardFront src={frontSrc} />
        </div>
      </motion.div>
    </motion.div>
  )
}

// --- Main Game Component ---
export default function CardRandomGame(): JSX.Element {
  // ✅ Use AutoScroll plugin for continuous movement
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center', dragFree: true }, [
    AutoScroll({
      speed: 2.2,
      playOnInit: true,
      stopOnMouseEnter: false, // non stop when hover
      stopOnInteraction: false // non stop when scrolling
    })
  ])

  const router = useRouter()
  const locale = useLocale()

  const [deck] = useState<CardModel[]>(DEMO_DECK)
  const [revealedMap, setRevealedMap] = useState<Record<string, boolean>>({})
  const [spinningId, setSpinningId] = useState<string | null>(null)
  const [celebrateId, setCelebrateId] = useState<string | null>(null)

  const slideWidth = 240
  const slideHeight = 340

  // ✅ Helper get plugin autoScroll
  const getAutoScroll = useCallback(() => (emblaApi ? (emblaApi.plugins() as any)?.autoScroll : undefined), [emblaApi])

  const resetGame = useCallback(() => {
    setRevealedMap({})
    setSpinningId(null)
    setCelebrateId(null)
    // resume continuous scroll
    getAutoScroll()?.play?.()
  }, [getAutoScroll])

  const scrollToIndex = useCallback(
    (index: number) => {
      const api = emblaApi as EmblaCarouselType | undefined
      api?.scrollTo(index, true)
    },
    [emblaApi]
  )

  const pickCard = useCallback(
    (index: number) => {
      const card = deck[index]
      if (!card) return
      if (spinningId || revealedMap[card.id]) return
      getAutoScroll()?.stop?.()
      setCelebrateId(null)
      setSpinningId(card.id)
      scrollToIndex(index)
    },
    [deck, revealedMap, scrollToIndex, spinningId, getAutoScroll]
  )

  const onSpinDone = useCallback(() => {
    if (!spinningId) return
    setRevealedMap((prev) => ({ ...prev, [spinningId]: true }))
    setCelebrateId(spinningId)
    setSpinningId(null)
    setTimeout(() => getAutoScroll()?.play?.(), 1900)
  }, [spinningId, getAutoScroll])

  // Auto-hide celebration after a while
  // useEffect(() => {
  //   if (!celebrateId) return;
  //   const t = setTimeout(() => setCelebrateId(null), 1800);
  //   return () => clearTimeout(t);
  // }, [celebrateId]);

  return (
    <div className='relative min-h-[100svh] w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white'>
      {/* Animated background blobs */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-cyan-500/20 blur-[100px]' />
        <div
          className='absolute right-10 bottom-20 h-96 w-96 animate-pulse rounded-full bg-blue-500/20 blur-[120px]'
          style={{ animationDelay: '1s' }}
        />
        <div
          className='absolute top-1/2 left-1/2 h-64 w-64 animate-pulse rounded-full bg-indigo-500/15 blur-[100px]'
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* Header */}
      <div className='relative z-10 px-4 pt-12'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div>
            <h1 className='mx-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl'>
              Bánh xe ý tưởng
            </h1>
          </div>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => {
                const api = emblaApi
                if (!api) return
                const slidesInView = (api as any).internalEngine().slideRegistry // optional
                const idx = Math.floor(Math.random() * deck.length)
                pickCard(idx)
              }}
              className='group relative rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 font-semibold shadow-lg shadow-blue-500/50 transition-all hover:from-cyan-500 hover:to-blue-500 hover:shadow-xl hover:shadow-blue-500/60 active:scale-[0.97]'
            >
              <span className='relative z-10'>Bắt đầu thử thách</span>
              <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 blur transition group-hover:opacity-20' />
            </button>
            <button
              onClick={resetGame}
              className='rounded-2xl border border-white/20 bg-white/10 px-6 py-3 font-semibold backdrop-blur-sm transition-all hover:bg-white/20 active:scale-[0.97]'
            >
              Đặt lại
            </button>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className='relative z-10 mt-6'>
        <div ref={emblaRef} className='overflow-hidden py-30'>
          <div className='flex items-center gap-8 px-8 md:gap-12'>
            {DEMO_DECK.map((card) => (
              <div key={card.id} className='shrink-0' style={{ width: slideWidth }}>
                <div className='group relative'>
                  {/* Floor shadow */}
                  <div className='pointer-events-none absolute inset-x-6 -bottom-4 h-8 rounded-full bg-cyan-500/20 blur-2xl transition-all duration-300 group-hover:bg-blue-500/30' />

                  <button
                    onClick={() => {
                      const idx = DEMO_DECK.findIndex((c) => c.id === card.id)
                      pickCard(idx)
                    }}
                    disabled={!!spinningId || !!revealedMap[card.id]}
                    className='outline-none'
                    aria-label={`Pick ${card.label}`}
                  >
                    <div
                      className='relative [transform:translateZ(0)] overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 shadow-2xl ring-1 ring-cyan-400/30 backdrop-blur-md transition-all duration-300 group-hover:-translate-y-3 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:ring-2 group-hover:ring-blue-400/50 group-active:translate-y-0'
                      style={{ width: slideWidth, height: slideHeight }}
                    >
                      <FlipCard
                        width={slideWidth}
                        height={slideHeight}
                        frontSrc={card.frontSrc}
                        isRevealed={!!revealedMap[card.id]}
                        isActiveSpin={spinningId === card.id}
                        onSpinDone={onSpinDone}
                      />
                      {/* Glow */}
                      <div className='pointer-events-none absolute -inset-2 rounded-3xl bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-indigo-400/20 opacity-0 blur-xl transition-all duration-300 group-hover:opacity-60' />

                      {/* Sparkle effect on hover */}
                      <div className='pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity group-hover:opacity-100'>
                        <div className='absolute top-4 right-4 h-2 w-2 animate-ping rounded-full bg-cyan-300' />
                        <div
                          className='absolute bottom-6 left-6 h-1.5 w-1.5 animate-ping rounded-full bg-blue-300'
                          style={{ animationDelay: '0.3s' }}
                        />
                        <div
                          className='absolute top-1/2 left-4 h-1 w-1 animate-ping rounded-full bg-indigo-300'
                          style={{ animationDelay: '0.6s' }}
                        />
                      </div>
                    </div>
                  </button>

                  <div className='mt-4 text-center'>
                    <div className='inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md'>
                      <span className='text-sm font-medium'>
                        {revealedMap[card.id] ? (
                          <span className='text-amber-300'>✨ {card.label}</span>
                        ) : (
                          <span className='text-blue-200'>Dừng</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Celebration Overlay */}
      {celebrateId && (
        <div className='fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-md'>
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className='relative'
          >
            {/* Outer glow rings */}
            <div className='absolute inset-0 -m-8'>
              <div className='absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl' />
              <div
                className='absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 blur-3xl'
                style={{ animationDelay: '0.5s' }}
              />
            </div>

            {/* Big card front with enhanced styling */}
            <div className='relative rounded-[32px] bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-1 shadow-2xl ring-2 ring-cyan-400/50 backdrop-blur-sm'>
              <div style={{ width: 360, height: 520 }} className='overflow-hidden rounded-[28px] ring-1 ring-white/10'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={deck.find((d) => d.id === celebrateId)?.frontSrc || ''}
                  alt='selected card'
                  className='h-full w-full object-cover'
                />
              </div>
            </div>
            {/* Fireworks */}
            <Fireworks className='pointer-events-none absolute inset-0' shots={32} size={12} life={1400} />

            {/* Small CTA under the selected card */}
            <div className='mt-3 flex justify-center gap-3'>
              <button
                onClick={() => router.push(`/${locale}/create-3d`)}
                className='rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs backdrop-blur-sm hover:bg-white/20'
              >
                Bắt đầu ngay
              </button>
              <button
                onClick={resetGame}
                className='rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm hover:bg-white/20'
              >
                Đặt lại
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
