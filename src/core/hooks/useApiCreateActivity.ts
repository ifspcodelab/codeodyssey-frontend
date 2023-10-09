import {api} from "../services/axios";


export const useApiCreateActivity = () => ({
    createActivity: async (title: string, description: string, startDate: string, endDate: string, initialFile: string, solutionFile: string, testFile: string, extension: string, rawAccessToken: string, courseId: string) => {
        // console.log("rawAccessToken: ", rawAccessToken);
        api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;
        const response = await api.post< | ProblemDetail>('/courses/' + courseId + '/activities', {title, description, startDate, endDate, initialFile, solutionFile, testFile, extension});

        return response.data;
    }
})