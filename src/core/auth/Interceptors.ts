import axios, {AxiosError} from "axios";
import {RefreshTokenResponse} from "../models/RefreshTokenResponse.ts";
import {JwtService} from "./JwtService.ts";
import {api} from "../services/axios";


export class Interceptors {

    public async onRejectedResponse(error: AxiosError) {
        console.log("status code outside of 2xx. An error occurred: \n", error);
        if (error.config && error.config.headers['Skip-Interceptor']) {
            delete error.config.headers['Skip-Interceptor'];
            return Promise.reject(error);
        }
        console.log("error after skip-interceptor delete", error);

        if (error.response && error.response.status === 401) {
            await this.handleUnauthorized(error)
                .catch((error: AxiosError) => {
                    console.log(error)
                    if (error.response && error.response.status === 401) {
                        console.log("error in handleUnauthorized");
                        this.forceLogout();
                    }
                    return Promise.reject(error);
                });
        }

        return Promise.reject(error);
    }

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
        /* error.response.data:
            detail: "refresh token was expired"
            instance: "/api/v1/refreshtoken"
            status: 403
            title: "RefreshToken expired refresh token"
            type: "about:blank"
        */

        /* AxiosError.config:
        config.headers
        config.method
        config.data
        config.url
         */

        console.log("@ handleUnauthorized");

        if (!error.response || !error.config || !error.response.data) {
            throw new Error();
        }

        // invalid access token, valid refresh token:
        // post refresh token request;
        // store new access and refresh token in local storage;
        // redo original request with new authorization header;

        const jwtService = new JwtService()

        const refreshToken = jwtService.getRefreshToken() as string;
        const refreshTokenResponse = await this.postRefreshToken(refreshToken)
            .then((response) => {
                return response;
            })
            .catch((error: AxiosError<ProblemDetail>) => {
                const errorDetail = error.response?.data as ProblemDetail;

                //invalid access token, invalid refresh token
                // force logout by removing tokens and redirecting to login page
                if (errorDetail.status === 403 && errorDetail.title === "RefreshToken expired refresh token") {
                    console.log("error in handleUnauthorized: refresh token expired");
                    this.forceLogout();
                    return Promise.reject(error);
                }

                console.log("error in postRefreshToken")
                throw new Error();
            });

        if (refreshTokenResponse) {
            jwtService.setAccessToken(refreshTokenResponse.accessToken);
            jwtService.setRefreshToken(refreshTokenResponse.refreshToken);
            error.config.headers['Authorization'] = 'Bearer ' + refreshTokenResponse.accessToken;
            return axios.request(error.config);
        }
    }

    private async postRefreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
        delete api.defaults.headers['Authorization'];
        api.defaults.headers['Skip-Interceptor'] = true;
        const response = await api.post<RefreshTokenResponse>('/refreshtoken', {refreshToken});
        delete api.defaults.headers['Skip-Interceptor'];

        return response.data;
    }

    public forceLogout() {
        new JwtService().removeTokens();
        window.location.href = "/login";
    }
}