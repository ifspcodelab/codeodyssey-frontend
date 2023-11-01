import {api} from "../../axios";
import { IActivityResponse } from "../activities/ActivitiesService";

const create = async (resolutionFile: string, rawAccessToken: string, courseId: string, activityId: string): Promise<IActivityResponse | ProblemDetail> => {
  api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;

  const response = await api.post<IActivityResponse | ProblemDetail>('/courses/' + courseId + '/activities/' + activityId + '/resolutions', {resolutionFile});

  return response.data;
};

export const ResolutionsService = {
  create
};