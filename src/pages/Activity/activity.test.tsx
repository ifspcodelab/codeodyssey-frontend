import { render } from '@testing-library/react';
import Activity from '../Activity/index.tsx';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { test } from 'vitest';

function renderActivity() {
  return render(
    <BrowserRouter>
      <Activity />
    </BrowserRouter>
  );
}

describe("Visualize activity page", () => {
  test("Should be able to see the activity information on the screen", () => {
    const { getByText } = renderActivity()

    expect(getByText(/Professor/)).toBeInTheDocument();
    expect(getByText(/Course/)).toBeInTheDocument();
    expect(getByText(/Language/)).toBeInTheDocument();
    expect(getByText(/Date/)).toBeInTheDocument();
    expect(getByText(/Download File/)).toBeInTheDocument();
  })

  test("Should be able to see the submit resolution elements on the screen", () => {
    const { getByText } = renderActivity()

    expect(getByText(/Send Resolution/)).toBeInTheDocument();
    expect(getByText(/Click here to upload the file/)).toBeInTheDocument();

  })
})
