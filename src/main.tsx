import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";
import CreateCourse from "./pages/CreateCourse";
import Invitation from "./pages/Invitation";
import Students from "./pages/Students";
import './locales/i18n.ts'
import Login from './pages/Login/index.tsx';
import Registration from "./pages/Registration";
import './index.css'
import ResendEmail from "./pages/ResendEmail";
import {PrivateRoute} from "./core/auth/PrivateRoute.tsx";
import {UserRole} from "./core/auth/JwtService.ts";
import {AuthProvider} from "./core/auth/AuthContext.tsx";
import ErrorPage from "./pages/ErrorPage";
import Confirmation from "./pages/Confirmation";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: "",
                element: <Home/>
            },
            {
                path: "create-course",
                element:
                    <PrivateRoute userRole={UserRole.PROFESSOR}>
                        <CreateCourse/>
                    </PrivateRoute>
            },
            {
                path: "courses",
                element: <Courses/>
            },
            {
                path: "registration",
                element: <Registration/>
            },
            {
                path: "resend-email",
                element: <ResendEmail/>
            },
            {
                path: "login",
                element: <Login/>
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
            {
                path: "confirmation/:token",
                element: <Confirmation/>
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider>
            <RouterProvider router={router}/>
        </AuthProvider>
    </React.StrictMode>,
)