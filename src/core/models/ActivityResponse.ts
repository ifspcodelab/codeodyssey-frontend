import { CourseResponse } from './CourseResponse';


export interface ActivityResponse {
  id: string,
  title: string,
  course: CourseResponse;
  extension: string,
  description: string,
  startDate: Date,
  endDate: Date,
}