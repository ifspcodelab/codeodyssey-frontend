import {api} from "../services/axios";

export const useApiCreateCourse = () => ({
    createCourse: async (name: string, slug: string, startDate: string, endDate: string, professorId: string, rawAccessToken: string) => {
        console.log("rawAccessToken: ", rawAccessToken);
        api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;
        const response = await api.post< | ProblemDetail>('/users/' + professorId +'/courses', {name, slug, startDate, endDate});

        return response.data;
    }
})