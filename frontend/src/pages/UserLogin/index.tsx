import { useEffect, useState } from "react";
import BreadCrumbs from "../../components/BreadCrumbs";
import Apple from "../../assets/images/apple.png";
import Footer from "../../components/Footer";
import AxiosClient from "../../axios/AxiosClient";
import GoogleLogin from "../googleLogin";
import { GoogleOAuthProvider } from '@react-oauth/google';
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import Login from "../Login";
import Register from "../Register";
import Loader from "../../components/Loader";
import OwnerAxiosClient from "../../axios/OwnerAxiosClient";
import { toast } from "react-toastify";
import { useAuthContext } from "../../context/AppContext";

const UserLogin = (): React.ReactElement => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, setToken, setOwnerToken } = useAuthContext();
  const userRedux = useSelector((state: any) => state.user.value);

  const [logginClicked, setLogginClicked] = useState<boolean>(false);
  const [signUpClicked, setSignUpClicked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleDataChange = (newData: boolean): void => {
    setLoading(newData);
  };

  const handleGoogleResponse = (response: { name: string; email: string; sub: string }) => {
    loginSubmit(response.name, response.email, response.sub);
  };

  const loginSubmit = async (name: string, email: string, pass: string): Promise<void> => {
    try {
      setLoading(true);
      await OwnerAxiosClient.get("/sanctum/csrf-cookie");
      const response = await OwnerAxiosClient.post("/api/auth/ownersociallogin", {
        username: name,
        email: email,
        password: pass,
        mobile: '9999999999'
      });
      const { data } = response;

      if (response.status === 200) {
        setIsAuthenticated(true);
        setToken(data.user_access_token);
        setOwnerToken(data.owner_access_token);

        localStorage.setItem('spotLength', data.spot_length);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("ACCESS_OWNER_TOKEN", data.owner_access_token);
        localStorage.setItem("ACCESS_TOKEN", data.user_access_token);
        toast.success("Login successfully!");

        const redirect = localStorage.getItem('redirect');
        if (redirect) {
          navigate(redirect);
          localStorage.removeItem('redirect');
        } else {
          navigate("/dashboard");
        }

        dispatch(
          saveUser({
            data: {
              isLoggedIn: true,
              username: data.user.name,
              email: data.user.email,
              token: data.user_access_token,
              mobile: data.user.mobile,
              spotLength: data.spot_length || 0,
              auth_owner_id: data.owner.id,
            },
          })
        );
      } else {
        localStorage.clear();
        setError(error);
        setLoading(false);
      }
    } catch (err: any) {
      setLoading(false);
      if (err.response && err.response.status === 409) {
        setError("Email already exists. Please use a different email.");
      } else {
        setError("Internal server error. Please try again later.");
      }
    }
  };

  return (
    <>
      <BreadCrumbs title={"Login"} />
      <div className="loginOuter">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mx-auto">
              <div className="card px-3">
                <div className="row">
                  <div className="col-lg-8 col-md-12 card-body">
                    {loading && <div className="loader"> <Loader /></div>}
                    {!isAuthenticated && (
                      <div id="form-credit-card" className="bg-lighter rounded">
                        <h4 className="">Let's gets started</h4>
                        <div className={loading ? 'form-disabled' : ''}>
                          <div className="row">
                            <div className="col-lg-6 mb-2">
                              <div className="loginasIcon" onClick={() => {
                                setLogginClicked(false);
                                setSignUpClicked(false);
                              }}>
                                <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_GG_APP_ID}>
                                  <GoogleLogin onGoogleResponse={handleGoogleResponse} />
                                </GoogleOAuthProvider>
                              </div>
                            </div>
                            <div className="col-lg-6 mb-2">
                              <div className="loginasIcon form-disabled">
                                <a>
                                  <img src={Apple} alt="Earning Passive Income" />
                                </a>
                              </div>
                            </div>
                            {!logginClicked && (
                              <div className="col-xl-12 col-md-12 mb-2">
                                <div className="loginasIcon cursor-pointer">
                                  <a onClick={() => {
                                    setLogginClicked(true);
                                    setSignUpClicked(false);
                                  }}>
                                    Login with email
                                  </a>
                                </div>
                              </div>
                            )}
                            {!isAuthenticated && logginClicked && <Login />}
                            {!isAuthenticated && signUpClicked && <Register />}
                            {!signUpClicked && (
                              <>
                                <div className="col-xl-12 col-md-12 mb-2">
                                  <div className="loginasIcon text-center">or</div>
                                </div>
                                <div className="col-xl-12 col-md-12 mb-2">
                                  <div className="loginasIcon">
                                    <a onClick={() => {
                                      setSignUpClicked(true);
                                      setLogginClicked(false);
                                    }}>
                                      Signup with email
                                    </a>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
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

export default UserLogin;










// import { useEffect, useState } from "react";
// import BreadCrumbs from "../../components/BreadCrumbs";
// import Apple from "../../assets/images/apple.png";
// import Header from "../../components/Header";
// import Footer from "../../components/Footer";
// import AxiosClient from "../../axios/AxiosClient";
// import GoogleLogin from "../googleLogin/index"
// import { GoogleOAuthProvider } from '@react-oauth/google';
// import React from "react";
// import { useDispatch } from "react-redux";
// import { saveUser } from "../../redux/userSlice";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import Login from "../Login";
// import Register from "../Register";
// import Loader from "../../components/Loader";
// import OwnerAxiosClient from "../../axios/OwnerAxiosClient";
// import { toast } from "react-toastify";
// import { useAuthContext } from "../../context/AppContext";
// const UserLogin = () => {
//     const handleDataChange = (newData) => {
//         setLoading(newData);
//     };
//     const dispatch = useDispatch();
//     const userRedux = useSelector((state) => {
//         return state.user.value;
//     });

//     const [logginClicked, setLogginClicked] = useState(false);
//     const [signUpClicked, setSignUpClicked] = useState(false);
//     const navigate = useNavigate();
//     const [loading, setLoading] = useState(false);
//     const {isAuthenticated, setIsAuthenticated, setToken, setOwnerToken} = useAuthContext();


//     const handleGoogleResponse = (response) => {
//         // Perform actions with the received data
//         loginSubmit(response.name, response.email, response.sub);
//     };

//     const loginSubmit = async (name, email, pass) => {
//         try {
//             setLoading(true); // Set loading state to true when API call sta
//             await OwnerAxiosClient.get("/sanctum/csrf-cookie");
//             const { data, error, status } =
//                 await OwnerAxiosClient.post("/api/auth/ownersociallogin", {
//                     username: name,
//                     email: email,
//                     password: pass,
//                     mobile: '9999999999'
//                 });
//             if (error) {
//                 localStorage.clear();
//                 setError(error);
//                 setLoading(false);
//                 return;
//             }
//             if (status === 200) {
//                 setIsAuthenticated(true);
//                 setToken(data.user_access_token);
//                 setOwnerToken(data.owner_access_token);

//                 localStorage.setItem('spotLength', data.spot_length);
//                 localStorage.setItem("isAuthenticated", true);
//                 localStorage.setItem("ACCESS_OWNER_TOKEN", data.owner_access_token);
//                 localStorage.setItem("ACCESS_TOKEN", data.user_access_token);
//                 toast.success("Login successfully!");
//                 const redirect = localStorage.getItem('redirect')
//                 if (redirect) {
//                     navigate(redirect);
//                     localStorage.removeItem('redirect');
//                 } else {
//                     navigate("/dashboard");
//                 }

//                 dispatch(
//                     saveUser({
//                         data: {
//                             isLoggedIn: true,
//                             username: data.user.name,
//                             email: data.user.email,
//                             token: data.user_access_token,
//                             mobile: data.user.mobile,
//                             spotLength: data.spot_length ? data.spot_length : 0,
//                             auth_owner_id: data.owner.id
//                         },
//                     })
//                 );
//             } else {
//                 localStorage.clear();
//                 setError(error);
//                 setLoading(false);
//                 return;
//             }
//         } catch (error) {
//             setLoading(false);
//             if (error.response && error.response.status === 409) {
//                 setError("Email already exists. Please use a different email.");
//             } else {
//                 setError("Internal server error. Please try again later.");
//             }
//         }
//     }

//     return (
//         <>
//             {/* <Header /> */}
//             <BreadCrumbs title={"Login"} />
//             <div className="loginOuter">
//                 <div className="container">
//                     <div className="row">
//                         <div className="col-lg-6 mx-auto">
//                             <div className="card px-3">
//                                 <div className="row">
//                                     <div className="col-lg-8 col-md-12 card-body">
//                                         {loading ? (
//                                             <div className="loader"> <Loader /></div>
//                                         ) : ''}
//                                         {!isAuthenticated && (
//                                             <div
//                                                 id="form-credit-card"
//                                                 className="bg-lighter rounded">
//                                                 <h4 className="">Let's gets started</h4>
//                                                 {/* <form> */}
//                                                 <div className={loading ? 'form-disabled' : ''}>
//                                                     <div className="row">
//                                                         <div className="col-lg-6 mb-2">
//                                                             <div className="loginasIcon" onClick={() => {
//                                                                 setLogginClicked(false);
//                                                                 setSignUpClicked(false);
//                                                             }}>
//                                                                 <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_GG_APP_ID}>
//                                                                     <GoogleLogin onGoogleResponse={handleGoogleResponse} />
//                                                                 </GoogleOAuthProvider>
//                                                             </div>
//                                                         </div>

//                                                         <div className="col-lg-6 mb-2">
//                                                             <div className="loginasIcon form-disabled">
//                                                                 <a>
//                                                                     <img src={Apple} alt="Earning Passive Income" />
//                                                                 </a>
//                                                             </div>
//                                                         </div>

//                                                         {!logginClicked && (
//                                                             <div className="col-xl-12 col-md-12 mb-2">
//                                                                 <div className="loginasIcon cursor-pointer">
//                                                                     <a
//                                                                         onClick={() => {
//                                                                             setLogginClicked(true);
//                                                                             setSignUpClicked(false);
//                                                                         }}
//                                                                     >
//                                                                         Login with email
//                                                                     </a>
//                                                                 </div>
//                                                             </div>
//                                                         )}

//                                                         {!isAuthenticated && logginClicked && <Login onDataChange={handleDataChange}/>}
//                                                         {!isAuthenticated && signUpClicked && (
//                                                             <Register onDataChange={handleDataChange} />
//                                                         )}
//                                                         {!signUpClicked && (
//                                                             <>
//                                                                 <div className="col-xl-12 col-md-12 mb-2">
//                                                                     <div className="loginasIcon text-center">
//                                                                         or
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="col-xl-12 col-md-12 mb-2">
//                                                                     <div className="loginasIcon">
//                                                                         <a
//                                                                             onClick={() => {
//                                                                                 setSignUpClicked(true);
//                                                                                 setLogginClicked(false);
//                                                                             }}
//                                                                         >
//                                                                             Signup with email
//                                                                         </a>
//                                                                     </div>
//                                                                 </div>
//                                                             </>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <Footer />
//         </>
//     );
// };

// export default UserLogin;
