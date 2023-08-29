import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Courses from "./index";

describe("Courses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  vi.mock('../../core/hooks/useApiGetCourses', () => ({
    useApiGetCourses: () => ({
      getCoursesStudent: () => [
        {
          id: 1, name: 'Course 1', professor: { name: 'Professor A' }, startDate: '2023-08-15',
          endDate: '2023-08-30',
        },
        {
          id: 2, name: 'Course 2', professor: { name: 'Professor B' }, startDate: '2023-08-18',
          endDate: '2023-11-30',
        },
      ],
      getCoursesProfessor: () => [
        {
          id: 3, name: 'Course 3', professor: { name: 'Professor C' }, startDate: '2023-08-16',
          endDate: '2023-09-30',
        },
        {
          id: 4, name: 'Course 4', professor: { name: 'Professor D' }, startDate: '2023-08-17',
          endDate: '2023-10-30',
        },
      ],
    }),
  }));

  test("Should be able to see the Page Header title on the screen", () => {
    const { getByText } = render(
        <BrowserRouter>
            <Courses/>
        </BrowserRouter>
    );

    expect(getByText("My Courses")).toBeInTheDocument();
  })  

  test('should render course attributes correctly', async () => {
    const { findByText } = render(
      <BrowserRouter>
        <Courses/>
      </BrowserRouter>);

    const courseName = await findByText(/Course 1/i);
    const professorName = await findByText(/Professor A/i);
    const startDate = await findByText(/8\/15\/2023/i);
    const endDate = await findByText(/8\/30\/2023/i);

    expect(courseName).toBeInTheDocument();
    expect(professorName).toBeInTheDocument();
    expect(startDate).toBeInTheDocument();
    expect(endDate).toBeInTheDocument();
  });

  test("should render all student courses", async () => {
    const { findAllByText } = render(
      <BrowserRouter>
        <Courses />
      </BrowserRouter>
    );
    const courseNames = await findAllByText(/Course \d/i);

    expect(courseNames).toHaveLength(2);
  })
});


