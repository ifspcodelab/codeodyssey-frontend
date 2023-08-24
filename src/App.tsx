import {Outlet} from "react-router-dom";
import Navbar from "../src/components/Navbar/index"

function App() {
    return (
        <div>
            <Navbar/>
            <Outlet/>
        </div>
    )
}

export default App
