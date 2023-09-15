import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import Courses from '../Courses';
import { useApiGetCourses } from '../../core/hooks/useApiGetCourses.ts';
import { AuthContext } from '../../core/auth/AuthContext.tsx';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import {UserRole} from "../../core/models/UserRole";
import CreateInviteModal from '../../components/CreateInviteModal/index.tsx';
import { test } from 'vitest';

vi.mock('../../core/hooks/useApiGetCourses.ts');

const mockGetCoursesStudent = vi.fn();
const mockGetCoursesProfessor = vi.fn();

(useApiGetCourses as jest.Mock).mockReturnValue({
  getCoursesStudent: mockGetCoursesStudent,
  getCoursesProfessor: mockGetCoursesProfessor,
});

interface MockAuthProviderProps {
  children: React.ReactNode;
  role: UserRole;
}

const MockAuthProvider: React.FC<MockAuthProviderProps> = ({ children, role }) => (
  <AuthContext.Provider
    value={{
      authenticated: true,
      setAuthenticated: vi.fn(),
      accessToken: 'test-token',
      setAccessToken: vi.fn(),
      id: '1',
      setId: vi.fn(),
      email: 'test@example.com',
      setEmail: vi.fn(),
      role: role,
      setRole: vi.fn(),
    }}
  >
    {children}
  </AuthContext.Provider>
);

describe("Visualize my courses", () => {
  test("Should be able to see the Page Header title on the screen", () => {
    const { getByText } = render(
      <BrowserRouter>
        <Courses />
      </BrowserRouter>
    );

    expect(getByText("My Courses")).toBeInTheDocument();
  })

  test('Should be able to render courses professor', async () => {
    const mockCourse = {
      id: 1,
      name: 'Java Spring Course',
      professor: { name: 'John Doe' },
      startDate: '8/30/2023',
      endDate: '9/30/2023',
    };

    mockGetCoursesProfessor.mockResolvedValue([mockCourse]);

    const { getByText } = render(
      <BrowserRouter>
        <MockAuthProvider role={UserRole.PROFESSOR}>
          <Courses />
        </MockAuthProvider>
      </BrowserRouter>
    );

    const element = await waitFor(() => getByText('Java Spring Course'));
    expect(element).toBeInTheDocument();

    const professorName = await waitFor(() => getByText('John Doe'));
    expect(professorName).toBeInTheDocument();

    const startDate = await waitFor(() => getByText(/8\/30\/2023/i));
    expect(startDate).toBeInTheDocument();

    const endDate = await waitFor(() => getByText(/9\/30\/2023/i));
    expect(endDate).toBeInTheDocument();
  });

  test('Should be able to render courses student', async () => {
    const mockCourse = {
      id: 1,
      name: 'React Course',
      professor: { name: 'Moriarty' },
      startDate: '8/30/2023',
      endDate: '9/30/2023',
    };

    mockGetCoursesStudent.mockResolvedValue([mockCourse]);

    const { getByText } = render(
      <BrowserRouter>
        <MockAuthProvider role={UserRole.STUDENT}>
          <Courses />
        </MockAuthProvider>
      </BrowserRouter>
    );

    const courseName = await waitFor(() => getByText('React Course'));
    expect(courseName).toBeInTheDocument();

    const professorName = await waitFor(() => getByText('Moriarty'));
    expect(professorName).toBeInTheDocument();

    const startDate = await waitFor(() => getByText(/8\/30\/2023/i));
    expect(startDate).toBeInTheDocument();

    const endDate = await waitFor(() => getByText(/9\/30\/2023/i));
    expect(endDate).toBeInTheDocument();
  });

  test('Should be able to render courses professor button', async () => {
    const mockCourse = {
      id: 1,
      name: 'React Course',
      professor: { name: 'Moriarty' },
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    };

    mockGetCoursesProfessor.mockResolvedValue([mockCourse]);

    const { getByText } = render(
      <BrowserRouter>
        <MockAuthProvider role={UserRole.PROFESSOR}>
          <Courses />
        </MockAuthProvider>
      </BrowserRouter>
    );

    const createInviteButton = await waitFor(() => getByText('Create Invite'));
    const visualizeStudentsButton = await waitFor(() => getByText('Visualize Students'));
    expect(createInviteButton).toBeInTheDocument();
    expect(visualizeStudentsButton).toBeInTheDocument();
  });

  test('Should be able to render empty list', async () => {
    mockGetCoursesStudent.mockResolvedValue([]);

    const { getByText } = render(
      <BrowserRouter>
        <MockAuthProvider role={UserRole.STUDENT}>
          <Courses />
        </MockAuthProvider>
      </BrowserRouter>
    );

    const courseName = await waitFor(() => getByText('You do not participate in any course yet'));
    expect(courseName).toBeInTheDocument();
  });

  test('Should be able to render the modal button', () => {
    const { getByText } = render(<CreateInviteModal course={{ id: "1", slug: "1", name: 'React Course', startDate: new Date(), endDate: new Date(), professor: { name: 'Moriarty', email: 'email@example.com', role: 'PROFESSOR' }, }} />);

    const inviteButton = getByText('Create Invite');

    expect(inviteButton).toBeInTheDocument();
  });

  // test('Should be able to open the modal when the button is clicked', async () => {
  //   const { getByText, getByLabelText } = render(<CreateInviteModal course={{ id: "1", slug: "1", name: 'React Course', startDate: new Date(), endDate: new Date(), professor: { name: 'Moriarty', email: 'email@example.com', role: 'PROFESSOR' }, }} />);
  //
  //   const inviteButton = getByText('Create Invite');
  //
  //   fireEvent.click(inviteButton);
  //
  //   const endDateLabelName = "Expiration date"
  //   const modalTitle = await waitFor(() => getByText('Create invite'));
  //
  //   expect(modalTitle).toBeInTheDocument();
  //   expect(getByLabelText(endDateLabelName)).toBeInTheDocument();
  // });

  // test('Should be able to close the modal when the user clicks outside the modal', async () => {
  //   const { getByText } = render(<CreateInviteModal course={{ id: "1", slug: "1", name: 'React Course', startDate: new Date(), endDate: new Date(), professor: { name: 'Moriarty', email: 'email@example.com', role: 'PROFESSOR' }, }} />);
  //
  //   const inviteButton = await waitFor(() => getByText('Create Invite'));
  //   fireEvent.click(inviteButton);
  //
  //   const modalTitle = await waitFor(() => getByText('Generate invite'));
  //
  //   const modalBackdrop = document.querySelector('.MuiBackdrop-root');
  //   if (modalBackdrop !== null)
  //     fireEvent.click(modalBackdrop);
  //
  //   expect(modalTitle).not.toBeInTheDocument();
  //
  // });


})
