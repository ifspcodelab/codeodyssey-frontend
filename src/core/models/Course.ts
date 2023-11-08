import { IUserResponse } from "./User";

export interface ICourseResponse {
  id: string,
  name: string,
  slug: string,
  startDate: Date,
  endDate: Date,
  professor: IUserResponse,
  createdAt: string,
}

export interface ICourseRequest{
  name: string;
  slug: string;
  startDate: Date;
  endDate: Date;
}