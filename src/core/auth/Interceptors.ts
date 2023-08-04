import {AxiosError} from "axios";

export class Interceptors {

    handleUnauthorized(error: AxiosError) {
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
    }
}