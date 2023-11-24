import { ICourseResponse } from "./Course";
import { IStudentResponse } from "./Student";

export interface IInvitationRequest {
  expirationDate: Date,
}

export interface InviteForm {
  endDate: Date,
}

export interface IInvitationResponse {
  id: string,
  course: ICourseResponse;
  expirationDate: string;
  link: string ,
  createdAt: string,
}

export interface IEnrollmentResponse {
  id: string,
  invitation: IInvitationResponse,
  student: IStudentResponse,
  createdAt: string,
}