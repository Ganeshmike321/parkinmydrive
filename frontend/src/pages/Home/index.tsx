import React, { memo } from "react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import HomeCarousel from "../../components/HomeCarousel";
import OtherHome from "../../components/OtherHome";
import ParkingPlace from "../../components/ParkingPlace";
import { useDocumentTitle } from "../../utils/useDocumentTitle";

// Constants
const PAGE_TITLE = 'Rent out your driveway to people who want to park for Concerts & Games';
const PARKING_SECTION_TITLE = 'Find a parking place';

// Type definitions
interface HomePageProps {
  showHeader?: boolean;
  customTitle?: string;
}

interface ParkingPlaceProps {
  title: string;
}

const HomePage: React.FC<HomePageProps> = memo(({ 
  showHeader = false, 
  customTitle 
}) => {
  // Set document title
  useDocumentTitle(customTitle || PAGE_TITLE);

  return (
    <>
      {showHeader && <Header />}
      <main role="main" className="home-page">
        <section className="hero-section" aria-label="Homepage carousel">
          <HomeCarousel />
        </section>
        
        <section className="parking-section" aria-label="Parking search">
          <ParkingPlace />
        </section>
        
        <section className="additional-content" aria-label="Additional information">
          <OtherHome />
        </section>
      </main>
      <Footer />
    </>
  );
});

// Set display name for debugging
HomePage.displayName = 'HomePage';

export default HomePage;







// import Header from "../../components/Header";
// import Footer from "../../components/Footer";
// import Slider from "../../components/Slider";
// import HomeCarousel from "../../components/HomeCarousel";
// import OtherHome from "../../components/OtherHome";

// import ParkingPlace from "../../components/ParkingPlace";
// import { useDocumentTitle } from "../../utils/useDocumentTitle";

// function HomePage() {
//     useDocumentTitle('Rent out your driveway to people who want to park for Concerts & Games');
//   return (
//     <>
//       {/* <Header /> */}
//       <HomeCarousel />
//       {/* <Search title={"Find a parking place"} /> */}
//       <ParkingPlace title="Find a parking place" />
//       <OtherHome />
//       <Footer />
//     </>
//   );
// }

// export default HomePage;
