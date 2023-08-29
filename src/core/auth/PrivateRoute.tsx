import {JSX} from "react";
import {UserRole} from "./JwtService.ts";
import {AuthConsumer} from "./AuthContext.tsx";
import {Navigate, useLocation} from "react-router-dom";

interface PrivateRouteProps {
    children: JSX.Element,
    userRole: UserRole,
}

export function PrivateRoute({ children, userRole }: PrivateRouteProps) {
    const { authenticated, roles } = AuthConsumer();
    const currentLocation = useLocation();

    console.log("hello there @ private route");
    console.log("authenticated: ", authenticated);
    console.log("role: ", roles);
    console.log(userRole)   
    console.log("currentLocation: ", currentLocation);

    if (!authenticated) {
        return <Navigate to={"/login"} />;
    }

    if (!roles.includes(userRole)) {
        // TODO: navigate the user to the previous url, since they are authenticated
        return <Navigate to={"/"} />; 
    }

    return children;
}