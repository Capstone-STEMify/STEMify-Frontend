import React from 'react'
import { Facebook, Instagram } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="relative min-h-[400px] overflow-hidden bg-sky-400 text-white md:bg-[url('/images/footer.png')] md:bg-cover md:bg-center md:bg-no-repeat">
      <div className='absolute top-4 left-8 z-10 hidden md:block'>
        <Image width={64} height={80} src='/images/balloon.png' alt='Hot Air Balloon' className='object-contain' />
      </div>

      <div className='absolute top-8 right-80 z-10 hidden md:block'>
        <Image width={120} height={120} src='/images/dino.png' alt='Dinosaur' className='h-30 w-30 object-contain' />
      </div>

      <div className='relative z-20 px-4 pt-16 pb-8 sm:px-6 md:pt-36 lg:px-8'>
        <div className='mx-auto max-w-7xl'>
          <div className='mb-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
            <div className='space-y-4'>
              <h3 className='mb-4 text-lg font-semibold'>Information For Parents</h3>
              <p className='text-sm leading-relaxed opacity-90'>
                We provide nurturing environment with developmentally appropriate activities and opportunities
              </p>
            </div>

            <div className='space-y-3'>
              <h3 className='mb-4 text-lg font-semibold'>Info</h3>
              <ul className='space-y-2 text-sm'>
                <li>
                  <Link href='#' className='transition-colors hover:text-blue-100'>
                    Home page
                  </Link>
                </li>
                <li>
                  <Link href='#' className='transition-colors hover:text-blue-100'>
                    About us
                  </Link>
                </li>
                <li>
                  <Link href='#' className='transition-colors hover:text-blue-100'>
                    Our news
                  </Link>
                </li>
              </ul>
            </div>

            <div className='space-y-3'>
              <h3 className='mb-4 text-lg font-semibold'>Education</h3>
              <ul className='space-y-2 text-sm'>
                <li>
                  <Link href='#' className='transition-colors hover:text-blue-100'>
                    Our Programs
                  </Link>
                </li>
                <li>
                  <Link href='#' className='transition-colors hover:text-blue-100'>
                    Our team
                  </Link>
                </li>
                <li>
                  <Link href='#' className='transition-colors hover:text-blue-100'>
                    Full day programs
                  </Link>
                </li>
              </ul>
            </div>

            <div className='space-y-3'>
              <h3 className='mb-4 text-lg font-semibold'>Help</h3>
              <ul className='space-y-2 text-sm'>
                <li>
                  <Link href='#' className='transition-colors hover:text-blue-100'>
                    Knowledge base
                  </Link>
                </li>
                <li>
                  <Link href='#' className='transition-colors hover:text-blue-100'>
                    Video tutorials
                  </Link>
                </li>
                <li>
                  {/* <Link href='#' className='transition-colors hover:text-blue-100'> */}
                  Contact us:{' '}
                  <a
                    href='https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox?compose=new'
                    className='transition-colors hover:text-blue-500 underline'
                  >
                    stemify30062025@gmail.com
                  </a>
                  {/* </Link> */}
                </li>
              </ul>
            </div>
          </div>

          <div className='border-opacity-20 flex flex-col items-center justify-between border-t border-white pt-8 sm:flex-row'>
            <div className='mb-4 text-sm opacity-90 sm:mb-0'>
              <span>© 2025 STEMIFY. </span>
              <Link href='#' className='transition-colors hover:text-blue-500 hover:underline'>
                11 Đ. T12, Long Bình, Thủ Đức, Hồ Chí Minh, Việt Nam
              </Link>
              <span className='mx-2'>-</span>
              <Link href='#' className='text-yellow-300 transition-colors hover:text-yellow-200'>
                Designed
              </Link>
            </div>

            <div className='flex space-x-3'>
              <Link
                href='#'
                className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 transition-all duration-200 hover:bg-blue-700'
                aria-label='Facebook'
              >
                <Facebook size={20} className='text-white' />
              </Link>
              <Link
                href='#'
                className='flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 transition-all duration-200 hover:bg-pink-600'
                aria-label='Instagram'
              >
                <Instagram size={20} className='text-white' />
              </Link>
              <Link
                href='#'
                className='flex h-10 w-10 items-center justify-center rounded-full bg-black transition-all duration-200 hover:bg-gray-800'
                aria-label='X (Twitter)'
              >
                <svg width='16' height='16' viewBox='0 0 24 24' fill='currentColor' className='text-white'>
                  <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
