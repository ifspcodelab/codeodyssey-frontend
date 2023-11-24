import { IResultResponse } from "../../../models/Result";
import {api} from "../../axios";

const getById = async (activityId: string, resolutionId: string, rawAccessToken: string, ): Promise<IResultResponse | ProblemDetail> => {
  api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;

  const response = await api.get<IResultResponse | ProblemDetail>(`/activities/${activityId}/resolutions/${resolutionId}/results`);

  return response.data;
};

export const ResultsService = {
  getById,
};