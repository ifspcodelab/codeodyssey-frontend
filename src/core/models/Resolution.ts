import { IActivityResponse } from "./Activity";
import { ResolutionStatus } from "./ResolutionStatus";
import { IUserResponse } from "./User";

export interface IResolutionForm<T = any> {
  resolutionFile: T ;
}

export interface IResolutionResponse {
  id: string;
  activity: IActivityResponse;
  student: IUserResponse;
  submitDate: string;
  resolutionFile: string;
  status: ResolutionStatus;
}