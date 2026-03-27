import HeroSection from "./components/HeroSection";
import HappeningNow from "./components/HappeningNow";
import CalendarSection from "./components/CalendarSection";
import ContactFooter from "./components/ContactFooter";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <HappeningNow />
      <CalendarSection />
      <ContactFooter />
    </main>
  );
}
