import {api} from "../services/axios";

export const useApiSendResolution = () => ({
    sendResolution: async (resolutionFile: string, rawAccessToken: string, courseId: string, activityId: string) => {
        api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;
        const response = await api.post< | ProblemDetail>('/courses/' + courseId + '/activities/' + activityId + '/resolutions', {resolutionFile});

        return response.data;
    }
})