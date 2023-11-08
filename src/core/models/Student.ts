import { UserRole } from "./UserRole";

export interface IStudentResponse {
  id: string,
  name: string,
  email: string,
  role: UserRole.STUDENT,
  createdAt: string,
}
