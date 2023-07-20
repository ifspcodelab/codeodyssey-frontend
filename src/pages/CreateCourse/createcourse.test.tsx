import "@testing-library/jest-dom";
import CreateCourse from "./index"
import { render } from "@testing-library/react";
import {describe, test, vi} from "vitest";

const cancelButtonId = "cancelButton"
const submitButtonId = "submitButton"
const nameFieldId = "nameField"
const slugFieldId = "slugField"
const startDateLabelName = "Start Date"
const endDateLabelName = "End Date"


describe("Create Course Form", () => {
  
  test("Should be able to see the title on the screen", () => {
    const {getByText} = render(
      <CreateCourse/>
    )

    expect(getByText("Create Course")).toBeInTheDocument();
  })

  test("Should be able to render the cancel button", () => {
    const {getByTestId} = render(
      <CreateCourse/>
    )

    expect(getByTestId(cancelButtonId)).toBeInTheDocument();
  })

  test("Should be able to render the submit button", () => {
    const {getByTestId} = render(
      <CreateCourse/>
    )

    expect(getByTestId(submitButtonId)).toBeInTheDocument();
  })


  test("Should be able to render the form fields", () => {
    const {getByTestId, getByLabelText} = render(
      <CreateCourse/>
    )

    expect(getByTestId(nameFieldId)).toBeInTheDocument();
    expect(getByTestId(slugFieldId)).toBeInTheDocument();
    expect(getByLabelText(startDateLabelName)).toBeInTheDocument();
    expect(getByLabelText(endDateLabelName)).toBeInTheDocument();
  })

//   test("Should be able to fire event", () => {
//     const handleClick = vi.fn()
//     const mockOnSubmit = jest.fn()

//     const { getByTestId } = render(<CreateCourse onSubmit={mockOnSubmit}/>);
//     fireEvent.click(getByTestId(submitButtonId))

//     expect(handleClick).toHaveBeenCalledTimes(1)
    
//   })
})