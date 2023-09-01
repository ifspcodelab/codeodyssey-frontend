import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {JwtService, UserRole} from "./JwtService.ts";

// import {useNavigate} from "react-router-dom";

interface Props {
    children?: ReactNode,
}

interface IAuthContext {
    authenticated: boolean,
    setAuthenticated: (newState: boolean) => void,
    accessToken: string,
    setAccessToken: (newState: string) => void,
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
    accessToken: "",
    setAccessToken: noop,
    id: "",
    setId: noop,
    email: "",
    setEmail: noop,
    role: UserRole.STUDENT,
    setRole: noop,
}

const AuthContext = createContext<IAuthContext>(authContextInitialValue);

const AuthProvider = ({children}: Props) => {
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [id, setId] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [role, setRole] = useState<UserRole | null>(null);

    useEffect(() => {
        const jwtService = new JwtService();
        const jwt = jwtService.getAccessToken();
        console.log(jwt);
        if (jwt) {
            console.log("@ if")
            const rawAccessToken = jwtService.getRawAccessToken() as string;
            setAuthenticated(true);
            setAccessToken(rawAccessToken);
            setId(jwt.sub);
            setEmail(jwt.email);
            setRole(jwt.role);
        } else {
            console.log("@ else")
            setAuthenticated(false);
            setAccessToken("");
            setId("");
            setEmail("");
            setRole(UserRole.STUDENT);
        }
    }, []);

    // const navigate = useNavigate();

    return (
        <AuthContext.Provider
            value={{
                authenticated: authenticated!,
                setAuthenticated,
                accessToken: accessToken!,
                setAccessToken,
                id: id!,
                setId,
                email: email!,
                setEmail,
                role: role!,
                setRole
            }}
        >
            { authenticated === null ? <></> :  children }
        </AuthContext.Provider>
    )
}

const AuthConsumer = () => {
    return useContext(AuthContext);
}

export { AuthContext, AuthProvider, AuthConsumer }