import {api} from "../services/axios";

export const useApiGetActivities = () => ({
    getActivities: async (courseId: string, rawAccessToken: string) => {
        api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;
        const response = await api.get< | ProblemDetail>('/courses/' + courseId + '/activities');
        return response.data;
    }
})