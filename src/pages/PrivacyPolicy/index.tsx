import {useTranslation} from "react-i18next";

function PrivacyPolicy() {
    const { t } = useTranslation();

    return (
        <>
            <h1>{t("privacypolicy.title")}</h1>
        </>
    );
}

export default PrivacyPolicy