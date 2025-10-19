'use client'
import { CheckCircle, Download, Share2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from '@/components/shadcn/dialog'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { useState } from 'react'
import { CourseEnrollment } from '@/features/enrollment/types/enrollment.type'
import { usePathname } from 'next/navigation'

interface CertificateHeaderProps {
  certificateUrl: string
  userName: string
  issuedDate: string
  title: string
  userImageUrl?: string
  courseEnrollments: CourseEnrollment[]
}

const LinkedInIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='48'
    height='48'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='h-12 w-12 rounded-full bg-[#0077B5] p-2 text-white'
  >
    <path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z'></path>
    <rect width='4' height='12' x='2' y='9'></rect>
    <circle cx='4' cy='4' r='2'></circle>
  </svg>
)
const EmailIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='48'
    height='48'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='h-12 w-12 rounded-full bg-gray-500 p-2 text-white'
  >
    <rect width='20' height='16' x='2' y='4' rx='2'></rect>
    <path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'></path>
  </svg>
)
const WhatsAppIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='48'
    height='48'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='h-12 w-12 rounded-full bg-[#25D366] p-2 text-white'
  >
    <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'></path>
  </svg>
)
const FacebookIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='48'
    height='48'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='h-12 w-12 rounded-full bg-[#1877F2] p-2 text-white'
  >
    <path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'></path>
  </svg>
)
const XIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='48'
    height='48'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='h-12 w-12 rounded-full bg-black p-2 text-white'
  >
    <path d='M18 4H6l-4 8 4 8h12l4-8z'></path>
    <path d='m9.09 9 5.82 6M14.91 9l-5.82 6'></path>
  </svg>
)

const CertificateHeader = ({
  certificateUrl,
  userName,
  issuedDate,
  title,
  userImageUrl,
  courseEnrollments
}: CertificateHeaderProps) => {
  const [copyButtonText, setCopyButtonText] = useState('COPY')

  const shareText = `I just completed the ${title} specialization on Stemify!`
  const fullUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopyButtonText('COPIED!')
      setTimeout(() => {
        setCopyButtonText('COPY')
      }, 2000)
    })
  }

  const socialPlatforms = [
    {
      name: 'LinkedIn',
      icon: <LinkedInIcon />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`
    },
    {
      name: 'Email',
      icon: <EmailIcon />,
      url: `mailto:?subject=Check out my Stemify Certificate&body=${encodeURIComponent(shareText + ' ' + fullUrl)}`
    },
    {
      name: 'WhatsApp',
      icon: <WhatsAppIcon />,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + fullUrl)}`
    },
    {
      name: 'Facebook',
      icon: <FacebookIcon />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`
    },
    {
      name: 'X',
      icon: <XIcon />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(shareText)}`
    }
  ]

  return (
    <Dialog>
      <section className='rounded-lg bg-white p-6 shadow-md md:p-8'>
        <div className='flex flex-col gap-8 lg:flex-row lg:gap-12'>
          <div className='flex-1'>
            <div className='flex items-start gap-4'>
              <div className='relative'>
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-gray-200'>
                  <Image
                    src={userImageUrl ?? ''}
                    width={64}
                    height={64}
                    alt='User Image'
                    className='rounded-full'
                  ></Image>
                </div>
                <CheckCircle className='absolute -right-1 -bottom-1 h-7 w-7 rounded-full border-2 border-white bg-blue-600 text-white' />
              </div>
              <div className='pt-1'>
                <p className='text-lg text-gray-700'>
                  Completed by <span className='font-bold text-gray-900'>{userName}</span>
                </p>
                <h1 className='mt-1 text-3xl font-bold text-gray-900'>{issuedDate}</h1>
              </div>
            </div>
            <p className='mt-6 text-base text-gray-700'>
              {userName}'s account is verified. Stemify certifies their successful completion of {title}{' '}
              <Link href={'#'} className='font-semibold text-blue-600 hover:underline'>
                {title}
              </Link>{' '}
              Specialization.
            </p>
            <div className='mt-6'>
              <h3 className='font-bold text-gray-800'>Course Certificates Completed</h3>
              <div className='mt-2 space-y-1 text-gray-700'>
                {courseEnrollments?.map((courseEnrollment) => (
                  <p key={courseEnrollment.id}>{courseEnrollment.courseTitle}</p>
                ))}
              </div>
            </div>
          </div>

          <div className='flex w-full flex-col items-center lg:w-auto lg:max-w-md lg:items-end'>
            <div className='w-full rounded-md border bg-gray-50 p-2 shadow-sm'>
              <Image
                src={certificateUrl ?? ''}
                alt='Certificate Thumbnail'
                width={500}
                height={350}
                className='rounded'
              />
            </div>
            <div className='mt-4 flex w-full gap-4'>
              <DialogTrigger asChild>
                <Button className='flex flex-1 items-center justify-center gap-2 bg-blue-500' size='lg'>
                  <Share2 size={18} />
                  Share Certificate
                </Button>
              </DialogTrigger>
              <Button
                variant='outline'
                className='flex flex-1 items-center justify-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-600'
                size='lg'
              >
                <Download size={18} />
                Download
              </Button>
            </div>
          </div>
        </div>
      </section>

      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>Share this page</DialogTitle>
          <DialogDescription>Show your friends what they can learn on Stemify</DialogDescription>
        </DialogHeader>
        <div className='flex items-center justify-around py-4'>
          {socialPlatforms.map((platform) => (
            <a
              href={platform.url}
              key={platform.name}
              target='_blank'
              rel='noopener noreferrer'
              className='flex flex-col items-center gap-2 text-xs text-gray-600 hover:text-blue-600'
            >
              {platform.icon}
              <span>{platform.name}</span>
            </a>
          ))}
        </div>
        <div className='flex items-center space-x-2'>
          <Input id='link' defaultValue={fullUrl} readOnly />
          <Button type='submit' size='sm' className='bg-blue-500 px-3' onClick={handleCopy}>
            <span className='sr-only'>Copy</span>
            {copyButtonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CertificateHeader
