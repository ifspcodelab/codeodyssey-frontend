import axios from "axios";
import {CreateUserResponse} from "../models/CreateUserResponse";


const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL as string,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    }
});

export const useApiRegistration = () => ({
    register: async (name: string, email: string, password: string) => {
        const response = await api.post<CreateUserResponse>('/users', {name, email, password});
        return response.data;
    }
})