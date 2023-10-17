import { render, waitFor } from "@testing-library/react";
import Activities from "../Activities";
import { vi } from "vitest";
import { useApiGetActivities } from '../../core/hooks/useApiGetActivities.ts';
import { BrowserRouter } from "react-router-dom";
import '@testing-library/jest-dom';

vi.mock('../../core/hooks/useApiGetActivities.ts');
const mockGetActivities = vi.fn();

(useApiGetActivities as jest.Mock).mockReturnValue({
  getActivities: mockGetActivities,
});

describe("Students Component", () => {

  test("Should be able to render activities Page Header", async () => {

    const { getByText } = render(
      <BrowserRouter>
        <Activities />
      </BrowserRouter>
    );

    const title = await waitFor(() => getByText(/Activities/));
    const text = await waitFor(() => getByText(/Course's activities/));
    expect(title).toBeInTheDocument();
    expect(text).toBeInTheDocument();
  });


});
