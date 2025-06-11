import ContentComponents from '@/components/shared/landingPage/Home/ContentComponents'
import FeatureComponents from '@/components/shared/landingPage/Home/FeatureComponents'
import React from 'react'

const Homepage = () => {
  return (
    <div className='min-h-screen h-full'>
      <FeatureComponents />
      <ContentComponents />
    </div>
  )
}

export default Homepage