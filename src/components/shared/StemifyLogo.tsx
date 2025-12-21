import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
// import logo from '../../../public/images/logo.png'
import logo from '../../../public/images/logo/logo.png'

type StemifyLogoProps = {
  className?: string
  href?: string
}

export default function StemifyLogo({ className = 'h-full w-auto object-contain', href = '/' }: StemifyLogoProps) {
  return (
    <Link href={href}>
      <Image src={logo} alt={'Stemify Logo'} width={140} height={140} loading={'lazy'} className={className} />
    </Link>
  )
}
