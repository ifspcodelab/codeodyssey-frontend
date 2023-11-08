import { IStudentResponse } from "../../../models/Student";
import {api} from "../../axios";

const getAll = async (USER_ID: string, courseSlug: string, rawAccessToken: string): Promise<IStudentResponse[] | ProblemDetail> => {
    api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;

    const response = await api.get<IStudentResponse[]>('/users/' + USER_ID + '/courses/' + courseSlug + '/students');

    return response.data;
};

export const StudentService = {
  getAll
};