import { useRouteError } from "react-router-dom";
import {useTranslation} from "react-i18next";

interface ErrorResponse {
    status: number;
    statusText: string;
    internal: boolean;
    data: string;
    error: string;
}

export default function ErrorPage() {
    const error = useRouteError() as ErrorResponse;
    const { t } = useTranslation();

    return (
        <div id="error-page">
            <h1>{t("errorPage.title", {statusCode: error.status})}</h1>
            <p>{t("errorPage.subTitle")}</p>
            <p>
                <i>{error.status === 404 && t("errorPage.notFound.message")}</i>
            </p>
        </div>
    );
}