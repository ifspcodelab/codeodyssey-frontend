import {api} from "../services/axios";



export const useApiGetStudents = () => ({
    getStudents: async (USER_ID: string, courseSlug: string, rawAccessToken: string) => {
        console.log("rawAccessToken: ", rawAccessToken);
        api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;
        const response = await api.get< | ProblemDetail>('/users/' + USER_ID + '/courses/' + courseSlug + '/students');
        return response.data;
    },
})