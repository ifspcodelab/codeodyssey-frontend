import {describe, test, vi} from "vitest";
import {render} from "@testing-library/react";
import ResendEmail from "./index";
import {BrowserRouter} from "react-router-dom";
import "@testing-library/jest-dom";

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

describe("Resend Email", () => {
    test("Should be able to see page elements on the screen", () => {
        const {getByRole} = renderResendEmail();

        expect(getByRole("heading", { name: "Resend email"})).toBeInTheDocument();
        expect(getByRole("heading", { name: "In case you didn't receive the email, you can resend it by clicking the link below after one minute has passed."})).toBeInTheDocument();
        expect(getByRole("heading", { name: "The system has sent a confirmation email to johndoe@email.com. Check your email."})).toBeInTheDocument();
        expect(getByRole("button", { name: "here"})).toBeInTheDocument();
    });
});