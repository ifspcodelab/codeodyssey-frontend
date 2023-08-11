import {describe, test} from "vitest";
import Login from "./index";
import {render, fireEvent, waitFor} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import "@testing-library/jest-dom";
import userEvent from '@testing-library/user-event'


describe("Login", () => {
    test("Should be able to see all page elements on the screen", () => {
        const { getByRole, getByLabelText } = render(
            <BrowserRouter>
                <Login/>
            </BrowserRouter>
        );

        expect(getByRole("heading", { name: "Login"})).toBeInTheDocument();
        expect(getByRole("heading", { name: "Log in or Register"})).toBeInTheDocument();
        expect(getByRole("textbox", { name: "Email"})).toBeInTheDocument();
        expect(getByLabelText("Password")).toBeInTheDocument();
        expect(getByRole("button", { name: "Log In!"})).toBeInTheDocument();
        expect(getByRole("button", { name: "Register"})).toBeInTheDocument();
    })

    test("Should send valid email error message", async () => {
        const {getByText, getByLabelText} = render(
            <BrowserRouter>
                <Login/>
            </BrowserRouter>
        );

        const inputEmail = getByLabelText('Email') as HTMLInputElement;
        const inputPassword = getByLabelText('Password') as HTMLInputElement;
        const submitButton = getByText('Log In!') as HTMLButtonElement;

        fireEvent.change(inputEmail, {target: {value: 'johndoeemail.com'}});
        fireEvent.change(inputPassword, {target: {value: 'Password@01'}});

        expect(inputPassword.value).toEqual('Password@01');
        
        await waitFor(() => {
            void userEvent.click(submitButton);
            expect(getByText(/email must be a valid email/i)).toBeInTheDocument();
        })
    })
})