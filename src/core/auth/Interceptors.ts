import axios, {AxiosError} from "axios";
import {RefreshTokenResponse} from "../models/RefreshTokenResponse.ts";
import {JwtService} from "./JwtService.ts";
import {api} from "../hooks/useApi.ts";

export class Interceptors {

    async handleUnauthorized(error: AxiosError) {
        console.log(error)
        /* AxiosError.response:
        data: {
                detail: "access token expired"
                instance: "" //route that the error occurred
                title: "AccessToken ACCESS_TOKEN_EXPIRED"
                type: "about:blank"
            }
        status: 401
        statusText: ""
         */

        /* AxiosError.config:
        config.headers
        config.method
        config.data
        config.url
         */

        // invalid access token, valid refresh token:
        // post refresh token request;
        // store new access and refresh token in local storage;
        // redo original request with new authorization header;
        console.log("@ handleUnauthorized");

        if (!error.response || !error.config) {
            return new Error();
        }

        const jwtService = new JwtService()

        const refreshToken = jwtService.getRefreshToken() as string;
        const refreshTokenResponse = await this.postRefreshToken(refreshToken);
        // TODO: handle error response from postRefreshToken, either here or on interceptor method call
        if (refreshTokenResponse) {
            jwtService.setAccessToken(refreshTokenResponse.accessToken);
            jwtService.setRefreshToken(refreshTokenResponse.refreshToken);
            error.config.headers['Authorization'] = 'Bearer ' + refreshTokenResponse.accessToken;
            return axios.request(error.config);
        }
    }

    private async postRefreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
        delete api.defaults.headers['Authorization'];
        const response = await api.post<RefreshTokenResponse>('/refreshtoken', {refreshToken});

        return response.data;
    }
}