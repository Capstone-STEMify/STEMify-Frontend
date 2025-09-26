'use client'
import ModelCarousel from "@/features/Modal3Display/ModelCarousel";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function ThreeDSection() {
  const t = useTranslations('ThreeDSection')
  const tc = useTranslations('common')
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-blue-100/40 animate-pulse blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-orange-100/40 animate-pulse blur-3xl animation-delay-1000" />
        <div className="absolute top-1/2 left-1/4 h-64 w-64 rounded-full bg-gray-100/30 animate-pulse blur-2xl animation-delay-2000" />
        
        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 right-20 h-6 w-6 bg-blue-200/30 rotate-45 animate-bounce animation-delay-500" />
        <div className="absolute bottom-32 left-16 h-4 w-4 bg-orange-200/40 rounded-full animate-ping animation-delay-1500" />
        <div className="absolute top-1/3 left-20 h-8 w-8 bg-gradient-to-tl from-purple-500 to-pink-500 opacity-45 rotate-12 animate-spin slow-spin" />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container relative mx-auto flex items-center px-6 py-12 lg:py-20">
        <div className="flex mx-auto w-full max-w-7xl flex-col items-center gap-12 lg:flex-row lg:gap-16">
          
          {/* Enhanced Text Section */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* Animated Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 via-orange-300 to-amber-400 text-white text-sm font-medium shadow-md transform hover:scale-105 transition-all duration-300 animate-fade-in-up">
              {t('badge')}
            </div>

            {/* Enhanced Title with Gradient */}
            <h1 className="text-4xl md:text-6xl font-black text-gray-800 leading-tight animate-fade-in-up animation-delay-200">
              {t('title')}
            </h1>

            {/* Enhanced Description */}
            <p className="text-xl text-gray-600 leading-relaxed animate-fade-in-up animation-delay-400">
              {t('description.part1')}
              <span className="font-semibold text-gray-800"> {t('description.part2')}</span> 
              {t('description.part3')}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-600">
              <Link href='/resource'>
              <button className="group relative px-8 py-4 bg-amber-400 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300">
                <span className="relative z-10">{tc('button.start')}</span>
              </button>
              </Link>
              
              <Link href='/resource'>
              <button className="group px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl shadow-md border border-gray-200 hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                <span className="flex items-center">
                  {tc('button.look')}
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
              </Link>
            </div>

            {/* Stats or Features */}
            <div className="grid grid-cols-3 gap-6 pt-8 animate-fade-in-up animation-delay-800">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-500">100+</div>
                <div className="text-sm text-gray-500">{t('project')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-500">24/7</div>
                <div className="text-sm text-gray-500">{t('support')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-500">∞</div>
                <div className="text-sm text-gray-500">{t('creative')}</div>
              </div>
            </div>
          </div>

          {/* Enhanced 3D Model Section */}
          <div className="w-full lg:w-2/3">
            <div className="relative">
              {/* Glowing Border Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 via-orange-200 to-gray-200 rounded-2xl blur opacity-20" />
              
              {/* Main Container */}
              <div className="relative h-[600px] bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                {/* Inner Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-orange-50/30 rounded-2xl" />
                
                {/* Model Container */}
                <div className="relative h-full p-8">
                  <ModelCarousel />
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <div className="h-3 w-3 bg-red-300 rounded-full animate-pulse" />
                  <div className="h-3 w-3 bg-yellow-300 rounded-full animate-pulse animation-delay-300" />
                  <div className="h-3 w-3 bg-green-300 rounded-full animate-pulse animation-delay-600" />
                </div>

                {/* Bottom Tech Pattern */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-100/50 to-transparent" />
              </div>

              {/* Floating Action Elements */}
              <div className="absolute -bottom-6 -right-6 bg-orange-500 text-white p-4 rounded-xl shadow-lg animate-bounce animation-delay-1000">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
          opacity: 0;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-1500 {
          animation-delay: 1.5s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .slow-spin {
          animation: spin 8s linear infinite;
        }
      `}</style>
    </section>
  );
}