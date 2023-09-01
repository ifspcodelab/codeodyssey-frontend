import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";
import { useLocation} from "react-router-dom";
import {Key, useEffect} from "react";


interface Location {
    state: { data: boolean } | null;
    key: Key;
}

function Home() {
    const location: Location = useLocation();

    useEffect(() => {
        if (location.state?.data === true) {
            window.history.replaceState({}, document.title)
            window.location.reload();
        }
    }, [location]);

    return (
      <>
        <PageHeader title={'Home'} text={"Application's home"}/>
        <h1>Home Page</h1>
        <PageFooter text={"Home Footer"}/>
      </>
    );
}

export default Home