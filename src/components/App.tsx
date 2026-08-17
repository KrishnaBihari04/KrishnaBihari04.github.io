import React, { useState, useEffect } from 'react';
import Hero from './portfolio/Hero';
import About from './portfolio/About';
import Projects from './portfolio/Projects';
import Contact from './portfolio/Contact';
import Skills from './portfolio/Skills';
import FadeTransition from './FadeTransition';
import Footer from './Footer';

type Section = 'hero' | 'about' | 'projects' | 'skills' | 'contact';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('hero');

  // Functie om sectie te zetten op basis van hash
  const setSectionFromHash = () => {
    const hash = window.location.hash.slice(1).toLowerCase() as Section;
    if (['hero', 'about', 'projects', 'skills', 'contact'].includes(hash)) {
      setActiveSection(hash);
    } else {
      setActiveSection('hero');
    }
  };

  // Luister naar hashchange (back/forward knoppen)
  useEffect(() => {
    setSectionFromHash();
    window.addEventListener('hashchange', setSectionFromHash);
    return () => window.removeEventListener('hashchange', setSectionFromHash);
  }, []);

  // Luister naar custom navigate events (vanuit navbar)
  useEffect(() => {
    const handleNavigate = (e: CustomEvent) => {
      const section = e.detail.section as Section;
      if (['hero', 'about', 'projects', 'skills', 'contact'].includes(section)) {
        setActiveSection(section);
        // Update URL hash zonder hashchange te triggeren
        history.pushState(null, '', `#${section}`);
      }
    };
    window.addEventListener('navigate', handleNavigate as EventListener);
    return () => window.removeEventListener('navigate', handleNavigate as EventListener);
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'hero': return <Hero />;
      case 'about': return <About />;
      case 'projects': return <Projects />;
      case 'skills': return <Skills />;
      case 'contact': return <Contact />;
      default: return <Hero />;
    }
  };

  return (
    <main className="fixed inset-0 z-10 overflow-hidden">
      <div className="relative w-full h-full overflow-y-auto scrollable-section">
        <FadeTransition keyValue={activeSection}>
          {renderSection()}
        </FadeTransition>
        <Footer />
      </div>
    </main>
  );
};

export default App;