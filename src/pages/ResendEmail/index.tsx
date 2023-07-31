import PageHeader from "../../components/PageHeader";
import {useTranslation} from "react-i18next";
import {useLocation} from "react-router-dom"

function ResendEmail() {
    const {t} = useTranslation()
    const location = useLocation()

    return (
        <PageHeader title={t("resendEmail.title")} text={t("resendEmail.text", { email: location.state.data })}/>
    );
}

export default ResendEmail;