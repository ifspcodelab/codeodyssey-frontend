import {api} from "../../axios";
import {LoginResponse} from "../../../models/login";
import {RefreshTokenResponse} from "../../../models/RefreshTokenResponse.ts";
import {CreateUserResponse} from "../../../models/CreateUserResponse";

const login = async (email: string, password: string): Promise<LoginResponse | ProblemDetail> => {
  delete api.defaults.headers['Authorization'];
  const response = await api.post<LoginResponse | ProblemDetail>('/login', {email, password});

  return response.data;
};

const refreshToken = async (refreshToken: string): Promise<RefreshTokenResponse | ProblemDetail> => {
  const response = await api.post<RefreshTokenResponse | ProblemDetail>('/refreshtoken', {refreshToken});

  return response.data;
};

const register = async (name: string, email: string, password: string): Promise<CreateUserResponse | ProblemDetail> => {
  const response = await api.post<CreateUserResponse | ProblemDetail>('/users', {name, email, password});
        return response.data;
};

const confirmation = async (token: string | undefined): Promise<CreateUserResponse > => {
  const response = await api.patch<CreateUserResponse>(`/users/confirmation/${token}`);
  return response.data;
};

const resendConfirmationEmail = async (email: string): Promise<CreateUserResponse | ProblemDetail> => {
  const response = await api.post<CreateUserResponse | ProblemDetail>('/users/resend-email', {email});
  return response.data;
};


export const UserService = {
  login,
  refreshToken,
  register,
  confirmation,
  resendConfirmationEmail
};