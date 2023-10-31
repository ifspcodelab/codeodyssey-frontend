import {api} from "../../axios";

export interface IStudentResponse {
  id: string,
  name: string,
  email: string,
}

const getAll = async (USER_ID: string, courseSlug: string, rawAccessToken: string): Promise<IStudentResponse[] | Error> => {
  try {
    api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;

    const response = await api.get<IStudentResponse[]>('/users/' + USER_ID + '/courses/' + courseSlug + '/students');
      
    if (response) {
      return response.data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

export const StudentService = {
  getAll
};