import { BackgroundVideo } from './components/BackgroundVideo'
import { HeroContent } from './components/HeroContent'
import { Navbar } from './components/Navbar'

function App() {
  return (
    <div className="relative bg-white text-neutral-900 font-sans selection:bg-[#EAECE9] selection:text-[#1C2E1E] antialiased overflow-x-hidden flex flex-col lg:block lg:min-h-screen">
      <Navbar />
      <BackgroundVideo />
      <div className="relative z-10 flex flex-col order-first lg:order-none w-full bg-white lg:bg-transparent pb-8 lg:pb-0 lg:min-h-screen">
        <HeroContent />
      </div>
    </div>
  )
}

export default App
