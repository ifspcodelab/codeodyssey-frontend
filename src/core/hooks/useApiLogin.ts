import {RefreshTokenResponse} from "../models/RefreshTokenResponse.ts";
import {api} from "../services/axios";
import {LoginResponse} from "../models/login";


// TODO: verify why it is not working (anymore)
// const bearerToken: string = new JwtService().getRawAccessToken() as string;

export const useApiLogin = () => ({
    login: async (email: string, password: string): Promise<LoginResponse | ProblemDetail> => {
        delete api.defaults.headers['Authorization'];
        const response = await api.post<LoginResponse | ProblemDetail>('/login', {email, password});

        return response.data;
    },
    refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse | ProblemDetail> => {
        const response = await api.post<RefreshTokenResponse | ProblemDetail>('/refreshtoken', {refreshToken});

        return response.data;
    }
});