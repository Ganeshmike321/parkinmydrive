import React, { useState, useCallback } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import AxiosClient from '../../axios/AxiosClient';
import Footer from '../../components/Footer';
import BreadCrumbs from '../../components/BreadCrumbs';
import Loader from '../../components/Loader';

// Types
interface PasswordFormData {
  password: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface PasswordVisibility {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

interface UserState {
  value: {
    email: string;
    [key: string]: any;
  };
}

interface RootState {
  user: UserState;
}

interface ChangePasswordResponse {
  message?: string;
  data?: any;
  status?: number;
}

interface ErrorResponse {
  response?: {
    status: number;
    message?: string;
  };
}

// Constants
const PASSWORD_FIELD_TYPES = {
  CURRENT: 'current',
  NEW: 'new',
  CONFIRM: 'confirm',
} as const;

const API_ENDPOINTS = {
  CHANGE_PASSWORD: 'api/auth/change-password',
} as const;

const ERROR_MESSAGES = {
  PASSWORD_MISMATCH: 'New password and confirmation new password does not match.',
  SAME_PASSWORD: 'Password has been already used.',
  INVALID_TOKEN: 'Invalid token provided. Please try again.',
  GENERIC_ERROR: 'Failed to reset password. Please try again.',
  SUCCESS: 'Password successfully updated!',
} as const;

const ChangePassword: React.FC = () => {
  // State management
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<PasswordFormData>({
    password: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordVisibility, setPasswordVisibility] = useState<PasswordVisibility>({
    current: false,
    new: false,
    confirm: false,
  });

  // Hooks
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  
  // Redux selector with proper typing
  const email = useSelector((state: RootState) => state.user.value.email);

  // Validation functions
  const validatePasswords = useCallback((): boolean => {
    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error(ERROR_MESSAGES.PASSWORD_MISMATCH);
      return false;
    }

    if (formData.password === formData.newPassword) {
      toast.error(ERROR_MESSAGES.SAME_PASSWORD);
      return false;
    }

    return true;
  }, [formData]);

  // Form handlers
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const togglePasswordVisibility = useCallback((type: keyof PasswordVisibility) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      password: '',
      newPassword: '',
      confirmNewPassword: '',
    });
  }, []);

  const handleApiResponse = useCallback((response: ChangePasswordResponse) => {
    setLoading(false);
    
    if (response.message) {
      toast.error(response.message);
      resetForm();
      return;
    }

    if (response.data && response.status === 200) {
      resetForm();
      toast.success(ERROR_MESSAGES.SUCCESS);
    } else {
      toast.error(ERROR_MESSAGES.GENERIC_ERROR);
    }
  }, [resetForm]);

  const handleApiError = useCallback((error: ErrorResponse) => {
    setLoading(false);
    resetForm();
    
    console.error('Change password error:', error);

    if (error.response?.status === 400) {
      const errorMessage = error.response.message?.includes('Invalid token provided')
        ? ERROR_MESSAGES.INVALID_TOKEN
        : ERROR_MESSAGES.GENERIC_ERROR;
      toast.error(errorMessage);
    } else {
      toast.error(ERROR_MESSAGES.GENERIC_ERROR);
    }
  }, [resetForm]);

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePasswords()) {
      return;
    }

    setLoading(true);

    try {
      const response: ChangePasswordResponse = await AxiosClient.post(
        API_ENDPOINTS.CHANGE_PASSWORD,
        {
          email,
          password: formData.password,
          newPassword: formData.newPassword,
          password_confirmation: formData.confirmNewPassword,
        }
      );

      handleApiResponse(response);
    } catch (error) {
      handleApiError(error as ErrorResponse);
    }
  }, [formData, email, validatePasswords, handleApiResponse, handleApiError]);

  // Render password input field
  const renderPasswordField = (
    label: string,
    name: keyof PasswordFormData,
    value: string,
    visibilityKey: keyof PasswordVisibility,
    placeholder?: string
  ) => (
    <div className="col-12 mb-4">
      <label className="form-label" htmlFor={name}>
        {label}
      </label>
      <div className="input-group input-group-merge">
        <input
          type={passwordVisibility[visibilityKey] ? 'text' : 'password'}
          required
          name={name}
          id={name}
          className="form-control billing-card-mask"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          autoComplete="off"
        />
        <div className="hide-show-icon">
          <FontAwesomeIcon
            icon={passwordVisibility[visibilityKey] ? faEyeSlash : faEye}
            onClick={() => togglePasswordVisibility(visibilityKey)}
            className="change-password-toggle-icon"
            style={{ cursor: 'pointer', marginLeft: '10px' }}
            aria-label={`${passwordVisibility[visibilityKey] ? 'Hide' : 'Show'} ${label.toLowerCase()}`}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <BreadCrumbs title="Change Password" />
      <div className="loginOuter">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-12">
              <div className="card mb-4">
                <div className="registerBg">
                  <form className="change-pass-form" onSubmit={handleSubmit}>
                    <div className="row">
                      {renderPasswordField(
                        'Old Password',
                        'password',
                        formData.password,
                        'current'
                      )}
                      
                      {renderPasswordField(
                        'New Password',
                        'newPassword',
                        formData.newPassword,
                        'new'
                      )}
                      
                      {renderPasswordField(
                        'Confirm Password',
                        'confirmNewPassword',
                        formData.confirmNewPassword,
                        'confirm'
                      )}

                      <input type="hidden" name="token" value={token || ''} />

                      <div className="col-md-3">
                        <div className="d-grid">
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                          >
                            {loading ? (
                              <div className="loader">
                                <Loader />
                              </div>
                            ) : (
                              'Update'
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
      </div>
      <Footer />
    </>
  );
};

export default ChangePassword;







// import { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import AxiosClient from "../../axios/AxiosClient";
// import Footer from "../../components/Footer";
// import BreadCrumbs from "../../components/BreadCrumbs";
// import Header from "../../components/Header";
// import Loader from "../../components/Loader";
// import { toast } from "react-toastify";
// import { useSelector } from "react-redux";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
// const ChangePassword = () => {
//   const [loading, setLoading] = useState(false);
//   const [password, setPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmNewPassword, setConfirmNewPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showCnfPassword, setShowCnfPassword] = useState(false);

//   const togglePasswordVisibility = (type) => {
//     switch (type) {
//       case '1':
//         setShowPassword(!showPassword);
//         break;
//       case '2':
//         setShowNewPassword(!showNewPassword);
//         break;
//       case '3':
//         setShowCnfPassword(!showCnfPassword);
//         break
//     }
//   };

//   // const togglePasswordVisibility = () => {
//   //   setShowPassword(!showPassword);
//   // }

//   const { token } = useParams();
//   let email = '';
//   const navigate = useNavigate();

//   const userRedux = useSelector((state) => {
//     email = state.user.value.email;
//     return state.user.value;
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Check if password and confirmation password match
//     if (newPassword !== confirmNewPassword) {
//       toast.error("New password and confirmation new password does not match.");
//       return;
//     }

//     if (password === newPassword) {
//       toast.error("Password has been already used.");
//       return;
//     }

//     setLoading(true);
//     try {
//       // await AxiosClient.get("/sanctum/csrf-cookie");
//       const response = await AxiosClient.post("api/auth/change-password", {
//         email: email,
//         password: password,
//         newPassword: newPassword,
//         password_confirmation: confirmNewPassword,
//       });
//       console.log("response", response);
//       if (response.message) {
//         toast.error(response.message);
//         setLoading(false);
//         setPassword("");
//         setNewPassword("");
//         setConfirmNewPassword("");
//       }
//       if (response && response.data) {
//         setLoading(false);
//         if (response.status === 200) {
//           setPassword("");
//           setNewPassword("");
//           setConfirmNewPassword("");
//           toast.success("Password successfully updated!");
//           //   navigate("/userlogin")

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
//       setNewPassword("");
//       setConfirmNewPassword("");
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
//     // console.log("Form submitted:", { email, password, confirmPassword, token });
//   };

//   return (
//     <>
//       {/* <Header /> */}
//       <BreadCrumbs title="Change Password" />
//       <div className="loginOuter">
//       <div className="container">
//         <div className="row justify-content-center">
//           {/* <div className="col-lg-4"></div> */}
//           <div className="col-lg-5 col-md-12">
//             <div className="card mb-4">
//               <div className="registerBg">
//                 {/* <h4 className="">Change Password</h4> */}
//                 <form className="change-pass-form" onSubmit={handleSubmit}>
//                   <div className="row">
//                     {/* <div className="col-12 mb-4">
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
//                     </div> */}

//                     <div className="col-12 mb-4">
//                       <label className="form-label" htmlFor="billings-card-num">
//                         Old Password
//                       </label>
//                       <div className="input-group input-group-merge">
//                         <input
//                           type={showPassword ? 'text' : 'password'}
//                           required
//                           name="password"
//                           // placeholder="Enter your email"
//                           id="billings-card-num"
//                           className="form-control billing-card-mask"
//                           value={password}
//                           onChange={(e) => setPassword(e.target.value)}
//                         />
//                         <div className="hide-show-icon">
//                         <FontAwesomeIcon
//                           icon={showPassword ? faEyeSlash : faEye}
//                           onClick={() => togglePasswordVisibility('1')}
//                           className="change-password-toggle-icon"
//                           style={{ cursor: 'pointer', marginLeft: '10px' }}
//                         />
//                         </div>
           
//                       </div>
//                     </div>

//                     <div className="col-12 mb-4">
//                       <label className="form-label" htmlFor="billings-card-num">
//                         New Password
//                       </label>
//                       <div className="input-group input-group-merge">
//                         <input
//                           type={showNewPassword ? 'text' : 'password'}
//                           required
//                           name="newPassword"
//                           // placeholder="Enter your email"
//                           id="billings-card-num"
//                           className="form-control billing-card-mask"
//                           value={newPassword}
//                           onChange={(e) => setNewPassword(e.target.value)}
//                         />
//                         <div className="hide-show-icon">
//                         <FontAwesomeIcon
//                           icon={showNewPassword ? faEyeSlash : faEye}
//                           onClick={() => togglePasswordVisibility('2')}
//                           className="change-password-toggle-icon"
//                           style={{ cursor: 'pointer', marginLeft: '10px' }}
//                         />
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
//                           value={confirmNewPassword}
//                           onChange={(e) => setConfirmNewPassword(e.target.value)}
//                         />
//                         <div className="hide-show-icon">
//                         <FontAwesomeIcon
//                           icon={showCnfPassword ? faEyeSlash : faEye}
//                           onClick={() => togglePasswordVisibility('3')}
//                           className="change-password-toggle-icon"
//                           style={{ cursor: 'pointer', marginLeft: '10px' }}
//                         />
//                         </div>
                
//                       </div>
//                     </div>
//                     <input type="hidden" name="token" value={token} />

//                     <div className="col-md-3">
//                       <div className="d-grid">
//                         <button type="submit" className="btn btn-primary">
//                           {/* <span className="me-2"> */}{" "}
//                           {loading ? (
//                             <div className="loader">
//                               <Loader />
//                             </div>
//                           ) : (
//                             "Update"
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

// export default ChangePassword;
