import "@testing-library/jest-dom";
import { render, fireEvent, waitFor } from "@testing-library/react";
import {describe, test, vi} from "vitest";
import Registration from "./index";
import {BrowserRouter, Router} from "react-router-dom";
import {schema} from "./schema";
import { createMemoryHistory } from 'history';
import {setupServer} from "msw/node";
import {rest} from "msw";
import userEvent from "@testing-library/user-event";

const MSW_URL = "http://localhost/users";

export const restHandlers = [
    rest.post(MSW_URL, async (req, res, ctx) => {
        console.log(req) // for build purposes
        return res(
            ctx.status(201),
            ctx.json(
                {
                    id: "9693be41-0eb2-44e8-8514-1379707c92b6",
                    name: "John Doe",
                    email: "johndoe@email.com",
                    role: "STUDENT",
                    createdAt: "2023-07-26T13:20:31.230343Z"
                }
            )
        )
    }),
]

const server = setupServer(...restHandlers)

beforeAll(() => void server.listen({ onUnhandledRequest: 'error' }))

afterAll(() => void server.close())

afterEach(() => server.resetHandlers())

function renderRegistration() {
    return render(
        <BrowserRouter>
            <Registration/>
        </BrowserRouter>
    );
}

describe("Registration", () => {

   test("Should be able to see the Page Header title on the screen", () => {
       const { getByText } = renderRegistration();

       expect(getByText("Registration")).toBeInTheDocument();
   })

    test("Should be able to see all the form fields", () => {
        const { getByLabelText } = renderRegistration();

        expect(getByLabelText("Name")).toBeInTheDocument();
        expect(getByLabelText("Email")).toBeInTheDocument();
        expect(getByLabelText("Password")).toBeInTheDocument();
        expect(getByLabelText("I have read and agree with the Terms of Use and Privacy Policy")).toBeInTheDocument();
    })

    test("Should be able to see the login button text", () => {
        const { getByTestId } = renderRegistration();

        expect(getByTestId("loginLink")).toBeInTheDocument();
    })

    test("Should be able to see the submit button text", () => {
        const { getByRole } = renderRegistration();

        expect(getByRole("button", {name: "Register"})).toBeInTheDocument();
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
        const { getByTestId } = renderRegistration();

        fireEvent.click(getByTestId("registerButton"));
    })

    test("Should send request with data after form submission", async () => {
        const history = createMemoryHistory();

        history.push = vi.fn();

        const { getByTestId, getByLabelText } = render(
            <Router location={history.location} navigator={history}>
                <Registration />
            </Router>
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
            void userEvent.click(getByTestId("registerButton"))
            expect(history.push).toHaveBeenLastCalledWith( {
                    "hash": "",
                    "pathname": "/resend-email",
                    "search": "",
                },
                {
                     "data": "johndoe@email.com",
                },
                {
                    "state": {
                        "data": "johndoe@email.com",
                    },
                }
            )
        })
    })

    test("Should send to login page after clicking the login button", () => {
        const { getByRole } = renderRegistration();

        const loginLink = getByRole("link", {name: "Login."})

        expect(loginLink).toBeInTheDocument()
        expect(loginLink).toHaveAttribute("href", "/login")
    })

    test("Should show immutability message", () => {
        const {getByText} = renderRegistration();

        const immutabilityMessage = getByText(/Won't be possible to change email/i)

        expect(immutabilityMessage).toBeInTheDocument()
    })

    test("Should show email error message on form submission", async () => {
        server.use(
            rest.post(MSW_URL, async (req, res, ctx) => {
                console.log(req) // for build purposes
                return res(
                    ctx.status(409),
                    ctx.json({
                        "type": "about:blank",
                        "title": "User Already exists",
                        "status": 409,
                        "detail": "Email already exists",
                        "instance": "/api/v1/users"
                    })
                )
            })
        )

        const {getByText, getByLabelText, getByTestId} = renderRegistration();

        const inputName = getByLabelText('Name') as HTMLInputElement;
        const inputEmail = getByLabelText('Email') as HTMLInputElement;
        const inputPassword = getByLabelText('Password') as HTMLInputElement;
        const inputTerms = getByLabelText('I have read and agree with the Terms of Use and Privacy Policy') as HTMLInputElement

        fireEvent.change(inputName, { target: { value: 'John Doe' } });
        fireEvent.change(inputEmail, { target: { value: 'johndoe@email.com' } });
        fireEvent.change(inputPassword, { target: { value: 'Password@01' } });
        fireEvent.change(inputTerms, { target: {value: true}})

        fireEvent.click(inputTerms)

        await waitFor(() => {
            void userEvent.click(getByTestId("registerButton"));
            expect(getByText("There was a problem with the email used")).toBeInTheDocument()
        })
    })

    test("Should show network error message on form submission", async () => {
        server.use(
            rest.post(MSW_URL,  (req, res, ctx) => {
                    console.log(req, ctx); // for build purposes
                    return res.networkError('Failed to connect');
                }
            ))

        const {getByText, getByLabelText, getByTestId} = renderRegistration();

        const inputName = getByLabelText('Name') as HTMLInputElement;
        const inputEmail = getByLabelText('Email') as HTMLInputElement;
        const inputPassword = getByLabelText('Password') as HTMLInputElement;
        const inputTerms = getByLabelText('I have read and agree with the Terms of Use and Privacy Policy') as HTMLInputElement;

        fireEvent.change(inputName, { target: { value: 'John Doe' } });
        fireEvent.change(inputEmail, { target: { value: 'johndoe@email.com' } });
        fireEvent.change(inputPassword, { target: { value: 'Password@01' } });
        fireEvent.change(inputTerms, { target: {value: true}});

        fireEvent.click(inputTerms);

        await void waitFor(() => {
            void userEvent.click(getByTestId("registerButton"));
            expect(getByText("Network error")).toBeInTheDocument();
        })
    })

    test("Should check if terms and privacy links have their respective href and target values", () => {
        const { getByRole } = renderRegistration();

        const registrationHeading = getByRole("heading", {name: "Registration"})
        const termsLink = getByRole("link", {name: "Terms of Use"})
        const privacyLink = getByRole("link", {name: "Privacy Policy"})

        expect(registrationHeading).toBeInTheDocument()
        expect(termsLink).toBeInTheDocument()
        expect(termsLink).toHaveAttribute("href", "/terms-of-use")
        expect(termsLink).toHaveAttribute("target", "_blank")
        expect(privacyLink).toBeInTheDocument()
        expect(privacyLink).toHaveAttribute("href", "/privacy-policy")
        expect(privacyLink).toHaveAttribute("target", "_blank")
    })
});