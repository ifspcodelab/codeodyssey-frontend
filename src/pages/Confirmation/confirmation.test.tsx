import {describe, test} from "vitest";
import {render} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import Confirmation from "./index";
import "@testing-library/jest-dom";


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
});