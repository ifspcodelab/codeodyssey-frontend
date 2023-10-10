import {api} from "../services/axios";

export const useApiGetActivity = () => ({
    getActivity: async (courseId: string, activityId: string,rawAccessToken: string) => {
        api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;
        const response = await api.get< | ProblemDetail>('/courses/' + courseId + '/activities/' + activityId);
        return response.data;
    }
})