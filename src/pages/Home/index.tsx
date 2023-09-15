import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";
import { useLocation} from "react-router-dom";
import {Key, useEffect} from "react";
import {Container} from "@mui/material";


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
        <Container maxWidth="sm">
            <PageHeader title={'Home'} text={"Application's home"}/>
            <h1 style={{alignItems: "center"}}>Home Page</h1>
            <PageFooter text={"Home Footer"}/>
        </Container>
    );
}

export default Home