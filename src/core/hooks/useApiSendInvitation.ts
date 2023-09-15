import { InvitationResponse } from "../models/InvitationResponse";
import {api} from "../services/axios";
// import InviteForm from '../../core/models/InviteForm.ts'


export const useApiSendInvitation = () => ({
  sendInvitation : async (expirationDate: string, courseId: string, rawAccessToken: string ): Promise<InvitationResponse> => {
    api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;

      const response = await api.post<InvitationResponse>('/courses/' + courseId + '/invitations', {expirationDate});

      console.log(response.data)
      return response.data;
  }
});