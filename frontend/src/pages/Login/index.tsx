import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import AxiosClient from "../../axios/AxiosClient";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { toast } from "react-toastify"; // Add this import

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const response = await AxiosClient.post("/login", formData);

      if (response.status === 200) {
        // Store user data if needed
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Show success toast
        toast.success("Login successfully!");
        
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
        setError("Login failed. Please check your credentials.");
        toast.error("Login failed. Please check your credentials."); // Show error toast
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

  const validateForm = (formData: LoginFormData): LoginFormErrors => {
    const errors: LoginFormErrors = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  return (
    <div className="col-lg-12">
      <div className="card">
        <div className="loginBg">
          <form onSubmit={handleLogin}>
            <div className="row">
              <div className="">
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

                {error && <div className="text-danger small">{error}</div>}

                <div className="row mb-2">
                  <div className="col-xl-5 col-lg-12 col-sm-12 col-md-12 offset-lg-5 offset-xl-4">
                    <button className="btn btn-primary btn-lg btn-block" type="submit">
                      {loading ? <Loader /> : "Login"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;





// import { useState } from "react";
// import type { ChangeEvent, FormEvent } from "react";
// import Loader from "../../components/Loader";
// import { useDispatch } from "react-redux";
// import { saveUser } from "../../redux/userSlice";
// import { NavLink, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import OwnerAxiosClient from "../../axios/OwnerAxiosClient";
// import { useAuthContext } from "../../context/AppContext";

// interface LoginProps {
//   onDataChange: (val: boolean) => void;
// }

// interface FormData {
//   email: string;
//   password: string;
// }

// interface FormError {
//   email: string;
//   password: string;
//   form: string;
// }

// const Login = ({ onDataChange }: LoginProps) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState<boolean>(false);
//   const [formData, setFormData] = useState<FormData>({
//     email: "",
//     password: "",
//   });
//   const [error, setError] = useState<FormError>({
//     email: "",
//     password: "",
//     form: "",
//   });
//   const [errors, setErrors] = useState<string>("");
//   const { setIsAuthenticated, setToken, setOwnerToken } = useAuthContext();

//   const sendDataToParent = (val: boolean) => {
//     onDataChange(val);
//   };

//   const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setErrors("");
//     setError({ email: "", password: "", form: "" });

//     try {
//       setLoading(true);
//       sendDataToParent(true);

//       await OwnerAxiosClient.get("/sanctum/csrf-cookie");
//       const { email, password } = formData;

//       const { data, status } = await OwnerAxiosClient.post("api/auth/adminlogin", { email, password });

//       if (status === 200) {
//         setIsAuthenticated(true);
//         setToken(data.user_access_token);
//         setOwnerToken(data.owner_access_token);

//         localStorage.setItem("spotLength", data.spot_length);
//         localStorage.setItem("isAuthenticated", "true");
//         localStorage.setItem("ACCESS_TOKEN", data.user_access_token);
//         localStorage.setItem("ACCESS_OWNER_TOKEN", data.owner_access_token);

//         dispatch(saveUser({
//           data: {
//             isLoggedIn: true,
//             username: data.user.name,
//             email: data.user.email,
//             token: data.user_access_token,
//             mobile: data.user.mobile,
//             spotLength: data.spot_length,
//             auth_owner_id: data.owner.id,
//           },
//         }));

//         toast.success("Login successfully!");
//         sendDataToParent(false);

//         const redirect = localStorage.getItem("redirect");
//         const bookingLogin = localStorage.getItem("bookingLogin");

//         if (redirect) {
//           navigate(redirect);
//           localStorage.removeItem("redirect");
//         } else if (!bookingLogin) {
//           navigate("/dashboard");
//         }
//         localStorage.removeItem("bookingLogin");
//       } else {
//         throw new Error("Invalid status");
//       }
//     } catch (err) {
//       console.error("Login Error:", err);
//       sendDataToParent(false);
//       localStorage.clear();
//       setErrors("Internal server error. Please try again later.");
//       setError({ ...error, form: "OOPS! Check your username and password" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="col-lg-12">
//       <div className="card">
//         <form onSubmit={handleSubmit}>
//           <div className="registerBg">
//             <div className="row">
//               <div className="row mb-2">
//                 <label className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label">
//                   Email Id<span className="text-danger">*</span>
//                 </label>
//                 <div className="col-lg-7 col-sm-7 col-md-12">
//                   <input
//                     type="email"
//                     className="form-control"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInput}
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="row mb-2">
//                 <label className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label">
//                   Password<span className="text-danger">*</span>
//                 </label>
//                 <div className="col-lg-7 col-sm-7 col-md-12">
//                   <input
//                     type="password"
//                     className="form-control"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleInput}
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="row">
//                 {(error.form || errors) && (
//                   <span className="text-danger small">
//                     {error.form || errors}
//                   </span>
//                 )}
//                 <div className="col-xl-5 col-lg-12 col-sm-12 col-md-12 offset-lg-5 offset-xl-4">
//                   <button className="btn btn-primary" type="submit">
//                     {loading ? <Loader /> : "Login"}
//                   </button>
//                   <br />
//                   <NavLink to="/forgetPassword">Forget Password?</NavLink>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;










// import { useState } from "react";
// import Loader from "../../components/Loader";
// import { useDispatch } from "react-redux";
// import { saveUser } from "../../redux/userSlice";
// import { NavLink } from "react-router-dom";
// import { toast } from "react-toastify";
// import OwnerAxiosClient from "../../axios/OwnerAxiosClient";
// import { useNavigate } from "react-router-dom";
// import { useAuthContext } from "../../context/AppContext";

// const Login = ({ onDataChange }) => {
//   const sendDataToParent = (val) => {
//     onDataChange(val);
// };
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [error, setError] = useState({
//     email: "",
//     password: "",
//     form: "",
//   });
//   const [errors, setErrors] = useState("");
// const {setIsAuthenticated, setToken, setOwnerToken} = useAuthContext()

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrors("");
//     setError({
//       username: "",
//       password: "",
//       form: "",
//     });
//     try {
//       setLoading(true);
//       sendDataToParent(true);
//       await OwnerAxiosClient.get("/sanctum/csrf-cookie");
//       const { email, password } = formData;
//       const { data, status } = await OwnerAxiosClient.post("api/auth/adminlogin", {
//         email,
//         password,
//       });
//       if (status === 200) {
//         setIsAuthenticated(true);
//         setToken(data.user_access_token);
//         setOwnerToken(data.owner_access_token);

//         localStorage.setItem('spotLength', data.spot_length);
//         localStorage.setItem("isAuthenticated", true);
//         localStorage.setItem("ACCESS_TOKEN", data.user_access_token);
//         localStorage.setItem("ACCESS_OWNER_TOKEN", data.owner_access_token);

//         sendDataToParent(false);
//         toast.success("Login successfully!");

//         const redirect = localStorage.getItem('redirect');
//         const bookingLogin = localStorage.getItem('bookingLogin');

//         if (redirect) {
//             navigate(redirect);
//             localStorage.removeItem('redirect');
//         } else if (!bookingLogin) {
//           navigate("/dashboard");
//         }
//         localStorage.removeItem('bookingLogin');
//         dispatch(
//           saveUser({
//             data: {
//               isLoggedIn: true,
//               username: data.user.name,
//               email: data.user.email,
//               token: data.user_access_token,
//               mobile: data.user.mobile,
//               spotLength: data.spot_length,
//               auth_owner_id: data.owner.id
//             },
//           })
//         );
//       }
//       if (status !== 200) {
//         sendDataToParent(false);
//         localStorage.clear();
//         navigate("/userlogin")
//         setError({
//           ...error,
//           form: "OOPS! Check your username and password",
//         });
//         setLoading(false);
//         // setErrors("OOPS! Check your username and password");
//       }
//     } catch (err) {
//       sendDataToParent(false);
//       localStorage.clear();
//       console.error("catching error", err);
//       setErrors("Internal server Error. Please try again later");
//       setLoading(false);
//     } finally {
//     }
//   };


//   const handleInput = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   return (
//     <div className="col-lg-12">
//     <div className="card">
//       <form onSubmit={handleSubmit}>
//         <div className="registerBg">
//           <div className="row">
//             <div className="">
//               <div className="row mb-2">
//                 <label
//                   htmlFor="inputEmail3"
//                   className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label"
//                 >
//                   Email Id<span className="text-danger">*</span>
//                 </label>
//                 <div className="col-lg-7 col-lg-7 col-sm-7 col-md-12">
//                   <input
//                     type="email"
//                     className="form-control"
//                     placeholder=""
//                     value={formData.email}
//                     name="email"
//                     onChange={handleInput}
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="row mb-2">
//                 <label
//                   htmlFor="inputEmail3"
//                   className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label"
//                 >
//                   Password<span className="text-danger">*</span>
//                 </label>
//                 <div className="col-lg-7 col-lg-7 col-sm-7 col-md-12">
//                   <input
//                     type="password"
//                     className="form-control"
//                     placeholder=""
//                     value={formData.password}
//                     name="password"
//                     onChange={handleInput}
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="row">
//                 {error.form && (
//                   <span className="text-danger small">{error.form}</span>
//                 )}

//                 {errors && <span className="text-danger small">{errors}</span>}
//                 <div className="col-xl-5 col-lg-12 col-sm-12 col-md-12 offset-lg-5 offset-xl-4">
//                   <button className="btn btn-primary" type="submit">
//                     {/* Loader */}
//                     {loading ? (
//                       <div className="loader">
//                         <Loader />
//                       </div>
//                     ) : (
//                       "Login"
//                     )}
//                   </button>
//                   <br />
//                   <NavLink to="/forgetPassword">Forget Password?</NavLink>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//     </div>
//   );
// };

// export default Login;
