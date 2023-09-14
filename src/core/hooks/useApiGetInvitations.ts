import {api} from "../services/axios";

export const useApiGetInvitations = () => ({
    getCourseInvitations: async (courseId: string, rawAccessToken: string) => {
        console.log("rawAccessToken: ", rawAccessToken);
        api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;
        const response = await api.get< | ProblemDetail>('/invitations/' + courseId);
        return response.data;
    }
})