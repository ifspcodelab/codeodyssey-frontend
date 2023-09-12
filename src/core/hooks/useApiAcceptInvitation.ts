import {api} from "../services/axios";
import {JwtService} from "../auth/JwtService";

const jwtService = new JwtService();

export const useApiAcceptInvitation = () => ({
    acceptInvitation: async (invitationId: string) => {
        const raw = jwtService.getRawAccessToken() as string;
        api.defaults.headers['Authorization'] = 'Bearer ' + raw;
        const response = await api.post< | ProblemDetail>(`/invitations/${invitationId}/enrollments`);
        return response.data;
    }
})