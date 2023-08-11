import {describe, test} from "vitest";
import Login from "./index";
import {render} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import "@testing-library/jest-dom";


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
})