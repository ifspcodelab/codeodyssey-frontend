import PageHeader from "../../core/components/PageHeader";
import { Trans, useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom"
import PageFooter from "../../core/components/PageFooter";
import { Container, Link, Typography } from "@mui/material";
import { useState } from "react";
import Spinner from "../../core/components/spinner";
import ErrorSnackBar from "../../core/components/error-snack-bar/ErrorSnackBar";
import { AxiosError } from "axios";
import ErrorPage from "../ErrorPage";
import { UserService } from './../../core/services/api/user/UserService';
import { useErrorHandler } from "../../core/hooks/useErrorHandler";

interface UseLocationState {
    data: string;
}

function ResendEmail() {
    const { t } = useTranslation();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const { handleError, openError, errorType, handleCloseError } = useErrorHandler();

    const resendEmail = () => {
        setLoading(true);
        const state = location.state as UseLocationState;
        UserService.resendConfirmationEmail(state.data)
            .then(() => {
                setLoading(false);
                setResendSuccess(true);
            }).catch((error: AxiosError<ProblemDetail>) => {
                setLoading(false);
                handleError(error);
            })
    }

    return (
        <Container maxWidth="md">
            {location.state ?
                <>
                    <PageHeader title={t("resendEmail.title")} text={t("resendEmail.text", { email: location.state.data })} />
                    <Typography variant="h6" gutterBottom>{t("resendEmail.emailMessage", { email: location.state.data })}</Typography>
                    {!resendSuccess ?
                        <Trans i18nKey="resendEmail.linkMessage">
                            Click <Link sx={{ marginRight: '3px' }} component="button" variant="body2"
                                onClick={resendEmail}>here</Link>
                            to resend the email.
                        </Trans>
                        :
                        <Typography variant="subtitle1" gutterBottom>{t("resendEmail.successMessage")}</Typography>
                    }
                    {loading && <Spinner size={10} />}
                    <ErrorSnackBar open={openError} handleClose={handleCloseError} errorType={errorType} />
                    <PageFooter text={t('resendEmail.footer')} />
                </>
                : <ErrorPage status={400} />}
        </Container>

    )
}

export default ResendEmail;