import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Banner from "../assets/images/banner.jpg";
import Banner2 from "../assets/images/banner2.jpg";
import Banner3 from "../assets/images/banner3.jpg";
import BannerIconOne from "../assets/images/banner-icon.png";
import BannerIconTwo from "../assets/images/banner-icon1.png";
import BannerIconThree from "../assets/images/banner-icon2.png";

interface RootState {
  user: {
    value: {
      isLoggedIn: boolean;
    };
  };
}

const Slider: React.FC = () => {
  const userRedux = useSelector((state: RootState) => state.user.value);
  const images = [Banner, Banner2, Banner3];
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFade(true);
      }, 1000);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const storedLoc = localStorage.getItem("currentLat");
        if (navigator.geolocation && !storedLoc) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              localStorage.setItem("currentLat", latitude.toString());
              localStorage.setItem("currentLong", longitude.toString());
              await fetchAddress(latitude, longitude);
            },
            async () => {
              console.log("User denied");
              const lat = 30.4366847;
              const lng = -97.8118165;
              localStorage.setItem("currentLat", lat.toString());
              localStorage.setItem("currentLong", lng.toString());
              await fetchAddress(lat, lng);
            }
          );
        } else {
          console.log("Geolocation is not supported by this browser.");
          localStorage.removeItem("currentLat");
          localStorage.removeItem("currentLong");
          localStorage.removeItem("addressComponent");
        }
      } catch (error) {
        console.error("Error getting location:", error);
      }
    };

    const fetchAddress = async (lat: number, lng: number) => {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_APP_GOOGLE_API_KEY}`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        const addressComponents = data.results[0].address_components;
        const filteredComponents = addressComponents.filter(
          (component: any) =>
            !component.types.includes("postal_code") &&
            !component.types.includes("plus_code")
        );
        const formattedAddress = filteredComponents
          .map((component: any) => component.long_name)
          .join(", ");
        localStorage.setItem(
          "addressComponent",
          JSON.stringify({
            label: formattedAddress,
            value: {
              description: formattedAddress,
              place_id: data.results[0].place_id,
            },
          })
        );
      }
    };

    fetchLocation();
  }, []);

  const goToFind = () => {
    navigate("/find-economy-parking");
    localStorage.removeItem("redirect");
  };

  const goToList = () => {
    if (!userRedux.isLoggedIn) localStorage.setItem("redirect", "/rent-out-your-driveway");
    navigate(userRedux.isLoggedIn ? "/rent-out-your-driveway" : "/userlogin");
  };

  const goToPrev = () => {
    setFade(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    setFade(true);
  };

  const goToNext = () => {
    setFade(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setFade(true);
  };

  return (
    <div
      id="bootstrap-touch-slider"
      className="carousel slide carousel-fade"
      data-bs-ride="carousel"
      data-bs-pause="hover"
      data-bs-interval="5000"
    >
      <ol className="carousel-indicators">
        {images.map((_, index) => (
          <li
            key={index}
            data-bs-target="#bootstrap-touch-slider"
            data-bs-slide-to={index}
            className={currentIndex === index ? "active" : ""}
          ></li>
        ))}
      </ol>

      <div className="carousel-inner">
        <div className="carousel-item active">
          <img
            src={images[currentIndex]}
            alt="parking"
            className={`d-block w-100 carasoul-image-container ${fade ? "c-fade-in" : "c-fade-out"}`}
          />
          <div className="carousel-overlay"></div>

          <div className="carousel-caption text-start w-40" style={{ top: "-16px" }}>
            <h1 data-bs-animation="animate__animated animate__zoomInRight">Driveway</h1>
            <p>
              <ul style={{ paddingLeft: "22px" }}>
                <li style={{ display: "list-item", listStyle: "circle" }}>
                  Do you Live near a concert venue, stadium or an area with limited parking ?
                </li>
                <li style={{ display: "list-item", listStyle: "circle" }}>
                  Rent out your driveway to people who want to park for upto $20/day
                </li>
                <li style={{ display: "list-item", listStyle: "circle" }}>
                  We want to be the AirBnb for Parking
                </li>
              </ul>
            </p>

            <p data-bs-animation="animate__animated animate__fadeInLeft" style={{ display: "flex", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img src={BannerIconOne} alt="icon1" />
                <span>Tech Driven Parking</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img src={BannerIconTwo} alt="icon2" />
                <span>Driven By Innovation</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img src={BannerIconThree} alt="icon3" />
                <span>Rent Out Your Driveway</span>
              </div>
            </p>

            <div style={{ display: "flex", gap: "8px" }}>
              <a
                onClick={goToList}
                className="btn btn-primary"
                data-bs-animation="animate__animated animate__fadeInLeft"
              >
                List Your Driveway
              </a>
              <a
                onClick={goToFind}
                className="btn btn-primary"
                data-bs-animation="animate__animated animate__fadeInLeft"
              >
                Find a spot to park
              </a>
            </div>
          </div>
        </div>
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#bootstrap-touch-slider"
        data-bs-slide="prev"
        onClick={goToPrev}
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#bootstrap-touch-slider"
        data-bs-slide="next"
        onClick={goToNext}
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Slider;












// import React, { useEffect, useState } from "react";
// import Banner from "../assets/images/banner.jpg";
// import Banner2 from "../assets/images/banner2.jpg";
// import Banner3 from "../assets/images/banner3.jpg";
// import { useNavigate } from "react-router-dom";
// import BannerIconOne from "../assets/images/banner-icon.png";
// import BannerIconTwo from "../assets/images/banner-icon1.png";
// import BannerIconThree from "../assets/images/banner-icon2.png";
// import { useSelector } from "react-redux";

// function Slider() {
//   const userRedux = useSelector((state) => {
//     return state.user.value;
//   });
//   const images = [
//     Banner, Banner2, Banner3
//   ];
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [fade, setFade] = useState(true);
//   useEffect(() => {
//  const interval = setInterval(() => {
//       setFade(false);
//       setTimeout(() => {
//         setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//         setFade(true);
//       }, 1000); // Adjust this time to match the fade-out duration
//     }, 4000); // 3000 milliseconds = 3 seconds

//     return () => {
//       clearInterval(interval);
//     };
//   }, [images.length]);
//   useEffect(() => {
//     const fetchLocation = async () => {
//       try {
//         let storedLoc = localStorage.getItem('currentLat');
//         if (navigator.geolocation && storedLoc == null) {
//           navigator.geolocation.getCurrentPosition(async (position) => {
//             const latitude = position.coords.latitude;
//             const longitude = position.coords.longitude;
//             localStorage.setItem('currentLat', latitude);
//             localStorage.setItem('currentLong', longitude);
//             // Fetch full address using reverse geocoding
//             const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_APP_GOOGLE_API_KEY}`);
//             const data = await response.json();
//             if (data.results.length > 0) {
//               const addressComponents = data.results[0].address_components;
//               const filteredComponents = addressComponents.filter(component =>
//                 !component.types.includes('postal_code') && !component.types.includes('plus_code')
//               );
//               const formattedAddress = filteredComponents.map(component => component.long_name).join(', ');
//               localStorage.setItem('addressComponent', JSON.stringify({
//                 label: formattedAddress,
//                 value: {
//                   description: formattedAddress,
//                   place_id: data.results[0].place_id
//                 }
//               }));
//             }
//           }, async (error) => {
//             console.log('User denied');
//             const lat = 30.4366847;
//             const lng = -97.8118165
//             localStorage.setItem('currentLat', lat);
//             localStorage.setItem('currentLong', lng);
//             const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_APP_GOOGLE_API_KEY}`);
//             const data = await response.json();
//             if (data.results.length > 0) {
//               const addressComponents = data.results[0].address_components;
//               const filteredComponents = addressComponents.filter(component =>
//                 !component.types.includes('postal_code') && !component.types.includes('plus_code')
//               );
//               const formattedAddress = filteredComponents.map(component => component.long_name).join(', ');
//               localStorage.setItem('addressComponent', JSON.stringify({
//                 label: formattedAddress,
//                 value: {
//                   description: formattedAddress,
//                   place_id: data.results[0].place_id
//                 }
//               }));
//             }
//           }
//         );
//         } else {
//           console.log('Geolocation is not supported by this browser.');
//           localStorage.removeItem('currentLat');
//           localStorage.removeItem('currentLong');
//           localStorage.removeItem('addressComponent');
//         }
//       } catch (error) {
//         console.error('Error getting location:', error);
//       }
//     };

//     fetchLocation();
//   }, []);
//   const navigate = useNavigate();
//   const goToFind = () => {
//     navigate("/find-economy-parking");
//     localStorage.removeItem('redirect');
//   };
//   const goToList = () => {
//     !userRedux.isLoggedIn ? localStorage.setItem('redirect', '/rent-out-your-driveway') : ''
//     navigate(userRedux.isLoggedIn ? '/rent-out-your-driveway' : '/userlogin');
//   };
//   const goToPrev =() => {
//     setFade(false);
//     setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
//         setFade(true);
//   }
//   const goToNext =() => {
//     setFade(false);
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//         setFade(true);
//   }
//   return (
//     <div
//       id="bootstrap-touch-slider"
//       className="carousel slide carousel-fade"
//       data-bs-ride="carousel"
//       data-bs-pause="hover"
//       data-bs-interval="5000"
//     >
//       <ol className="carousel-indicators">
//         {/* <li
//           data-bs-target="#bootstrap-touch-slider"
//           data-bs-slide-to="0"
//           className={`${images[0] ? 'active' : ''}`}
//         ></li>
//         <li data-bs-target="#bootstrap-touch-slider" data-bs-slide-to="1" className={`${fade ? 'active' : ''}`}></li>
//         <li data-bs-target="#bootstrap-touch-slider" data-bs-slide-to="2" className={`${fade ? 'active' : ''}`}></li> */}
//          {images.map((_, index) => (
//           <li
//             key={index}
//             data-bs-target="#bootstrap-touch-slider"
//             data-bs-slide-to={index}
//             className={currentIndex === index ? 'active' : ''}
//           ></li>
//         ))}
//       </ol>

//       <div className="carousel-inner">

//         <div className="carousel-item active">
//         <img src={images[currentIndex]} alt="parking" className={`'d-block w-100 carasoul-image-container' ${fade ? 'c-fade-in' : 'c-fade-out'}`} />
//           <div className="carousel-overlay"></div>

//           <div className="carousel-caption text-start w-40" style={{top: "-16px"}}>
//             <h1 data-bs-animation="animate__animated animate__zoomInRight">
//             Driveway
//             </h1>
//             <p>
//             <ul style={{paddingLeft: "22px"}}>
//               <li style={{display: "list-item", listStyle: "circle"}}>Do you Live near a concert venue, stadium or an area with limited parking ?</li>
//               <li style={{display: "list-item", listStyle: "circle"}}>Rent out your driveway to people who want to park for upto $20/day</li>
//               <li style={{display: "list-item", listStyle: "circle"}}>We want to be the AirBnb for Parking</li>
//             </ul>
//             </p>

//             <p data-bs-animation="animate__animated animate__fadeInLeft" style={{display: "flex"}}>
//               <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
//               <img src={BannerIconOne} alt="" />
//               <span>Tech Driven Parking</span>
//               </div>
//               <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
//               <img src={BannerIconTwo} alt="" />
//               <span>Driven By Innovation</span>
//               </div>
//               <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
//               <img src={BannerIconThree} alt="" />
//               <span>Rent Out Your Driveway</span>
//               </div>
//             </p>
//             <div style={{display: "flex", gap: "8px"}}>
//             <a
//               onClick={() => goToList()}
//               className="btn btn-primary"
//               data-bs-animation="animate__animated animate__fadeInLeft"
//             >
//               List Your Driveway
//             </a>
//             <a
//               onClick={() => goToFind()}
//               className="btn btn-primary"
//               data-bs-animation="animate__animated animate__fadeInLeft"
//             >
//               Find a spot to park
//             </a>
//             </div>

//           </div>
//         </div>

//         {/* <div className="carousel-item">
//           <img src={Banner2} alt="parking" className="d-block w-100" />
//           <div className="carousel-overlay"></div>

//           <div className="carousel-caption text-start">
//             <h1 data-bs-animation="animate__animated animate__flipInX">
//               Find Amazing Parking Space Near You
//             </h1>
//             <p data-bs-animation="animate__animated animate__lightSpeedIn">
//               Uncover convenient spots for hassle-free parking nearby.
//             </p>
//             <a
//               target="_blank"
//               className="btn btn-primary"
//               data-bs-animation="animate__animated animate__fadeInUp"
//             >
//               Show Parking Spaces
//             </a>
//           </div>
//         </div>

//         <div className="carousel-item">
//           <img src={Banner3} alt="parking" className="d-block w-100" />
//           <div className="carousel-overlay"></div>

//           <div className="carousel-caption text-start">
//             <h1 data-bs-animation="animate__animated animate__zoomInLeft">
//               Find Amazing Parking Space Near You
//             </h1>
//             <p data-bs-animation="animate__animated animate__fadeInRight">
//               Uncover convenient spots for hassle-free parking nearby.
//             </p>
//             <a
//               target="_blank"
//               className="btn btn-primary"
//               data-bs-animation="animate__animated animate__fadeInLeft"
//             >
//               Show Parking Spaces
//             </a>
//           </div>
//         </div> */}
//       </div>

//       <button
//         className="carousel-control-prev"
//         type="button"
//         data-bs-target="#bootstrap-touch-slider"
//         data-bs-slide="prev"
//         onClick={() => goToPrev()}
//       >
//         <span className="carousel-control-prev-icon" aria-hidden="true"></span>
//         <span className="visually-hidden">Previous</span>
//       </button>

//       <button
//         className="carousel-control-next"
//         type="button"
//         data-bs-target="#bootstrap-touch-slider"
//         data-bs-slide="next"
//         onClick={() => goToNext()}
//       >
//         <span className="carousel-control-next-icon" aria-hidden="true"></span>
//         <span className="visually-hidden">Next</span>
//       </button>
//     </div>
//   );
// }

// export default Slider;
