import jwtDecode from "jwt-decode";

enum UserRole {
    ADMIN = "ADMIN",
    STUDENT = "STUDENT",
    PROFESSOR = "PROFESSOR",
}
interface accessToken {
    role: UserRole,
    name: string,
    email: string,
    sub: string,
    iss: string,
    iat: number,
    exp: number,
}

export class JwtService {
    setAccessToken(accessToken: string): void {
        localStorage.setItem('access_token', accessToken);
    }

    setRefreshToken(refreshToken: string): void {
        localStorage.setItem('refresh_token', refreshToken);
    }

    getAccessToken(): accessToken | null {
        const rawAccessToken = localStorage.getItem('access_token');
        if (rawAccessToken) {
            return jwtDecode<accessToken>(rawAccessToken);
        }
        return null;
    }
}