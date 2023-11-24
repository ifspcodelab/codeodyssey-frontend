import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { test } from 'vitest';
import Result from './index';

function renderActivities() {
  return render(
    <BrowserRouter>
      <Result />
    </BrowserRouter>
  );
}

describe("Results", () => {
  test("Should be able to render the result page", () => {
    const { getByText } = renderActivities()

    expect(getByText(/Result/)).toBeInTheDocument();
    expect(getByText(/Total Time/)).toBeInTheDocument();
    expect(getByText(/Tests Passed/)).toBeInTheDocument();
  })
})
