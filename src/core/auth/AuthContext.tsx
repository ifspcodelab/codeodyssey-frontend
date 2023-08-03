import {createContext, ReactNode, useContext, useState} from "react";
import {UserRole} from "./JwtService.ts";
// import {useNavigate} from "react-router-dom";

interface Props {
    children?: ReactNode,
}

interface IAuthContext {
    authenticated: boolean,
    setAuthenticated: (newState: boolean) => void,
    id: string,
    setId: (newState: string) => void,
    email: string,
    setEmail: (newState: string) => void,
    role: UserRole,
    setRole: (newState: UserRole) => void,
}

const noop = () => {
    // No-operation dummy function
};

const authContextInitialValue = {
    authenticated: false,
    setAuthenticated: noop,
    id: "",
    setId: noop,
    email: "",
    setEmail: noop,
    role: UserRole.STUDENT,
    setRole: noop,
}

const AuthContext = createContext<IAuthContext>(authContextInitialValue);

const AuthProvider = ({children}: Props) => {
    const [ authenticated, setAuthenticated ] = useState(authContextInitialValue.authenticated);
    const [ id, setId ] = useState(authContextInitialValue.id);
    const [ email, setEmail ] = useState(authContextInitialValue.email);
    const [ role, setRole ] = useState(authContextInitialValue.role);

    // const navigate = useNavigate();

    return (
        <AuthContext.Provider
            value={{
                authenticated, setAuthenticated,
                id, setId,
                email, setEmail,
                role, setRole
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

const AuthConsumer = () => {
    return useContext(AuthContext);
}

export { AuthContext, AuthProvider, AuthConsumer }
