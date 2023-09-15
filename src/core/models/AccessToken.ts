import {UserRole} from "./UserRole";

export interface AccessToken {
  role: UserRole,
  name: string,
  email: string,
  sub: string,
  iss: string,
  iat: number,
  exp: number,
}