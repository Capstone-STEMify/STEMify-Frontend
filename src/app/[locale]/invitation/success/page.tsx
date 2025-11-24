import { Button } from '@/components/shadcn/button'
import StemifyLogo from '@/components/shared/StemifyLogo'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function InvitationSuccessPage() {
  return (
    <div className='bg-light flex min-h-screen items-center justify-center p-4'>
      <div className='w-full max-w-3xl'>
        {/* Top notification badge */}
        <div className='mb-3 flex justify-center'>
          <div className='inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700'>
            <span className='h-2 w-2 rounded-full bg-blue-500'></span>
            Bạn đã chấp nhận lời mời thành công
            <Sparkles className='h-4 w-4' />
          </div>
        </div>

        {/* Logo */}
        <div className='mb-3 flex justify-center'>
          <StemifyLogo className='' />
        </div>

        {/* Main heading */}
        <div className='mb-8 space-y-4 text-center'>
          <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>Chào mừng đến với Stemify</h1>
          <p className='mx-auto max-w-2xl text-lg text-gray-600'>
            Một nền tảng học tập STEM hiện đại giúp bạn khám phá, học hỏi và phát triển. Bắt đầu ngay hôm nay và tận
            hưởng trải nghiệm tuyệt vời.
          </p>
        </div>

        {/* CTA buttons */}
        <div className='mb-8 flex justify-center gap-4'>
          <Link href='/'>
            <Button size='lg' className='h-11 rounded-full bg-gradient-to-r from-sky-400 via-sky-500 to-blue-500 px-6'>
              Bắt đầu ngay
            </Button>
          </Link>
        </div>

        {/* Features grid */}
        <div className='mx-auto max-w-4xl'>
          <div className='grid gap-8 sm:grid-cols-3'>
            <div className='text-center'>
              <div className='mb-3 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100'>
                  <svg className='h-6 w-6 text-blue-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                    />
                  </svg>
                </div>
              </div>
              <h3 className='mb-2 font-semibold text-gray-900'>Học liệu phong phú</h3>
              <p className='text-sm text-gray-600'>Hàng trăm bài học và dự án thực hành chất lượng cao</p>
            </div>

            <div className='text-center'>
              <div className='mb-3 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100'>
                  <svg className='h-6 w-6 text-yellow-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                    />
                  </svg>
                </div>
              </div>
              <h3 className='mb-2 font-semibold text-gray-900'>Cộng đồng sôi động</h3>
              <p className='text-sm text-gray-600'>Kết nối với hàng trăm học viên và giáo viên nhiệt huyết</p>
            </div>

            <div className='text-center'>
              <div className='mb-3 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-green-100'>
                  <svg className='h-6 w-6 text-green-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
              </div>
              <h3 className='mb-2 font-semibold text-gray-900'>Hỗ trợ 24/7</h3>
              <p className='text-sm text-gray-600'>Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn mọi lúc</p>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <div className='mt-8 text-center text-sm text-gray-500'>
          Cần trợ giúp?{' '}
          <Link href='/contact' className='font-medium text-gray-900 underline underline-offset-4 hover:text-gray-700'>
            Liên hệ với chúng tôi
          </Link>
        </div>
      </div>
    </div>
  )
}
