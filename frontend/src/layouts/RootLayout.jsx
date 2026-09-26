import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, useReducedMotion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';
import ScrollProgress from '../components/ScrollProgress';
import Preloader from '../components/Preloader';
import { IntroContext } from './IntroContext';

const INTRO_KEY = 'lumora:intro-seen';

function introAlreadySeen() {
  try {
    return sessionStorage.getItem(INTRO_KEY) === '1';
  } catch {
    return true; // storage blocked → don't risk showing the loader every time
  }
}

/** Shell shared by every public page: preloader, nav, cursor, progress bar, footer. */
export default function RootLayout({ children }) {
  const reduce = useReducedMotion();
  const [showIntro, setShowIntro] = useState(() => !reduce && !introAlreadySeen());
  const { pathname } = useLocation();
  const mainRef = useRef(null);
  const firstPath = useRef(pathname);

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      /* ignore */
    }
    setShowIntro(false);
  }, []);

  // Lock scroll while the preloader is up
  useEffect(() => {
    if (!showIntro) return undefined;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [showIntro]);

  // After client-side navigation, move keyboard / screen-reader focus to the new page's content
  useEffect(() => {
    if (pathname === firstPath.current) return;
    firstPath.current = null;
    const t = setTimeout(() => mainRef.current?.focus({ preventScroll: true }), 700);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <IntroContext.Provider value={!showIntro}>
      <div className="grain">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-charcoal focus:px-5 focus:py-3 focus:text-sm focus:text-bone"
        >
          Skip to content
        </a>

        <AnimatePresence>{showIntro && <Preloader key="preloader" onDone={finishIntro} />}</AnimatePresence>

        <ScrollProgress />
        <Navbar />
        <main id="main" ref={mainRef} tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <CustomCursor />
      </div>
    </IntroContext.Provider>
  );
}
