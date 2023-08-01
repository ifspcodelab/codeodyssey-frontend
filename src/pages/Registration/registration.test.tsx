import "@testing-library/jest-dom";
import { render, fireEvent, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import {describe, test, vi} from "vitest";
import Registration from "./index";
import {BrowserRouter, Router} from "react-router-dom";
import {schema} from "./index"
import { createMemoryHistory } from 'history';

const mockCreateUser = vi.fn((name: string, email: string, password: string, navigate: never) => {
    return Promise.resolve({ name, email, password, navigate })
})

describe("Registration", () => {

   test("Should be able to see the Page Header title on the screen", () => {
       const { getByText } = render(
           <BrowserRouter>
               <Registration createUser={mockCreateUser}/>
           </BrowserRouter>
       );

       expect(getByText("Registration")).toBeInTheDocument();
   })

    test("Should be able to see all the form fields", () => {
        const { getByLabelText, getByText } = render(
            <BrowserRouter>
                <Registration createUser={mockCreateUser}/>
            </BrowserRouter>
        );

        expect(getByText("Name")).toBeInTheDocument();
        expect(getByText("Email")).toBeInTheDocument();
        expect(getByText("Password")).toBeInTheDocument();
        expect(getByLabelText("I have read and agree with the Terms of Use and Privacy Policy")).toBeInTheDocument();
    })

    test("Should be able to see the login button text", () => {
        const { getByTestId } = render(
            <BrowserRouter>
                <Registration createUser={mockCreateUser}/>
            </BrowserRouter>
        );

        expect(getByTestId("loginButton")).toBeInTheDocument();
    })

    test("Should be able to see the submit button text", () => {
        const { getByTestId } = render(
            <BrowserRouter>
                <Registration createUser={mockCreateUser}/>
            </BrowserRouter>
        );

        expect(getByTestId("submitButton")).toBeInTheDocument();
    })

    test("Should name be validated", async () => {
        await expect(schema.validateAt('name', {})).rejects.toMatch(/name is a required field/)
        await expect(schema.validateAt('name', {name: "inv"})).rejects.toMatch(/name must be at least 5 characters/)
        await expect(schema.validateAt('name', {name: "invalid nameinvalid nameinvalid nameinvalid nameinvalid nameinvalid nameinvalid nameinvalid nameinval"})).rejects.toMatch(/name must be at most 100 characters/)
        await expect(schema.validateAt('name', {name: "valid name"})).resolves.toBeTruthy()
    })

    test("Should email be validated", async () => {
        await expect(schema.validateAt('email', {})).rejects.toMatch(/email is a required field/)
        await expect(schema.validateAt('email', {email: "email"})).rejects.toMatch(/email must be a valid email/)
        await expect(schema.validateAt('email', {email: "email@emailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemaile.com"})).rejects.toMatch(/email must be a valid email/)
        await expect(schema.validateAt('email', {email: 'ema`i´l\'"@email'})).rejects.toMatch(/email must be a valid email/)
        await expect(schema.validateAt('email', {email: "email@email"})).resolves.toBeTruthy()
    })

    test("Should password be validated", async () => {
        await expect(schema.validateAt('password', {})).rejects.toMatch(/password is a required field/)
        await expect(schema.validateAt('password', {password: "1A$a"})).rejects.toMatch(/password must be at least 8 characters/)
        await expect(schema.validateAt('password', {password: "invalidpassword"})).rejects.toMatch(/Password must have at least one digit/)
        await expect(schema.validateAt('password', {password: "invalidpassword1"})).rejects.toMatch(/Password must have at least one uppercase letter/)
        await expect(schema.validateAt('password', {password: "invalidpassword1A"})).rejects.toMatch(/Password must have at least one special character/)
        await expect(schema.validateAt('password', {password: "invalidpassword1Ainvalidpassword1Ainvalidpassword1Ainvalidpasswor"})).rejects.toMatch(/password must be at most 64 characters/)
        await expect(schema.validateAt('password', {password: "ValidPassword@1"})).resolves.toBeTruthy()
    })

    test("Should terms be validated", async () => {
        await expect(schema.validateAt('terms', {terms: false})).rejects.toMatch(/You must agree with the terms and privacy policy/)
        await expect(schema.validateAt('terms', {terms: true})).resolves.toBeTruthy()
    })

    test("Should be able to send registration request", () => {
        const { getByTestId } = render(
            <BrowserRouter>
                <Registration createUser={mockCreateUser}/>
            </BrowserRouter>
        );

        fireEvent.click(getByTestId("submitButton"));
    })

    test("Should send request with data after form submission", async () => {
        const { getByRole, getByLabelText } = render(
            <BrowserRouter>
                <Registration createUser={mockCreateUser} />
            </BrowserRouter>
        );

        const inputName = getByLabelText('Name') as HTMLInputElement;
        const inputEmail = getByLabelText('Email') as HTMLInputElement;
        const inputPassword = getByLabelText('Password') as HTMLInputElement;
        const inputTerms = getByLabelText('I have read and agree with the Terms of Use and Privacy Policy') as HTMLInputElement

        fireEvent.change(inputName, { target: { value: 'John Doe' } });
        fireEvent.change(inputEmail, { target: { value: 'johndoe@email.com' } });
        fireEvent.change(inputPassword, { target: { value: 'Password@01' } });
        fireEvent.change(inputTerms, { target: {value: true}})

        expect(inputName.value).toEqual('John Doe');
        expect(inputEmail.value).toEqual('johndoe@email.com');
        expect(inputPassword.value).toEqual('Password@01');
        expect(inputTerms.value).toEqual("true");

        fireEvent.click(inputTerms)

        await waitFor(() => {
            fireEvent.click(getByRole("button", {name: /submit/i}))
            expect(mockCreateUser).toBeCalled()
        })
    })

    test("Should send to login page after clicking the login button", async () => {
        const history = createMemoryHistory();

        history.push = vi.fn();

        const { getByText, getByTestId } = render(
            <Router location={history.location} navigator={history}>
                <Registration createUser={mockCreateUser}/>
            </Router>
        );

        expect(getByText(/^Registration$/i)).toBeInTheDocument()

        await waitFor(() => {
            userEvent.click(getByTestId("loginButton"))
            expect(history.push).toHaveBeenLastCalledWith({
                    "hash": "",
                    "pathname": "/login",
                    "search": "",
                },
                    undefined,
                    {},
            );
        })
    })

    test("Should show immutability message when hover email tooltip", () => {
        const {getByTestId, getByTitle} = render(
            <BrowserRouter>
                <Registration createUser={mockCreateUser}/>
            </BrowserRouter>
        )

        const toolTip = getByTestId("immutabilityMessage")
        const immutabilityMessage = getByTitle("the email is immutable")

        fireEvent.mouseEnter(toolTip)

        expect(immutabilityMessage).toBeVisible()
    })
});