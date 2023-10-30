import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "@emotion/react";
import { LightTheme } from "./core/themes/Light";
import { SideBar } from "./core/components/side-bar/SideBar";
import { DrawerProvider } from "./core/contexts/DrawerContext";

function App() {
    return (
        <ThemeProvider theme={LightTheme}>
            <DrawerProvider>
                <SideBar>
                    <Navbar />
                    <Outlet />
                </SideBar>
            </DrawerProvider>
        </ThemeProvider>
    )
}

export default App
