import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import { test } from 'vitest';
import { rest } from 'msw'

import Courses from '../Courses';

const MSW_URL = "http://localhost/users/*/enrollments";

const server = setupServer(
  rest.get(MSW_URL, (req, res, ctx) => {
    console.log(req) // for build purposes
    return res(
      ctx.status(200),
      ctx.json([
        {
          "id": "43f55cfd-4dc0-4e23-ad36-52c634c61506",
          "name": "React",
          "slug": "courseSlug",
          "startDate": "2024-01-01",
          "endDate": "2024-01-02",
          "professor": {
            "id": "a19dc6bd-ac77-4ea0-b0ef-e9842231db17",
            "name": "Tony Stark",
            "email": "tonystark@email.com",
            "role": "PROFESSOR",
            "createdAt": "2023-11-07T18:12:30.862382Z"
          },
          "createdAt": "2023-11-07T18:37:34.054153Z"
        }
      ]),
    )
  }),
)

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

function renderEnrollments() {
  return render(
    <BrowserRouter>
      <Courses />
    </BrowserRouter>
  );
}

describe("Visualize my courses", () => {
  test("Should be able to see the Page title on the screen", () => {
    const { getByText } = renderEnrollments()

    expect(getByText("My Courses")).toBeInTheDocument();
  })

  test("Should be able to render the Enrollments Table", () => {
    const { getByText } = renderEnrollments()

    expect(getByText("Enrollments")).toBeInTheDocument();
    expect(getByText("Name")).toBeInTheDocument();
    expect(getByText("Professor")).toBeInTheDocument();
    expect(getByText("Start Date")).toBeInTheDocument();
    expect(getByText("End Date")).toBeInTheDocument();
    expect(getByText("Actions")).toBeInTheDocument();
  })

  test('Should be able to render courses student', async () => {
    const { getByText } = renderEnrollments()

    const courseName = await waitFor(() => getByText('React'));
    expect(courseName).toBeInTheDocument();

    const professorName = await waitFor(() => getByText('Tony Stark'));
    expect(professorName).toBeInTheDocument();

    const startDate = await waitFor(() => getByText("12/31/2023"));
    expect(startDate).toBeInTheDocument();

    const endDate = await waitFor(() => getByText("1/1/2024"));
    expect(endDate).toBeInTheDocument();
  })

  test('Should be able to render empty list', async () => {
    const { getByText } = renderEnrollments()

    server.use(
      rest.get(MSW_URL, (req, res, ctx) => {
        console.log(req) // for build purposes
        return res(
          ctx.json([]),
        )
      }),
    );

    const emptyMessage = await waitFor(() => getByText('You do not participate in any course yet'));
    expect(emptyMessage).toBeInTheDocument();
  });

})
