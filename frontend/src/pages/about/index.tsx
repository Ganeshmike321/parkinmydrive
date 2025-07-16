import React from 'react';
import Footer from "../../components/Footer";
import AboutPic from "../../assets/images/about.jpg";
import Icon5 from "../../assets/images/icon5.png";
import Icon6 from "../../assets/images/icon6.png";
import Icon7 from "../../assets/images/icon7.png";
import { useDocumentTitle } from "../../utils/useDocumentTitle.tsx";

interface FeatureProps {
  icon: string;
  title: string;
  alt: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, alt }) => (
  <div className="col-md-4">
    <div className="d-flex mb-4 mb-lg-0 align-items-center">
      <div 
        className="d-flex flex-shrink-0 align-items-center justify-content-center mr-3" 
        style={{ height: "70px", width: "100px" }}
      >
        <img src={icon} alt={alt} />
      </div>
      <div className="d-flex flex-column">
        <h5>{title}</h5>
      </div>
    </div>
  </div>
);

const About: React.FC = () => {
  useDocumentTitle('About - Rent out your driveway to people who want to park for Concerts & Games');

  const features: FeatureProps[] = [
    { icon: Icon5, title: "Safe & Secure", alt: "Safe and secure parking" },
    { icon: Icon6, title: "Community First", alt: "Community focused service" },
    { icon: Icon7, title: "Live Customer Support", alt: "24/7 customer support" }
  ];

  const storyParagraphs = [
    "The idea for Park In My Driveway came to us when we went to Austin City Limits.",
    "We had a friend who lived about 10 mins walk from Zilker park and we decided to park there.",
    "We parked at her house and started walking to Zilker. We noticed that there were kids who had golf carts and they were giving people rides to Zilker. We all piled in and it was awesome. On the way back, we noticed the long line of people all piling in to overcrowded buses trying to get to downtown to pick up their vehicles and drive home. We on the other hand walked over to our friends house picked up our car and headed out, totally skipping all the crowds on the way back. We heard from people that it took them almost 90 mins to 2 hours to get back home while we were back home in 30 mins. We did this all 3 days of ACL and it completely changed how we enjoyed the music, we did not have to worry about getting back home and we could just relax and get carried away.",
    "We thought it was a no brainer to make this available to all our friends, but the challenge was getting driveways, so we talked to a few people who lived next to Zilker Park and saw if we could rent their driveways. Of course we could, people thought it was a great idea and did not mind us parking their cars in their driveway for a few hours.",
    "So we decided to do this a bit more formally, so we built this website and now are trying to expand our reach to folks that we don't know and see what they think."
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="graybg">
        <div className="container">
          <div className="row">
            <div className="col">
              <h2>About Us</h2>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="container-fluid py-5">
        <div className="container pt-5">
          <div className="row">
            <div className="col-lg-6" style={{ minHeight: "500px" }}>
              <div className="position-relative h-100">
                <img 
                  className="position-absolute w-100 h-100" 
                  src={AboutPic} 
                  alt="About Park In My Driveway"
                  style={{ objectFit: 'cover' }} 
                />
              </div>
            </div>
            <div className="col-lg-6 pt-5 pb-lg-5">
              <div className="about-text bg-white p-4 p-lg-5 my-lg-5">
                <p>
                  <strong>{storyParagraphs[0]}</strong>
                </p>
                {storyParagraphs.slice(1).map((paragraph, index) => (
                  <p key={index + 1}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container-fluid aboutLabel pb-5 mb-3">
        <div className="container">
          <div className="row">
            {features.map((feature, index) => (
              <Feature 
                key={index}
                icon={feature.icon}
                title={feature.title}
                alt={feature.alt}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="rentOuter">
        <h3>Rent Out Your Driveways &amp; Parking Space</h3>
        <div className="get-started">
          <a href="/find-economy-parking" className="btn btn-primary">
            Get Started
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default About;








// import Footer from "../../components/Footer";
// import AboutPic from "../../assets/images/about.jpg";
// import Icon5 from "../../assets/images/icon5.png";
// import Icon6 from "../../assets/images/icon6.png";
// import Icon7 from "../../assets/images/icon7.png";
// import { useDocumentTitle } from "../../utils/useDocumentTitle";

// const About = () => {
//   useDocumentTitle('About - Rent out your driveway to people who want to park for Concerts & Games');

//   const aboutParagraphs = [
//     "<strong> The idea for Park In My Driveway came to us when we went to Austin City Limits.</strong>",
//     "We had a friend who lived about 10 mins walk from Zilker park and we decided to park there.",
//     "We parked at her house and started walking to Zilker. We noticed that there were kids who had golf carts and they were giving people rides to Zilker. We all piled in and it was awesome. On the way back, we noticed the long line of people all piling in to overcrowded buses trying to get to downtown to pick up their vehicles and drive home. We on the other hand walked over to our friends house picked up our car and headed out, totally skipping all the crowds on the way back. We heard from people that it took them almost 90 mins to 2 hours to get back home while we were back home in 30 mins. We did this all 3 days of ACL and it completely changed how we enjoyed the music, we did not have to worry about getting back home and we could just relax and get carried away.",
//     "We thought it was a no brainer to make this available to all our friends, but the challenge was getting driveways, so we talked to a few people who lived next to Zilker Park and saw if we could rent their driveways. Of course we could, people thought it was a great idea and did not mind us parking their cars in their driveway for a few hours.",
//     "So we decided to do this a bit more formally, so we built this website and now are trying to expand our reach to folks that we don't know and see what they think."
//   ];

//   const features = [
//     { icon: Icon5, title: "Safe & Secure" },
//     { icon: Icon6, title: "Community First" },
//     { icon: Icon7, title: "Live Customer Support" }
//   ];

//   return (
//     <>
//       <div className="graybg">
//         <div className="container">
//           <div className="row">
//             <div className="col">
//               <h2>About Us</h2>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container-fluid py-5">
//         <div className="container pt-5">
//           <div className="row">
//             <div className="col-lg-6" style={{ minHeight: "500px" }}>
//               <div className="position-relative h-100">
//                 <img className="position-absolute w-100 h-100" src={AboutPic} alt="About" style={{ objectFit: 'cover' }} />
//               </div>
//             </div>
//             <div className="col-lg-6 pt-5 pb-lg-5">
//               <div className="about-text bg-white p-4 p-lg-5 my-lg-5">
//                 {aboutParagraphs.map((para, idx) => (
//                   <p key={idx} dangerouslySetInnerHTML={{ __html: para }} />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container-fluid aboutLabel pb-5 mb-3">
//         <div className="container">
//           <div className="row">
//             {features.map((item, idx) => (
//               <div className="col-md-4" key={idx}>
//                 <div className="d-flex mb-4 mb-lg-0 align-items-center">
//                   <div
//                     className="d-flex flex-shrink-0 align-items-center justify-content-center mr-3"
//                     style={{ height: "70px", width: "100px" }}
//                   >
//                     <img src={item.icon} alt={`icon-${idx}`} />
//                   </div>
//                   <div className="d-flex flex-column">
//                     <h5 className="">{item.title}</h5>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="rentOuter">
//         <h3>Rent Out Your Driveways &amp; Parking Space</h3>
//         <div className="get-started">
//           <a href="/find-economy-parking" className="btn btn-primary">Get Started</a>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default About;
