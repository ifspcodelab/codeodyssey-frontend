import { InvitationResponse } from "../models/InvitationResponse";
import {api} from "../services/axios";

export const useApiGetInvitation = () => ({
    getCourseInvitation: async (courseId: string, rawAccessToken: string) => {
        console.log("rawAccessToken: ", rawAccessToken);
        api.defaults.headers['Authorization'] = 'Bearer ' + rawAccessToken;
        const response = await api.get< | InvitationResponse>('/invitations/' + courseId);
        return response.data;
    }
})