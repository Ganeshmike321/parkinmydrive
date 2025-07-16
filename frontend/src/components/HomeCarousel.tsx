import { NavLink } from "react-router-dom";
import Carousel from 'react-bootstrap/Carousel';
import React from "react";

import Banner from "../assets/images/banner.jpg";
import Banner2 from "../assets/images/banner2.jpg";
import Banner3 from "../assets/images/banner3.jpg";

import BannerIconOne from "../assets/images/banner-icon.png";
import BannerIconTwo from "../assets/images/banner-icon1.png";
import BannerIconThree from "../assets/images/banner-icon2.png";

type BannerItem = {
  src: string;
  alt: string;
};

type IconItem = {
  icon: string;
  text: string;
  alt: string;
};

const banners: BannerItem[] = [
  { src: Banner, alt: "Economy parking lot banner 1" },
  { src: Banner2, alt: "Economy parking lot banner 2" },
  { src: Banner3, alt: "Economy parking lot banner 3" }
];

const icons: IconItem[] = [
  { icon: BannerIconOne, text: "Smart, Secure Parking", alt: "Smart, Secure Parking icon" },
  { icon: BannerIconTwo, text: "Innovative Tech Solutions", alt: "Innovative Tech Solutions icon" },
  { icon: BannerIconThree, text: "List Your Driveway Easily", alt: "List Your Driveway Easily icon" }
];

const HomeCarousel: React.FC = () => {
  return (
    <Carousel fade interval={100}>
      {banners.map((banner, index) => (
        <Carousel.Item key={index}>
          <img
            className="d-block w-100 caros-res"
            src={banner.src}
            alt={banner.alt}
            loading="lazy"
          />
          <Carousel.Caption className="text-start">
            <CaptionSection />
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

const CaptionSection: React.FC = React.memo(() => (
  <>
    <h1 className="animate__animated animate__zoomInRight">
      Park In My Driveway
    </h1>
    <ul className="carousel-features">
      <li>
        Live near events, stadiums, or high-traffic areas? Put your driveway to work!
      </li>
      <li>
        Earn up to <strong>$20/day</strong> by renting out your unused parking space.
      </li>
      <li>
        We’re building the <strong>Airbnb of Parking</strong> — join the movement today.
      </li>
    </ul>

    <div className="bannerListBtm">
      <ul className="list-unstyled ps-0">
        {icons.map(({ icon, text, alt }, idx) => (
          <li key={idx}>
            <img src={icon} className="img-fluid" alt={alt} loading="lazy" /> <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>

    <div className="carousel-actions">
      <NavLink
        to="/rent-out-your-driveway"
        className="btn btn-primary animate__animated animate__fadeInLeft w-2"
      >
        Become a Host
      </NavLink>
      <NavLink
        to="/find-economy-parking"
        className="btn btn-primary animate__animated animate__fadeInLeft w-4"
      >
        Find Parking
      </NavLink>
    </div>
  </>
));

export default HomeCarousel;



// import { NavLink } from "react-router-dom";
// import Carousel from 'react-bootstrap/Carousel';
// import React from "react";

// import Banner from "../assets/images/banner.jpg";
// import Banner2 from "../assets/images/banner2.jpg";
// import Banner3 from "../assets/images/banner3.jpg";

// import BannerIconOne from "../assets/images/banner-icon.png";
// import BannerIconTwo from "../assets/images/banner-icon1.png";
// import BannerIconThree from "../assets/images/banner-icon2.png";

// const banners = [
//   { src: Banner, alt: "Economy parking lot banner 1" },
//   { src: Banner2, alt: "Economy parking lot banner 2" },
//   { src: Banner3, alt: "Economy parking lot banner 3" }
// ];

// const icons = [
//   { icon: BannerIconOne, text: "Smart, Secure Parking", alt: "Smart, Secure Parking icon" },
//   { icon: BannerIconTwo, text: "Innovative Tech Solutions", alt: "Innovative Tech Solutions icon" },
//   { icon: BannerIconThree, text: "List Your Driveway Easily", alt: "List Your Driveway Easily icon" }
// ];

// function HomeCarousel() {
//   return (
//     <Carousel fade interval={100}>
//       {banners.map((banner, index) => (
//         <Carousel.Item key={index}>
//           <img
//             className="d-block w-100 caros-res"
//             src={banner.src}
//             alt={banner.alt}
//             loading="lazy"
//           />
//           <Carousel.Caption className="text-start">
//             <CaptionSection />
//           </Carousel.Caption>
//         </Carousel.Item>
//       ))}
//     </Carousel>
//   );
// }

// const CaptionSection = React.memo(() => (
//   <>
//     <h1 className="animate__animated animate__zoomInRight">
//       Park In My Driveway
//     </h1>
//     <ul className="carousel-features">
//       <li>
//         Live near events, stadiums, or high-traffic areas? Put your driveway to work!
//       </li>
//       <li>
//         Earn up to <strong>$20/day</strong> by renting out your unused parking space.
//       </li>
//       <li>
//         We’re building the <strong>Airbnb of Parking</strong> — join the movement today.
//       </li>
//     </ul>

//     <div className="bannerListBtm">
//       <ul className="list-unstyled ps-0">
//         {icons.map(({ icon, text, alt }, idx) => (
//           <li key={idx}>
//             <img src={icon} className="img-fluid" alt={alt} loading="lazy" /> <span>{text}</span>
//           </li>
//         ))}
//       </ul>
//     </div>

//     <div className="carousel-actions">
//       <NavLink
//         to="/rent-out-your-driveway"
//         className="btn btn-primary animate__animated animate__fadeInLeft"
//       >
//         Become a Host
//       </NavLink>
//       <NavLink
//         to="/find-economy-parking"
//         className="btn btn-primary animate__animated animate__fadeInLeft"
//       >
//         Find Parking
//       </NavLink>
//     </div>
//   </>
// ));

// export default HomeCarousel;
