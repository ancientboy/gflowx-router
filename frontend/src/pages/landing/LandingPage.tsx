import './landing.css'
import { LandingCompare } from './LandingCompare'
import { LandingFaq } from './LandingFaq'
import { LandingFooter } from './LandingFooter'
import { LandingHero } from './LandingHero'
import { LandingHow } from './LandingHow'
import { LandingScenes } from './LandingScenes'

export function LandingPage() {
  return (
    <div className="landing-page">
      <LandingHero />
      <LandingCompare />
      <LandingScenes />
      <LandingHow />
      <LandingFaq />
      <LandingFooter />
    </div>
  )
}
