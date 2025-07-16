import React from "react";
import Icon1 from "../assets/images/icon1.png";
import Icon2 from "../assets/images/icon2.png";
import Icon3 from "../assets/images/icon3.png";
import Icon4 from "../assets/images/icon4.png";
import Icon5 from "../assets/images/icon5.png";
import Icon6 from "../assets/images/icon6.png";
import Icon7 from "../assets/images/icon7.png";
import HomeLast1 from "../assets/images/home-last1.png";
import HomeLast2 from "../assets/images/home-last2.png";
import HomeLast3 from "../assets/images/home-last3.png";
import PopularParking from "./PopularParking";

const OtherHome: React.FC = () => {
  return (
    <>
      <div className="parkmydriveBenefits">
        <div className="parkmydriveBenefitsLeft">
          <div className="parkmydriveBenefitsInner">
            <div className="row">
              <div className="col-lg-9 offset-lg-2">
                <h2>How it works</h2>
                <p>
                  Our platform allows you to easily rent out your driveway to
                  people who want to park their vehicles for the concert or
                  sports event
                </p>

                <div className="row parkmydriveBenefitsList">
                  <div className="col-lg-6 col-md-6">
                    <img src={Icon1} alt="List your driveway" />
                    <h3>List your driveway</h3>
                    <p>
                      Sign up, list your driveway, and tell us a little bit
                      about when we can park there.
                    </p>
                  </div>

                  <div className="col-lg-6 col-md-6">
                    <img src={Icon3} alt="Bookings made easy" />
                    <h3>Bookings made easy</h3>
                    <p>
                      Visitors can browse listings, select the perfect spot, and
                      book in advance. No more last-minute parking stress!
                    </p>
                  </div>

                  <div className="col-lg-6 col-md-6">
                    <img src={Icon2} alt="Extra Income" />
                    <h3>Extra Income</h3>
                    <p>
                      Start earning extra income effortlessly. Whether it's a
                      one-time event or a regular source of revenue, your
                      driveway has untapped potential.
                    </p>
                  </div>

                  <div className="col-lg-6 col-md-6">
                    <img src={Icon4} alt="Innovative Technology" />
                    <h3>Innovative Technology</h3>
                    <p>
                      Our platform is driven by innovative technology that
                      ensures a seamless parking experience for all our users.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PopularParking />

      <div className="rentOut">
        <div className="parkmydriveBenefitsLeft">
          <div className="rentOutInner">
            <div className="row">
              <div className="col-lg-10 offset-lg-1">
                <h2>Why Choose Us</h2>
                <p>
                  We are a small company, trying to validate if this is a
                  feasible idea. So we would really appreciate your help and
                  support. That does not mean we compromise Safety, security,
                  and customer support. We need them to survive
                </p>

                <div className="row parkmydriveBenefitsList rentOutList">
                  <div className="col-lg-12">
                    <div className="image-box-wrapper">
                      <figure className="image-box-img">
                        <img src={Icon5} alt="Safe & Secure" />
                      </figure>
                      <div
                        className="image-box-content"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "20px",
                        }}
                      >
                        <img src={HomeLast1} alt="Security Visual" />
                        <h3>Safe & Secure</h3>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <div className="image-box-wrapper">
                      <figure className="image-box-img">
                        <img src={Icon6} alt="Community First" />
                      </figure>
                      <div
                        className="image-box-content"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "20px",
                        }}
                      >
                        <img src={HomeLast2} alt="Community Visual" />
                        <h3>Community First</h3>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <div className="image-box-wrapper">
                      <figure className="image-box-img">
                        <img src={Icon7} alt="Live Support" />
                      </figure>
                      <div
                        className="image-box-content"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "20px",
                        }}
                      >
                        <img src={HomeLast3} alt="Support Visual" />
                        <h3>Live Customer Support</h3>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <a href="#" className="btn btn-secondary">
                      Get Started
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OtherHome;



// import React from "react";
// import Icon1 from "../assets/images/icon1.png";
// import Icon2 from "../assets/images/icon2.png";
// import Icon3 from "../assets/images/icon3.png";
// import Icon4 from "../assets/images/icon4.png";
// import Icon5 from "../assets/images/icon5.png";
// import Icon6 from "../assets/images/icon6.png";
// import Icon7 from "../assets/images/icon7.png";
// import HomeLast1 from "../assets/images/home-last1.png";
// import HomeLast2 from "../assets/images/home-last2.png";
// import HomeLast3 from "../assets/images/home-last3.png";
// import PopularParking from "./PopularParking";

// function OtherHome() {
//   return (
//     <>
//       <div className="parkmydriveBenefits">
//         <div className="parkmydriveBenefitsLeft">
//           <div className="parkmydriveBenefitsInner">
//             <div className="row">
//               <div className="col-lg-9 offset-lg-2">
//                 <h2>How it works</h2>
//                 <p>
//                 Our platform allows you to easily rent out your driveway to people who want to park their vehicles for the concert or sports event
//                 </p>

//                 <div className="row parkmydriveBenefitsList">
//                   <div className="col-lg-6 col-md-6">
//                     <img src={Icon1} />
//                     <h3>List your driveway</h3>
//                     <p>
//                     Sign up, list your driveway, and tell us a little bit about when we can park there.
//                     </p>
//                   </div>

//                   <div className="col-lg-6 col-md-6">
//                     <img src={Icon3} />
//                     <h3>Bookings made easy</h3>
//                     <p>
//                     Visitors can browse listings, select the perfect spot, and book in advance. No more last-minute parking stress!
//                     </p>
//                   </div>

//                   <div className="col-lg-6 col-md-6">
//                     <img src={Icon2} />
//                     <h3>Extra Income</h3>
//                     <p>
//                     Start earning extra income effortlessly. Whether it's a one-time event or a regular source of revenue, your driveway has untapped potential.
//                     </p>
//                   </div>
//                   <div className="col-lg-6 col-md-6">
//                     <img src={Icon4} />
//                     <h3>Innovative Technology</h3>
//                     <p>
//                     Our platform is driven by innovative technology that ensures a seamless parking experience for all our users.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <PopularParking />

//       <div className="rentOut">
//         <div className="parkmydriveBenefitsLeft">
//           <div className="rentOutInner">
//             <div className="row">
//               <div className="col-lg-10 offset-lg-1">
//                 <h2>Why Choose Us</h2>
//                 <p>
//                 We are a small company, trying to validate if this is a feasible idea. So we would really appreciate your help and support. That does not mean we compromise Safety, security, and customer support. We need them to survive
//                 </p>

//                 <div className="row parkmydriveBenefitsList rentOutList">
//                   <div className="col-lg-12">
//                     <div className="image-box-wrapper">
//                       <figure className="image-box-img">
//                         <img src={Icon5.png} />
//                       </figure>
//                       <div className="image-box-content" style={{display: "flex", alignItems: "center", gap: "20px"}}>
//                       <img src={HomeLast1} alt="" />
//                         <h3>Safe & Secure</h3>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="col-lg-12">
//                     <div className="image-box-wrapper">
//                       <figure className="image-box-img">
//                         <img src={Icon6.png} />
//                       </figure>
//                       <div className="image-box-content" style={{display: "flex", alignItems: "center", gap: "20px"}}>
//                       <img src={HomeLast2} alt="" />
//                         <h3>Community First</h3>
                  
//                       </div>
//                     </div>
//                   </div>

//                   <div className="col-lg-12">
//                     <div className="image-box-wrapper">
//                       <figure className="image-box-img">
//                         <img src={Icon7.png} />
//                       </figure>
//                       <div className="image-box-content" style={{display: "flex", alignItems: "center", gap: "20px"}}>
//                         <img src={HomeLast3} alt="" />
//                         <h3>Live Customer Support</h3>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="col-lg-12">
//                     <a href="" className="btn btn-secondary">
//                       Get Started
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default OtherHome;
