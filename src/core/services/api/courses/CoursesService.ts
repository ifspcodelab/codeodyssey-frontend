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

const getAllCourses = async (userId: string, rawAccessToken: string): Promise<ICourseResponse[] | Error> => {
  try {
    api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;

    const response = await api.get<ICourseResponse[]>(`/users/${userId}/courses`);
      
    if (response) {
      return response.data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const getAllEnrollments = async (userId: string, rawAccessToken: string): Promise<ICourseResponse[] | Error> => {
  try {
    api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;

    const response = await api.get<ICourseResponse[]>(`/users/${userId}/enrollments`);
      
    if (response) {
      return response.data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const getById = async (courseId: string, rawAccessToken: string): Promise<ICourseResponse | Error> => {
  try {
    api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;
    const response = await api.get<ICourseResponse>(`/courses/${courseId}`);

    if (response) {
      return response.data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const create = async (name: string, slug: string, startDate: string, endDate: string, professorId: string, rawAccessToken: string): Promise<ICourseResponse | Error> => {
  try {
    api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;
    const response = await api.post<ICourseResponse>('/users/' + professorId +'/courses', {name, slug, startDate, endDate});

    if (response) {
      return response.data;
    }

    return new Error('Erro ao criar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
  }
};


export const CoursesService = {
  getAllCourses,
  getAllEnrollments,
  getById,
  create
};