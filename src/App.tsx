import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "@emotion/react";
import { LightTheme } from "./core/themes/Light";

function App() {
    return (
        <ThemeProvider theme={LightTheme}>
            <Navbar />
            <Outlet />
        </ThemeProvider>
    )
}

export default App
