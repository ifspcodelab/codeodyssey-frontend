import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import {describe, test, vi} from "vitest";
import Registration from "./index";
import {BrowserRouter} from "react-router-dom";

const submitButtonId = "submitButton"

describe("Registration", () => {

   test("Should be able to see the Page Header title on the screen", () => {
       const { getByText } = render(
           <BrowserRouter>
               <Registration/>
           </BrowserRouter>
       );

       expect(getByText("Registration")).toBeInTheDocument();
   })

    test("Should be able to see the submit button text", () => {
        const { getByTestId } = render(
            <BrowserRouter>
                <Registration/>
            </BrowserRouter>
        );

        expect(getByTestId(submitButtonId)).toBeInTheDocument();
    })

    test("Should be able to send registration request", () => {
        const { getByTestId } = render(
            <BrowserRouter>
                <Registration/>
            </BrowserRouter>
        );

        fireEvent.click(screen.getByTestId(submitButtonId));
    })

    test("Should show error message if the checkbox is not checked", () => {
        const { getByLabelText, getByTestId, getByText } = render(
            <BrowserRouter>
                <Registration/>
            </BrowserRouter>
        );

        const termsCheckBox = getByLabelText("I have read and agree with the Terms of Use and Privacy Policy")
        const submitButton = getByTestId(submitButtonId)

        fireEvent.click(termsCheckBox);
        fireEvent.click(submitButton);

        expect(getByText("You must agree with the terms and privacy policy"))
    })
});