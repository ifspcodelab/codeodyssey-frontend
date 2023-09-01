import PageHeader from "../../components/PageHeader";
import {Trans, useTranslation} from "react-i18next";
import {useLocation} from "react-router-dom"
import PageFooter from "../../components/PageFooter";
import {Container, Link, Typography} from "@mui/material";
import {useApiRegistration} from "../../core/hooks/useApiRegistration";
import {useState} from "react";
import Spinner from "../../components/Spinner";
import ErrorSnackBar from "../../components/ErrorSnackBar/ErrorSnackBar";
import {AxiosError} from "axios";
import ErrorPage from "../ErrorPage";


interface UseLocationState {
    data: string;
}

function ResendEmail() {
    const {t} = useTranslation();
    const location = useLocation();
    const { resendConfirmationEmail } = useApiRegistration();
    const [loading, setLoading] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [open, setOpen] = useState(false);
    const [errorType, setErrorType] = useState('');

    const resendEmail = () => {
        setLoading(true);
        const state = location.state as UseLocationState;
        resendConfirmationEmail(state.data)
            .then(() => {
                setLoading(false);
                setResendSuccess(true);
            }).catch((error: AxiosError) => {
                setLoading(false);
                handleError(error);
            })
    }

    const handleError = (error: AxiosError) => {
        let responseStatus: number;
        let problemDetail: ProblemDetail = { title: '', detail: '' , instance: '', status: 0, type: ''};
        if (error.response) {
            problemDetail = error.response?.data as ProblemDetail;
            responseStatus = problemDetail.status;
            if (responseStatus === 404) {
                setErrorType('notFound');
            } else if (responseStatus === 422) {
                setErrorType('resendEmailDelay');
            }
            setOpen(true);
        } else if (error.message == "Network Error") {
            setErrorType('networkError');
            setOpen(true);
        }
    }

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway' || event === undefined) {
            return;
        }

        setOpen(false);
    };

    return (
        <Container maxWidth="md">
            {location.state ?
            <>
                <PageHeader title={t("resendEmail.title")} text={t("resendEmail.text", { email: location.state.data })}/>
                <Typography variant="h6" gutterBottom>{t("resendEmail.emailMessage", { email: location.state.data })}</Typography>
                {!resendSuccess ?
                    <Trans i18nKey="resendEmail.linkMessage">
                        Click <Link sx={{marginRight: '3px'}} component="button" variant="body2"
                                    onClick={resendEmail}>here</Link>
                        to resend the email.
                    </Trans>
                    :
                    <Typography variant="subtitle1" gutterBottom>{t("resendEmail.successMessage")}</Typography>
                }
                {loading && <Spinner size={10}/>}
                <ErrorSnackBar open={open} handleClose={handleClose} errorType={errorType}/>
                <PageFooter text={t('resendEmail.footer')}/>
            </>
            : <ErrorPage status={400}/>}
        </Container>

    )
}

export default ResendEmail;