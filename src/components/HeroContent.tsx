import { Check } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'

const SERVICE_OPTIONS = [
  'Image Generator',
  'Video Generator',
  'AI Trip Planner',
  'AI Task Engine',
  'Research AI',
  'AI Object Scanner',
  'Prompt Generator',
]

export function HeroContent() {
  const { displayed, done } = useTypewriter('explore the\nworld of AI!')
  const [services, setServices] = useState<string[]>([])

  const toggleService = (service: string) => {
    setServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service],
    )
  }

  return (
    <main
      id="spade-hero"
      className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1
          className="text-5xl md:text-6xl lg:text-[76px] font-normal tracking-tight text-black leading-[1.08] mb-8 select-none w-full whitespace-pre-wrap"
        >
          {displayed}
          {!done && (
            <span
              className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px] animate-blink"
              aria-hidden
            />
          )}
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <p className="text-lg md:text-xl text-[#5A635A] leading-relaxed font-normal mb-14 max-w-2xl">
          Discover a curated collection of AI interface templates, designed for the next generation
          of digital experiences.
        </p>
      </motion.div>

      <div>
        <h2 className="text-2xl font-medium tracking-tight mb-2 text-black">
          What would you like to explore?
        </h2>
        <p className="opacity-85 text-[#738273] mb-8">Select all that apply</p>

        <div className="flex flex-wrap gap-3">
          {SERVICE_OPTIONS.map((option) => {
            const active = services.includes(option)
            return (
              <motion.button
                key={option}
                type="button"
                onClick={() => toggleService(option)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#1C2E1E] text-white shadow-md shadow-emerald-950/5 transform'
                    : 'bg-white text-[#1C2E1E] border border-[#F1F3F1] hover:bg-[#F1F3F1]/55'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                {option}
                <AnimatePresence>
                  {active && (
                    <motion.span
                      key="check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="inline-flex"
                    >
                      <Check className="w-4 h-4" strokeWidth={2.5} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </div>

        <div className="mt-8 min-h-[4rem]">
          <AnimatePresence mode="wait">
            {services.length === 0 ? (
              <motion.p
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="italic text-xs text-[#738273]"
              >
                Please select a template category above.
              </motion.p>
            ) : (
              <motion.div
                key="banner"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="overflow-hidden"
              >
                <div className="bg-[#FAFBF9] border border-[#F1F3F1] rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <p className="text-sm text-[#1C2E1E]">
                    Ready to explore: {services.join(', ')}
                  </p>
                  <button
                    type="button"
                    className="text-[#4D6D47] uppercase text-xs font-medium tracking-wide hover:opacity-70 transition-opacity inline-flex items-center gap-1"
                  >
                    EXPLORE TEMPLATES <span aria-hidden>→</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}
