'use client'
import FeatureCardSec from '@/features/classroom/components/manage-class/FeatureCardSec'
import HeroClassSec from '@/features/classroom/components/manage-class/HeroClassSec'
import ResourceSec from '@/features/classroom/components/manage-class/ResourceSec'
import SubHeader from '@/features/classroom/components/manage-class/SubHeader'
import TipSec from '@/features/classroom/components/manage-class/TipSec'

export default function ClassRoomManagement() {
  return (
    <div className='min-h-screen'>
      <SubHeader />
      <HeroClassSec />
      <FeatureCardSec />
      <TipSec />
      <ResourceSec />
      {/* <CTASec /> */}
    </div>
  )
}
