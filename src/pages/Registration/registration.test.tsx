import "@testing-library/jest-dom";
import { render, fireEvent } from "@testing-library/react";
import {describe, test} from "vitest";
import Registration from "./index";
import {BrowserRouter} from "react-router-dom";
import {schema} from "../Registration/index.tsx"

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

    test("requires user's name", async () => {
        await expect(schema.validateAt('name', {})).rejects.toMatch(/name is a required field/)
        await expect(schema.validateAt('name', {name: "inv"})).rejects.toMatch(/name must be at least 5 characters/)
        await expect(schema.validateAt('name', {name: "valid name"})).resolves.toBeTruthy()
    })

    test("Should be able to send registration request", () => {
        const { getByTestId } = render(
            <BrowserRouter>
                <Registration/>
            </BrowserRouter>
        );

        fireEvent.click(getByTestId(submitButtonId));
    })
});