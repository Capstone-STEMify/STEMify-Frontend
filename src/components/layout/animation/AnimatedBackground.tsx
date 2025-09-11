'use client'
import React, { useEffect, useState } from 'react'

interface Sphere {
  id: number
  size: number
  color: string
  initialX: number
  initialY: number
  duration: number
  delay: number
}

const AnimatedBackground: React.FC = () => {
  const [spheres, setSpheres] = useState<Sphere[]>([])

  useEffect(() => {
    const newSpheres: Sphere[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      size: Math.random() * 100 + 50, // 50-150px
      color: [
        'bg-blue-400',
        'bg-purple-400',
        'bg-pink-400',
        'bg-yellow-400',
        'bg-green-400',
        'bg-orange-400',
        'bg-cyan-400',
        'bg-red-400'
      ][Math.floor(Math.random() * 8)],
      initialX: Math.random() * 100, // 0-100%
      initialY: Math.random() * 100, // 0-100%
      duration: Math.random() * 20 + 15, // 15-35s
      delay: Math.random() * 5 // 0-5s delay
    }))
    setSpheres(newSpheres)
  }, [])

  return (
    <div className='pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden'>
      {spheres.map((sphere) => (
        <div
          key={sphere.id}
          className={`absolute rounded-full opacity-20 ${sphere.color}`}
          style={{
            width: `${sphere.size}px`,
            height: `${sphere.size}px`,
            left: `${sphere.initialX}%`,
            top: `${sphere.initialY}%`,
            animation: `float-${sphere.id} ${sphere.duration}s infinite linear`,
            animationDelay: `${sphere.delay}s`
          }}
        />
      ))}

      <style jsx>{`
        @keyframes float-0 {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(-30vw, -20vh) rotate(90deg);
          }
          50% {
            transform: translate(40vw, -15vh) rotate(180deg);
          }
          75% {
            transform: translate(20vw, 30vh) rotate(270deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }
        @keyframes float-1 {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(35vw, -25vh) rotate(120deg);
          }
          66% {
            transform: translate(-45vw, 20vh) rotate(240deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }
        @keyframes float-2 {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          20% {
            transform: translate(-40vw, -25vh) rotate(72deg);
          }
          40% {
            transform: translate(30vw, -35vh) rotate(144deg);
          }
          60% {
            transform: translate(50vw, 15vh) rotate(216deg);
          }
          80% {
            transform: translate(-15vw, 40vh) rotate(288deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }
        @keyframes float-3 {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(-55vw, 35vh) rotate(180deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }
        @keyframes float-4 {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(45vw, -40vh) rotate(90deg);
          }
          50% {
            transform: translate(-50vw, -30vh) rotate(180deg);
          }
          75% {
            transform: translate(-25vw, 45vh) rotate(270deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }
        @keyframes float-5 {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          40% {
            transform: translate(60vw, -20vh) rotate(144deg);
          }
          80% {
            transform: translate(-35vw, 50vh) rotate(288deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }
        @keyframes float-6 {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          30% {
            transform: translate(-50vw, -35vh) rotate(108deg);
          }
          60% {
            transform: translate(55vw, -25vh) rotate(216deg);
          }
          90% {
            transform: translate(25vw, 55vh) rotate(324deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }
        @keyframes float-7 {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(-40vw, 35vh) rotate(90deg);
          }
          50% {
            transform: translate(50vw, 40vh) rotate(180deg);
          }
          75% {
            transform: translate(35vw, -35vh) rotate(270deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

export default AnimatedBackground
