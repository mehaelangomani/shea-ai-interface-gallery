import { useState } from 'react'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)

  const openContact = () => {
    setIsMobileMenuOpen(false)
    setIsContactOpen(true)
  }

  const closeContact = () => setIsContactOpen(false)

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-10 px-5 sm:px-8 py-4 sm:py-5 flex flex-row justify-between items-center bg-transparent">
        <div className="flex flex-row items-center gap-3">
          <span className="text-[21px] sm:text-[26px] tracking-tight text-black font-medium select-none">
            SHEA
          </span>
          <span className="text-[25px] sm:text-[30px] text-black select-none tracking-[-0.02em] font-medium leading-none mb-1">
            {'\u2731'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => (isContactOpen ? closeContact() : openContact())}
          className="hidden md:inline text-[23px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          Get in touch
        </button>

        <button
          type="button"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
        >
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              isMobileMenuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
            }`}
          />
        </button>
      </header>

      <div
        className={`fixed inset-0 z-[9] md:hidden bg-white/95 backdrop-blur-sm transition-opacity duration-300 ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-8 text-3xl text-black pt-20">
          <button
            type="button"
            className="text-xl underline underline-offset-2 hover:opacity-60 transition-opacity"
            onClick={openContact}
          >
            Get in touch
          </button>
        </nav>
      </div>

      <div
        className={`fixed inset-0 z-[9] bg-white/95 backdrop-blur-sm transition-opacity duration-300 ${
          isContactOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeContact}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isContactOpen}
        aria-label="Get in touch"
      >
        <div
          className="flex flex-col items-center justify-center h-full gap-8 text-black px-6 pt-20 max-w-lg mx-auto text-left w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-3xl md:text-4xl font-medium tracking-tight w-full text-center">
            Let&apos;s connect!
          </p>

          <div className="w-full space-y-6 text-lg text-[#5A635A] leading-relaxed">
            <div>
              <p className="text-black font-medium mb-2">Meha</p>
              <p>
                GitHub:{' '}
                <a
                  href="https://github.com/mehaelangomani"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
                >
                  mehaelangomani
                </a>
              </p>
              <p>
                Email:{' '}
                <a
                  href="mailto:mehaelangomani22@gmail.com"
                  className="text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
                >
                  mehaelangomani22@gmail.com
                </a>
              </p>
            </div>

            <div>
              <p className="text-black font-medium mb-2">Sweenija</p>
              <p>
                GitHub:{' '}
                <a
                  href="https://github.com/sweenijareddy14-glitch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
                >
                  sweenijareddy14-glitch
                </a>
              </p>
              <p>
                Email:{' '}
                <a
                  href="mailto:sweenijareddy123@gmail.com"
                  className="text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
                >
                  sweenijareddy123@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
