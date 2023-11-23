import { render } from "@testing-library/react";
import Students from "../Students";
import { BrowserRouter } from "react-router-dom";
import '@testing-library/jest-dom';

describe("Students Component", () => {

  function renderEnrollments() {
    return render(
      <BrowserRouter>
        <Students />
      </BrowserRouter>
    );
  }

  test("Should be able to render the students Table", () => {
    const { getByText } = renderEnrollments()

    expect(getByText("Avatar")).toBeInTheDocument();
    expect(getByText("Name")).toBeInTheDocument();
    expect(getByText("E-mail")).toBeInTheDocument();
    expect(getByText("Actions")).toBeInTheDocument();
  })
});
