import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ReCAPTCHA from "react-google-recaptcha";
import ParkingImage from '../../../assets/images/parking-image.jpg';
import ParkingImage1 from '../../../assets/images/about.jpg';
import ParkingImage2 from '../../../assets/images/Mask group.jpg';
import Logo from '../../../assets/images/logopmid.png';
import AxiosClient from "../../../axios/AxiosClient";

// Types and Interfaces
interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface ContactFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting?: boolean;
}

interface CustomAlertOptions {
  message: string;
  type?: 'success' | 'error' | 'warning';
  duration?: number;
}

// Constants
const FAQ_DATA: FAQItem[] = [
  {
    question: "1. How do I list my driveway for parking in Austin, Texas?",
    answer: "You can list your driveway by signing up on our website. Once registered, you can specify the dates and times when your driveway is available, along with any specific instructions.",
  },
  {
    question: "2. Can I rent out my driveway for overnight parking in Austin?",
    answer: "Yes! If you have a driveway available for overnight parking in Austin, you can list it on our platform. Just make sure to specify the time frames and availability.",
  },
  {
    question: "3. How do I book a parking spot in Austin?",
    answer: "Simply browse the available listings on our website, select your desired spot, and book it in advance. Once your booking is confirmed, you'll receive instructions on how to park.",
  },
  {
    question: "4. Is Park In My Driveway secure for both visitors and driveway owners?",
    answer: "Yes, we ensure that all transactions are safe and secure. Additionally, we provide live customer support to assist with any issues or concerns you may have while booking or listing parking.",
  },
  {
    question: "5. Are there options for Austin city parking?",
    answer: "Yes, you can find public parking in Austin TX, but they may not always be conveniently located near your destination. Park In My Driveway offers private driveway rentals as a much more efficient alternative.",
  },
  {
    question: "6. How much can I earn by renting out my driveway in Austin?",
    answer: "You can earn up to $20/day by renting out your driveway, depending on the location and demand. Parking spots near popular event venues like the Austin Convention Center or Zilker Park can bring in higher earnings.",
  },
  {
    question: "7. How can I contact customer support for issues related to Austin parking?",
    answer: 'If you encounter any issues, you can contact our customer support team via email at <a href="mailto:parkinmydriveway@gmail.com">parkinmydriveway@gmail.com</a> or call us at <a href="tel:+15128530282">+(512) 853 0282</a>.',
  },
];

const RECAPTCHA_SITE_KEY = "6Lfp2zArAAAAALXDmrXSE-byWenyL_nB0ckMxc9A";

const INITIAL_FORM_DATA: FormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

// Utility Functions
const showCustomAlert = ({ message, type = 'success', duration = 3000 }: CustomAlertOptions): void => {
  const alertBox = document.createElement("div");
  alertBox.className = `custom-alert custom-alert--${type}`;
  alertBox.innerText = message;
  document.body.appendChild(alertBox);

  setTimeout(() => alertBox.classList.add("show"), 100);
  setTimeout(() => {
    alertBox.classList.remove("show");
    setTimeout(() => {
      if (document.body.contains(alertBox)) {
        document.body.removeChild(alertBox);
      }
    }, 400);
  }, duration);
};

const validateInput = (name: string, value: string): boolean => {
  switch (name) {
    case "name":
      return !/[^a-zA-Z\s]/.test(value);
    case "phone":
      return !/[^0-9]/.test(value);
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value === "";
    default:
      return true;
  }
};

// Sub-components
const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (!validateInput(name, value)) return;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  const handleCaptchaChange = useCallback((token: string | null) => {
    setRecaptchaToken(token);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const { name, email, phone, subject, message } = formData;
    
    // Validation
    const newErrors: Partial<FormData> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!phone.trim()) newErrors.phone = "Phone is required";
    if (!subject.trim()) newErrors.subject = "Subject is required";
    if (!message.trim()) newErrors.message = "Message is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Swal.fire("Please fill out all fields", "", "warning");
      return;
    }
    
    if (!recaptchaToken) {
      Swal.fire("Please complete the reCAPTCHA", "", "warning");
      return;
    }
    
    try {
      await onSubmit(formData);
      setFormData(INITIAL_FORM_DATA);
      setRecaptchaToken(null);
      setErrors({});
    } catch (error) {
      console.error("Form submission error:", error);
    }
  }, [formData, recaptchaToken, onSubmit]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2 position-relative">
        <input
          type="text"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          name="name"
          placeholder="Name *"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
      </div>
      
      <div className="mb-2">
        <input
          type="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          name="email"
          placeholder="Email ID *"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>
      
      <div className="mb-2">
        <input
          type="tel"
          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
          name="phone"
          placeholder="Phone Number *"
          value={formData.phone}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
      </div>
      
      <div className="mb-2">
        <input
          type="text"
          className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
          name="subject"
          placeholder="Subject *"
          value={formData.subject}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
        {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
      </div>
      
      <div className="mb-3">
        <textarea
          className={`form-control ${errors.message ? 'is-invalid' : ''}`}
          name="message"
          rows={3}
          placeholder="Type Your Message Here *"
          value={formData.message}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
        {errors.message && <div className="invalid-feedback">{errors.message}</div>}
      </div>
      
      <ReCAPTCHA
        sitekey={RECAPTCHA_SITE_KEY}
        onChange={handleCaptchaChange}
        className="mb-3"
      />
      
      <button 
        type="submit" 
        className="btn custom-btn px-4"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'SENDING...' : 'SEND'}
      </button>
    </form>
  );
};

const FAQSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = useCallback((index: number) => {
    setActiveIndex(prevIndex => prevIndex === index ? null : index);
  }, []);

  return (
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
                aria-expanded={activeIndex === index}
                aria-controls={`collapse-${index}`}
              >
                <span>{faq.question}</span>
                <span className="ms-auto fw-bold fs-4">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </button>
            </h2>
            <div
              id={`collapse-${index}`}
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
};

const ImageWithFallback: React.FC<{
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ src, alt, className, style }) => {
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  if (hasError) {
    return (
      <div 
        className={`d-flex align-items-center justify-content-center bg-light ${className}`}
        style={style}
      >
        <span className="text-muted">Image not available</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      loading="lazy"
    />
  );
};

// Main Component
const AustinParking: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = useCallback(async (formData: FormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await AxiosClient.post("/api/contact", {
        ...formData,
        page: "austin"
      });

      if (response.status === 201) {
        showCustomAlert({ message: "Submitted successfully!" });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      Swal.fire("Error", errorMessage, "error");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleNavigation = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  return (
    <div className="container py-5 px-3 px-md-5">
      {/* Hero Section */}
      <div className="row mb-5">
        <div className="col-md-6 mb-4">
          <h3>Discover Convenient Austin Parking with Park In My Driveway</h3>
          <p>
            Finding Austin parking can be a hassle, especially during major events
            like concerts, festivals, and sports games...
          </p>
          <p>
            Whether you're heading downtown or to a local venue, we offer a seamless, 
            tech-driven solution for driveway rentals.
          </p>
          <div className="d-flex gap-2 flex-wrap">
            <button 
              className="btn custom-btn"
              onClick={() => handleNavigation("/list-your-driveway")}
            >
              LIST YOUR DRIVEWAY
            </button>
            <button 
              className="btn custom-btn"
              onClick={() => handleNavigation("/find-economy-parking")}
            >
              FIND A SPOT TO PARK
            </button>
          </div>
        </div>

        <div className="col-md-6">
          <h5 className="fw-bold">Contact With Us</h5>
          <p>If you have any questions, please feel free to contact us.</p>
          <ContactForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="row align-items-center border p-3">
        <div className="col-md-6 mb-3 mb-md-0">
          <ImageWithFallback
            src={ParkingImage}
            alt="Austin Parking Lot"
            className="img-fluid w-100"
            style={{ objectFit: 'cover', height: '400px' }}
          />
        </div>
        <div className="col-md-6">
          <h4 className="fw-bold mb-3">
            Simplify Parking in Austin: Skip the Hassle with Park In My Driveway
          </h4>
          <p>
            Parking at Austin can be difficult to navigate, especially when you're
            attending events in popular areas such as downtown Austin, near Zilker Park, 
            or at the Austin Convention Center.
          </p>
          <p>
            Traditional Austin city parking options often leave you driving in circles,
            searching for available spaces, and paying expensive parking fees. 
            Fortunately, Park In My Driveway makes finding parking in Austin, Texas a breeze.
          </p>
          <p>
            Renting out private driveways in residential areas allows you to bypass 
            crowded parking lots and garages, ensuring an easy, convenient parking 
            experience that saves you both time and money.
          </p>
        </div>
      </div>

      {/* Innovative Technology Section */}
      <div className="row align-items-center border mt-5 p-3">
        <div className="col-md-6">
          <h4 className="fw-bold">
            Innovative Technology for<br />Seamless Parking
          </h4>
          <p>
            Our platform uses innovative technology that lets you browse Austin parking 
            lots and driveway listings with ease. The user-friendly interface ensures 
            you can quickly find the perfect parking spot near your destination.
            Whether you're looking for overnight parking in Austin or just a place to 
            park for the day, Park In My Driveway has got you covered.
          </p>
        </div>
        <div className="col-md-6 mb-3 mb-md-0">
          <ImageWithFallback
            src={ParkingImage1}
            alt="Innovative Parking"
            className="img-fluid w-100"
            style={{ objectFit: 'cover', height: '300px' }}
          />
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
                If you're a local, you can list your driveway for free!
                Simply sign up, provide information about your location and availability,
                and let our system take care of the rest. Whether you're offering
                overnight parking in Austin or a spot for an afternoon concert,
                you'll have control over when and where your driveway is available.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="border p-4 h-100">
              <h5 className="fw-bold mb-3">2. Browse Listings and Book</h5>
              <p>
                Visitors can easily browse available spots near key locations like the
                parking spot in Austin TX or around Austin city parking areas. You can 
                even search for parking garage Austin TX spaces if you prefer structured 
                parking. Book your spot ahead of time and enjoy guaranteed parking when 
                you arrive!
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="border p-4 h-100">
              <h5 className="fw-bold mb-3">3. Earn Extra Income</h5>
              <p>
                Have a driveway near popular destinations like the Austin Convention 
                Center or Zilker Park? Rent it out through Park In My Driveway and earn 
                up to $20/day. It's a simple way to make extra money while providing 
                visitors with much-needed parking in Austin, Texas whether for special 
                events, overnight stays, or a quick stop.
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
                Advantages of Parking at Austin, TX with Park In My Driveway
              </h5>
              <p>• <strong>Convenience</strong><br />
                Skip the long walks and crowded buses by parking close to your event.</p>
              <p>• <strong>Affordable Rates</strong><br />
                Enjoy affordable Austin parking rates, especially compared to traditional 
                garages or street parking in Austin.</p>
              <p>• <strong>Security</strong><br />
                Your car will be parked in a safe, residential area with fewer risks than 
                public parking spaces.</p>
              <p>• <strong>Availability</strong><br />
                You can easily find overnight parking in Austin TX or day-use parking 
                near events.</p>
              <p>
                Whether you need public parking in Austin TX for the afternoon or
                overnight parking in Austin for the weekend, we have you covered.
              </p>
              <p>Take advantage of available options to ensure a stress-free visit.</p>
            </div>
          </div>
          <div className="col-md-6 d-flex align-items-stretch">
            <ImageWithFallback
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
            <ImageWithFallback
              src={Logo}
              alt="Park In My Driveway Logo"
              className="img-fluid"
              style={{ width: '250px', height: '150px' }}
            />
          </div>
          <div className="col-md-8">
            <div className="border p-4 h-100 rounded shadow-sm">
              <h5 className="fw-bold mb-3">Why Choose Us for Parking at Austin?</h5>
              <p>
                Park In My Driveway is driven by innovation and designed to simplify 
                parking. Our platform focuses on safe and secure transactions, supported 
                by live customer support to assist with any questions you may have about 
                parking in Austin or listing your driveway.
              </p>
              <p>We value the community and ensure a high-quality experience for both owners and visitors.</p>
              <p>
                We are a small, growing company, working to validate the idea of making 
                parking more accessible and efficient. Your support means a lot to us, 
                and we promise not to compromise on safety or security. Let us help you 
                enjoy a better parking experience in Austin, Texas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection />

      {/* Call to Action Section */}
      <div className="container py-5">
        <div className="border p-4 text-center">
          <h6 className="fw-bold mb-4">Explore Parking Options in Austin</h6>
          <p>
            Finding parking at the Austin Convention Center or the parking spot in 
            Austin West can be time-consuming and expensive. But with Park In My 
            Driveway, you can find an affordable and convenient parking spot near 
            your destination, whether it's for a few hours or overnight.
          </p>
          <p>
            If you're planning to attend an event or visit downtown, consider renting 
            a parking spot from local homeowners who are offering parking in Austin, 
            Texas. It's a great way to ensure you have a hassle-free experience while 
            saving money.
          </p>
          <p>
            We are committed to making parking in Austin easy and accessible for 
            everyone. Rent out your driveway and start earning today or find the 
            perfect spot for your visit!
          </p>
          <button 
            className="btn px-4 mt-3 fw-bold text-uppercase"
            style={{
              border: '5px solid #ff7902',
              color: '#ff7902'
            }}
            onClick={() => handleNavigation("/get-started")}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default AustinParking;