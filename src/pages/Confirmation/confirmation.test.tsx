import {describe, test} from "vitest";
import {render} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import Confirmation from "./index";
import "@testing-library/jest-dom";
import {rest} from "msw";
import {setupServer} from "msw/node";

export const restHandlers = [
    rest.patch('http://localhost:3000/users/confirmation/undefined', (req, res, ctx) => {
        console.log(req) // for build purposes
        return res(
            ctx.status(200),
            ctx.json(
                {
                    "id": "b16107b2-a021-4da5-b4f5-bc3cd9e8c759",
                    "name": "John Doe",
                    "email": "john@doe.com",
                    "role": "STUDENT",
                    "createdAt": "2023-08-22T19:07:21.170037Z"
                }
            )
        )
    }),
];

const server = setupServer(...restHandlers)

beforeAll(() => void server.listen({ onUnhandledRequest: 'error' }))

afterAll(() => void server.close())

afterEach(() => server.resetHandlers())

function renderConfirmation() {
    return render(
        <BrowserRouter>
            <Confirmation/>
        </BrowserRouter>
    );
}

describe("Confirmation", () => {
    test("Should be able to see page header elements", () => {
        const { getByRole } = renderConfirmation();

        expect(getByRole("heading", { name: "Confirmation" })).toBeInTheDocument();
        expect(getByRole("heading", { name: "Email's confirmation" })).toBeInTheDocument();
    })

    test("Should show confirmation message", async () => {
        const { findByText } = renderConfirmation();

        expect(await findByText("The email \"john@doe.com\" was confirmed successfully")).toBeInTheDocument();
    });
});