import { CourseResponse } from "../models/CourseResponse";
import {api} from "../services/axios";

export const useApiGetCourse = () => ({
    getCourse: async (courseId: string, rawAccessToken: string) => {
        api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;
        const response = await api.get< | CourseResponse>('/courses/' + courseId);
        return response.data;
    },

})