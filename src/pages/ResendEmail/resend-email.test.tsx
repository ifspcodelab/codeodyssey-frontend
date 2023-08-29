import {describe, test, vi} from "vitest";
import {render, waitFor, fireEvent} from "@testing-library/react";
import ResendEmail from "./index";
import {BrowserRouter} from "react-router-dom";
import "@testing-library/jest-dom";
import {rest} from "msw";
import {setupServer} from "msw/node";

interface UseLocationType {
    state: {
        data: string,
    }
}

const mockUseLocation = vi.fn().mockImplementation(() => {return { state: {data: "johndoe@email.com"}}})

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom") as object;
    return {
        ...actual,
        useLocation: () => mockUseLocation() as UseLocationType,
    }
})

function renderResendEmail() {
    return render(
        // <RouterProvider router={router}/>
        <BrowserRouter>
            <ResendEmail/>
        </BrowserRouter>
    );
}

export const restHandlers = [
    rest.post('http://localhost:3000/users/resend-email', (req, res, ctx) => {
        console.log(req) // for build purposes
        return res(
            ctx.status(200),
            ctx.json(
                {
                    "id": "c29a994b-4423-499f-b09e-f3c92679b974",
                    "name": "John Doe",
                    "email": "johndoe@email.com",
                    "role": "STUDENT",
                    "createdAt": "2023-08-29T18:41:42.042243Z"
                }
            )
        )
    }),
];

const server = setupServer(...restHandlers)

beforeAll(() => void server.listen({ onUnhandledRequest: 'error' }))

afterAll(() => void server.close())

afterEach(() => server.resetHandlers())

describe("Resend Email", () => {
    test("Should be able to see page elements on the screen", () => {
        const {getByRole} = renderResendEmail();

        expect(getByRole("heading", { name: "Resend email"})).toBeInTheDocument();
        expect(getByRole("heading", { name: "In case you didn't receive the email, you can resend it by clicking the link below after one minute has passed."})).toBeInTheDocument();
        expect(getByRole("heading", { name: "The system has sent a confirmation email to johndoe@email.com. Check your email."})).toBeInTheDocument();
        expect(getByRole("button", { name: "here"})).toBeInTheDocument();
    });

    test("Should show successfull message when user clicks on the resend button", async () => {
        const {getByRole, getByText} = renderResendEmail();

        const resendButton = getByRole("button", { name: "here"});

        fireEvent.click(resendButton);

        await waitFor(() => {
            expect(getByText("The email was resent successfully.")).toBeInTheDocument();
        });
    });
});