import {api} from "../services/axios";
// import InviteForm from '../../core/models/InviteForm.ts'


export const useApiSendInvitation = () => ({
  sendInvitation : async (expirationDate: Date, courseId: string, rawAccessToken: string ): Promise< | ProblemDetail> => {
    api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;

      const response = await api.post< | ProblemDetail>('/courses/' + courseId + '/invitations', {expirationDate});

      return response.data;
  }
});