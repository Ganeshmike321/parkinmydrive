import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import ParkingImage from '../../../assets/images/parking-image.jpg';
import ParkingImage1 from '../../../assets/images/about.jpg';
import ParkingImage2 from '../../../assets/images/Mask group.jpg';
import Logo from '../../../assets/images/logopmid.png';
import AxiosClient from "../../../axios/AxiosClient";

// Type definitions
interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface ContactResponse {
  status: number;
  data?: {
    message?: string;
  };
}

// Constants
const SITE_KEY = "6Lfp2zArAAAAALXDmrXSE-byWenyL_nB0ckMxc9A";
const SUCCESS_TIMEOUT = 4000;

const FAQ_DATA: FAQ[] = [
  {
    question: "1. How do I know if a driveway is available for parking in Dallas TX?",
    answer: "Our platform displays real-time availability for all listed driveways. Each listing includes details on pricing, availability, and any restrictions. To guarantee your spot, we recommend booking in advance.",
  },
  {
    question: "2. Is Dallas overnight parking allowed in residential areas?",
    answer: "Yes, many homeowners on our platform offer Dallas overnight parking in their driveways. Each listing specifies whether overnight stays are allowed, so you can find a spot that fits your needs.",
  },
  {
    question: "3. How much does it cost to park in Dallas using your platform?",
    answer: "Prices vary depending on location and demand. Some hosts offer Dallas parking for as low as $10-$20 per day, which is often cheaper than traditional Dallas city parking or commercial garages.",
  },
  {
    question: "4. Can I find parking at the Dallas Convention Center for a full day?",
    answer: "Yes! We have driveways listed near the Dallas Convention Center that allow full-day or extended parking. Since convention center parking fills up quickly, booking ahead ensures a hassle-free experience.",
  },
  {
    question: "5. What are the benefits of using your service instead of Dallas public parking?",
    answer: "Unlike public parking in Dallas TX, our platform provides reserved spots, so you don't have to waste time searching for a space. Plus, residential driveways often offer a safer and more convenient alternative to crowded Dallas parking lots.",
  },
  {
    question: "6. Are there options for long term parking in Dallas TX?",
    answer: "Absolutely! Many homeowners offer it, including weekly and monthly rentals. This is perfect for commuters, business travelers, or anyone needing a dedicated parking space.",
  },
  {
    question: "7. How do I know if a parking spot in Dallas is legitimate?",
    answer: 'All driveways listed on our platform are verified to ensure authenticity and security. Unlike random parking lots in Dallas TX, our listings come from real homeowners, giving you peace of mind.',
  },
  {
    question: "8. How do I contact customer support if I have an issue?",
    answer: 'We offer live customer support to assist with any concerns. Whether you have a question about a reservation or need help with parking in Dallas Texas, you can <a href="#">Contact Us</a> anytime!',
  },
];

const FORM_FIELDS = [
  { id: "name" as keyof FormData, type: "text", label: "Name" },
  { id: "email" as keyof FormData, type: "email", label: "Email ID" },
  { id: "phone" as keyof FormData, type: "tel", label: "Phone" },
  { id: "subject" as keyof FormData, type: "text", label: "Subject" },
] as const;

const INITIAL_FORM_DATA: FormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const DallasParking: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const navigate = useNavigate();

  // Event handlers
  const toggleFAQ = (index: number): void => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const handleCaptchaChange = (token: string | null): void => {
    setRecaptchaToken(token);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { id, value } = e.target;
    let updatedValue = value;

    // Input validation
    if (id === "name") {
      updatedValue = value.replace(/[^A-Za-z\s]/g, "");
    } else if (id === "phone") {
      updatedValue = value.replace(/[^0-9]/g, "");
    }

    setFormData(prev => ({ ...prev, [id]: updatedValue }));
  };

  const validateForm = (): boolean => {
    const { name, email, phone, subject, message } = formData;
    
    if (!name || !email || !phone || !subject || !message) {
      // Note: Replace with your preferred alert library
      alert("Please fill out all fields");
      return false;
    }

    if (!recaptchaToken) {
      alert("Please complete the reCAPTCHA.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setSubmitted(true);

    try {
      const response = await AxiosClient.post<ContactResponse>("/api/contact", {
        ...formData,
        page: "dallas"
      });

      if (response.status === 201) {
        // Note: Replace with your preferred success notification
        alert("Submitted successfully!");
        setFormData(INITIAL_FORM_DATA);
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setTimeout(() => setSubmitted(false), SUCCESS_TIMEOUT);
    }
  };

  const handleNavigation = (path: string) => (): void => {
    navigate(path);
  };

  // Render components
  const renderSuccessMessage = (): React.JSX.Element | null => {
    if (!submitted) return null;

    return (
      <div
        className="position-fixed top-0 end-0 mt-3 me-3 px-4 py-2 bg-light-green rounded shadow animate-slide-in d-flex align-items-center gap-2"
        style={{
          zIndex: 9999,
          backgroundColor: "#d4edda",
          color: "#155724",
          border: "1px solid #c3e6cb",
          width: "auto",
          maxWidth: "300px",
          fontWeight: "bold",
        }}
      >
        <FaCheckCircle className="text-success" />
        Submitted successfully
      </div>
    );
  };

  const renderFormFields = (): React.JSX.Element[] => {
    return FORM_FIELDS.map(({ id, type, label }) => (
      <div key={id} className="mb-3">
        <input
          type={type}
          id={id}
          name={id}
          className="form-control"
          value={formData[id]}
          onChange={handleChange}
          required
          placeholder={`${label}*`}
          disabled={isLoading}
        />
      </div>
    ));
  };

  const renderFAQSection = (): React.JSX.Element => (
    <div className="container py-5">
      <h5 className="fw-bold mb-4">Frequently Asked Questions (FAQs)</h5>
      <div className="accordion" id="faqAccordion">
        {FAQ_DATA.map((faq, index) => (
          <div className="accordion-item" key={index}>
            <h2 className="accordion-header">
              <button
                className={`accordion-button no-arrow d-flex justify-content-between align-items-center ${
                  activeIndex === index ? "" : "collapsed"
                }`}
                type="button"
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                <span className="ms-auto fw-bold fs-4">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </button>
            </h2>
            <div
              className={`accordion-collapse collapse ${
                activeIndex === index ? "show" : ""
              }`}
            >
              <div
                className="accordion-body"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container py-5 px-3 px-sm-2">
      <div className="row mb-5 position-relative">
        {renderSuccessMessage()}

        {/* Left Column */}
        <div className="col-md-6 mb-4">
          <h3>Parking in Dallas – Easy, Affordable & Convenient Solutions</h3>
          <p>
            Finding a parking spot in Dallas can be tough, especially during major events or concerts. 
            Whether you're visiting American Airlines Center, attending a conference at the Dallas 
            Convention Center, or exploring the city, you need a hassle-free solution.
          </p>
          <p>
            Park In My Driveway connects drivers with local homeowners offering an affordable, 
            safe, and convenient way.
          </p>
          <p>
            Skip the crowded garages and overpriced lots—reserve your spot in advance and enjoy 
            stress-free Dallas parking today!
          </p>
          <div className="d-flex gap-2 flex-wrap">
            <button 
              className="btn custom-btn" 
              onClick={handleNavigation('/rent-out-your-driveway')}
            >
              LIST YOUR DRIVEWAY
            </button>
            <button 
              className="btn custom-btn" 
              onClick={handleNavigation('/find-economy-parking')}
            >
              FIND A SPOT TO PARK
            </button>
          </div>
        </div>

        {/* Right Column - Contact Form */}
        <div className="col-md-6">
          <h5 className="fw-bold">Contact With Us</h5>
          <p>If you have any questions please feel free to contact with us.</p>
          <form onSubmit={handleSubmit}>
            {renderFormFields()}

            <div className="mb-3">
              <textarea
                id="message"
                name="message"
                className="form-control"
                rows={3}
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your message here"
                disabled={isLoading}
              />
            </div>

            <ReCAPTCHA
              sitekey={SITE_KEY}
              onChange={handleCaptchaChange}
              className="mb-3"
            />

            <button
              type="submit"
              className="btn custom-btn px-4"
              style={{ backgroundColor: "#ff7902", color: "white" }}
              disabled={isLoading}
            >
              {isLoading ? "SENDING..." : "SEND"}
            </button>
          </form>
        </div>
      </div>

      {/* Content Sections */}
      <div className="row align-items-center border mt-5 p-3">
        <div className="col-md-6">
          <h3 className="fw-bold">Skip the Crowds: Easy Parking in Dallas</h3>
          <p>
            Securing Dallas city parking during peak hours or major events can be challenging. 
            Whether you're attending a game at American Airlines Center, a concert, or a meeting 
            downtown, parking in Dallas TX often means circling garages and paying high prices.
          </p>
          <p>
            Instead of dealing with packed Dallas parking lots, Park In My Driveway lets you 
            rent private driveways near your destination. This affordable and convenient option 
            makes parking simple. Reserve your spot in advance and enjoy a hassle-free experience today!
          </p>
        </div>
        <div className="col-md-6 mb-3 mb-md-0">
          <img
            src={ParkingImage1}
            alt="Innovative Parking"
            className="img-fluid w-100"
            style={{ objectFit: 'cover', height: '300px' }}
          />
        </div>
      </div>

      <div className="row align-items-center border p-3">
        <div className="col-md-6 mb-3 mb-md-0">
          <img
            src={ParkingImage}
            alt="Austin Parking Lot"
            className="img-fluid w-100"
            style={{ objectFit: 'cover', height: '400px' }}
          />
        </div>
        <div className="col-md-6">
          <h3 className="fw-bold mb-3">Smarter Parking with Innovative Technology</h3>
          <p>
            Finding the parking spot in Dallas TX has never been easier. Our platform uses 
            advanced technology to connect you with available driveways and parking spaces 
            near your destination. With a simple, user-friendly interface, you can quickly 
            browse, book, and secure your parking hassle-free. Whether you need a spot for 
            a few hours or overnight, Park In My Driveway ensures a seamless and stress-free experience.
          </p>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-5">How Does Park In My Driveway Work?</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="border p-4 h-100">
              <h5 className="fw-bold mb-3">1. List Your Driveway</h5>
              <p>
                If you're a local, you can list your driveway for free! Simply sign up, 
                provide details about your location and availability, and let our system 
                handle the rest. Whether you're offering overnight parking in Dallas or 
                a spot for a major event, you'll have full control over when and where 
                your driveway is available.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="border p-4 h-100">
              <h5 className="fw-bold mb-3">2. Browse Listings and Book</h5>
              <p>
                Visitors can easily browse available spots near key locations like parking 
                at the Dallas Convention Center. You can even search for parking garages 
                in Dallas, TX if you prefer structured parking. Book your spot ahead of 
                time and enjoy stress-free parking when you arrive!
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="border p-4 h-100">
              <h5 className="fw-bold mb-3">3. Earn Extra Income</h5>
              <p>
                Have a driveway near top spots like the American Airlines Center, Kay Bailey 
                Hutchison Convention Center, or the State Fair of Texas? List it on Park In 
                My Driveway and earn up to $20/day while providing much-needed parking in 
                Dallas TX for events and visitors.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Advantages Section */}
      <div className="container py-5">
        <div className="row g-4 align-items-center">
          <div className="col-md-6">
            <div className="border p-4 h-100">
              <h5 className="fw-bold mb-4">
                Advantages of Parking in Dallas, TX with Park In My Driveway
              </h5>
              <p>
                <strong>• Convenience</strong><br />
                Avoid long walks and crowded garages by parking close to your destination.
              </p>
              <p>
                <strong>• Affordable Rates</strong><br />
                Enjoy lower prices compared to traditional Dallas parking lots or metered street parking.
              </p>
              <p>
                <strong>• Security</strong><br />
                Park in safe, residential areas with less risk than public spaces.
              </p>
              <p>
                <strong>• Availability</strong><br />
                Easily find overnight parking in Dallas Texas, whether for a few hours or an extended stay.
              </p>
              <p>
                <strong>• Flexible Options</strong><br />
                Need public parking in Dallas Texas for a day or weekend? Reserve a spot in 
                advance for a stress-free experience.
              </p>
            </div>
          </div>
          <div className="col-md-6 d-flex align-items-stretch">
            <img 
              src={ParkingImage2} 
              alt="Parking Image" 
              className="img-fluid w-100 h-100 rounded border object-cover" 
            />
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="container py-5">
        <div className="row g-4 align-items-center">
          <div className="col-md-4 d-flex justify-content-center">
            <img
              src={Logo}
              alt="Park In My Driveway Logo"
              className="img-fluid"
              style={{ width: '250px', height: '150px' }}
            />
          </div>
          <div className="col-md-8">
            <div className="border p-4 h-100 rounded shadow-sm">
              <h5 className="fw-bold mb-3">Why Choose Us for Parking in Dallas?</h5>
              <p>
                Park In My Driveway is transforming parking at Dallas by providing a 
                hassle-free and secure alternative to traditional parking options.
              </p>
              <p>
                Our platform offers safe and easy transactions, with live customer support 
                to assist you with Dallas overnight parking or listing your driveway. We 
                value community, ensuring a reliable and convenient experience for both 
                visitors and local homeowners.
              </p>
              <p>
                Our service allows you to find flexible, monthly parking in Dallas TX without 
                the stress of searching for a spot daily.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      {renderFAQSection()}

      {/* CTA Section */}
      <div className="container py-5">
        <div className="border p-4 text-center">
          <h4 className="fw-bold mb-4">Book Your Dallas Parking Spot Today!</h4>
          <p>
            Say goodbye to the stress of finding parking in Dallas. With Park In My Driveway, 
            you can book a convenient and affordable spot in advance, avoiding the hassle of 
            last-minute searches.
          </p>
          <p>
            Whether you need monthly parking in Dallas TX for work, or a reliable option near 
            your hotel, we've got you covered.
          </p>
          <p>
            Don't waste time circling for a spot—reserve it now and enjoy a hassle-free experience!
          </p>
          <button 
            className="btn px-4 mt-3 fw-bold text-uppercase"
            style={{
              border: '5px solid #ff7902',
              color: '#ff7902'
            }}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default DallasParking;


// import { React, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaCheckCircle } from "react-icons/fa";
// import ParkingImage from '../../../assets/images/parking-image.jpg';
// import ParkingImage1 from '../../../assets/images/about.jpg'
// import ParkingImage2 from '../../../assets/images/Mask group.jpg'
// import Logo from '../../../assets/images/logopmid.png'
// import AxiosClient from "../../../axios/AxiosClient";
// import ReCAPTCHA from "react-google-recaptcha";

// const faqData = [
//     {
//         question: "1. How do I know if a driveway is available for parking in Dallas TX?",
//         answer:
//             "Our platform displays real-time availability for all listed driveways. Each listing includes details on pricing, availability, and any restrictions. To guarantee your spot, we recommend booking in advance.",
//     },
//     {
//         question: "2. Is Dallas overnight parking allowed in residential areas?",
//         answer:
//             "Yes, many homeowners on our platform offer Dallas overnight parking in their driveways. Each listing specifies whether overnight stays are allowed, so you can find a spot that fits your needs.",
//     },
//     {
//         question: "3. How much does it cost to park in Dallas using your platform?",
//         answer:
//             "Prices vary depending on location and demand. Some hosts offer Dallas parking for as low as $10-$20 per day, which is often cheaper than traditional Dallas city parking or commercial garages.",
//     },
//     {
//         question:
//             "4. Can I find parking at the Dallas Convention Center for a full day?",
//         answer:
//             "Yes! We have driveways listed near the Dallas Convention Center that allow full-day or extended parking. Since convention center parking fills up quickly, booking ahead ensures a hassle-free experience.",
//     },
//     {
//         question: "5. What are the benefits of using your service instead of Dallas public parking?",
//         answer:
//             "Unlike public parking in Dallas TX, our platform provides reserved spots, so you don’t have to waste time searching for a space. Plus, residential driveways often offer a safer and more convenient alternative to crowded Dallas parking lots.",
//     },
//     {
//         question: "6. Are there options for long term parking in Dallas TX?",
//         answer:
//             "Absolutely! Many homeowners offer it, including weekly and monthly rentals. This is perfect for commuters, business travelers, or anyone needing a dedicated parking space.",
//     },
//     {
//         question:
//             "7. How do I know if a parking spot in Dallas is legitimate?",
//         answer:
//             'All driveways listed on our platform are verified to ensure authenticity and security. Unlike random parking lots in Dallas TX, our listings come from real homeowners, giving you peace of mind.',
//     },
//     {
//         question:
//             "8. How do I contact customer support if I have an issue?",
//         answer:
//             'We offer live customer support to assist with any concerns. Whether you have a question about a reservation or need help with parking in Dallas Texas, you can <a href="#">Contact Us</a> anytime!',
//     },
// ];

// const DallasParking = () => {

//     const [activeIndex, setActiveIndex] = useState(null);
//     const [submitted, setSubmitted] = useState(false);
//     const [recaptchaToken, setRecaptchaToken] = useState(null);
//     const siteKey = "6Lfp2zArAAAAALXDmrXSE-byWenyL_nB0ckMxc9A";
//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         phone: "",
//         subject: "",
//         message: "",
//     });
//     const navigate = useNavigate();

//     const toggleFAQ = (index) => {
//         setActiveIndex(index === activeIndex ? null : index);
//     };

//     const handleCaptchaChange = (token) => {
//         setRecaptchaToken(token);
//     };

//     const handleChange = (e) => {
//         const { id, value } = e.target;
//         let updatedValue = value;

//         if (id === "name") {
//             updatedValue = value.replace(/[^A-Za-z\s]/g, "");
//         }

//         if (id === "phone") {
//             updatedValue = value.replace(/[^0-9]/g, "");
//         }

//         setFormData({ ...formData, [id]: updatedValue });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setSubmitted(true);

//         const { name, email, phone, subject, message } = formData;

//         if (!name || !email || !phone || !subject || !message) {
//             Swal.fire("Please fill out all fields", "", "warning");
//             return;
//         }

//         if (!recaptchaToken) {
//             alert("Please complete the reCAPTCHA.");
//             return;
//         }

//         try {
//             const response = await AxiosClient.post("/api/contact", {
//                 name,
//                 email,
//                 phone,
//                 subject,
//                 message,
//                 page: "dallas"
//             });

//             if (response.status === 201) {
//                 Swal.fire("Submitted successfully!", "", "success");

//                 setFormData({
//                     name: "",
//                     email: "",
//                     phone: "",
//                     subject: "",
//                     message: ""
//                 });
//             }
//         } catch (error) {
//             Swal.fire("Error", error.response?.data?.message || "Something went wrong", "error");
//         }

//         setTimeout(() => setSubmitted(false), 4000);
//     };

//     return (
//         <div className="container py-5 px-3 px-sm-2">
//             <div className="row mb-5 position-relative">
//                 {/* Animated Box */}
//                 {submitted && (
//                     <div
//                         className="position-fixed top-0 end-0 mt-3 me-3 px-4 py-2 bg-light-green rounded shadow animate-slide-in d-flex align-items-center gap-2"
//                         style={{
//                             zIndex: 9999,
//                             backgroundColor: "#d4edda",
//                             color: "#155724",
//                             border: "1px solid #c3e6cb",
//                             width: "auto",
//                             maxWidth: "300px",
//                             fontWeight: "bold",
//                         }}
//                     >
//                         <FaCheckCircle className="text-success" />
//                         Submitted successfully
//                     </div>
//                 )}

//                 {/* Left Column */}
//                 <div className="col-md-6 mb-4">
//                     <h3>
//                         Parking in Dallas – Easy, Affordable & Convenient{" "}
//                         Solutions
//                     </h3>
//                     <p>
//                         Finding a parking spot in Dallas can be tough,
//                         especially during major events or concerts. Whether you're visiting
//                         American Airlines Center, attending a conference at the Dallas
//                         Convention Center, or exploring the city, you need a hassle-free
//                         solution.
//                     </p>
//                     <p>
//                         Park In My Driveway connects drivers with local homeowners offering
//                         an affordable, safe, and convenient way.
//                     </p>
//                     <p>
//                         Skip the crowded garages and overpriced lots—reserve your spot in
//                         advance and enjoy stress-free Dallas parking today!
//                     </p>
//                     <div className="d-flex gap-2 flex-wrap">
//                         <button className="btn custom-btn" onClick={() => navigate('/rent-out-your-driveway')}>
//                             LIST YOUR DRIVEWAY
//                         </button>
//                         <button className="btn custom-btn" onClick={() => navigate('/find-economy-parking')}>
//                             FIND A SPOT TO PARK
//                         </button>
//                     </div>

//                 </div>

//                 {/* Right Column */}
//                 <div className="col-md-6">
//                     <h5 className="fw-bold">Contact With Us</h5>
//                     <p>If you have any questions please feel free to contact with us.</p>
//                     <form onSubmit={handleSubmit}>
//                         {[
//                             { id: "name", type: "text", label: "Name" },
//                             { id: "email", type: "email", label: "Email ID" },
//                             { id: "phone", type: "tel", label: "Phone" },
//                             { id: "subject", type: "text", label: "Subject" },
//                         ].map(({ id, type, label }) => (
//                             <div key={id} className="mb-3">
//                                 <input
//                                     type={type}
//                                     id={id}
//                                     name={id}
//                                     className="form-control"
//                                     value={formData[id]}
//                                     onChange={handleChange}
//                                     required
//                                     placeholder={`${label}*`}
//                                 />
//                             </div>
//                         ))}

//                         <div className="mb-3">
//                             <textarea
//                                 id="message"
//                                 name="message"
//                                 className="form-control"
//                                 rows="3"
//                                 required
//                                 value={formData.message}
//                                 onChange={handleChange}
//                                 placeholder="Type your message here"
//                             ></textarea>
//                         </div>
//                         <ReCAPTCHA
//                             sitekey={siteKey}
//                             onChange={handleCaptchaChange}
//                             className="mb-3"
//                         />
//                         <button
//                             type="submit"
//                             className="btn custom-btn px-4"
//                             style={{ backgroundColor: "#ff7902", color: "white" }}
//                         >
//                             SEND
//                         </button>
//                     </form>
//                 </div>
//             </div>

//             {/* Innovative Parking Section */}
//             <div className="row align-items-center border mt-5 p-3">
//                 {/* Left Text Content */}
//                 <div className="col-md-6">
//                     <h3 className="fw-bold">
//                         Skip the Crowds: Easy Parking in Dallas
//                     </h3>
//                     <p>
//                         Securing Dallas city parking during peak
//                         hours or major events can be challenging.
//                         Whether you're attending a game at
//                         American Airlines Center, a concert, or a
//                         meeting downtown, parking in Dallas TX
//                         often means circling garages and paying
//                         high prices.
//                     </p>
//                     <p>
//                         Instead of dealing with packed Dallas
//                         parking lots, Park In My Driveway lets you
//                         rent  private  driveways  near  your
//                         destination. This affordable and convenient
//                         option makes parking simple. Reserve your
//                         spot in advance and enjoy a hassle-free
//                         experience today!
//                     </p>
//                 </div>

//                 {/* Right Image */}
//                 <div className="col-md-6 mb-3 mb-md-0">
//                     <img
//                         src={ParkingImage1}
//                         alt="Innovative Parking"
//                         className="img-fluid w-100"
//                         style={{ objectFit: 'cover', height: '300px' }}
//                     />
//                 </div>
//             </div>

//             {/* New Section From Uploaded Design */}
//             <div className="row align-items-center border p-3">
//                 {/* Left Image */}
//                 <div className="col-md-6 mb-3 mb-md-0">
//                     <img
//                         src={ParkingImage}
//                         alt="Austin Parking Lot"
//                         className="img-fluid w-100"
//                         style={{ objectFit: 'cover', height: '400px' }}
//                     />
//                 </div>

//                 {/* Right Content */}
//                 <div className="col-md-6">
//                     <h3 className="fw-bold mb-3">
//                         Smarter Parking with Innovative Technology
//                     </h3>
//                     <p>
//                         Finding the parking spot in Dallas TX has
//                         never been easier. Our platform uses
//                         advanced technology to connect you with
//                         available driveways and parking spaces
//                         near your destination. With a simple, userfriendly interface, you can quickly browse,
//                         book, and secure your parking hassle-free.
//                         Whether you need a spot for a few hours or
//                         overnight, Park In My Driveway ensures a
//                         seamless and stress-free experience.
//                     </p>
//                 </div>
//             </div>

//             <div class="container py-5">
//                 <h2 class="text-center fw-bold mb-5">How Does Park In My Driveway Work?</h2>
//                 <div class="row g-4">

//                     <div class="col-md-4">
//                         <div class="border p-4 h-100">
//                             <h5 class="fw-bold mb-3">1. List Your Driveway</h5>
//                             <p>
//                                 If you're a local, you can list
//                                 your driveway for free!
//                                 Simply sign up, provide
//                                 details about your location
//                                 and availability, and let our
//                                 system handle the rest.
//                                 Whether you're offering
//                                 overnight parking in Dallas or a spot for a major event,
//                                 you’ll have full control over
//                                 when and where your
//                                 driveway is available.

//                             </p>
//                         </div>
//                     </div>

//                     <div class="col-md-4">
//                         <div class="border p-4 h-100">
//                             <h5 class="fw-bold mb-3">2. Browse Listings and Book</h5>
//                             <p>
//                                 Visitors can easily browse
//                                 available spots near key
//                                 locations like
//                                 parking at the
//                                 Dallas Convention Center.You can even search for
//                                 parking garages in Dallas, TX  if you prefer structured
//                                 parking. Book your spot
//                                 ahead of time and enjoy
//                                 stress-free parking when
//                                 you arrive!
//                             </p>
//                         </div>
//                     </div>

//                     <div class="col-md-4">
//                         <div class="border p-4 h-100">
//                             <h5 class="fw-bold mb-3">3. Earn Extra Income</h5>
//                             <p>
//                                 Have a driveway near top
//                                 spots like the American
//                                 Airlines Center, Kay Bailey
//                                 Hutchison Convention
//                                 Center, or the State Fair of
//                                 Texas? List it on Park In My
//                                 Driveway and earn up to
//                                 $20/day while providing
//                                 much-needed parking in
//                                 Dallas TX for events and visitors.
//                             </p>
//                         </div>
//                     </div>

//                 </div>
//             </div>
//             <div className="container py-5">
//                 <div className="row g-4 align-items-center">
//                     <div className="col-md-6">
//                         <div className="border p-4 h-100">
//                             <h5 className="fw-bold mb-4">
//                                 Advantages of Parking in Dallas,
//                                 TX with Park In My Driveway
//                             </h5>

//                             <p>• Convenience<br />
//                                 Avoid long walks and crowded
//                                 garages by parking close to your
//                                 destination.</p>

//                             <p>• Affordable Rates<br />
//                                 Enjoy lower prices compared to
//                                 traditional   Dallas parking lots or
//                                 metered street parking.</p>

//                             <p>• Security<br />
//                                 Park in safe, residential areas with
//                                 less risk than public spaces.</p>

//                             <p>• Availability<br />
//                                 Easily find overnight parking in
//                                 Dallas Texas,  whether for a few
//                                 hours or an extended stay.</p>

//                             <p>• Flexible Options<br />
//                                 Need public parking in Dallas
//                                 Texas  for a day or weekend? Reserve
//                                 a spot in advance for a stress-free
//                                 experience. </p>
//                         </div>
//                     </div>

//                     <div className="col-md-6 d-flex align-items-stretch">
//                         <img src={ParkingImage2} alt="Parking Image" className="img-fluid w-100 h-100 rounded border object-cover" />
//                     </div>
//                 </div>
//             </div>
//             <div className="container py-5">
//                 <div className="row g-4 align-items-center">
//                     {/* Left Column: Logo */}
//                     <div className="col-md-4 d-flex justify-content-center">
//                         <img
//                             src={Logo}
//                             alt="Park In My Driveway Logo"
//                             className="img-fluid"
//                             style={{ width: '250px', height: '150px' }}
//                         />
//                     </div>

//                     {/* Right Column: Content */}
//                     <div className="col-md-8">
//                         <div className="border p-4 h-100 rounded shadow-sm">
//                             <h5 className="fw-bold mb-3">
//                                 Why Choose Us for Parking in Dallas?
//                             </h5>
//                             <p>
//                                 Park In My Driveway is transforming parking
//                                 at Dallas by providing a hassle-free and
//                                 secure alternative to traditional parking
//                                 options.
//                             </p>
//                             <p>
//                                 Our platform offers safe and easy
//                                 transactions, with live customer support to
//                                 assist you with Dallas overnight parking or
//                                 listing your driveway. We value community,
//                                 ensuring a reliable and convenient
//                                 experience for both visitors and local
//                                 homeowners.
//                             </p>
//                             <p>
//                                 Our service allows you to find flexible,
//                                 monthly parking in Dallas TX without the
//                                 stress of searching for a spot daily.
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className="container py-5">
//                 <h5 className="fw-bold mb-4">Frequently Asked Questions (FAQs)</h5>
//                 <div className="accordion" id="faqAccordion">
//                     {faqData.map((faq, index) => (
//                         <div className="accordion-item" key={index}>
//                             <h2 className="accordion-header">
//                                 <button
//                                     className={`accordion-button no-arrow d-flex justify-content-between align-items-center ${activeIndex === index ? "" : "collapsed"
//                                         }`}
//                                     type="button"
//                                     onClick={() => toggleFAQ(index)}
//                                 >
//                                     <span>{faq.question}</span>
//                                     <span className="ms-auto fw-bold fs-4">{activeIndex === index ? "−" : "+"}</span>
//                                 </button>
//                             </h2>
//                             <div
//                                 className={`accordion-collapse collapse ${activeIndex === index ? "show" : ""
//                                     }`}
//                             >
//                                 <div
//                                     className="accordion-body"
//                                     dangerouslySetInnerHTML={{ __html: faq.answer }}
//                                 />
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//             <div className="container py-5">
//                 <div className="border p-4 text-center">
//                     <h4 className="fw-bold mb-4">Book Your Dallas Parking Spot Today!</h4>

//                     <p>
//                         Say goodbye to the stress of finding parking in Dallas. With Park In My Driveway, you can
//                         book a convenient and affordable spot in advance, avoiding the hassle of last-minute
//                         searches.
//                     </p>

//                     <p>
//                         Whether you need monthly parking in Dallas TX for work, or a reliable option near your
//                         hotel, we’ve got you covered.
//                     </p>

//                     <p>
//                         Don’t waste time circling for a spot—reserve it now and enjoy a hassle-free experience!
//                     </p>

//                     <button className="btn px-4 mt-3 fw-bold text-uppercase"
//                         style={{
//                             border: '5px solid #ff7902',
//                             color: '#ff7902'
//                         }}>
//                         Get Started
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DallasParking;
