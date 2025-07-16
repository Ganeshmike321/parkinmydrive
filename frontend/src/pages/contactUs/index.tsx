import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../../components/Footer";
//import Loader from "../../components/Loader";
import OwnerAxiosClient from "../../axios/OwnerAxiosClient";
import { useDocumentTitle } from "../../utils/useDocumentTitle";

// Types
interface FormData {
  name: string;
  email: string;
  subject: string;
  ymessage: string;
  phone: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  ymessage?: string;
  phone?: string;
}

interface ApiResponse {
  data: any;
  statusText: string;
  message: string;
  error: string | null;
  status: number;
}

// Constants
const INITIAL_FORM_DATA: FormData = {
  name: "",
  email: "",
  subject: "",
  ymessage: "",
  phone: "",
};

const VALIDATION_PATTERNS = {
  email: /\S+@\S+\.\S+/,
  phone: /^\d{10}$/,
} as const;

const ContactUs: React.FC = () => {
  useDocumentTitle('Rent out your driveway to people who want to park for Concerts & Games');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // State
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Form validation
  const validateForm = useCallback((data: FormData): FormErrors => {
    const validationErrors: FormErrors = {};

    if (!data.name.trim()) {
      validationErrors.name = "Name is required";
    }

    if (!data.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!VALIDATION_PATTERNS.email.test(data.email)) {
      validationErrors.email = "Email address is invalid";
    }

    if (!data.phone.trim()) {
      validationErrors.phone = "Phone number is required";
    } else if (!VALIDATION_PATTERNS.phone.test(data.phone)) {
      validationErrors.phone = "Phone number must be 10 digits";
    }

    if (!data.ymessage.trim()) {
      validationErrors.ymessage = "Message is required";
    }

    if (!data.subject.trim()) {
      validationErrors.subject = "Subject is required";
    }

    return validationErrors;
  }, []);

  // Handle input changes
  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  }, [errors]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      
      // Get CSRF token
      await OwnerAxiosClient.get("/sanctum/csrf-cookie");
      
      // Submit form
      const response = await OwnerAxiosClient.post<ApiResponse>("/api/contact", formData);
      const { error: apiError, status } = response.data;

      if (apiError) {
        setError(apiError);
        return;
      }

      if (status === 201) {
        toast.success("Thanks for the enquiry, We will contact you shortly!");
        setFormData(INITIAL_FORM_DATA);
        setErrors({});
      } else {
        localStorage.clear();
        setError(response.data.message || "Something went wrong");
      }
    } catch (error) {
      localStorage.clear();
      console.error("Contact form error:", error);
      setError("Internal server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm]);

  // Form field component for reusability
  const FormField: React.FC<{
    label: string;
    name: keyof FormData;
    type?: string;
    placeholder: string;
    required?: boolean;
    as?: 'input' | 'textarea';
  }> = ({ label, name, type = "text", placeholder, required = false, as = 'input' }) => {
    const InputComponent = as === 'textarea' ? 'textarea' : 'input';
    
    return (
      <div className="row mb-2">
        <label
          htmlFor={name}
          className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label"
        >
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
        <div className="col-lg-7 col-sm-7 col-md-12">
          <InputComponent
            id={name}
            type={as === 'input' ? type : undefined}
            className={as === 'textarea' ? undefined : "form-control"}
            placeholder={placeholder}
            value={formData[name]}
            name={name}
            onChange={handleInputChange}
          />
          {errors[name] && (
            <div className="text-danger small">{errors[name]}</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="graybg">
        <div className="container">
          <div className="row">
            <div className="col">
              <h2>Contact Us</h2>
            </div>
          </div>
        </div>
      </div>

      <section className="contact-us section">
        <div className="container">
          <div className="inner">
            <div className="row">
              <div className="col-lg-6">
                <div className="contact-us-form">
                  <h2>Contact With Us</h2>
                  <p>If you have any questions please feel free to contact us.</p>
                  
                  <form onSubmit={handleSubmit} className="form" noValidate>
                    <div className="row">
                      <div className="">
                        <FormField
                          label="Name"
                          name="name"
                          placeholder="Name"
                          required
                        />
                        
                        <FormField
                          label="Email Id"
                          name="email"
                          type="email"
                          placeholder="Email id"
                          required
                        />
                        
                        <FormField
                          label="Phone"
                          name="phone"
                          placeholder="Phone number"
                          required
                        />
                        
                        <FormField
                          label="Subject"
                          name="subject"
                          placeholder="Subject"
                          required
                        />
                        
                        <FormField
                          label="Your message"
                          name="ymessage"
                          placeholder="Type your message here"
                          as="textarea"
                          required
                        />

                        {error && <div className="text-danger small">{error}</div>}

                        <div className="row mb-2">
                          <div className="col-lg-12">
                            <button
                              className="btn btn-primary btn-lg btn-block"
                              type="submit"
                              disabled={loading}
                            >
                              {loading ? "Loading..." : "Send"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              
              <div className="col-lg-6">
                <div className="contact-us-left">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3440.437220408575!2d-97.75994902463964!3d30.423705274734772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644ccef52188d87%3A0x480b38ca2e37bf77!2s11900%20Jollyville%20Rd%2C%20Austin%2C%20TX%2078759%2C%20USA!5e0!3m2!1sen!2sin!4v1727260966550!5m2!1sen!2sin"
                    width="100%"
                    height="550"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Office Location"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="contact-info">
            <div className="row">
              <div className="col-lg-4 col-12">
                <div className="single-info">
                  <i className="fa fa-phone" />
                  <div className="content">
                    <h3>+(512) 853 0282</h3>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-4 col-12">
                <div className="single-info">
                  <i className="fa fa-map" />
                  <div className="content">
                    <h3>11900 Jollyville Rd</h3>
                    <p>Austin, TX 78759</p>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-4 col-12">
                <div className="single-info">
                  <i className="fa fa-clock-o" />
                  <div className="content">
                    <h3>24/7</h3>
                    <p>Opening</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <div className="rentOuter">
        <h3>Rent Out Your Driveways &amp; Parking Space</h3>
        <div className="get-started">
          <a href="/find-economy-parking" className="btn btn-primary">
            Get Started
          </a>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default ContactUs;




// import { useState } from "react";
// import Footer from "../../components/Footer";
// import { toast } from "react-toastify";
// import Loader from "../../components/Loader";
// import { useDispatch } from "react-redux";
// import OwnerAxiosClient from "../../axios/OwnerAxiosClient";
// import { useNavigate } from "react-router-dom";
// // import { useHistory, useNavigate } from "react-router-dom";
// import { useDocumentTitle } from "../../utils/useDocumentTitle";

// const ContactUs = () => {
//     useDocumentTitle('Rent out your driveway to people who want to park for Concerts & Games');
// //const ContactUs = ({ onDataChange }) => {
//     // const sendDataToParent = (val) => {
//     // onDataChange(val);
//     // };
//   // const params = id;
//   // console.log("param id", id);
//   const navigate = useNavigate();
//   // const history = useHistory(); // Initialize useHistory
//   // const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     ymessage: "",
//     phone: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [error, setError] = useState("");

//   const [loading, setLoading] = useState(false);

//   const handleRegister = async (e) => {

//     // await ownerHandleSubmit(e);
//     await loginSubmit(e);
//   }

//   const loginSubmit = async (e) => {
//     setError(null);
//     e.preventDefault();
//     const validationErrors = validateForm(formData);
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }
//     try {
//       setLoading(true); // Set loading state to true when API call sta
//     //  sendDataToParent(true);
//       await OwnerAxiosClient.get("/sanctum/csrf-cookie");
//       const { name, email, subject, ymessage, phone } =
//         formData;
//       const { data, statusText, message, error, status } =
//         await OwnerAxiosClient.post("/api/contact", {
//           name,
//           email,
//           subject,
//           ymessage,
//           phone,
//         });
//       console.log("error response", error);
//       if (error) {
//        // sendDataToParent(false);
//         setError(error);
//         setLoading(false);
//         return;
//       }
//       if (status === 201) {
//         setLoading(false);
//         toast.success("Thanks for the enquiry, We will contact you shortly!");
//         setFormData({
//           name: "",
//           email: "",
//           ymessage: "",
//           subject: "",
//           phone: "",
//         });
//       }
//       if (status !== 201) {
//         //sendDataToParent(false);
//         console.log("message", message);
//         localStorage.clear();
//         setError(message);
//       }
//     } catch (error) {
//      // sendDataToParent(false);
//       localStorage.clear();
//       console.log("Error:", error);
//       setError("Internal server error. Please try again later.");
//     } finally {

//     }
//   };


//   const handleInput = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//     setErrors({
//       ...errors,
//       [e.target.name]: "",
//     });
//   };

//   const validateForm = (formData) => {
//     let errors = {};
//     if (!formData.name) {
//       errors.name = "Name is required";
//     }
//     if (!formData.email) {
//       errors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       errors.email = "Email address is invalid";
//     }
//     if (!formData.phone) {
//       errors.phone = "phone number is required";
//     } else if (!/^\d{10}$/.test(formData.phone)) {
//       errors.phone = "phone number must be 10 digits";
//     }
//     if (!formData.ymessage) {
//       errors.ymessage = "Message is required";
//     }
//     if (!formData.subject) {
//       errors.subject = "Subject is required";
//     }
//     return errors;
//   };

//   return (
//     <>
//         <div className="graybg">
//             <div className="container">
//                 <div className="row">
//                 <div className="col">
//                     <h2>Contact Us</h2>
//                 </div>
//                 </div>
//             </div>
//         </div>

//             <section className="contact-us section">
//                 <div className="container">
//                     <div className="inner">
//                         <div className="row">
//                             <div className="col-lg-6">
//                                 <div className="contact-us-form">
//                                     <h2>Contact With Us</h2>
//                                     <p>If you have any questions please fell free to contact with us.</p>
//                                     <form onSubmit={handleRegister} className="form">
//                                         <div className="row">
//                                             <div className="">
//                                             <div className="row mb-2">
//                                                 <label
//                                                 htmlFor="inputEmail3"
//                                                 className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label"
//                                                 >
//                                                 Name<span className="text-danger">*</span>
//                                                 </label>
//                                                 <div className="col-lg-7 col-lg-7 col-sm-7 col-md-12">
//                                                 <input
//                                                     type="text"
//                                                     className="form-control"
//                                                     placeholder="Name"
//                                                     value={formData.name}
//                                                     name="name"
//                                                     // pattern="[A-Za-z]+"
//                                                     onChange={handleInput}
//                                                 />
//                                                 {errors.name && (
//                                                     <div className="text-danger small">{errors.name}</div>
//                                                 )}
//                                                 </div>
//                                             </div>

//                                             <div className="row mb-2">
//                                                 <label
//                                                 htmlFor="inputEmail3"
//                                                 className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label"
//                                                 >
//                                                 Email Id<span className="text-danger">*</span>
//                                                 </label>
//                                                 <div className="col-lg-7 col-lg-7 col-sm-7 col-md-12">
//                                                 <input
//                                                     type="email"
//                                                     className="form-control"
//                                                     placeholder="Email id"
//                                                     value={formData.email}
//                                                     name="email"
//                                                     onChange={handleInput}
//                                                 />
//                                                 {errors.email && (
//                                                     <div className="text-danger small">{errors.email}</div>
//                                                 )}
//                                                 </div>
//                                             </div>

//                                             <div className="row mb-2">
//                                                 <label
//                                                 htmlFor="inputEmail3"
//                                                 className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label"
//                                                 >
//                                                 Phone<span className="text-danger">*</span>
//                                                 </label>
//                                                 <div className="col-lg-7 col-lg-7 col-sm-7 col-md-12">
//                                                 <input
//                                                     type="text"
//                                                     className="form-control"
//                                                     placeholder="Phone number"
//                                                     value={formData.phone}
//                                                     name="phone"
//                                                     onChange={handleInput}
//                                                 />
//                                                 {errors.phone && (
//                                                     <div className="text-danger small">{errors.phone}</div>
//                                                 )}
//                                                 </div>
//                                             </div>

//                                             <div className="row mb-2">
//                                                 <label htmlFor="inputEmail3"  className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label" >
//                                                 Subject
//                                                 <span className="text-danger">*</span>
//                                                 </label>
//                                                 <div className="col-lg-7 col-lg-7 col-sm-7 col-md-12">
//                                                 <input
//                                                     type="text"
//                                                     className="form-control"
//                                                     placeholder="Subject"
//                                                     value={formData.subject}
//                                                     name="subject"
//                                                     onChange={handleInput}
//                                                 />
//                                                 {errors.subject && (
//                                                     <div className="text-danger small">
//                                                     {errors.subject}
//                                                     </div>
//                                                 )}
//                                                 </div>
//                                             </div>

//                                             <div className="row mb-2">
//                                                 <label
//                                                 htmlFor="inputEmail3"
//                                                 className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label"
//                                                 >
//                                                 Your message
//                                                 <span className="text-danger">*</span>
//                                                 </label>
//                                                 <div className="col-lg-7 col-lg-7 col-sm-7 col-md-12">
//                                                     <div className="col-lg-12">
//                                                         <div className="form-group">
//                                                             <textarea
//                                                             // className="form-control"
//                                                             placeholder="Type your message here"
//                                                             value={formData.ymessage}
//                                                             name="ymessage"
//                                                             onChange={handleInput}
//                                                             ></textarea>
//                                                         </div>
//                                                     </div>
//                                                     {errors.ymessage && (
//                                                         <div className="text-danger small">
//                                                         {errors.ymessage}
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                             {error && <div className="text-danger small">{error}</div>}

//                                             <div className="row mb-2">
//                                                 <div className="col-lg-12 col-lg-12 col-sm-12 col-md-12 ">
//                                                 <button
//                                                     className="btn btn-primary btn-lg btn-block"
//                                                     type="submit"
//                                                 >
//                                                     {/* Loader */}
//                                                     {loading ? (
//                                                         "loading..."
//                                                     ) : (
//                                                     "Send"
//                                                     )}
//                                                 </button>
//                                                 {/* <p>
//                                                         Already Registered,
//                                                         <NavLink to="/login">Login Here?</NavLink>
//                                                         </p> */}
//                                                 </div>
//                                             </div>
//                                             </div>
//                                         </div>
//                                     </form>
//                                 </div>
// 						    </div>
//                 <div className="col-lg-6">
//                                 <div className="contact-us-left">
//                                     <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3440.437220408575!2d-97.75994902463964!3d30.423705274734772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644ccef52188d87%3A0x480b38ca2e37bf77!2s11900%20Jollyville%20Rd%2C%20Austin%2C%20TX%2078759%2C%20USA!5e0!3m2!1sen!2sin!4v1727260966550!5m2!1sen!2sin" width="100%" height="550" style={{border:"0"}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
//                                  </div>
//                             </div>
// 					    </div>
// 				    </div>
//                     <div className="contact-info">
//                         <div className="row">
//                             {/* <!-- single-info --> */}
//                             <div className="col-lg-4 col-12 ">
//                                 <div className="single-info">
//                                     <i className="fa fa-phone"></i>
//                                     <div className="content">
//                                         <h3>+(512) 853 0282</h3>

//                                     </div>
//                                 </div>
//                             </div>
//                             {/* <!--/End single-info -->
//                             <!-- single-info --> */}
//                             <div className="col-lg-4 col-12 ">
//                                 <div className="single-info">
//                                     <i className="fa fa-map"></i>
//                                     <div className="content">
//                                         <h3>11900 Jollyville Rd</h3>
//                                         <p>Austin, TX 78759</p>
//                                     </div>
//                                 </div>
//                             </div>
//                             {/* <!--/End single-info -->
//                             <!-- single-info --> */}
//                             <div className="col-lg-4 col-12 ">
//                                 <div className="single-info">
//                                     <i className="fa fa-clock-o"></i>
//                                     <div className="content">
//                                         <h3>24/7 </h3>
//                                         <p>Opening</p>
//                                     </div>
//                                 </div>
//                             </div>
//                             {/* <!--/End single-info --> */}
//                         </div>
//                     </div>
// 			    </div>
// 		    </section>
//         <div className="rentOuter">
//             <h3>Rent Out Your Driveways &amp; Parking Space</h3>
//             <div className="get-started">
//                 <a href="/find-economy-parking" className="btn btn-primary">Get Started</a>
//             </div>
//         </div>
//         <Footer />
//     </>
//   );
// };

// export default ContactUs;

