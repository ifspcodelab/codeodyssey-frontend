import { render } from '@testing-library/react';
import Activities from '../Activities/index.tsx';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { test } from 'vitest';

function renderActivities() {
  return render(
    <BrowserRouter>
      <Activities />
    </BrowserRouter>
  );
}

describe("Visualize activities course", () => {
  test("Should be able to see the Page Header title and text on the screen", () => {
    const { getByText } = renderActivities()

    expect(getByText(/Activities/)).toBeInTheDocument();
    expect(getByText(/Course's activities/)).toBeInTheDocument();
  })


})
