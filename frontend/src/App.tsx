  import React, { useEffect, useRef, useCallback } from 'react';
  import { BrowserRouter as Router } from 'react-router-dom';
  import ReactGA from 'react-ga4';
  import { AuthProvider } from './context/AppContext';
  import AppRoutes from './AppRoutes';
  import Header from './components/Header';
  import OwnerAxiosClientResponseHandler from './axios/OwnerAxiosClientResponseHandler';
  import ValidateToken from './context/ValidateToken';

  // Types
  interface ImportMetaEnv {
    readonly VITE_GTAG_ID: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  interface HeaderRef {
    handleActiveClick: () => void;
    handleCloseClick: () => void;
  }

  // Constants
  const ELEMENT_IDS = {
    PROFILE_IMG: 'profileImg',
  } as const;

  const App: React.FC = () => {
    const headerRef = useRef<HeaderRef>(null);

    // Initialize Google Analytics
    useEffect(() => {
      const gtagId = import.meta.env.VITE_GTAG_ID;
      
      if (gtagId) {
        ReactGA.initialize(gtagId);
        console.log('Google Analytics initialized with ID:', gtagId);
      } else {
        console.warn('VITE_GTAG_ID environment variable is not defined');
      }
    }, []);

    // Memoized click handler to prevent unnecessary re-renders
    const handleDocumentClick = useCallback((event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (!target || !headerRef.current) {
        return;
      }

      try {
        if (target.id === ELEMENT_IDS.PROFILE_IMG) {
          headerRef.current.handleActiveClick();
        } else {
          headerRef.current.handleCloseClick();
        }
      } catch (error) {
        console.error('Error handling document click:', error);
      }
    }, []);

    // Set up document click listener
    useEffect(() => {
      // Use capture phase for better performance
      document.addEventListener('click', handleDocumentClick, { 
        passive: true,
        capture: false 
      });

      // Cleanup function
      return () => {
        document.removeEventListener('click', handleDocumentClick);
      };
    }, [handleDocumentClick]);

    return (
      <Router>
        <AuthProvider>
          <OwnerAxiosClientResponseHandler>
            <ValidateToken>
              <Header ref={headerRef} />
              <AppRoutes />
            </ValidateToken>
          </OwnerAxiosClientResponseHandler>
        </AuthProvider>
      </Router>
    );
  };

  export default App;