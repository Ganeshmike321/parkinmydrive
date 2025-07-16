import React from "react";
import Google from "../../assets/images/google.png";
import { useGoogleLogin } from '@react-oauth/google';
import type { TokenResponse } from '@react-oauth/google';
import axios from "axios";

interface GoogleLoginProps {
  onGoogleResponse: (userData: any) => void; // You can replace `any` with a more specific type if known
}

const GoogleLogin: React.FC<GoogleLoginProps> = ({ onGoogleResponse }) => {

  const login = useGoogleLogin({
    onSuccess: async (response: TokenResponse) => {
      try {
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${response.access_token}`,
          },
        });
        console.log(res);
        onGoogleResponse(res.data);
      } catch (err) {
        console.error("Google login error:", err);
      }
    },
    onError: (error) => {
      console.error("Google login failed:", error);
    },
  });

  return (
    <a onClick={() => login()} style={{ cursor: 'pointer' }}>
      <img src={Google} alt="Login with Google" />
    </a>
  );
};

export default GoogleLogin;





// import Google from "../../assets/images/google.png";
// import { useGoogleLogin } from '@react-oauth/google';
// import axios from "axios";

// const GoogleLogin = ({ onGoogleResponse }) => {

//     const login = useGoogleLogin({
//         onSuccess: async (response) => {
//             try {
//                 const res = await axios.get(
//                     "https://www.googleapis.com/oauth2/v3/userinfo",
//                     {
//                         headers: {
//                             Authorization: `Bearer ${response.access_token}`,
//                         },
//                     }
//                 );
//                 console.log(res);
//                 onGoogleResponse(res.data);
//             } catch (err) {
//                 console.log(err);
//             }
//         }
//     });

//     return (<a onClick={() => login()}>
//         <img src={Google} />
//     </a>)
// };

// export default GoogleLogin;
