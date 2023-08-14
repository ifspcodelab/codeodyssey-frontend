import axios, {AxiosError} from "axios";
import {Interceptors} from "../auth/Interceptors.ts";


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

export const useApiCreateCourse = () => ({
    createCourse: async (name: string, slug: string, startDate: string, endDate: string, professorId: string, rawAccessToken: string) => {
        console.log("rawAccessToken: ", rawAccessToken);
        api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;
        const response = await api.post< | ProblemDetail>('/users/' + professorId +'/courses', {name, slug, startDate, endDate});

        return response.data;
    }
})