import {Outlet} from "react-router-dom";
import PageHeader from "./components/PageHeader";
import PageFooter from "./components/PageFooter";

function App() {
    return (
        <div>
            <Outlet/>
        </div>
    )
}

export default App
