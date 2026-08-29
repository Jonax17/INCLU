import Navbar from './Navbar.jsx';
import Hero from './Hero.jsx';
import Features from './Features.jsx';
import Steps from './Steps.jsx';
import Accessibility from './Accessibility.jsx';
import CTA from './CTA.jsx';
import Footer from './Footer.jsx';

export default function Landing({ onLaunchApp }) {
  return (
    <>
      <Navbar onLaunchApp={onLaunchApp} />
      <Hero onLaunchApp={onLaunchApp} />
      <Features />
      <Steps />
      <Accessibility />
      <CTA onLaunchApp={onLaunchApp} />
      <Footer />
    </>
  );
}
