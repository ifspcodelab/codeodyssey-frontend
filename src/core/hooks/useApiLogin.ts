import axios, {AxiosError} from "axios";
import {LoginResponse} from "../../pages/Login";
import {Interceptors} from "../auth/Interceptors.ts";
import {RefreshTokenResponse} from "../models/RefreshTokenResponse.ts";


export const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL as string,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    }
});

const interceptors = new Interceptors();

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        return interceptors.onRejectedResponse(error)
    }
);

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