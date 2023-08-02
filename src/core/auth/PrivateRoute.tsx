import {JSX, useContext} from "react";
import {UserRole} from "./JwtService.ts";
import {AuthContext} from "./AuthContext.tsx";
import {Navigate, useLocation} from "react-router-dom";

interface PrivateRouteProps {
    children: JSX.Element,
    userRole: UserRole,
}

export function PrivateRoute({ children, userRole }: PrivateRouteProps) {
    const { authenticated, role } = useContext(AuthContext);
    const currentLocation = useLocation();

    console.log("hello there @ private route");
    console.log("authenticated: ", authenticated);
    console.log("role: ", role);
    console.log("currentLocation: ", currentLocation);

    if (!authenticated) {
        return <Navigate to={"/login"} />;
    }

    if (role !== userRole) {
        // TODO: navigate the user to the previous url, since they are authenticated
        return <Navigate to={"/login"} />;
    }

    return children;
}