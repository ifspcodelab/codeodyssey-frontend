import { CourseResponse } from './CourseResponse';


export interface ActivityResponse {
  id: string,
  name: string,
  course: CourseResponse;
  extension: string,
  description: string,
  startDate: Date,
  endDate: Date,
}