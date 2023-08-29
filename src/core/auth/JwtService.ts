import jwtDecode from "jwt-decode";

export enum UserRole {
    ADMIN = "ADMIN",
    STUDENT = "STUDENT",
    PROFESSOR = "PROFESSOR",
}

export interface AccessToken {
    roles: UserRole,
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

    getAccessToken(): AccessToken | null {
        const rawAccessToken = localStorage.getItem('access_token');
        if (rawAccessToken) {
            return jwtDecode<AccessToken>(rawAccessToken);
        }
        return null;
    }

    getRawAccessToken(): string | null {
        const rawAccessToken = localStorage.getItem('access_token');
        return rawAccessToken ? rawAccessToken : null;
    }

    getRefreshToken() {
        const refreshToken = localStorage.getItem('refresh_token');
        return refreshToken ? refreshToken : null;
    }

    removeTokens() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }
}