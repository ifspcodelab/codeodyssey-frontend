import { CourseResponse } from './CourseResponse';

export interface InvitationResponse {
  id: string,
  course: CourseResponse;
  expirationDate: string;
  link: string | null,
  createdAt: string,
}
