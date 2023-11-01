import { CourseResponse } from "../../../models/CourseResponse";
import {api} from "../../axios";

export interface IActivityResponse {
  id: string,
  title: string,
  course: CourseResponse;
  extension: string,
  description: string,
  startDate: Date,
  endDate: Date,
  initialFile: string
}

const getAll = async (courseId: string, rawAccessToken: string): Promise<IActivityResponse[] | ProblemDetail> => {
  api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;

  const response = await api.get<IActivityResponse[] | ProblemDetail>('/courses/' + courseId + '/activities');

  return response.data;
};

const getById = async (courseId: string, activityId: string,rawAccessToken: string): Promise<IActivityResponse | ProblemDetail> => {
  api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;

  const response = await api.get<IActivityResponse | ProblemDetail>('/courses/' + courseId + '/activities/' + activityId);

  return response.data;
};

const create = async (title: string, description: string, startDate: string, endDate: string, initialFile: string, solutionFile: string, testFile: string, extension: string, rawAccessToken: string, courseId: string): Promise<IActivityResponse[] | ProblemDetail> => {
  api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;

  const response = await api.post< | ProblemDetail>('/courses/' + courseId + '/activities', {title, description, startDate, endDate, initialFile, solutionFile, testFile, extension});

  return response.data;
};

export const ActivitiesService = {
  getAll,
  getById,
  create
};