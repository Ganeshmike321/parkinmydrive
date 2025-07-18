import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import AxiosClient from "../../axios/AxiosClient";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

interface RegisterProps {
  onDataChange?: (value: boolean) => void;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  mobile: string;
}

interface RegisterFormErrors {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  mobile?: string;
}

const Register = ({ onDataChange }: RegisterProps) => {
  const sendDataToParent = (val: boolean) => {
    onDataChange?.(val);
  };

  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    mobile: "",
  });

  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      // Use AxiosClient and post to /register
      const response = await AxiosClient.post("/register", formData);

      if (response.status === 200) {
        setIsRegistered(true);
        setFormData({
          name: "",
          email: "",
          password: "",
          password_confirmation: "",
          mobile: "",
        });
        
        // Show success toast
        toast.success("Registration successful!");
        
        // Navigate to home page after a short delay
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setError(response.data?.message || "Something went wrong");
      }
    } catch (err: any) {
      setLoading(false);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
        toast.error(err.response.data.error); // Show error toast
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
        toast.error(err.response.data.message); // Show error toast
      } else {
        setError("Internal server error. Please try again later.");
        toast.error("Internal server error. Please try again later."); // Show error toast
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validateForm = (formData: RegisterFormData): RegisterFormErrors => {
    const errors: RegisterFormErrors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }
    if (!formData.mobile) {
      errors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      errors.mobile = "Mobile number must be 10 digits";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!formData.password_confirmation) {
      errors.password_confirmation = "Confirm Password is required";
    } else if (formData.password_confirmation !== formData.password) {
      errors.password_confirmation = "Passwords do not match";
    }
    return errors;
  };

  return (
    <>
      {isRegistered && (
        <div className="text-success medium text-center">
          Successfully user registered! Redirecting to login...
        </div>
      )}

      {!isRegistered && (
        <div className="col-lg-12">
          <div className="card">
            <div className="registerBg">
              <form onSubmit={handleRegister}>
                <div className="row">
                  <div className="">
                    <div className="row mb-2">
                      <label className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label">
                        Name<span className="text-danger">*</span>
                      </label>
                      <div className="col-lg-7 col-sm-7 col-md-12">
                        <input
                          type="text"
                          className="form-control"
                          value={formData.name}
                          name="name"
                          onChange={handleInput}
                        />
                        {errors.name && <div className="text-danger small">{errors.name}</div>}
                      </div>
                    </div>

                    <div className="row mb-2">
                      <label className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label">
                        Email Id<span className="text-danger">*</span>
                      </label>
                      <div className="col-lg-7 col-sm-7 col-md-12">
                        <input
                          type="email"
                          className="form-control"
                          value={formData.email}
                          name="email"
                          onChange={handleInput}
                        />
                        {errors.email && <div className="text-danger small">{errors.email}</div>}
                      </div>
                    </div>

                    <div className="row mb-2">
                      <label className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label">
                        Mobile<span className="text-danger">*</span>
                      </label>
                      <div className="col-lg-7 col-sm-7 col-md-12">
                        <input
                          type="text"
                          className="form-control"
                          value={formData.mobile}
                          name="mobile"
                          onChange={handleInput}
                        />
                        {errors.mobile && <div className="text-danger small">{errors.mobile}</div>}
                      </div>
                    </div>

                    <div className="row mb-2">
                      <label className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label">
                        Password<span className="text-danger">*</span>
                      </label>
                      <div className="col-lg-7 col-sm-7 col-md-12">
                        <input
                          type="password"
                          className="form-control"
                          value={formData.password}
                          name="password"
                          onChange={handleInput}
                        />
                        {errors.password && <div className="text-danger small">{errors.password}</div>}
                      </div>
                    </div>

                    <div className="row mb-2">
                      <label className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label">
                        Confirm Password<span className="text-danger">*</span>
                      </label>
                      <div className="col-lg-7 col-sm-7 col-md-12">
                        <input
                          type="password"
                          className="form-control"
                          value={formData.password_confirmation}
                          name="password_confirmation"
                          onChange={handleInput}
                        />
                        {errors.password_confirmation && (
                          <div className="text-danger small">{errors.password_confirmation}</div>
                        )}
                      </div>
                    </div>

                    {error && <div className="text-danger small">{error}</div>}

                    <div className="row mb-2">
                      <div className="col-xl-5 col-lg-12 col-sm-12 col-md-12 offset-lg-5 offset-xl-4">
                        <button className="btn btn-primary btn-lg btn-block" type="submit">
                          {loading ? <Loader /> : "Register"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;


// import { useState } from "react";
// import type { ChangeEvent, FormEvent } from "react";
// import AxiosClient from "../../axios/AxiosClient";
// import { registerUser } from '../../axios/AuthApi';

// import { toast } from "react-toastify";
// import Loader from "../../components/Loader";
// import { useDispatch } from "react-redux";
// import { saveUser } from "../../redux/userSlice";
// import OwnerAxiosClient from "../../axios/OwnerAxiosClient";
// import { useNavigate } from "react-router-dom";
// import { useAuthContext } from "../../context/AppContext";

// interface RegisterProps {
//   onDataChange: (value: boolean) => void;
// }

// interface RegisterFormData {
//   name: string;
//   email: string;
//   password: string;
//   password_confirmation: string;
//   mobile: string;
// }

// interface RegisterFormErrors {
//   name?: string;
//   email?: string;
//   password?: string;
//   password_confirmation?: string;
//   mobile?: string;
// }

// const Register = ({ onDataChange }: RegisterProps) => {
//   const sendDataToParent = (val: boolean) => {
//     onDataChange(val);
//   };

//   const { setIsAuthenticated, setToken, setOwnerToken } = useAuthContext();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [formData, setFormData] = useState<RegisterFormData>({
//     name: "",
//     email: "",
//     password: "",
//     password_confirmation: "",
//     mobile: "",
//   });

//   const [errors, setErrors] = useState<RegisterFormErrors>({});
//   const [error, setError] = useState<string | null>(null);
//   const [isRegistered, setIsRegistered] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError(null);

//     const validationErrors = validateForm(formData);
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     try {
//       setLoading(true);
//       await OwnerAxiosClient.get("/sanctum/csrf-cookie");

//       const { name, email, password, password_confirmation, mobile } = formData;

//       const response = await OwnerAxiosClient.post("/api/auth/adminregister", {
//         name,
//         email,
//         password,
//         password_confirmation,
//         mobile,
//       });

//       const { data, status } = response;
//       const message = data.message;

//       if (status === 201) {
//         setIsAuthenticated(true);
//         setToken(data.user_access_token);
//         setOwnerToken(data.owner_access_token);

//         localStorage.setItem("isAuthenticated", "true");
//         localStorage.setItem("ACCESS_OWNER_TOKEN", data.owner_access_token);
//         localStorage.setItem("ACCESS_TOKEN", data.user_access_token);

//         toast.success("Register successfully!");

//         const redirect = localStorage.getItem("redirect");
//         const bookingLogin = localStorage.getItem("bookingLogin");

//         if (redirect) {
//           navigate(redirect);
//           localStorage.removeItem("redirect");
//         } else if (!bookingLogin) {
//           navigate("/dashboard");
//         }

//         localStorage.removeItem("bookingLogin");
//         setIsRegistered(true);

//         setFormData({
//           name: "",
//           email: "",
//           password: "",
//           password_confirmation: "",
//           mobile: "",
//         });
//       } else {
//         setError(message || "Something went wrong");
//         localStorage.clear();
//       }
//     } catch (err: any) {
//       setLoading(false);
//       localStorage.clear();
//       if (err.response?.status === 409) {
//         setError("Email already exists. Please use a different email.");
//       } else {
//         setError("Internal server error. Please try again later.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//     setErrors({
//       ...errors,
//       [e.target.name]: "",
//     });
//   };

//   const validateForm = (formData: RegisterFormData): RegisterFormErrors => {
//     const errors: RegisterFormErrors = {};
//     if (!formData.name) errors.name = "Name is required";
//     if (!formData.email) {
//       errors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       errors.email = "Email address is invalid";
//     }
//     if (!formData.mobile) {
//       errors.mobile = "Mobile number is required";
//     } else if (!/^\d{10}$/.test(formData.mobile)) {
//       errors.mobile = "Mobile number must be 10 digits";
//     }
//     if (!formData.password) {
//       errors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       errors.password = "Password must be at least 6 characters";
//     }
//     if (!formData.password_confirmation) {
//       errors.password_confirmation = "Confirm Password is required";
//     } else if (formData.password_confirmation !== formData.password) {
//       errors.password_confirmation = "Passwords do not match";
//     }
//     return errors;
//   };

//   return (
//     <>
//       {isRegistered && (
//         <div className="text-success medium text-center">
//           Successfully user registered!
//         </div>
//       )}

//       {!isRegistered && (
//         <div className="col-lg-12">
//           <div className="card">
//             <div className="registerBg">
//               <form onSubmit={handleRegister}>
//                 <div className="row">
//                   <div className="">
//                     <div className="row mb-2">
//                       <label className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label">
//                         Name<span className="text-danger">*</span>
//                       </label>
//                       <div className="col-lg-7 col-sm-7 col-md-12">
//                         <input
//                           type="text"
//                           className="form-control"
//                           value={formData.name}
//                           name="name"
//                           onChange={handleInput}
//                         />
//                         {errors.name && <div className="text-danger small">{errors.name}</div>}
//                       </div>
//                     </div>

//                     <div className="row mb-2">
//                       <label className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label">
//                         Email Id<span className="text-danger">*</span>
//                       </label>
//                       <div className="col-lg-7 col-sm-7 col-md-12">
//                         <input
//                           type="email"
//                           className="form-control"
//                           value={formData.email}
//                           name="email"
//                           onChange={handleInput}
//                         />
//                         {errors.email && <div className="text-danger small">{errors.email}</div>}
//                       </div>
//                     </div>

//                     <div className="row mb-2">
//                       <label className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label">
//                         Mobile<span className="text-danger">*</span>
//                       </label>
//                       <div className="col-lg-7 col-sm-7 col-md-12">
//                         <input
//                           type="text"
//                           className="form-control"
//                           value={formData.mobile}
//                           name="mobile"
//                           onChange={handleInput}
//                         />
//                         {errors.mobile && <div className="text-danger small">{errors.mobile}</div>}
//                       </div>
//                     </div>

//                     <div className="row mb-2">
//                       <label className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label">
//                         Password<span className="text-danger">*</span>
//                       </label>
//                       <div className="col-lg-7 col-sm-7 col-md-12">
//                         <input
//                           type="password"
//                           className="form-control"
//                           value={formData.password}
//                           name="password"
//                           onChange={handleInput}
//                         />
//                         {errors.password && <div className="text-danger small">{errors.password}</div>}
//                       </div>
//                     </div>

//                     <div className="row mb-2">
//                       <label className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label">
//                         Confirm Password<span className="text-danger">*</span>
//                       </label>
//                       <div className="col-lg-7 col-sm-7 col-md-12">
//                         <input
//                           type="password"
//                           className="form-control"
//                           value={formData.password_confirmation}
//                           name="password_confirmation"
//                           onChange={handleInput}
//                         />
//                         {errors.password_confirmation && (
//                           <div className="text-danger small">{errors.password_confirmation}</div>
//                         )}
//                       </div>
//                     </div>

//                     {error && <div className="text-danger small">{error}</div>}

//                     <div className="row mb-2">
//                       <div className="col-xl-5 col-lg-12 col-sm-12 col-md-12 offset-lg-5 offset-xl-4">
//                         <button className="btn btn-primary btn-lg btn-block" type="submit">
//                           {loading ? <Loader /> : "Register"}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Register;




















// // import { useState } from "react";

// // import AxiosClient from "../../axios/AxiosClient";
// // import { toast } from "react-toastify";
// // import Loader from "../../components/Loader";
// // import { useDispatch } from "react-redux";
// // import { saveUser } from "../../redux/userSlice";
// // import OwnerAxiosClient from "../../axios/OwnerAxiosClient";
// // import { useNavigate } from "react-router-dom";
// // // import { BehaviorSubject } from 'rxjs';
// // import { useAuthContext } from "../../context/AppContext";
// // // import { useHistory, useNavigate } from "react-router-dom";

// // const Register = ({ onDataChange }) => {
// //   const sendDataToParent = (val) => {
// //     onDataChange(val);
// // };

// // const { setIsAuthenticated, setToken, setOwnerToken } = useAuthContext();
// //   const navigate = useNavigate();
// //   const dispatch = useDispatch();
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     email: "",
// //     password: "",
// //     password_confirmation: "",
// //     mobile: "",
// //   });
// //   const [errors, setErrors] = useState({});
// //   const [error, setError] = useState("");
// //   const [isRegistered, setIsRegistered] = useState(false);

// //   const [loading, setLoading] = useState(false);

// //   const handleRegister = async (e) => {
// //     setError(null);
// //     e.preventDefault();
    
// //     const validationErrors = validateForm(formData);
// //     if (Object.keys(validationErrors).length > 0) {
// //         setErrors(validationErrors);
// //         return;
// //     }

// //     try {
// //         setLoading(true);
// //         await OwnerAxiosClient.get("/sanctum/csrf-cookie");

// //         const { name, email, password, password_confirmation, mobile } = formData;

// //         const response = await OwnerAxiosClient.post("/api/auth/adminregister", {
// //             name,
// //             email,
// //             password,
// //             password_confirmation,
// //             mobile,
// //         });

// //         const { data, status, message, error } = response;

// //         if (status === 201) {
// //             setIsAuthenticated(true);
// //             setToken(data.user_access_token);
// //             setOwnerToken(data.owner_access_token);

// //             localStorage.setItem("isAuthenticated", true);
// //             localStorage.setItem("ACCESS_OWNER_TOKEN", data.owner_access_token);
// //             localStorage.setItem("ACCESS_TOKEN", data.user_access_token);

// //             toast.success("Register successfully!");

// //             const redirect = localStorage.getItem('redirect');
// //             const bookingLogin = localStorage.getItem('bookingLogin');

// //             if (redirect) {
// //                 navigate(redirect);
// //                 localStorage.removeItem('redirect');
// //             } else if (!bookingLogin) {
// //                 navigate("/dashboard");
// //             }
// //             localStorage.removeItem('bookingLogin');
// //             setIsRegistered(true);

// //             setFormData({
// //                 name: "",
// //                 email: "",
// //                 password: "",
// //                 password_confirmation: "",
// //                 mobile: "",
// //             });
// //         } else {
// //             setError(message);
// //             localStorage.clear();
// //         }
// //     } catch (error) {
// //         setLoading(false);
// //         localStorage.clear();

// //         if (error.response && error.response.status === 409) {
// //             setError("Email already exists. Please use a different email.");
// //         } else {
// //             setError("Internal server error. Please try again later.");
// //         }
// //     } finally {
// //         setLoading(false);
// //     }
// // };

// //   const handleInput = (e) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.name]: e.target.value,
// //     });
// //     setErrors({
// //       ...errors,
// //       [e.target.name]: "",
// //     });
// //   };

// //   const validateForm = (formData) => {
// //     let errors = {};
// //     if (!formData.name) {
// //       errors.name = "Name is required";
// //     }
// //     if (!formData.email) {
// //       errors.email = "Email is required";
// //     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
// //       errors.email = "Email address is invalid";
// //     }
// //     if (!formData.mobile) {
// //       errors.mobile = "Mobile number is required";
// //     } else if (!/^\d{10}$/.test(formData.mobile)) {
// //       errors.mobile = "Mobile number must be 10 digits";
// //     }
// //     if (!formData.password) {
// //       errors.password = "Password is required";
// //     } else if (formData.password.length < 6) {
// //       errors.password = "Password must be at least 6 characters";
// //     }
// //     if (!formData.password_confirmation) {
// //       errors.password_confirmation = "Confirm Password is required";
// //     } else if (formData.password_confirmation !== formData.password) {
// //       errors.password_confirmation = "Passwords do not match";
// //     }
// //     return errors;
// //   };

// //   return (
// //     <>
// //       {isRegistered && (
// //         <div className="text-success medium text-center">
// //           Successfully user registered!
// //         </div>
// //       )}
// //       {!isRegistered && (
// //          <div className="col-lg-12">
// //         <div className="card">
// //           <div className="registerBg">
// //             <form onSubmit={handleRegister}>
// //               <div className="row">
// //                 <div className="">
// //                   <div className="row mb-2">
// //                     <label
// //                       htmlFor="inputEmail3"
// //                       className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label"
// //                     >
// //                       Name<span className="text-danger">*</span>
// //                     </label>
// //                     <div className="col-lg-7 col-lg-7 col-sm-7 col-md-12">
// //                       <input
// //                         type="text"
// //                         className="form-control"
// //                         placeholder=""
// //                         value={formData.name}
// //                         name="name"
// //                         // pattern="[A-Za-z]+"
// //                         onChange={handleInput}
// //                       />
// //                       {errors.name && (
// //                         <div className="text-danger small">{errors.name}</div>
// //                       )}
// //                     </div>
// //                   </div>

// //                   <div className="row mb-2">
// //                     <label
// //                       htmlFor="inputEmail3"
// //                       className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label"
// //                     >
// //                       Email Id<span className="text-danger">*</span>
// //                     </label>
// //                     <div className="col-lg-7 col-lg-7 col-sm-7 col-md-12">
// //                       <input
// //                         type="email"
// //                         className="form-control"
// //                         placeholder=""
// //                         value={formData.email}
// //                         name="email"
// //                         onChange={handleInput}
// //                       />
// //                       {errors.email && (
// //                         <div className="text-danger small">{errors.email}</div>
// //                       )}
// //                     </div>
// //                   </div>

// //                   <div className="row mb-2">
// //                     <label
// //                       htmlFor="inputEmail3"
// //                       className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label"
// //                     >
// //                       Mobile<span className="text-danger">*</span>
// //                     </label>
// //                     <div className="col-lg-7 col-lg-7 col-sm-7 col-md-12">
// //                       <input
// //                         type="text"
// //                         className="form-control"
// //                         placeholder=""
// //                         value={formData.mobile}
// //                         name="mobile"
// //                         onChange={handleInput}
// //                       />
// //                       {errors.mobile && (
// //                         <div className="text-danger small">{errors.mobile}</div>
// //                       )}
// //                     </div>
// //                   </div>

// //                   <div className="row mb-2">
// //                     <label
// //                       htmlFor="inputEmail3"
// //                       className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label"
// //                     >
// //                       Password<span className="text-danger">*</span>
// //                     </label>
// //                     <div className="col-lg-7 col-lg-7 col-sm-7 col-md-12">
// //                       <input
// //                         type="password"
// //                         className="form-control"
// //                         placeholder=""
// //                         value={formData.password}
// //                         name="password"
// //                         onChange={handleInput}
// //                       />
// //                       {errors.password && (
// //                         <div className="text-danger small">
// //                           {errors.password}
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>

// //                   <div className="row mb-2">
// //                     <label
// //                       htmlFor="inputEmail3"
// //                       className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label"
// //                     >
// //                       Confirm Password
// //                       <span className="text-danger">*</span>
// //                     </label>
// //                     <div className="col-lg-7 col-lg-7 col-sm-7 col-md-12">
// //                       <input
// //                         type="password"
// //                         className="form-control"
// //                         placeholder=""
// //                         value={formData.password_confirmation}
// //                         name="password_confirmation"
// //                         onChange={handleInput}
// //                       />
// //                       {errors.password_confirmation && (
// //                         <div className="text-danger small">
// //                           {errors.password_confirmation}
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>
// //                   {error && <div className="text-danger small">{error}</div>}

// //                   <div className="row mb-2">
// //                   <div className="col-xl-5 col-lg-12 col-sm-12 col-md-12 offset-lg-5 offset-xl-4">
// //                       <button
// //                         className="btn btn-primary btn-lg btn-block"
// //                         type="submit"
// //                       >
// //                         {/* Loader */}
// //                         {loading ? (
// //                           <div className="loader">
// //                             <Loader />
// //                           </div>
// //                         ) : (
// //                           "Register"
// //                         )}
// //                       </button>
// //                       {/* <p>
// //                               Already Registered,
// //                               <NavLink to="/login">Login Here?</NavLink>
// //                             </p> */}
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // };

// // export default Register;
