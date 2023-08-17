import {UserResponse} from "../../core/models/UserResponse";

export interface CourseResponse {
  name: string,
  slug: string,
  startDate: Date,
  endDate: Date,
  professor: UserResponse;
}