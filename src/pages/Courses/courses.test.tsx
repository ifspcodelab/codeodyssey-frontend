import { render  } from "@testing-library/react";
import "@testing-library/jest-dom";
import {BrowserRouter} from "react-router-dom";
import Courses from "./index";

describe("Courses", () => {
      test("Should be able to see the Page Header title on the screen", () => {
        const { getByText } = render(
            <BrowserRouter>
                <Courses/>
            </BrowserRouter>
        );

        expect(getByText("My Courses")).toBeInTheDocument();
      })  
});