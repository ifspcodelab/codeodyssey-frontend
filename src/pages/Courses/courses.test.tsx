import { render} from "@testing-library/react";
import "@testing-library/jest-dom";
import {describe, test, vi} from "vitest";
import {BrowserRouter} from "react-router-dom";
import Courses from "./index";

vi.mock('../../core/hooks/useApiGetCourses', () => ({
  useApiGetCourses: () => ({
    getCoursesProfessor: async () => [
      { id: 1, name: 'Course 1', professor: { name: 'Professor A' } },
      { id: 2, name: 'Course 2', professor: { name: 'Professor B' } },
    ],
    getCoursesStudent: async () => [
      { id: 3, name: 'Course 3', professor: { name: 'Professor C' } },
      { id: 4, name: 'Course 4', professor: { name: 'Professor D' } },
    ],
  }),
}));


describe("Courses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

      test("Should be able to see the Page Header title on the screen", () => {
        const { getByText } = render(
            <BrowserRouter>
                <Courses/>
            </BrowserRouter>
        );

        expect(getByText("My Courses")).toBeInTheDocument();
      })  

      test('should render all professor courses', async () => {
        const { findAllByText } = render(<BrowserRouter>
          <Courses/>
      </BrowserRouter>);
        const courseNames = await findAllByText(/Course \d/i);
        expect(courseNames).toHaveLength(2); 
      });
});