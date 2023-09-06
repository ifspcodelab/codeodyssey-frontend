import {api} from "../services/axios";
import {AccessToken} from "../auth/JwtService";

export const useApiAcceptInvitation = () => ({
    acceptInvitation: async (invitationId: string | undefined, rawAccessToken: AccessToken | null) => {
        api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;
        const response = await api.post< | ProblemDetail>(`/invitations/${invitationId}/enrollments`);

        return response.data;
    }
})