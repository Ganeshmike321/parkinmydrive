import React, { useEffect } from 'react';
import  type {  ReactNode } from 'react';

import moment from 'moment';
import OwnerAxiosClient from '../axios/OwnerAxiosClient';

interface ValidateTokenProps {
  children: ReactNode;
}

const ValidateToken = ({ children }: ValidateTokenProps): React.ReactElement => {
  const onFocusChange = async (): Promise<void> => {
    if (document.visibilityState === 'visible') {
      getUser();
    }
  };

  const getUser = async (): Promise<void> => {
    try {
      await OwnerAxiosClient.get('api/auth/user');
    } catch (error) {
      console.error('Error validating token:', error);
    }
  };

  useEffect(() => {
    document.addEventListener('visibilitychange', onFocusChange);
    window.addEventListener('load', getUser);

    return () => {
      document.removeEventListener('visibilitychange', onFocusChange);
      window.removeEventListener('load', getUser);
    };
  }, []);

  return <>{children}</>;
};

export default ValidateToken;






// import moment from 'moment';
// import OwnerAxiosClient from '../axios/OwnerAxiosClient';
// import { useEffect } from 'react';

// const ValidateToken = ({children}) => {
//     const onFocusChange = async () => {
//         if (document.visibilityState === "visible") {
//             getUser();
//         }
//     };

//     const getUser = async () => {
//         await OwnerAxiosClient.get('api/auth/user');
//     }


//     useEffect(() => {
//         document.addEventListener('visibilitychange', onFocusChange);
//         window.addEventListener('load', getUser);

//         return () => {
//             document.removeEventListener('visibilitychange', onFocusChange);
//             window.removeEventListener('load', getUser);
//         }
//     }, []);

//     return children;
// }

// export default ValidateToken
