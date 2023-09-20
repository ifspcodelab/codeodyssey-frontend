import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import Courses from '../Courses';
import { useApiGetCourses } from '../../core/hooks/useApiGetCourses.ts';
import { AuthContext } from '../../core/auth/AuthContext.tsx';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { UserRole } from "../../core/models/UserRole";
import CreateInviteModal from '../../components/CreateInviteModal/index.tsx';
import { test } from 'vitest';
import { useApiSendInvitation } from '../../core/hooks/useApiSendInvitation.ts';
import { useApiGetInvitation } from '../../core/hooks/useApiGetInvitation.ts';

vi.mock('../../core/hooks/useApiGetCourses.ts');
vi.mock('../../core/hooks/useApiSendInvitation.ts');
vi.mock('../../core/hooks/useApiGetInvitation.ts');

const mockGetCoursesStudent = vi.fn();
const mockGetCoursesProfessor = vi.fn();
const mockSendInvitations = vi.fn();
const mockGetInvitations = vi.fn();

vi.mock('../../core/auth/JwtService', () => ({
  JwtService: vi.fn().mockReturnValue({
    getRawAccessToken: vi.fn().mockReturnValue('test-token'),
  }),
}));

vi.mock('@mui/x-date-pickers/DatePicker', () => {
  return {
    DatePicker: vi.fn().mockImplementation(({ onChange }) => (
      <input data-testid="datePicker" onChange={onChange} />
    )),
  };
});

(useApiGetCourses as jest.Mock).mockReturnValue({
  getCoursesStudent: mockGetCoursesStudent,
  getCoursesProfessor: mockGetCoursesProfessor,
});

(useApiSendInvitation as jest.Mock).mockReturnValue({
  sendInvitation: mockSendInvitations,
});

(useApiGetInvitation as jest.Mock).mockReturnValue({
  getCourseInvitation: mockGetInvitations,
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

function renderCreateInviteModal() {
  return render(<CreateInviteModal course={{ id: "1", slug: "1", name: 'React Course', startDate: new Date(), endDate: new Date(), professor: { name: 'Moriarty', email: 'email@example.com', role: 'PROFESSOR' }, }} />);
}

function renderCoursesProfessor() {
  return render(
    <BrowserRouter>
      <MockAuthProvider role={UserRole.PROFESSOR}>
        <Courses />
      </MockAuthProvider>
    </BrowserRouter>
  );
}

function renderCoursesStudent() {
  return render(
    <BrowserRouter>
      <MockAuthProvider role={UserRole.STUDENT}>
        <Courses />
      </MockAuthProvider>
    </BrowserRouter>
  );
}

describe("Visualize my courses", () => {
  test("Should be able to see the Page Header title on the screen", () => {
    const { getByText } = renderCoursesProfessor()

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

    const { getByText } = renderCoursesProfessor()

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

    const { getByText } = renderCoursesStudent()

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

    const { getByText } = renderCoursesProfessor()

    const createInviteButton = await waitFor(() => getByText('Create Invite'));
    const visualizeStudentsButton = await waitFor(() => getByText('Visualize Students'));
    expect(createInviteButton).toBeInTheDocument();
    expect(visualizeStudentsButton).toBeInTheDocument();
  });

  test('Should be able to render empty list', async () => {
    mockGetCoursesStudent.mockResolvedValue([]);

    const { getByText } = renderCoursesStudent()

    const courseName = await waitFor(() => getByText('You do not participate in any course yet'));
    expect(courseName).toBeInTheDocument();
  });

  test('Should be able to render the modal button', () => {
    const { getByText } = renderCreateInviteModal()

    const inviteButton = getByText('Create Invite');

    expect(inviteButton).toBeInTheDocument();
  });

  test('Should be able to close the modal when the user clicks outside the modal', async () => {
    const { getByText } = renderCreateInviteModal()

    const inviteButton = await waitFor(() => getByText('Create Invite'));
    fireEvent.click(inviteButton);

    const modalTitle = await waitFor(() => getByText('Generate invite'));

    const modalBackdrop = document.querySelector('.MuiBackdrop-root');
    if (modalBackdrop !== null)
      fireEvent.click(modalBackdrop);

    expect(modalTitle).not.toBeInTheDocument();

  });

  test('Should be able to generate a link when the button is clicked', async () => {
    const { getByText, getByTestId } = renderCreateInviteModal()

    const inviteButton = getByText('Create Invite');
    fireEvent.click(inviteButton);

    const datePicker = getByTestId('datePicker');
    fireEvent.change(datePicker, { target: { value: '2023-12-30' } });

    const generateButton = getByText('Generate invite');
    fireEvent.click(generateButton);

    await waitFor(() => {
      const inviteLink = getByText('unexpected');
      expect(inviteLink).toBeInTheDocument();
    });
  });

  test('Should be able to open the modal when the button is clicked', async () => {
    const { getByText, getByTestId } = renderCreateInviteModal()

    const inviteButton = getByText('Create Invite');

    fireEvent.click(inviteButton);

    const modalTitle = await waitFor(() => getByText('Create invite'));
    const datePicker = await waitFor(() => getByTestId("datePicker"));
    expect(modalTitle).toBeInTheDocument();
    expect(datePicker).toBeInTheDocument();
  });
})
