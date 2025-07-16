
import React from 'react';
import FooterLogo from '../assets/images/footerlogo.png';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="container">
        <div className="row">

          {/* Logo & Description */}
          <div className="col-lg-3 col-md-6">
            <a href="https://park-in-my-driveway.com/">
              <img src={FooterLogo} className="footerlogo img-fluid" alt="Park in My Driveway Logo" />
            </a>
            <p>Park in My Driveway is the innovative idea that's revolutionizing the  way people park.</p>
          </div>

          {/* Quick Links */}
          <div className="col-lg-3 col-md-6">
            <div className="quickLinks">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About us</a></li>
                <li><a href="/find-economy-parking">Parking</a></li>
                <li><a href="/contact-us">Contact us</a></li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="col-lg-3 col-md-6">
            <h3>Connect with us</h3>
            <address>
              <p>L: 11900 Jollyville Rd<br />Austin, TX 78759</p>
              <p>T: +(512) 853 0282</p>
              <p>E: <a href="mailto:parkinmydriveway@gmail.com">parkinmydriveway@gmail.com</a></p>
            </address>
          </div>

          {/* Social Media */}
          <div className="col-lg-3 col-md-6">
            <h3>Follow with us</h3>
            <div className="socialMedia">
              <a href="#"><i className="fa fa-phone"></i></a>
              <a href="#"><i className="fa fa-facebook-f"></i></a>
              <a href="#"><i className="fa fa-instagram"></i></a>
              <a href="#"><i className="fa fa-youtube"></i></a>
              <a href="#"><i className="fa fa-twitter"></i></a>
            </div>
          </div>

        </div>

        {/* Copyright Footer */}
        <div className="copyrights">
          <div className="row">
            <div className="col-lg-6 col-md-6">
              © 2024 Park in my driveway. All rights reserved.
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="copyrighttext">
                <a href="https://inqtechnologies.com/" target="_blank" rel="noreferrer">
                  Powered by InQ Technologies
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;


// import React from 'react'
// import FooterLogo from '../assets/images/footerlogo.png'

// function Footer() {
//     return (
//         <footer>

//             <div className="container">
//                 <div className="row">
//                     <div className="col-lg-3 col-md-6">
//                    <a href="https://park-in-my-driveway.com/">    <img src={FooterLogo} className="footerlogo img-fluid" /></a> 
//                         <p>Park in My Driveway is the innovative idea that's revolutionizing the way people park.</p>


//                     </div>
//                     <div className="col-lg-3 col-md-6">
//                         <div className="quickLinks">
//                             <h3>Quick Links</h3>
//                             <ul>
//                             <li><a href="/">Home</a></li>
//                                 <li><a href="/about">About us</a></li>
//                                 <li><a href="/find-economy-parking">Parking </a></li>
//                                 <li><a href="/contact-us">Contact us </a></li>

//                             </ul></div>
//                     </div>
//                     <div className="col-lg-3 col-md-6">
//                         <h3>Connect with us</h3>
//                         <address>
//                             <p>L: 11900 Jollyville Rd <br/>
// Austin, TX 78759</p>
//                             <p>T: +(512) 853 0282</p>  
//                             <p>E: <a href="mailto:parkinmydriveway@gmail.com">parkinmydriveway@gmail.com</a></p>
//                         </address>

//                     </div>
//                     <div className="col-lg-3 col-md-6">
//                         <h3>Follow with us</h3>
//                         <div className="socialMedia"><a href=""><i className="fa fa-phone"></i></a> <a href=""><i className="fa fa-facebook-f"></i></a> <a href=""><i className="fa fa-instagram"></i></a> <a href=""><i className="fa fa-youtube"></i></a> <a href=""><i className="fa fa-twitter"></i></a>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="copyrights">
//                     <div className="row">
//                         <div className="col-lg-6 col-md-6">© 2024 Park in my driveway. All rights reserved.</div>

//                         <div className="col-lg-6 col-md-6"><div className="copyrighttext"><a href="https://inqtechnologies.com/" target="_blank" rel="noreferrer">Powered by InQ Technologies</a></div></div>
//                     </div>

//                 </div>
//             </div>

//         </footer>
//     )
// }

// export default Footer