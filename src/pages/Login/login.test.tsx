import {describe, test, vi} from "vitest";
import Login from "./index";
import {render, fireEvent, waitFor} from "@testing-library/react";
import {BrowserRouter, Router} from "react-router-dom";
import "@testing-library/jest-dom";
import userEvent from '@testing-library/user-event'
import {createMemoryHistory} from "history";
import {rest} from "msw";
import {setupServer} from "msw/node";

export const restHandlers = [
    rest.post('http://localhost:3000/login', (req, res, ctx) => {
        console.log(req) // for build purposes
        return res(
            ctx.status(200),
            ctx.json(
                {
                    "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiU1RVREVOVCIsIm5hbWUiOiJSYWZhZWwgU2ltw7VlcyBkZSBQYXVsYSIsImVtYWlsIjoicnNkZXBhdWxhNjdAZ21haWwuY29tIiwic3ViIjoiOWUwMDliODEtYTAwNi00ODEzLWI1NGYtMzdlYzYyODk5MDdhIiwiaXNzIjoiY29kZS1vZHlzc2V5IiwiaWF0IjoxNjkyMDIwMDE2LCJleHAiOjE2OTIwMjA5MTZ9.-BfeZnE_KVvefPLIDfo4fQ_ywg7YZkJ5a3OCMxG7pHM",
                    "refreshToken": "c96f21f3-545b-4893-9609-525fd829bf94"
                }
            )
        )
    }),
];

const server = setupServer(...restHandlers)

beforeAll(() => void server.listen({ onUnhandledRequest: 'error' }))

afterAll(() => void server.close())

afterEach(() => server.resetHandlers())

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

    test("Should send to registration page after clicking the register button", async () => {
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

    test("Should send to home page after clicking the login button", async () => {
        const history = createMemoryHistory();
        history.push = vi.fn();

        const { getByLabelText, getByRole } = render(
            <Router location={history.location} navigator={history}>
                <Login />
            </Router>
        );

        const inputEmail = getByRole("textbox", {name: "Email"});
        const inputPassword = getByLabelText("Password");
        const loginButton = getByRole("button", {name: "Login"});

        fireEvent.change(inputEmail, {target: {value: 'johndoe@email.com'}});
        fireEvent.change(inputPassword, {target: {value: 'Password@01'}});

        await waitFor(() => {
            void userEvent.click(loginButton)
            expect(history.push).toHaveBeenLastCalledWith({
                    "hash": "",
                    "pathname": "/",
                    "search": "",
                },
                undefined,
                {},
            );
        });
    });

    test("Should show error message when login fails", async () => {
        server.use(
            rest.post('http://localhost:3000/login', async (req, res, ctx) => {
                console.log(req) // for build purposes
                return res(
                    ctx.status(403),
                    ctx.json({
                        "type": "about:blank",
                        "title": "org.springframework.security.authentication.BadCredentialsException",
                        "status": 403,
                        "detail": "Bad credentials",
                        "instance": "/api/v1/login"
                    })
                )
            })
        );

        const {getByText, inputEmail, inputPassword, loginButton} = createTestVariables();

        fireEvent.change(inputEmail, {target: {value: 'john_doe@email.com'}});
        fireEvent.change(inputPassword, {target: {value: 'Password@02'}});

        await waitFor(() => {
            void userEvent.click(loginButton);
            expect(getByText(/Email or password is incorrect/i)).toBeInTheDocument();
        });
    });
});