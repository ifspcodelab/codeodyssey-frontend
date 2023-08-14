import "@testing-library/jest-dom";
import CreateCourse from "./index"
import { render, fireEvent  } from "@testing-library/react";
import {describe, test, vi} from "vitest";
import {schema} from "../CreateCourse/schema.ts"
import {BrowserRouter} from "react-router-dom";

const cancelButtonId = "cancelButton"
const submitButtonId = "submitButton"
const nameFieldId = "nameField"
const slugFieldId = "slugField"
const startDateLabelName = "Start Date"
const endDateLabelName = "End Date"


describe("Create Course Form", () => {
  
  test("Should be able to see the title on the screen", () => {
    const {getByText} = render(
      <BrowserRouter>
        <CreateCourse/>
      </BrowserRouter>
    )

    expect(getByText("Create Course")).toBeInTheDocument();
  })

  test("Should be able to render the cancel button", () => {
    const {getByTestId} = render(
      <BrowserRouter>
        <CreateCourse/>
      </BrowserRouter>
    )

    expect(getByTestId(cancelButtonId)).toBeInTheDocument();
  })

  test("Should be able to render the submit button", () => {
    const {getByTestId} = render(
      <BrowserRouter>
        <CreateCourse/>
      </BrowserRouter>
    )

    expect(getByTestId(submitButtonId)).toBeInTheDocument();
  })

  test("Should name be validated", async () => {
    await expect(schema.validateAt('name', {name: ""})).rejects.toMatch(/This field is required./)
    await expect(schema.validateAt('name', {name: "react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react react "})).rejects.toMatch(/This field should be smaller than 255./)
    await expect(schema.validateAt('name', {name: "valid name"})).resolves.toBeTruthy()
  })

  test("Should slug be validated", async () => {
    await expect(schema.validateAt('slug', {slug: ""})).rejects.toMatch(/This field is required./)
    await expect(schema.validateAt('slug', {slug: "react native"})).rejects.toMatch(/This field cannot contain white space and special character/)
    await expect(schema.validateAt('slug', {slug: "react#3"})).rejects.toMatch(/This field cannot contain white space and special character/)
    await expect(schema.validateAt('slug', {slug: "validslug"})).resolves.toBeTruthy()
  })

  test("Should endDate be validated", async () => {
    await expect(schema.validateAt('endDate', {endDate: null})).rejects.toMatch(/This field is required./)
  })


  test("Should be able to render the form fields", () => {
    const {getByTestId, getByLabelText} = render(
      <BrowserRouter>
        <CreateCourse/>
      </BrowserRouter>
    )

    expect(getByTestId(nameFieldId)).toBeInTheDocument();
    expect(getByTestId(slugFieldId)).toBeInTheDocument();
    expect(getByLabelText(startDateLabelName)).toBeInTheDocument();
    expect(getByLabelText(endDateLabelName)).toBeInTheDocument();
  })

  test("Should be able to send create course form", () => {
    const { getByTestId } = render(
        <BrowserRouter>
            <CreateCourse/>
        </BrowserRouter>
    );

    fireEvent.click(getByTestId("submitButton"));
})

test("Should send request with data after form submission", async () => {
  const { getByTestId, getByLabelText } = render(
      <BrowserRouter>
          <CreateCourse />
      </BrowserRouter>
  );

  const nameInput = getByTestId("nameField")
  const slugInput = getByTestId('slugField')
  const startDate = getByLabelText(startDateLabelName)
  const endDate = getByLabelText(endDateLabelName)
  const submitButton =getByTestId('submitButton');

  fireEvent.change(nameInput, { target: { value: 'Java Spring' } });
  fireEvent.change(slugInput, { target: { value: 'java' } });
  fireEvent.change(startDate, { target: { value: '2023-12-01' } });
  fireEvent.change(endDate, { target: { value: '2024-01-01' } });

  fireEvent.click(submitButton);

  const result = await vi.fn();

  expect(result).toMatchSnapshot();
})

test("Should send to my courses page after clicking the submit button", async () => {
  const { getByTestId } = render(
      <BrowserRouter>
          <CreateCourse />
      </BrowserRouter>
  );

  const submitButton = getByTestId("submitButton")

  fireEvent.click(submitButton)

  const result = await vi.fn();

  expect(result).toMatchSnapshot("My Courses Page");
})
})