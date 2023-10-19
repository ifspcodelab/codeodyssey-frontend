import "@testing-library/jest-dom";
import CreateActivity from "./index"
import { render, waitFor } from "@testing-library/react";
import { describe, test, vi } from "vitest";
import { schema } from "../CreateActivity/schema.ts"
import { BrowserRouter } from "react-router-dom";

const descField = "descField"
const titleField = "titleField"
const startDateLabelName = "Start Date"
const endDateLabelName = "End Date"
const languageLabelName = "Language"

vi.mock('../../core/hooks/useApiCreateActivity', () => ({
  useApiCreateActivity: () => ({
    createActivity: vi.fn(),
  }),
}));

describe("Create Course Form", () => {

  test("Should be able to see the title on the screen", () => {
    const { getByText } = render(
      <BrowserRouter>
        <CreateActivity />
      </BrowserRouter>
    )

    expect(getByText(/Create Activity/)).toBeInTheDocument();
  })

  test("Should be able to render the publish button", async () => {
    const { getByText } = render(
      <BrowserRouter>
        <CreateActivity />
      </BrowserRouter>
    )

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

  test("Should be able to render the form fields", () => {
    const { getByTestId, getByLabelText } = render(
      <BrowserRouter>
        <CreateActivity />
      </BrowserRouter>
    )

    expect(getByTestId(descField)).toBeInTheDocument();
    expect(getByTestId(titleField)).toBeInTheDocument();
    expect(getByLabelText(startDateLabelName)).toBeInTheDocument();
    expect(getByLabelText(endDateLabelName)).toBeInTheDocument();
    expect(getByLabelText(languageLabelName)).toBeInTheDocument();
  })
})