import axios, {AxiosError} from "axios";
import {Interceptors} from "../auth/Interceptors";

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