import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";
import {Link} from "react-router-dom";

function Home() {
    return (
        <>
            <PageHeader title={'Home'} text={"Application's home"}/>
            <h1>Home Page</h1>
            <nav>
                <Link to={"/registration"}>Registration</Link>
                <Link to={"/login"}>Login</Link>
                <Link to={"/create-course"}>Create course</Link>
            </nav>
            <PageFooter text={"Home Footer"}/>
        </>
    );
}

export default Home