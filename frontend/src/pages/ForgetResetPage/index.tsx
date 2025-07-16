import React, { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { AxiosResponse } from "axios";

import AxiosClient from "../../axios/AxiosClient";
import Header from "../../components/Header";
import BreadCrumbs from "../../components/BreadCrumbs";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";

// Type definitions
interface ApiResponse {
  status: string;
  message?: string;
  data?: any;
}

interface ApiError {
  response?: {
    data: {
      message?: string;
    };
  };
}

const ForgetResetPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleForgetPassword = async (): Promise<void> => {
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    
    try {
      // Get CSRF token
      await AxiosClient.get("/sanctum/csrf-cookie");
      
      // Send forgot password request
      const response: AxiosResponse<ApiResponse> = await AxiosClient.post(
        "api/auth/forgot-password",
        { email: email.trim() }
      );

      console.log("Forget password response:", response.data);

      if (response.data.status === "error") {
        toast.error(response.data.message || "Invalid email");
      } else {
        toast.success("Please check your mail");
        navigate("/userlogin");
        setEmail("");
      }
    } catch (error) {
      console.error("Forget password error:", error);
      
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message || 
                          "An error occurred. Please try again later.";
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    handleForgetPassword();
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  return (
    <>
      <BreadCrumbs title="Forget Password" />
      <div className="loginOuter">
        <div className="row">
          <div className="offset-lg-4 col-lg-5 col-md-12">
            <div className="card mb-4">
              <div className="registerBg">
                <h4>Forget Password</h4>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-12 mb-4">
                      <label className="form-label" htmlFor="email-input">
                        Email
                      </label>
                      <div className="input-group input-group-merge">
                        <input
                          type="email"
                          required
                          id="email-input"
                          className="form-control billing-card-mask"
                          value={email}
                          onChange={handleEmailChange}
                          disabled={loading}
                          placeholder="Enter your email address"
                          aria-describedby="email-help"
                        />
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="d-grid">
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                          disabled={loading || !email.trim()}
                        >
                          {loading ? <Loader /> : "Submit"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForgetResetPage;







// import { useState } from "react";

// import AxiosClient from "../../axios/AxiosClient";
// import Header from "../../components/Header";
// import BreadCrumbs from "../../components/BreadCrumbs";
// import Footer from "../../components/Footer";
// import { toast } from "react-toastify";
// import Loader from "../../components/Loader";
// import { useNavigate } from "react-router-dom";

// const ForgetResetPage = () => {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleForgetPassword = async () => {
//     // Logic to send reset password email
//     console.log("Forget password email sent to:", email);
//     setLoading(true);
//     try {
//       await AxiosClient.get("/sanctum/csrf-cookie");
//       const response = await AxiosClient.post("api/auth/forgot-password", {
//         email,
//       });
//       console.log("response", response); // Log the response
//       if (response.status === "error") {
//         // Display error message
//         toast.error("Invalid email");
//         setLoading(false);
//       } else {
//         setLoading(false);
//         toast.success("Please check your mail");
//         navigate("/userlogin");
//         setEmail("");
//         console.log("forget password response", response.data);
//       }
//     } catch (error) {
//       setLoading(false);

//       console.log("error", error);
//       toast.error("An error occurred. Please try again later.");
//       //   throw new Error(
//       //     error.response.data.message || "Failed to send password reset link."
//       //   );
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     handleForgetPassword();
//   };

//   return (
//     <>
//       {/* <Header /> */}
//       <BreadCrumbs title="forget Password" />
//       <div className="loginOuter">
//         <div className="row">
//           {/* <div className="col-lg-4"></div> */}
//           <div className=" offset-lg-4 col-lg-5 col-md-12">
//             <div className="card mb-4">
//               <div className="registerBg">
//                 <h4 className="">Forget Password</h4>
//                 <form onSubmit={handleSubmit}>
//                   <div className="row">
//                     <div className="col-12 mb-4">
//                       <label className="form-label" htmlFor="billings-card-num">
//                         Email
//                       </label>
//                       <div className="input-group input-group-merge">
//                         <input
//                           type="email"
//                           required
//                           // placeholder="Enter your email"
//                           id="billings-card-num"
//                           className="form-control billing-card-mask"
//                           value={email}
//                           onChange={(e) => setEmail(e.target.value)}
//                         />
//                       </div>
//                     </div>

//                     <div className="col-md-12">
//                       <div className="d-grid">
//                         <button type="submit" className="btn btn-primary">
//                           {/* <span className="me-2"> */}{" "}
//                           {loading ? (
//                             <div className="loader">
//                               <Loader />
//                             </div>
//                           ) : (
//                             "Submit"
//                           )}
//                           {/* </span> */}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default ForgetResetPage;
