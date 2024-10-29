import DemoPreview from '@/components/DemoPreview';
import Features from '@/components/Features';
import Hero from '@/components/Hero';

export default function Home() {
  return (
    <div className="bg-zinc-900">
      <Hero />
      <Features />
      <DemoPreview />
    </div>
  )
}