import {api} from "../../axios";
import {RefreshTokenResponse} from "../../../models/RefreshTokenResponse.ts";
import { ILoginResponse, IRegistrationRequest } from "../../../models/User.ts";

const login = async (email: string, password: string): Promise<ILoginResponse | ProblemDetail> => {
  delete api.defaults.headers['Authorization'];
  const response = await api.post<ILoginResponse | ProblemDetail>('/login', {email, password});

  return response.data;
};

const refreshToken = async (refreshToken: string): Promise<RefreshTokenResponse | ProblemDetail> => {
  const response = await api.post<RefreshTokenResponse | ProblemDetail>('/refreshtoken', {refreshToken});

  return response.data;
};

const register = async (name: string, email: string, password: string): Promise<IRegistrationRequest | ProblemDetail> => {
  const response = await api.post<IRegistrationRequest | ProblemDetail>('/users', {name, email, password});
        return response.data;
};

const confirmation = async (token: string | undefined): Promise<IRegistrationRequest > => {
  const response = await api.patch<IRegistrationRequest>(`/users/confirmation/${token}`);
  return response.data;
};

const resendConfirmationEmail = async (email: string): Promise<IRegistrationRequest | ProblemDetail> => {
  const response = await api.post<IRegistrationRequest | ProblemDetail>('/users/resend-email', {email});
  return response.data;
};

export const UserService = {
  login,
  refreshToken,
  register,
  confirmation,
  resendConfirmationEmail
};