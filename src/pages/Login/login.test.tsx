import {describe, test, vi} from "vitest";
import Login from "./index";
import {render, fireEvent, waitFor} from "@testing-library/react";
import {BrowserRouter, Router} from "react-router-dom";
import "@testing-library/jest-dom";
import userEvent from '@testing-library/user-event'
import {createMemoryHistory} from "history";

function renderLogin() {
    return render(
        <BrowserRouter>
            <Login/>
        </BrowserRouter>
    );
}

const createTestVariables = () => {
    const {getByText, getByRole, getByLabelText} = renderLogin()

    const inputEmail = getByLabelText('Email') as HTMLInputElement;
    const inputPassword = getByLabelText('Password') as HTMLInputElement;
    const loginButton = getByRole('button', { name: 'Login' }) as HTMLButtonElement;

    return { getByRole, getByLabelText, inputEmail, inputPassword, loginButton, getByText }
}

describe("Login", () => {
    test("Should be able to see all page elements on the screen", () => {
        const { getByRole, getByLabelText } = renderLogin();

        expect(getByRole("heading", { name: "Login"})).toBeInTheDocument();
        expect(getByRole("heading", { name: "Sign in or Register"})).toBeInTheDocument();
        expect(getByRole("textbox", { name: "Email"})).toBeInTheDocument();
        expect(getByLabelText("Password")).toBeInTheDocument();
        expect(getByRole("button", { name: "Login"})).toBeInTheDocument();
        expect(getByRole("button", { name: "Register"})).toBeInTheDocument();
    })

    test("Should send required email error message", async () => {
        const {getByText, inputEmail, inputPassword, loginButton} = createTestVariables();

        fireEvent.change(inputEmail, {target: {value: ''}});
        fireEvent.change(inputPassword, {target: {value: 'Password@01'}});

        expect(inputPassword.value).toEqual('Password@01');

        await waitFor(() => {
            void userEvent.click(loginButton);
            expect(getByText(/email is a required field/i)).toBeInTheDocument();
        })
    })

    test("Should send valid email error message", async () => {
        const {getByText, inputEmail, inputPassword, loginButton} = createTestVariables();

        fireEvent.change(inputEmail, {target: {value: 'johndoeemail.com'}});
        fireEvent.change(inputPassword, {target: {value: 'Password@01'}});

        expect(inputPassword.value).toEqual('Password@01');
        
        await waitFor(() => {
            void userEvent.click(loginButton);
            expect(getByText(/email must be a valid email/i)).toBeInTheDocument();
        })
    })

    test("Should send uppercase letter error message", async () => {
        const {getByText, inputEmail, inputPassword, loginButton} = createTestVariables();

        fireEvent.change(inputEmail, {target: {value: 'johndoe@email.com'}});
        fireEvent.change(inputPassword, {target: {value: 'password@01'}});

        expect(inputEmail.value).toEqual('johndoe@email.com');

        await waitFor(() => {
            void userEvent.click(loginButton);
            expect(getByText(/Password must have at least one uppercase letter/i)).toBeInTheDocument();
        })
    })

    test("Should send uppercase letter error message", async () => {
        const {getByText, inputEmail, inputPassword, loginButton} = createTestVariables();

        fireEvent.change(inputEmail, {target: {value: 'johndoe@email.com'}});
        fireEvent.change(inputPassword, {target: {value: 'PASSWORD@01'}});

        expect(inputEmail.value).toEqual('johndoe@email.com');

        await waitFor(() => {
            void userEvent.click(loginButton);
            expect(getByText(/Password must have at least one lowercase letter/i)).toBeInTheDocument();
        })
    })

    test("Should send special character error message", async () => {
        const {getByText, inputEmail, inputPassword, loginButton} = createTestVariables();

        fireEvent.change(inputEmail, {target: {value: 'johndoe@email.com'}});
        fireEvent.change(inputPassword, {target: {value: 'Passworda01'}});

        expect(inputEmail.value).toEqual('johndoe@email.com');

        await waitFor(() => {
            void userEvent.click(loginButton);
            expect(getByText(/Password must have at least one special character/i)).toBeInTheDocument();
        })
    })

    test("Should send digits error message", async () => {
        const {getByText, inputEmail, inputPassword, loginButton} = createTestVariables();


        fireEvent.change(inputEmail, {target: {value: 'johndoe@email.com'}});
        fireEvent.change(inputPassword, {target: {value: 'Password@ab'}});

        expect(inputEmail.value).toEqual('johndoe@email.com');

        await waitFor(() => {
            void userEvent.click(loginButton);
            expect(getByText(/Password must have at least one digit/i)).toBeInTheDocument();
        })
    })

    test("Should send required email error message", async () => {
        const {getByText, inputEmail, inputPassword, loginButton} = createTestVariables();

        fireEvent.change(inputEmail, {target: {value: 'johndoe@email.com'}});
        fireEvent.change(inputPassword, {target: {value: ''}});

        expect(inputEmail.value).toEqual('johndoe@email.com');

        await waitFor(() => {
            void userEvent.click(loginButton);
            expect(getByText(/password is a required field/i)).toBeInTheDocument();
        })
    })

    test("Should send minimum characters length error message", async () => {
        const {getByText, inputEmail, inputPassword, loginButton} = createTestVariables();

        fireEvent.change(inputEmail, {target: {value: 'johndoe@email.com'}});
        fireEvent.change(inputPassword, {target: {value: 'Pass@01'}});

        expect(inputEmail.value).toEqual('johndoe@email.com');

        await waitFor(() => {
            void userEvent.click(loginButton);
            expect(getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
        })
    })

    test("Should send maximum characters length error message", async () => {
        const {getByText, inputEmail, inputPassword, loginButton} = createTestVariables();

        fireEvent.change(inputEmail, {target: {value: 'johndoe@email.com'}});
        fireEvent.change(inputPassword, {target: {value: 'Password@01Password@01Password@01Password@01Password@01Password@0'}});

        expect(inputEmail.value).toEqual('johndoe@email.com');

        await waitFor(() => {
            void userEvent.click(loginButton);
            expect(getByText(/password must be at most 64 characters/i)).toBeInTheDocument();
        })
    })

    test("Should send to login page after clicking the login button", async () => {
        const history = createMemoryHistory();
        history.push = vi.fn();

        const { getByRole } = render(
            <Router location={history.location} navigator={history}>
                <Login />
            </Router>
        );

        const loginHeading = getByRole("heading", {name: "Login"});
        const registrationButton = getByRole("button", {name: "Register"});

        expect(loginHeading).toBeInTheDocument();

        await waitFor(() => {
            void userEvent.click(registrationButton)
            expect(history.push).toHaveBeenLastCalledWith({
                    "hash": "",
                    "pathname": "/registration",
                    "search": "",
                },
                undefined,
                {},
            );
        });
    });
});