import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import { test } from 'vitest';
import { rest } from 'msw'

import Course from '../Course/index.tsx';

const MSW_URL = "http://localhost/courses/*";

const server = setupServer(
  rest.get(MSW_URL, (req, res, ctx) => {
    console.log(req) // for build purposes
    return res(
      ctx.status(200),
      ctx.json(
        {
          "id": "43f55cfd-4dc0-4e23-ad36-52c634c61506",
          "name": "Course",
          "slug": "courseSlug",
          "startDate": "2024-01-01",
          "endDate": "2024-01-01",
          "professor": {
            "id": "a19dc6bd-ac77-4ea0-b0ef-e9842231db17",
            "name": "Tony Stark",
            "email": "tonystark@email.com",
            "role": "PROFESSOR",
            "createdAt": "2023-11-07T18:12:30.862382Z"
          },
          "createdAt": "2023-11-07T18:37:34.054153Z"
        }
      ),
    )
  }),
)

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

function renderEnrollments() {
  return render(
    <BrowserRouter>
      <Course />
    </BrowserRouter>
  );
}

describe("Visualize my courses", () => {
  test("Should be able to render the Course Card", () => {
    const { getByText } = renderEnrollments()

    expect(getByText("Professor")).toBeInTheDocument();
    expect(getByText("Start Date")).toBeInTheDocument();
    expect(getByText("End Date")).toBeInTheDocument();
  })
})
