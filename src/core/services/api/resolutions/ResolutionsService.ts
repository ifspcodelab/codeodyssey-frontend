import { IResolutionForm, IResolutionResponse } from "../../../models/Resolution";
import {api} from "../../axios";

const create = async (resolutionFile: string, rawAccessToken: string, courseId: string, activityId: string): Promise<IResolutionForm | ProblemDetail> => {
  api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;

  const response = await api.post<IResolutionForm | ProblemDetail>('/courses/' + courseId + '/activities/' + activityId + '/resolutions', {resolutionFile});

  return response.data;
};
const getAllResolutions = async (courseId: string, activityId: string, rawAccessToken: string, ): Promise<IResolutionResponse[] | ProblemDetail> => {
  api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;

  const response = await api.get<IResolutionResponse[] | ProblemDetail>('/courses/' + courseId + '/activities/' + activityId + '/resolutions');

  return response.data;
};

export const ResolutionsService = {
  create,
  getAllResolutions
};