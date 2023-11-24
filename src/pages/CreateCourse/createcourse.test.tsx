import "@testing-library/jest-dom";
import CreateCourse from "./index"
import { render, waitFor } from "@testing-library/react";
import { describe, test, vi } from "vitest";
import { schema } from "../CreateCourse/schema.ts"
import { BrowserRouter } from "react-router-dom";

const nameFieldId = "nameField"
const slugFieldId = "slugField"
const startDateLabelName = "Start Date"
const endDateLabelName = "End Date"
vi.mock('../../core/hooks/useApiCreateCourse', () => ({
  useApiCreateCourse: () => ({
    createCourse: vi.fn(),
  }),
}));
describe("Create Course Form", () => {

  test("Should be able to see the title on the screen", () => {
    const { getByText } = render(
      <BrowserRouter>
        <CreateCourse />
      </BrowserRouter>
    )

    expect(getByText("Create Course")).toBeInTheDocument();
  })

  test("Should be able to render the submit button", async () => {
    const { getByText } = render(
      <BrowserRouter>
        <CreateCourse />
      </BrowserRouter>
    )

    const createButton = await waitFor(() => getByText('Save'));
    expect(createButton).toBeInTheDocument();
  })

  test("Should name be validated", async () => {
    await expect(schema.validateAt('name', { name: "" })).rejects.toMatch(/This field is required./)
    await expect(schema.validateAt('name', { name: "react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react " })).rejects.toMatch(/This field should be smaller than 255./)
    await expect(schema.validateAt('name', { name: "valid name" })).resolves.toBeTruthy()
  })

  test("Should slug be validated", async () => {
    await expect(schema.validateAt('slug', { slug: "" })).rejects.toMatch(/This field is required./)
    await expect(schema.validateAt('slug', { slug: "react native" })).rejects.toMatch(/slug cannot contain special characters/)
    await expect(schema.validateAt('slug', { slug: "react#3" })).rejects.toMatch(/slug cannot contain special characters/)
    await expect(schema.validateAt('slug', { slug: "validslug" })).resolves.toBeTruthy()
  })

  test("Should endDate be validated", async () => {
    await expect(schema.validateAt('endDate', { endDate: null })).rejects.toMatch(/This field is required./)
  })

  test("Should be able to render the form fields", () => {
    const { getByTestId, getByLabelText } = render(
      <BrowserRouter>
        <CreateCourse />
      </BrowserRouter>
    )

    expect(getByTestId(nameFieldId)).toBeInTheDocument();
    expect(getByTestId(slugFieldId)).toBeInTheDocument();
    expect(getByLabelText(startDateLabelName)).toBeInTheDocument();
    expect(getByLabelText(endDateLabelName)).toBeInTheDocument();
  })
})