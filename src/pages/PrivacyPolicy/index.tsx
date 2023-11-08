import { useTranslation } from "react-i18next";

import { PageBaseLayout } from "../../core/layout/PageBaseLayout";

function PrivacyPolicy() {
    const { t } = useTranslation();

    return (
        <>
            <PageBaseLayout title={t("privacypolicy.title")}>

            </PageBaseLayout>
        </>
    );
}

export default PrivacyPolicy