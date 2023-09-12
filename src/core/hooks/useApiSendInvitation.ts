import { InviteReponse } from "../models/InviteResponse";
import {api} from "../services/axios";
// import InviteForm from '../../core/models/InviteForm.ts'


export const useApiSendInvitation = () => ({
  sendInvitation : async (expirationDate: string, courseId: string, rawAccessToken: string ): Promise<InviteReponse | ProblemDetail> => {
    api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;

      const response = await api.post<InviteReponse | ProblemDetail>('/courses/' + courseId + '/invitations', {expirationDate});

      console.log(response.data)
      return response.data;
  }
});