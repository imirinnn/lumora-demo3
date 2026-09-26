import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import RootLayout from './layouts/RootLayout';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Services from './pages/Services';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// The admin area is code-split so none of it ships to public visitors.
const AdminApp = lazy(() => import('./pages/admin/AdminApp'));

// Runs while the curtain covers the screen; hash targets are handled by PageTransition once the new page mounts.
function scrollAfterNavigation() {
  window.scrollTo(0, 0);
}

function PublicSite() {
  const location = useLocation();

  return (
    <RootLayout>
      {/* mode="wait": the old page finishes its exit (curtain closes) before the new one mounts */}
      <AnimatePresence mode="wait" onExitComplete={scrollAfterNavigation}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/start-a-project" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </RootLayout>
  );
}

export default function App() {
  const { pathname } = useLocation();

  return (
    // reducedMotion="user": Framer Motion automatically drops transform/layout
    // animations for visitors who ask their OS for reduced motion.
    <MotionConfig reducedMotion="user">
      {pathname.startsWith('/admin') ? (
        <Suspense fallback={<div className="grid min-h-screen place-items-center bg-bone text-stone">Loading…</div>}>
          <AdminApp />
        </Suspense>
      ) : (
        <PublicSite />
      )}
    </MotionConfig>
  );
}
