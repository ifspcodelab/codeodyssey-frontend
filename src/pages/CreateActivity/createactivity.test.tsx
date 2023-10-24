import "@testing-library/jest-dom";
import CreateActivity from "./index"
import { render, waitFor } from "@testing-library/react";
import { describe, test, vi } from "vitest";
import { schema } from "../CreateActivity/schema.ts"
import { BrowserRouter } from "react-router-dom";

vi.mock('../../core/hooks/useApiCreateActivity', () => ({
  useApiCreateActivity: () => ({
    createActivity: vi.fn(),
  }),
}));

function renderCreateActivity() {
  return render(
    <BrowserRouter>
      <CreateActivity />
    </BrowserRouter>
  );
}


describe("Create Activity Form", () => {

  test("Should be able to see the title on the screen", () => {
    const { getByText } = renderCreateActivity()

    expect(getByText(/Create Activity/)).toBeInTheDocument();
  })

  test("Should be able to render the publish button", async () => {
    const { getByText } = renderCreateActivity()

    const createButton = await waitFor(() => getByText(/Publish Activity/));
    expect(createButton).toBeInTheDocument();
  })

  test("Should startDate be validated", async () => {
    await expect(schema.validateAt('startDate', { startDate: null })).rejects.toMatch(/This field is required./)
  })

  test("Should endDate be validated", async () => {
    await expect(schema.validateAt('endDate', { endDate: null })).rejects.toMatch(/This field is required./)
  })

  test("Should title be validated", async () => {
    await expect(schema.validateAt('title', { title: "" })).rejects.toMatch(/This field is required./)
    await expect(schema.validateAt('title', { title: "react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react " })).rejects.toMatch(/This field should be smaller than 255./)
    await expect(schema.validateAt('title', { title: "desc" })).rejects.toMatch(/This field should be bigger than 5./)
  })

  test("Should description be validated", async () => {
    await expect(schema.validateAt('description', { description: "" })).rejects.toMatch(/This field is required./)
    await expect(schema.validateAt('description', { description: "desc" })).rejects.toMatch(/This field should be bigger than 5./)
  })

  test("Should extension be validated", async () => {
    await expect(schema.validateAt('extension', { extension: null })).rejects.toMatch(/This field is required./)
  })

  test("Should initialFile be validated", async () => {
    await expect(schema.validateAt('initialFile', { initialFile: null })).rejects.toMatch(/The initial file is required/)
  })

  test("Should testFile be validated", async () => {
    await expect(schema.validateAt('testFile', { testFile: null })).rejects.toMatch(/The test file is required/)
  })

  test("Should solutionFile be validated", async () => {
    await expect(schema.validateAt('solutionFile', { solutionFile: null })).rejects.toMatch(/The solution file is required/)
  })

  test("Should be able to render the form fields", async () => {
    const { getByLabelText } = renderCreateActivity()

    const titleLabel = await waitFor(() => getByLabelText('Title'));
    expect(titleLabel).toBeInTheDocument();
    const descLabel = await waitFor(() => getByLabelText('Description'));
    expect(descLabel).toBeInTheDocument();
    const startDateLabel = await waitFor(() => getByLabelText('Start Date'));
    expect(startDateLabel).toBeInTheDocument();
    const endDateLabel = await waitFor(() => getByLabelText('End Date'));
    expect(endDateLabel).toBeInTheDocument();
    const languageLabel = await waitFor(() => getByLabelText('Language'));
    expect(languageLabel).toBeInTheDocument();
  })
})