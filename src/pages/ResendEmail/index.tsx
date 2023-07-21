import PageHeader from "../../components/PageHeader";
import {useTranslation} from "react-i18next";

function ResendEmail() {
    const {t} = useTranslation()
    return (
        <PageHeader title={t("resendEmail.title")} text={t("resendEmail.text")}/>
    );
}

export default ResendEmail;