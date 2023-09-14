import {describe, test} from "vitest";
import {render} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import Confirmation from "./index";
import "@testing-library/jest-dom";
import {rest} from "msw";
import {setupServer} from "msw/node";

const MSW_URL = "http://localhost/users/confirmation/undefined";

export const restHandlers = [
    rest.patch(MSW_URL, (req, res, ctx) => {
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

    test("Should show email already confirmed message", async () => {
        server.use(
            rest.patch(MSW_URL, (req, res, ctx) => {
                console.log(req) // for build purposes
                return res(
                    ctx.status(409),
                    ctx.json(
                        {
                            "type": "about:blank",
                            "title": "Validation",
                            "status": 409,
                            "detail": "User is already validated",
                            "instance": "/api/v1/users/confirmation/acb046e9-5127-4260-ad36-c8e3544699ed"
                        }
                    )
                )
            }),
        );

        const { findByText } = renderConfirmation();

        expect(await findByText("The email has already been confirmed")).toBeInTheDocument();
    });

    test("Should show user not found message", async () => {
        server.use(
            rest.patch(MSW_URL, (req, res, ctx) => {
                console.log(req) // for build purposes
                return res(
                    ctx.status(404),
                    ctx.json(
                        {
                            "type": "about:blank",
                            "title": "Token problem",
                            "status": 404,
                            "detail": "No user associated with this token",
                            "instance": "/api/v1/users/confirmation/acb046e9-5127-4260-ad36-c8e3544699ed"
                        }
                    )
                )
            }),
        );

        const { findByText } = renderConfirmation();

        expect(await findByText("No user found with given token")).toBeInTheDocument();
    });

    test("Should show token expired message", async () => {
        server.use(
            rest.patch(MSW_URL, (req, res, ctx) => {
                console.log(req) // for build purposes
                return res(
                    ctx.status(404),
                    ctx.json(
                        {
                            "type": "about:blank",
                            "title": "Token problem",
                            "status": 404,
                            "detail": "Token Expired",
                            "instance": "/api/v1/users/confirmation/acb046e9-5127-4260-ad36-c8e3544699ed"
                        }
                    )
                )
            }),
        );

        const { findByText } = renderConfirmation();

        expect(await findByText("The confirmation token is expired")).toBeInTheDocument();
    });

    // test("Should show network error message", async () => {
    //     server.use(
    //         rest.patch(MSW_URL, (req, res, ctx) => {
    //             console.log(req, ctx) // for build purposes
    //             return res.networkError('Failed to connect'); // << This is not working
    //         }),
    //     );
    //
    //     const { findByText } = renderConfirmation();
    //
    //     expect(await findByText("There was a connection error")).toBeInTheDocument();
    // });
});