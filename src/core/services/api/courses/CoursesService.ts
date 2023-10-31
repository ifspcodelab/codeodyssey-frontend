import { UserResponse } from "../../../models/UserResponse";
import {api} from "../../axios";

export interface ICoursesResponse {
  id: string,
  name: string,
  slug: string,
  startDate: Date,
  endDate: Date,
  professor: UserResponse;
}

const getAll = async (userId: string, rawAccessToken: string): Promise<ICoursesResponse[] | Error> => {
  try {
    api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;

    const response = await api.get<ICoursesResponse[]>(`/users/${userId}/courses`);
      
    if (response) {
      return response.data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

export const CoursesService = {
  getAll
};