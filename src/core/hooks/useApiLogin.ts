import {LoginResponse} from "../../pages/Login";
import {RefreshTokenResponse} from "../models/RefreshTokenResponse.ts";
import {api} from "../services/axios";


// TODO: verify why it is not working (anymore)
// const bearerToken: string = new JwtService().getRawAccessToken() as string;

export const useApiLogin = () => ({
    login: async (email: string, password: string): Promise<LoginResponse | ProblemDetail> => {
        const response = await api.post<LoginResponse | ProblemDetail>('/login', {email, password});

        return response.data;
    },
    refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse | ProblemDetail> => {
        const response = await api.post<RefreshTokenResponse | ProblemDetail>('/refreshtoken', {refreshToken});

        return response.data;
    },
    createCourse: async (name: string, slug: string, startDate: string, endDate: string, professorId: string, rawAccessToken: string) => {
        console.log("rawAccessToken: ", rawAccessToken);
        api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;
        const response = await api.post< | ProblemDetail>('/users/' + professorId +'/courses', {name, slug, startDate, endDate});

        return response.data;
    }
});