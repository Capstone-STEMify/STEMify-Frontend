import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import logo from '../../../public/images/logo.png' //  logo

export default function StemifyLogo() {
  return (
    <Link href={'/'}>
      <Image src={logo} alt={'Stemify Logo'} width={200} height={200} loading={'lazy'} />
    </Link>
  )
}
