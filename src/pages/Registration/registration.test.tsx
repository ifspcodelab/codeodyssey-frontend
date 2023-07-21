import "@testing-library/jest-dom";
import { render, fireEvent } from "@testing-library/react";
import {describe, test, vitest} from "vitest";
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

    test("Should send request with data after form submission", async () => {
        const { getByLabelText, getByTestId } = render(
            <BrowserRouter>
                <Registration />
            </BrowserRouter>
        );

        const inputName = getByLabelText('Name');
        const inputEmail = getByLabelText('Email');
        const inputPassword = getByLabelText('Password');
        const inputTerms = getByLabelText('I have read and agree with the Terms of Use and Privacy Policy')
        const submitButton =getByTestId('submitButton');

        fireEvent.change(inputName, { target: { value: 'John Doe' } });
        fireEvent.change(inputEmail, { target: { value: 'johndoe@email.com' } });
        fireEvent.change(inputPassword, { target: { value: 'Password@01' } });
        fireEvent.change(inputTerms, { target: {value: true}})

        fireEvent.click(submitButton);

        const result = await vitest.fn();

        expect(result).toMatchSnapshot();
    })

    test("Should send to login page after clicking the login button", async () => {
        const { getByText, getByTestId } = render(
            <BrowserRouter>
                <Registration />
            </BrowserRouter>
        );

        const loginButton = getByTestId("loginButton")

        fireEvent.click(loginButton)

        const result = await vitest.fn();

        expect(result).toMatchSnapshot("Login Page");
    })
});