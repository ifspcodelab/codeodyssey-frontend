import {describe, test} from "vitest";
import {render} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import Invitation from "./index";
import "../../locales/i18n";
import "@testing-library/jest-dom";

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
})