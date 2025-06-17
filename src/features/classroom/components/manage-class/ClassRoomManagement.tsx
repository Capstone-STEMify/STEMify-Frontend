'use client'
import React from 'react'
import SubHeader from './subHeader-class/SubHeader'
import HeroClassSec from './heroSec-class/HeroClassSec'
import CurrentClassSec from './currentSec-class/CurrentClassSec'
import FeatureCardSec from './featureCard-class/FeatureCardSec'
import ResourceSec from './resource-class/ResourceSec'
import CTASec from './CTA-class/CTASec'
import TipSec from './Tips-class/TipSec'

export default function ClassRoomManagement() {
  return (
    <div className="min-h-screen">
      <SubHeader />
      <HeroClassSec />
      <FeatureCardSec />
      <TipSec/>
      <ResourceSec />
      {/* <CTASec /> */}
    </div>
  )
}
