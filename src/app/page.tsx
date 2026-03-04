import Hero from '@/components/Hero/Hero'
import Problem from '@/components/Problem/Problem'
import ValueStack from '@/components/ValueStack/ValueStack'
import SocialProof from '@/components/SocialProof/SocialProof'
import Transformation from '@/components/Transformation/Transformation'
import SecondaryCta from '@/components/SecondaryCta/SecondaryCta'
import Footer from '@/components/Footer/Footer'

export default function Home() {
  return (
    <main>
      <Hero />
      <Problem />
      <ValueStack />
      <SocialProof />
      <Transformation />
      <SecondaryCta />
      <Footer />
    </main>
  )
}
