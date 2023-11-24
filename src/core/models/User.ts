export interface ILoginRequest {
  email: string,
  password: string,
}

export interface ILoginResponse {
  accessToken: string,
  refreshToken: string,
}

export interface IUserResponse {
  name: string;
  email: string;
  role: string;
  id: string;
}

export interface IRegistrationRequest {
  name: string,
  email: string,
  password: string,
}