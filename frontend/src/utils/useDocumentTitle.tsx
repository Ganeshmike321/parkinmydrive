import { useEffect } from "react";
import {useLocation} from "react-router-dom";
import ReactGA from 'react-ga4';

export const useDocumentTitle = (title: string) => {

    const location = useLocation();
    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: location.pathname, title: title});
        document.title = title;
    }, [title, location]);

    return null;
}
