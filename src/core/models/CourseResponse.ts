import {UserResponse} from "../../core/models/UserResponse";

export interface CourseResponse {
  id: string,
  name: string,
  slug: string,
  startDate: Date,
  endDate: Date,
  professor: UserResponse;
  createdAt: string,
}