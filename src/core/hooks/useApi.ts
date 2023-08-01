import axios from "axios";
import i18n from "../../locales/i18n";
import {CreateUserResponse} from "../models/CreateUserResponse";


const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL as string,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    }
});

export const useApi = () => ({
    register: async (name: string, email: string, password: string) => {
        try {
            const response = await api.post<CreateUserResponse>('/users', {name, email, password});
            return response.data
        }
        catch(error: any) {
            if (axios.isAxiosError(error)) {
                handleError(error)
            } else {
                console.log('unexpected error: ', error);
                return 'An unexpected error ocurred';
            }
        }
    }
})

const handleError = (error: any) => {
    let responseStatus: number
    let problemDetail: ProblemDetail
    responseStatus = error.response.data.status
    if (responseStatus == 400) {
        alert(i18n.t("registration.exception.badRequest"))
    } else if (responseStatus == 409) {
        problemDetail = error.response.data;
        if (problemDetail.title == "User Already exists" && problemDetail.detail == "Email already exists")
            alert(i18n.t("registration.exception.email"))
    }
}