import axios, {AxiosError} from "axios";
import i18n from "../../locales/i18n";
import {CreateUserResponse} from "../models/CreateUserResponse";
import {RefreshTokenResponse} from "../models/RefreshTokenResponse.ts";
import {api} from "../services/axios";
import {LoginResponse} from "../models/login";


// TODO: verify why it is not working (anymore)
// const bearerToken: string = new JwtService().getRawAccessToken() as string;

export const useApi = () => ({
    register: async (name: string, email: string, password: string) => {
        try {
            const response = await api.post<CreateUserResponse>('/users', {name, email, password});
            return response.data
        }
        catch(error: any) {
            if (axios.isAxiosError(error)) {
                handleError(error as AxiosError<ProblemDetail>)
            } else {
                console.log('unexpected error: ', error);
                return 'An unexpected error ocurred';
            }
        }
    },
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
})

const handleError = (error: AxiosError<ProblemDetail>) => {
    let responseStatus: number
    let problemDetail: ProblemDetail
    if (error.response) {
        responseStatus = error.response.data.status
        if (responseStatus == 400) {
            alert(i18n.t("registration.exception.badRequest"))
        } else if (responseStatus == 409) {
            problemDetail = error.response.data;
            if (problemDetail.title == "User Already exists" && problemDetail.detail == "Email already exists")
                alert(i18n.t("registration.exception.email"))
        }
    }
    // TODO: refactor this method to return a ProblemDetail to the components and make them handle error showing
    // return error.response?.data as ProblemDetail;
}