'use client'
import React from 'react'
import SubHeader from './manage-class/subHeader-class/SubHeader'
import HeroClassSec from './manage-class/heroSec-class/HeroClassSec'
import CurrentClassSec from './manage-class/currentSec-class/CurrentClassSec'
import FeatureCardSec from './manage-class/featureCard-class/FeatureCardSec'
import ResourceSec from './manage-class/resource-class/ResourceSec'
import CTASec from './manage-class/CTA-class/CTASec'
import TipSec from './manage-class/Tips-class/TipSec'

export default function ClassRoomManagement() {
  return (
    <div className="min-h-screen">
      <SubHeader />
      <HeroClassSec />
      <FeatureCardSec />
      <TipSec/>
      <ResourceSec />
      <CurrentClassSec />
      <CTASec />
    </div>
  )
}
