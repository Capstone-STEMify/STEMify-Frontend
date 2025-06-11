import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
// import logo from '../../../public/images/logo.png'
import logo from '../../../public/images/logo/logo.png'

export default function StemifyLogo({ className = 'h-full w-auto object-contain' }: { className?: string }) {
  return (
    <Link href={'/'}>
      <Image src={logo} alt={'Stemify Logo'} width={140} height={140} loading={'lazy'} className={className} />
    </Link>
  )
}
