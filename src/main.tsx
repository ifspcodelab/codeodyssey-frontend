import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Course from "./pages/Course";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";
import CreateCourse from "./pages/CreateCourse";
import CreateActivity from "./pages/CreateActivity";
import Invitation from "./pages/Invitation";
import Students from "./pages/Students";
import './locales/i18n.ts'
import Login from './pages/Login/index.tsx';
import Registration from "./pages/Registration";
import './index.css'
import ResendEmail from "./pages/ResendEmail";
import { PrivateRoute } from "./core/auth/PrivateRoute.tsx";
import { UserRole } from "./core/models/UserRole";
import { AuthProvider } from "./core/auth/AuthContext.tsx";
import ErrorPage from "./pages/ErrorPage";
import Confirmation from "./pages/Confirmation";
import Activities from "./pages/Activities";
import Activity from "./pages/Activity";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "create-course",
                element:
                    <PrivateRoute userRole={UserRole.PROFESSOR}>
                        <CreateCourse />
                    </PrivateRoute>
            },
            {
                path: "courses/:idCourse/:slug/create-activity",
                element:
                    <PrivateRoute userRole={UserRole.PROFESSOR}>
                        <CreateActivity />
                    </PrivateRoute>
            },
            {
                path: "courses",
                element: <Courses />
            },
            {
                path: "registration",
                element: <Registration />
            },
            {
                path: "resend-email",
                element: <ResendEmail />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "courses/:idCourse/:slug",
                element: <Course />
            },
            {
                path: "courses",
                element: <Courses />
            },
            {
                path: "courses/:idCourse/:slug/activities",
                element: <Activities />
            },
            {
                path: "courses/:idCourse/:slug/activities/:idActivity",
                element: <Activity />
            },
            {
                path: "terms-of-use",
                element: <TermsOfUse />
            },
            {
                path: "privacy-policy",
                element: <PrivacyPolicy />
            },
            {
                path: "contact",
                element: <Contact />
            },
            {
                path: "courses/:idCourse/:slug/students",
                element: <Students />
            },
            {
                path: "invitations/:idInvitation",
                element: <Invitation />
            },
            {
                path: "confirmation/:token",
                element: <Confirmation />
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </React.StrictMode>,
)