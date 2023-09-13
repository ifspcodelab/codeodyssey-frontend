
import { render, waitFor } from "@testing-library/react";
import Students from "../Students";
import { vi } from "vitest";
import { useApiGetStudents } from '../../core/hooks/useApiGetStudents.ts';
import { BrowserRouter } from "react-router-dom";
import '@testing-library/jest-dom';

vi.mock('../../core/hooks/useApiGetStudents.ts');
const mockGetStudents = vi.fn();

(useApiGetStudents as jest.Mock).mockReturnValue({
  getStudents: mockGetStudents,
});

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


});
