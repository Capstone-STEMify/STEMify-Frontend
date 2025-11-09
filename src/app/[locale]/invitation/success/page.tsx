import { Button } from '@/components/shadcn/button'
import StemifyLogo from '@/components/shared/StemifyLogo'
import { CheckCircle2, ArrowRight, Users, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function InvitationSuccessPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-4'>
      <div className='w-full max-w-2xl'>
        {/* Main Card */}
        <div className='overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl'>
          <div className='px-8 py-4 text-center'>
            <div className='flex justify-center'>
              <div className=''>
                <StemifyLogo className='' />
              </div>
            </div>

            <h1 className='mb-3 text-3xl font-bold text-gray-900'>Chào mừng bạn đến với Stemify! 🎉</h1>

            <p className='mx-auto max-w-md text-lg text-gray-600'>
              Bạn đã chấp nhận lời mời thành công và giờ là thành viên của tổ chức chúng tôi
            </p>
          </div>

          {/* Content */}
          <div className='px-8 pb-10'>
            {/* What's Next Section */}
            <div className='mb-8'>
              <h2 className='mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900'>
                <Users className='h-5 w-5 text-blue-500' />
                Bước tiếp theo
              </h2>

              <div className='space-y-4'>
                <div className='flex gap-4 rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 to-transparent p-4'>
                  <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white'>
                    1
                  </div>
                  <div>
                    <h3 className='mb-1 font-semibold text-gray-900'>Khám phá workspace của bạn</h3>
                    <p className='text-sm text-gray-600'>Làm quen với các lớp học, dự án và tài nguyên có sẵn</p>
                  </div>
                </div>

                <div className='flex gap-4 rounded-lg border border-yellow-100 bg-gradient-to-r from-yellow-50 to-transparent p-4'>
                  <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-yellow-500 text-sm font-semibold text-white'>
                    2
                  </div>
                  <div>
                    <h3 className='mb-1 font-semibold text-gray-900'>Kết nối với đồng đội</h3>
                    <p className='text-sm text-gray-600'>Bắt đầu cộng tác với các thành viên khác trong tổ chức</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className='mb-8 grid grid-cols-3 gap-4 rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50 to-blue-50 p-6'>
              <div className='text-center'>
                <div className='mb-1 text-2xl font-bold text-blue-600'>24/7</div>
                <div className='text-xs text-gray-600'>Hỗ trợ</div>
              </div>
              <div className='border-x border-gray-200 text-center'>
                <div className='mb-1 text-2xl font-bold text-green-600'>100+</div>
                <div className='text-xs text-gray-600'>Thành viên</div>
              </div>
              <div className='text-center'>
                <div className='mb-1 text-2xl font-bold text-yellow-600'>50+</div>
                <div className='text-xs text-gray-600'>Dự án</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className='flex flex-col gap-3 sm:flex-row'>
              <Link href='/dashboard' className='flex-1'>
                <Button className='h-12 w-full bg-gradient-to-r from-sky-400 to-blue-500 text-base font-semibold text-white shadow-lg transition-all'>
                  Bắt đầu ngay
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Button>
              </Link>

              <Link href='/help' className='flex-1'>
                <Button variant='outline' className='h-12 w-full border-2 text-base font-semibold hover:bg-gray-50'>
                  Trung tâm trợ giúp
                </Button>
              </Link>
            </div>

            {/* Footer Note */}
            <p className='mt-8 text-center text-sm text-gray-500'>
              Bạn có thể thay đổi cài đặt tài khoản bất cứ lúc nào trong phần{' '}
              <Link href='/settings' className='font-medium text-blue-600 hover:underline'>
                Cài đặt
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Help Text */}
        <p className='mt-6 text-center text-sm text-gray-500'>
          Cần hỗ trợ?{' '}
          <Link href='/contact' className='font-medium text-blue-600 hover:underline'>
            Liên hệ với chúng tôi
          </Link>
        </p>
      </div>
    </div>
  )
}
