import {UserResponse} from "../../core/models/UserResponse";

export interface CreateCourseResponse {
  name: string;
  slug: string;
  startDate: Date;
  endDate: Date;
  professor: UserResponse;
}