import axios from "axios";
import {CreateCourseResponse} from "../models/CreateCourseResponse";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL as string,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    }
});

const token = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUFJPRkVTU09SIiwibmFtZSI6Ik1vcmlhcnR5IiwiZW1haWwiOiJtb3JpYXJ0eUBnbWFpbC5jb20iLCJzdWIiOiJiMDM0OWY2NS0xNDBkLTRiNzEtOGE3OS04MDYxNThiMzExZmUiLCJpc3MiOiJjb2RlLW9keXNzZXkiLCJpYXQiOjE2OTE2OTk5ODcsImV4cCI6MTY5MTcwMDg4N30.e_uLGKongqa0Jh8X939s4KoKHr_422yGMhoU7D8Ylzo"

export const useApiCourse = () => ({
    createCourse: async (name: string, slug: string, startDate: Date, endDate: Date, professorId: string) => {
        api.defaults.headers['Authorization'] = 'Bearer ' + token;
        const response = await api.post<CreateCourseResponse>('/users/' + professorId + '/courses', {name, slug, startDate, endDate});
        return response.data;
    }
})