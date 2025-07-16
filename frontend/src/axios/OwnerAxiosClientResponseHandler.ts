import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios';
import OwnerAxiosClient from './OwnerAxiosClient';
import { useAuthContext } from '../context/AppContext';

// Types
interface OwnerAxiosClientResponseHandlerProps {
  children: ReactNode;
}

interface AuthContextType {
  logout: (redirect?: boolean) => void;
}

// Constants
const EXCLUDED_LOGOUT_URLS = [
  'api/auth/login',
  'api/auth/refresh',
  'api/auth/register',
] as const;

const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
} as const;

const OwnerAxiosClientResponseHandler = ({ 
  children 
}: OwnerAxiosClientResponseHandlerProps): React.JSX.Element => {
  const { logout } = useAuthContext() as AuthContextType;

  useEffect(() => {
    // Store the interceptor ID for cleanup
    const interceptorId = OwnerAxiosClient.interceptors.response.use(
      // Success response handler
      (response: AxiosResponse) => response,
      
      // Error response handler
      (error: AxiosError) => {
        const { response } = error;
        
        // Early return if no response (network error, etc.)
        if (!response) {
          console.error('Network error or request timeout:', error.message);
          return Promise.reject(error);
        }

        const { status, config } = response;
        const requestUrl = config?.url || '';

        // Handle authentication errors
        if (status === HTTP_STATUS.UNAUTHORIZED) {
          const shouldLogout = !EXCLUDED_LOGOUT_URLS.some(excludedUrl => 
            requestUrl.includes(excludedUrl)
          );

          if (shouldLogout) {
            console.warn('Authentication failed. Logging out user.');
            logout(false);
          }
        }

        // Handle forbidden errors
        if (status === HTTP_STATUS.FORBIDDEN) {
          console.warn('Access forbidden for:', requestUrl);
        }

        // Return the error response data or reject with full error
        return response.data 
          ? Promise.resolve(response.data)
          : Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      OwnerAxiosClient.interceptors.response.eject(interceptorId);
    };
  }, [logout]);

  return children as React.JSX.Element;
};

export default OwnerAxiosClientResponseHandler;

// Export types for use in other components
export type { OwnerAxiosClientResponseHandlerProps };

// import { useEffect } from "react"
// import OwnerAxiosClient from "./OwnerAxiosClient"
// import { useAuthContext } from "../context/AppContext";

// const OwnerAxiosClientResponseHandler = ({children}) => {
//     const {logout} = useAuthContext();

//     useEffect(() => {
//         OwnerAxiosClient.interceptors.response.use(res => res, (error) => {
//             if (error.response.status === 401 && error.response.config.url !== 'api/auth/login') {
//                 logout(false);
//             }
//             return error.response.data
//         })

//     }, []);

//     return children;
// }

// export default OwnerAxiosClientResponseHandler
