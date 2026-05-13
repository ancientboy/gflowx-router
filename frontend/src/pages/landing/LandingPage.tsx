import { lazy, Suspense } from 'react'
import { Spin } from 'antd'
import './landing.css'
import { LandingHero } from './LandingHero'

const LandingCompare = lazy(async () => {
  const m = await import('./LandingCompare')
  return { default: m.LandingCompare }
})
const LandingScenes = lazy(async () => {
  const m = await import('./LandingScenes')
  return { default: m.LandingScenes }
})
const LandingSceneMgmt = lazy(async () => {
  const m = await import('./LandingSceneMgmt')
  return { default: m.LandingSceneMgmt }
})
const LandingPricing = lazy(async () => {
  const m = await import('./LandingPricing')
  return { default: m.LandingPricing }
})
const LandingHow = lazy(async () => {
  const m = await import('./LandingHow')
  return { default: m.LandingHow }
})
const LandingFaq = lazy(async () => {
  const m = await import('./LandingFaq')
  return { default: m.LandingFaq }
})
const LandingFooter = lazy(async () => {
  const m = await import('./LandingFooter')
  return { default: m.LandingFooter }
})

function LandingFallback() {
  return (
    <div className="landing-lazy-fallback" role="status" aria-label="加载中">
      <Spin />
    </div>
  )
}

export function LandingPage() {
  return (
    <div className="landing-page" id="landing-main">
      <LandingHero />
      <Suspense fallback={<LandingFallback />}>
        <LandingCompare />
        <LandingScenes />
        <LandingSceneMgmt />
        <LandingPricing />
        <LandingHow />
        <LandingFaq />
        <LandingFooter />
      </Suspense>
    </div>
  )
}
