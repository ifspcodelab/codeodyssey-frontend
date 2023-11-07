import { UserResponse } from "../../../models/UserResponse";
import {api} from "../../axios";
import { InvitationResponse } from "../../../models/InvitationResponse";
import { JwtService } from "../../../auth/JwtService";
import {EnrollmentResponse} from "../../../models/invitations";

export interface ICourseResponse {
  id: string,
  name: string,
  slug: string,
  startDate: Date,
  endDate: Date,
  professor: UserResponse;
}

const jwtService = new JwtService();

const sendInvitation = async (expirationDate: string, courseId: string, rawAccessToken: string ): Promise<InvitationResponse | ProblemDetail> => {
  api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;

  const response = await api.post<InvitationResponse>('/courses/' + courseId + '/invitations', {expirationDate});

  return response.data;
}

const getInvitation = async (courseId: string, rawAccessToken: string): Promise<InvitationResponse> => {
  api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;
  const response = await api.get<InvitationResponse>('/invitations/' + courseId);
  return response.data;
};

const acceptInvitation = async (invitationId: string | undefined) : Promise<EnrollmentResponse> => {
  const raw = jwtService.getRawAccessToken() as string;
  api.defaults.headers['Authorization'] = 'Bearer ' + raw;
  const response = await api.post<EnrollmentResponse>(`/invitations/${invitationId}/enrollments`);
  return response.data 
};

export const InvitationService = {
  sendInvitation,
  getInvitation,
  acceptInvitation
};