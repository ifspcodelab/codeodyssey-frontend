import { CourseResponse } from './CourseResponse';

export interface InviteReponse {
  course: CourseResponse;
  expirationDate: string;
  id: string;
  link: string;
}