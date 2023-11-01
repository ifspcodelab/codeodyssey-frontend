import { UserResponse } from "../../../models/UserResponse";
import {api} from "../../axios";

export interface ICourseResponse {
  id: string,
  name: string,
  slug: string,
  startDate: Date,
  endDate: Date,
  professor: UserResponse;
}

const getAllCourses = async (userId: string, rawAccessToken: string): Promise<ICourseResponse[] | ProblemDetail> => {
    api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;

    const response = await api.get<ICourseResponse[] | ProblemDetail>(`/users/${userId}/courses`);

    return response.data;
};

const getAllEnrollments = async (userId: string, rawAccessToken: string): Promise<ICourseResponse[] | ProblemDetail> => {
    api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;

    const response = await api.get<ICourseResponse[] | ProblemDetail>(`/users/${userId}/enrollments`);

    return response.data;
};

const getById = async (courseId: string, rawAccessToken: string): Promise<ICourseResponse | ProblemDetail> => {
    api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;

    const response = await api.get<ICourseResponse | ProblemDetail>(`/courses/${courseId}`);

    return response.data;
};

const create = async (name: string, slug: string, startDate: string, endDate: string, professorId: string, rawAccessToken: string): Promise<ICourseResponse | ProblemDetail> => {
  api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;

  const response = await api.post<ICourseResponse | ProblemDetail>('/users/' + professorId +'/courses', {name, slug, startDate, endDate});

  return response.data;
}

export const CoursesService = {
  getAllCourses,
  getAllEnrollments,
  getById,
  create
};