import {api} from "../../axios";

export interface IStudentResponse {
  id: string,
  name: string,
  email: string,
}

const getAll = async (USER_ID: string, courseSlug: string, rawAccessToken: string): Promise<IStudentResponse[] | ProblemDetail> => {
    api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;

    const response = await api.get<IStudentResponse[]>('/users/' + USER_ID + '/courses/' + courseSlug + '/students');

    return response.data;
};

export const StudentService = {
  getAll
};