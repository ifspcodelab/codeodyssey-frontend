import {api} from "../../axios";
import { JwtService } from "../../../auth/JwtService";
import { IEnrollmentResponse, IInvitationResponse } from "../../../models/Invitation";

const jwtService = new JwtService();

const sendInvitation = async (expirationDate: string, courseId: string, rawAccessToken: string ): Promise<IInvitationResponse | ProblemDetail> => {
  api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;

  const response = await api.post<IInvitationResponse>('/courses/' + courseId + '/invitations', {expirationDate});

  return response.data;
}

const getInvitation = async (courseId: string, rawAccessToken: string): Promise<IInvitationResponse> => {
  api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;
  const response = await api.get<IInvitationResponse>('/invitations/' + courseId);
  return response.data;
};

const acceptInvitation = async (invitationId: string | undefined) : Promise<IEnrollmentResponse> => {
  const raw = jwtService.getRawAccessToken() as string;
  api.defaults.headers['Authorization'] = 'Bearer ' + raw;
  const response = await api.post<IEnrollmentResponse>(`/invitations/${invitationId}/enrollments`);
  return response.data 
};

export const InvitationService = {
  sendInvitation,
  getInvitation,
  acceptInvitation
};