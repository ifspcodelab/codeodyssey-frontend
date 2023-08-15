import { render} from "@testing-library/react";
import "@testing-library/jest-dom";
import {describe, test, vi} from "vitest";
import {BrowserRouter} from "react-router-dom";
import Courses from "./index";

vi.mock('../../core/hooks/useApiGetCourses', () => ({
  useApiGetCourses: () => ({
    getCoursesProfessor: async () => [
      { id: 1, name: 'Course 1', professor: { name: 'Professor A' }, startDate: '2023-08-15',
      endDate: '2023-08-30', },
      { id: 2, name: 'Course 2', professor: { name: 'Professor B' }, startDate: '2023-08-18',
      endDate: '2023-11-30', },
    ],
    getCoursesStudent: async () => [
      { id: 3, name: 'Course 3', professor: { name: 'Professor C' }, startDate: '2023-08-16',
      endDate: '2023-09-30', },
      { id: 4, name: 'Course 4', professor: { name: 'Professor D' }, startDate: '2023-08-17',
      endDate: '2023-10-30', },
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

      test('should render all student courses', async () => {
        const { findAllByText } = render(<BrowserRouter>
          <Courses/>
      </BrowserRouter>);
        const courseNames = await findAllByText(/Course \d/i);
        expect(courseNames).toHaveLength(2);
      });

      it('renders course attributes correctly', async () => {
        const { findByText } = render(<BrowserRouter>
          <Courses/>
      </BrowserRouter>);
        
        const courseName = await findByText(/Course 3/i);
        const professorName = await findByText(/Professor C/i);
        const startDate = await findByText(/Aug 15, 2023/i);
        const endDate = await findByText(/Sep 29, 2023/i);
        
        expect(courseName).toBeInTheDocument();
        expect(professorName).toBeInTheDocument();
        expect(startDate).toBeInTheDocument();
        expect(endDate).toBeInTheDocument();
      });
});