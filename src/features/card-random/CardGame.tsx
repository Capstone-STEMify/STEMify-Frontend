'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import type { EmblaCarouselType } from 'embla-carousel'
import AutoScroll from 'embla-carousel-auto-scroll'
import { motion, useAnimationControls } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

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
  'https://res.cloudinary.com/dgdi9wvpz/image/upload/v1760092619/res_les_marble-run-part-1-foundation_cover_1_audbtg.webp',
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
  <div className='relative h-full w-full rounded-3xl bg-gradient-to-br from-purple-600 via-fuchsia-500 to-amber-500 p-[3px] shadow-2xl'>
    <div className='relative grid h-full w-full place-items-center overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 backdrop-blur-sm'>
      {/* Animated gradient overlay */}
      <div className='absolute inset-0 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 opacity-50' />

      {/* Center ornament */}
      <div className='relative z-10'>
        <div className='grid h-16 w-16 animate-pulse place-items-center rounded-full border-2 border-purple-300/40'>
          <div className='grid h-10 w-10 place-items-center rounded-full border-2 border-fuchsia-300/60'>
            <div className='h-4 w-4 rounded-full bg-gradient-to-br from-purple-400 to-fuchsia-400 shadow-lg shadow-fuchsia-500/50' />
          </div>
        </div>
      </div>

      {/* Decorative corners */}
      <div className='absolute top-4 left-4 h-8 w-8 rounded-tl-lg border-t-2 border-l-2 border-purple-400/30' />
      <div className='absolute top-4 right-4 h-8 w-8 rounded-tr-lg border-t-2 border-r-2 border-fuchsia-400/30' />
      <div className='absolute bottom-4 left-4 h-8 w-8 rounded-bl-lg border-b-2 border-l-2 border-amber-400/30' />
      <div className='absolute right-4 bottom-4 h-8 w-8 rounded-br-lg border-r-2 border-b-2 border-purple-400/30' />
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
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center', dragFree: true }, // dragFree giúp mượt mà hơn
    [
      AutoScroll({
        speed: 2.2, // tốc độ cuộn (càng lớn càng nhanh)
        playOnInit: true,
        stopOnMouseEnter: false, // không dừng khi hover
        stopOnInteraction: false // không dừng khi kéo tay
      })
    ]
  )

  const router = useRouter()
  const locale = useLocale()

  const [deck] = useState<CardModel[]>(DEMO_DECK)
  const [revealedMap, setRevealedMap] = useState<Record<string, boolean>>({})
  const [spinningId, setSpinningId] = useState<string | null>(null)
  const [celebrateId, setCelebrateId] = useState<string | null>(null)

  const slideWidth = 240
  const slideHeight = 340

  // ✅ Helper lấy plugin autoScroll
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
      // tạm dừng auto scroll khi chuẩn bị spin
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
    // vẫn tạm dừng trong lúc overlay hiển thị, resume sau
    setTimeout(() => getAutoScroll()?.play?.(), 1900)
  }, [spinningId, getAutoScroll])

  // Auto-hide celebration after a while
  // useEffect(() => {
  //   if (!celebrateId) return;
  //   const t = setTimeout(() => setCelebrateId(null), 1800);
  //   return () => clearTimeout(t);
  // }, [celebrateId]);

  return (
    <div className='relative min-h-[100svh] w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white'>
      {/* Animated background blobs */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-purple-500/20 blur-[100px]' />
        <div
          className='absolute right-10 bottom-20 h-96 w-96 animate-pulse rounded-full bg-fuchsia-500/20 blur-[120px]'
          style={{ animationDelay: '1s' }}
        />
        <div
          className='absolute top-1/2 left-1/2 h-64 w-64 animate-pulse rounded-full bg-amber-500/10 blur-[100px]'
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* Header */}
      <div className='relative z-10 px-4 pt-12'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div>
            <h1 className='bg-gradient-to-r from-purple-400 via-fuchsia-400 to-amber-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl'>
              Bánh xe ý tưởng
            </h1>
          </div>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => {
                const api = emblaApi
                if (!api) return
                // pick ngẫu nhiên gần vị trí hiện tại
                const slidesInView = (api as any).internalEngine().slideRegistry // optional
                // fallback: chọn index bất kỳ
                const idx = Math.floor(Math.random() * deck.length)
                pickCard(idx)
              }}
              className='group relative rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-6 py-3 font-semibold shadow-lg shadow-purple-500/50 transition-all hover:from-purple-500 hover:to-fuchsia-500 hover:shadow-xl hover:shadow-purple-500/60 active:scale-[0.97]'
            >
              <span className='relative z-10'>Bắt đầu thử thách</span>
              <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400 to-fuchsia-400 opacity-0 blur transition group-hover:opacity-20' />
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
      <div className='relative z-10 mt-12'>
        <div ref={emblaRef} className='overflow-hidden py-25'>
          <div className='flex items-center gap-8 px-8 md:gap-12'>
            {DEMO_DECK.map((card) => (
              <div key={card.id} className='shrink-0' style={{ width: slideWidth }}>
                <div className='group relative'>
                  {/* Floor shadow */}
                  <div className='pointer-events-none absolute inset-x-6 -bottom-4 h-8 rounded-full bg-purple-500/30 blur-2xl transition-all duration-300 group-hover:bg-fuchsia-500/40' />

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
                      className='relative [transform:translateZ(0)] rounded-3xl bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 shadow-2xl ring-1 ring-purple-400/30 backdrop-blur-md transition-all duration-300 group-hover:-translate-y-3 group-hover:shadow-[0_0_40px_rgba(217,70,239,0.4)] group-hover:ring-2 group-hover:ring-fuchsia-400/50 group-active:translate-y-0'
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
                      <div className='pointer-events-none absolute -inset-2 rounded-3xl bg-gradient-to-r from-purple-400/30 via-fuchsia-400/30 to-amber-400/30 opacity-0 blur-2xl transition-all duration-300 group-hover:opacity-100' />
                    </div>
                  </button>

                  <div className='mt-4 text-center'>
                    <div className='inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md'>
                      <span className='text-sm font-medium'>
                        {revealedMap[card.id] ? (
                          <span className='text-amber-300'>✨ {card.label}</span>
                        ) : (
                          <span className='text-purple-200'>Dừng</span>
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
            {/* Glow rings */}
            <div className='absolute inset-0 -m-8'>
              <div className='absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 blur-3xl' />
              <div
                className='absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 blur-3xl'
                style={{ animationDelay: '0.5s' }}
              />
            </div>

            {/* Big card */}
            <div className='relative rounded-[32px] bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 p-1 shadow-2xl ring-2 ring-purple-400/50 backdrop-blur-sm'>
              <div style={{ width: 360, height: 520 }} className='overflow-hidden rounded-[28px] ring-1 ring-white/10'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={DEMO_DECK.find((d) => d.id === celebrateId)?.frontSrc || ''}
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
