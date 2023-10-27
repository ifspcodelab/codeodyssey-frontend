import { render } from '@testing-library/react';
import Course from '../Course/index.tsx';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { test } from 'vitest';

function renderCourse() {
  return render(
    <BrowserRouter>
      <Course />
    </BrowserRouter>
  );
}

describe("Visualize course page", () => {
  test("Should be able to see the buttons on the screen", () => {
    const { getByText } = renderCourse()

    expect(getByText(/Visualize Activities/)).toBeInTheDocument();
  })
})
