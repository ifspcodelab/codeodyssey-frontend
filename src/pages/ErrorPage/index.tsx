import { useRouteError } from "react-router-dom";
import {useTranslation} from "react-i18next";

interface ErrorResponse {
    status: number;
    statusText: string;
    internal: boolean;
    data: string;
    error: string;
}

interface StatusType {
    status?: number;
}

export default function ErrorPage({status}: ErrorResponse | StatusType) {
    const routeError = useRouteError() as ErrorResponse;
    const { t } = useTranslation();

    return (
        <div id="error-page">
            <h1>{t("errorPage.title", {statusCode: routeError?.status || status})}</h1>
            <p>{t("errorPage.subTitle")}</p>
            <p>
                <i>{(routeError?.status == 404 || status == 404) ? t("errorPage.message.notFound") : ""}</i>
                <i>{(routeError?.status == 400 || status == 400) ? t("errorPage.message.badRequest") : ""}</i>
            </p>
        </div>
    );
}