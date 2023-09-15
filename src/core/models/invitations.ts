import {UserRole} from "./UserRole";


export interface EnrollmentResponse {
    id: string,
    invitation: InvitationResponse,
    student: StudentResponse,
    createdAt: string,
}

interface InvitationResponse {
    id: string,
    link: string | null,
    expirationDate: string,
    course: CourseResponse,
    createdAt: string,
}

interface StudentResponse {
    id: string,
    name: string,
    email: string,
    role: UserRole.STUDENT,
    createdAt: string,
}

interface CourseResponse {
    id: string,
    name: string,
    slug: string,
    startDate: string,
    endDate: string,
    professor: ProfessorResponse,
    createdAt: string,
}

interface ProfessorResponse {
    id: string,
    name: string,
    email: string,
    role: UserRole.PROFESSOR,
    createdAt: string,
}