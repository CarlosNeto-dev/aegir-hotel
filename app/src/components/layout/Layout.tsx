import { Footer } from "./Footer";
import { Header } from "./Header";

import { FirstSection } from "./sections/FirstSection";
import { SecondSection } from "./sections/SecondSection";

export default function Layout() {
  return (
    <>
      <Header />
      <main className="aegir-main">
        <FirstSection />
        <SecondSection />
      </main>
      <Footer />
    </>
  );
}
