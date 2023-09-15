import {describe, test} from "vitest";
import Invitation from "./index";
import {BrowserRouter} from "react-router-dom";
import {render, waitFor} from "@testing-library/react";
import {rest} from "msw";
import {setupServer} from "msw/node";
import "@testing-library/jest-dom";


const MSW_URL = 'http://localhost/invitations/undefined/enrollments'

export const restHandlers = [
    rest.post(MSW_URL, async (req, res, ctx) => {
        console.log(req) // for build purposes
        return res(
            ctx.status(201),
            ctx.json(
                {
                    "id": "1434a8a4-a558-4c47-b513-d39bb996b96c",
                    "invitation":  {
                        "id": "09246a18-cf5e-4b7d-960f-b5248ad51b16",
                        "link": null,
                        "expirationDate": "2023-09-30",
                        "course": {
                            "id": "50202211-b192-4d8a-92fa-48e09c6df67a",
                            "name": "Example Course",
                            "slug": "example-course",
                            "startDate": "2023-09-05",
                            "endDate": "2023-09-30",
                            "professor": {
                                "id": "88a0addb-4d6a-48e2-a800-e8227515a433",
                                "name": "John Doe",
                                "email": "john@doe.com",
                                "role": "PROFESSOR",
                                "createdAt": "2023-09-05T18:50:48.388242Z"
                            },
                            "createdAt": "2023-09-05T19:06:24.285097Z"
                        },
                        "createdAt": "2023-09-11T17:52:01.767371Z"
                    },
                    "student": {
                        "id": "82f66168-1013-4dc1-a7bd-31da68a31dc9",
                            "name": "John Doe Jr",
                            "email": "johnjr@doe.com",
                            "role": "STUDENT",
                            "createdAt": "2023-09-01T19:01:00.815498Z"
                    },
                    "createdAt": "2023-09-12T17:22:26.474552600Z"
                }
            )
        )
    }),
];

const server = setupServer(...restHandlers)

beforeAll(() => {void server.listen({ onUnhandledRequest: 'error' })})

afterAll(() => void server.close())

afterEach(() => server.resetHandlers())

const renderInvitation = () => {
    return render(
        <BrowserRouter>
            <Invitation/>
        </BrowserRouter>
    );
}

describe("Invitation", () => {
    test("Should be able to see all page elements on the screen", () => {
        const { getByRole } = renderInvitation();

        expect(getByRole("heading", { name: "Invitation"})).toBeInTheDocument();
        expect(getByRole("heading", { name: "Course's invitation"})).toBeInTheDocument();
    });

    test("Should return success message when invitation is accepted", async () => {
        const { getByText } = renderInvitation();

        await waitFor(() => expect(getByText("Your invitation has been accepted for Example Course")).toBeInTheDocument());
    });

    test("Should return error message when invitation is invalid", async () => {
        server.use(
            rest.post(MSW_URL, async (req, res, ctx) => {
                return res(
                    ctx.status(400),
                    ctx.json(
                        {
                            "detail": "Invalid invitation"
                        }
                    )
                )
            }),
        );

        const { getByText } = renderInvitation();

        await waitFor(() => expect(getByText("Invalid invitation")).toBeInTheDocument());
    });

    test("Should return error message when invitation is already accepted", async () => {
        server.use(
            rest.post(MSW_URL, async (req, res, ctx) => {
                return res(
                    ctx.status(409),
                    ctx.json(
                        {
                            "type": "about:blank",
                            "title": "Student already enrolled",
                            "status": 409,
                            "detail": "Student with id=82f66168-1013-4dc1-a7bd-31da68a31dc9 is already enrolled on course id=50202211-b192-4d8a-92fa-48e09c6df67a.",
                            "instance": "/api/v1/invitations/09246a18-cf5e-4b7d-960f-b5248ad51b16/enrollments"
                        }
                    )
                )
            }),
        );

        const { getByText } = renderInvitation();

        await waitFor(() => expect(getByText("You have already accepted this invitation")).toBeInTheDocument());
    });
})