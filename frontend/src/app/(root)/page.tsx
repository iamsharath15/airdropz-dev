import ContentComponents from '@/components/shared/landingPage/Home/ContentComponents'
import FeatureComponents from '@/components/shared/landingPage/Home/FeatureComponents'
import React from 'react'
import MembershipBenefits from './MembershipBenefits'
import Testimonials from './Testimonials'

const Homepage = () => {
  return (
    <div className='min-h-screen h-full'>
      <MembershipBenefits />
            <Testimonials />

      <FeatureComponents />
      <ContentComponents />
    </div>
  )
}

export default Homepage