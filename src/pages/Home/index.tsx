import { Key, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { PageBaseLayout } from "../../core/layout/PageBaseLayout";
import PageFooter from "../../core/components/page-footer";

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
            <PageBaseLayout title={'Home'}>
            </PageBaseLayout>

            <PageFooter text={"Home Footer"} />
        </>
    );
}

export default Home