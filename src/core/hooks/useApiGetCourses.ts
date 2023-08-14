import {api} from "../services/axios";

export const useApiGetCourses = () => ({
    getCoursesProfessor: async (userId: string, rawAccessToken: string) => {
        console.log("rawAccessToken: ", rawAccessToken);
        api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;
        const response = await api.get< | ProblemDetail>('/users/' + userId + '/courses');
        return response.data;
    },
    getCoursesStudent: async (userId: string, rawAccessToken: string) => {
      console.log("rawAccessToken: ", rawAccessToken);
      api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;
      const response = await api.get< | ProblemDetail>('/users/' + userId + '/enrollments');
      return response.data;
  }
})