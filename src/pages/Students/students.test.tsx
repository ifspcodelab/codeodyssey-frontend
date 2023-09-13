
import { act, render, waitFor, screen } from "@testing-library/react";
import Students from "../Students";
import { vi } from "vitest";
import { useApiGetStudents } from '../../core/hooks/useApiGetStudents.ts';
import { BrowserRouter } from "react-router-dom";
import '@testing-library/jest-dom';
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
vi.mock('../../core/hooks/useApiGetStudents.ts');
const mockGetStudents = vi.fn();

(useApiGetStudents as jest.Mock).mockReturnValue({
  getStudents: mockGetStudents,
});

const mock = new MockAdapter(axios);

describe("Students Component", () => {
  test("Should be able to render the page title", async () => {
    const { getByText } = render(
      <BrowserRouter>
        <Students />
      </BrowserRouter>
    );

    const title = await waitFor(() => getByText('My Students'));
    const text = await waitFor(() => getByText('Course students'));
    expect(title).toBeInTheDocument();
    expect(text).toBeInTheDocument();
  });

  test("Should be able to fetch students successfully", async () => {
    const USER_ID = "123";
    const courseSlug = "math101";
    const rawAccessToken = "your-raw-access-token";
    const mockStudents = [
      { id: 1, name: "Student 1", email: "student1@example.com" },
      { id: 2, name: "Student 2", email: "student2@example.com" },
    ];

    mockGetStudents.mockResolvedValue({ data: mockStudents });

    mock.onGet(`/users/${USER_ID}/courses/${courseSlug}/students`).reply(200, mockStudents);

    const api = useApiGetStudents();
    const { data: studentsResponse } = await api.getStudents(USER_ID, courseSlug, rawAccessToken);

    expect(studentsResponse).toEqual(mockStudents);
  });
});
