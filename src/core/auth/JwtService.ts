import jwtDecode from "jwt-decode";
import {AccessToken} from "../models/AccessToken";

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