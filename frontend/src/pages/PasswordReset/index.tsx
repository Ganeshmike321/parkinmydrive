
import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AxiosClient from "../../axios/AxiosClient";
import Footer from "../../components/Footer";
import BreadCrumbs from "../../components/BreadCrumbs";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import OwnerAxiosClient from "../../axios/OwnerAxiosClient";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const PasswordReset: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showCnfPassword, setShowCnfPassword] = useState<boolean>(false);
  const { token } = useParams<{ token: string }>();
  const email = new URLSearchParams(window.location.search).get("email") || "";
  const navigate = useNavigate();

  const togglePasswordVisibility = (type: string): void => {
    switch (type) {
      case '1':
        setShowNewPassword(!showNewPassword);
        break;
      case '2':
        setShowCnfPassword(!showCnfPassword);
        break;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Password and confirmation password do not match.");
      return;
    }

    setLoading(true);
    try {
      await AxiosClient.get("/sanctum/csrf-cookie");
      const response = await AxiosClient.post("api/auth/password/reset", {
        email,
        token,
        password,
        password_confirmation: confirmPassword,
      });

      if (response.data.message) {
        toast.error(response.data.message);
        setLoading(false);
        setPassword("");
        setConfirmPassword("");
      }

      if (response && response.data) {
        setLoading(false);
        if (response.status === 200) {
          setPassword("");
          setConfirmPassword("");
          toast.success("Password successfully reset!");
          navigate("/userlogin");
        } else {
          toast.error("Failed to reset password. Please try again.");
        }
      }
    } catch (error: any) {
      setLoading(false);
      setPassword("");
      setConfirmPassword("");

      if (error.response && error.response.status === 400) {
        if (
          error.response.message &&
          error.response.message.includes("Invalid token provided")
        ) {
          toast.error("Invalid token provided. Please try again.");
        } else {
          toast.error("Failed to reset password. Please try again.");
        }
      }
    }
  };

  return (
    <>
      <BreadCrumbs title="Reset Password" />
      <div className="loginOuter">
        <div className="row">
          <div className="offset-lg-4 col-lg-5 col-md-12">
            <div className="card mb-4">
              <div className="registerBg">
                <h4 className="">Reset Password</h4>
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
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="col-12 mb-4">
                      <label className="form-label" htmlFor="password-input">
                        Password
                      </label>
                      <div className="input-group input-group-merge">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          name="password"
                          id="password-input"
                          className="form-control billing-card-mask"
                          value={password}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        />
                        <div className="hide-show-icon">
                          <FontAwesomeIcon
                            icon={showNewPassword ? faEyeSlash : faEye}
                            onClick={() => togglePasswordVisibility('1')}
                            className="change-password-toggle-icon"
                            style={{ cursor: 'pointer', marginLeft: '10px' }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-12 mb-4">
                      <label className="form-label" htmlFor="confirm-password-input">
                        Confirm Password
                      </label>
                      <div className="input-group input-group-merge">
                        <input
                          type={showCnfPassword ? 'text' : 'password'}
                          required
                          name="password_confirmation"
                          id="confirm-password-input"
                          className="form-control billing-card-mask"
                          value={confirmPassword}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                        />
                        <div className="hide-show-icon">
                          <FontAwesomeIcon
                            icon={showCnfPassword ? faEyeSlash : faEye}
                            onClick={() => togglePasswordVisibility('2')}
                            className="change-password-toggle-icon"
                            style={{ cursor: 'pointer', marginLeft: '10px' }}
                          />
                        </div>
                      </div>
                    </div>

                    <input type="hidden" name="token" value={token || ''} />

                    <div className="col-md-12">
                      <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                          {loading ? (
                            <div className="loader">
                              <Loader />
                            </div>
                          ) : (
                            "Submit"
                          )}
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

export default PasswordReset;











// import { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import AxiosClient from "../../axios/AxiosClient";
// import Footer from "../../components/Footer";
// import BreadCrumbs from "../../components/BreadCrumbs";
// import Header from "../../components/Header";
// import Loader from "../../components/Loader";
// import { toast } from "react-toastify";
// import OwnerAxiosClient from "../../axios/OwnerAxiosClient";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
// const PasswordReset = () => {
//   const [loading, setLoading] = useState(false);
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showCnfPassword, setShowCnfPassword] = useState(false);
//   const { token } = useParams();
//   const email = new URLSearchParams(window.location.search).get("email");
//   const navigate = useNavigate();

//   const togglePasswordVisibility = (type) => {
//     switch (type) {
//       case '1':
//         setShowNewPassword(!showNewPassword);
//         break;
//       case '2':
//         setShowCnfPassword(!showCnfPassword);
//         break
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Check if password and confirmation password match
//     if (password !== confirmPassword) {
//       toast.error("Password and confirmation password do not match.");
//       return;
//     }

//     setLoading(true);
//     try {
//       await AxiosClient.get("/sanctum/csrf-cookie");
//       const response = await AxiosClient.post("api/auth/password/reset", {
//         email,
//         token,
//         password,
//         password_confirmation: confirmPassword,
//       });
//       console.log("response", response);
//       if (response.message) {
//         toast.error(response.message);
//         setLoading(false);
//         setPassword("");
//         setConfirmPassword("");
//       }
//       if (response && response.data) {
//         setLoading(false);
//         if (response.status === 200) {
//           setPassword("");
//           setConfirmPassword("");
//           toast.success("Password successfully reset!");
//           navigate("/userlogin")

//           // navigate("/");
//         } else {
//           toast.error("Failed to reset password. Please try again.");
//         }
//         console.log("Reset password response", response.data);
//         console.log("Reset response", response);
//       }
//     } catch (error) {
//       setLoading(false);
//       setPassword("");
//       setConfirmPassword("");
//       console.log("error", error);

//       if (error.response && error.response.status === 400) {
//         // Validation error occurred

//         // Log the error response to console
//         console.log("Error response:", error.response);

//         // Check if the error message contains "Invalid token provided"
//         if (
//           error.response.message &&
//           error.response.message.includes("Invalid token provided")
//         ) {
//           toast.error("Invalid token provided. Please try again.");
//         } else {
//           toast.error("Failed to reset password. Please try again.");
//         }
//       }
//     }

//     // Handle form submission here, e.g., send a POST request to the backend
//     console.log("Form submitted:", { email, password, confirmPassword, token });
//   };

//   return (
//     <>
//       {/* <Header /> */}
//       <BreadCrumbs title="Reset Password" />
//       <div className="loginOuter">
//         <div className="row">
//           {/* <div className="col-lg-4"></div> */}
//           <div className="offset-lg-4 col-lg-5 col-md-12">
//             <div className="card mb-4">
//               <div className="registerBg">
//                 <h4 className="">Reset Password</h4>
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
//                           readOnly
//                         />
//                       </div>
//                     </div>

//                     <div className="col-12 mb-4">
//                       <label className="form-label" htmlFor="billings-card-num">
//                         Password
//                       </label>
//                       <div className="input-group input-group-merge">
//                         <input
//                           type={showNewPassword ? 'text' : 'password'}
//                           required
//                           name="password"
//                           // placeholder="Enter your email"
//                           id="billings-card-num"
//                           className="form-control billing-card-mask"
//                           value={password}
//                           onChange={(e) => setPassword(e.target.value)}
//                         />
//                         <div className="hide-show-icon">
//                           <FontAwesomeIcon
//                             icon={showNewPassword ? faEyeSlash : faEye}
//                             onClick={() => togglePasswordVisibility('1')}
//                             className="change-password-toggle-icon"
//                             style={{ cursor: 'pointer', marginLeft: '10px' }}
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     <div className="col-12 mb-4">
//                       <label className="form-label" htmlFor="billings-card-num">
//                         Confirm Password
//                       </label>
//                       <div className="input-group input-group-merge">
//                         <input
//                           type={showCnfPassword ? 'text' : 'password'}
//                           required
//                           name="password_confirmation"
//                           // placeholder="Enter your email"
//                           id="billings-card-num"
//                           className="form-control billing-card-mask"
//                           value={confirmPassword}
//                           onChange={(e) => setConfirmPassword(e.target.value)}
//                         />
//                          <div className="hide-show-icon">
//                           <FontAwesomeIcon
//                             icon={showCnfPassword ? faEyeSlash : faEye}
//                             onClick={() => togglePasswordVisibility('2')}
//                             className="change-password-toggle-icon"
//                             style={{ cursor: 'pointer', marginLeft: '10px' }}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                     <input type="hidden" name="token" value={token} />

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
//       {/* 
//       <form className="form-container" onSubmit={handleSubmit}>
//         <h2>Forgot Password?</h2>

//         <input
//           type="email"
//           name="email"
//           placeholder="Enter email"
//           value={email}
//           readOnly
//           //   onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Enter new password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <input
//           type="password"
//           name="password_confirmation"
//           placeholder="Confirm new password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//         />

//         <button type="submit">Submit</button>
//       </form> */}
//     </>
//   );
// };

// export default PasswordReset;
