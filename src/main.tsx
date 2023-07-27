import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";
import Invitation from "./pages/Invitation";
import Students from "./pages/Students";
import './locales/i18n.ts'

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "",
                element: <Home/>
            },
            {
                path: "courses",
                element: <Courses/>
            },
            {
                path: "terms-of-use",
                element: <TermsOfUse/>
            },
            {
                path: "privacy-policy",
                element: <PrivacyPolicy/>
            },
            {
                path: "contact",
                element: <Contact/>
            },
            {
                path: "students",
                element: <Students/>
            },
            {
                path: "invitation",
                element: <Invitation/>
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)
