import { useState } from "react";
import { Container, Link, Typography } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom"
import { AxiosError } from "axios";

import ErrorSnackBar from "../../core/components/error-snack-bar/ErrorSnackBar";
import { UserService } from './../../core/services/api/user/UserService';
import { useErrorHandler } from "../../core/hooks/useErrorHandler";
import PageFooter from "../../core/components/page-footer";
import PageHeader from "../../core/components/page-header";
import Spinner from "../../core/components/spinner";
import ErrorPage from "../ErrorPage";

interface IUseLocationState {
    data: string;
}

const ResendEmail: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const { handleError, openError, errorType, handleCloseError } = useErrorHandler();

    const resendEmail = () => {
        setLoading(true);
        const state = location.state as IUseLocationState;
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