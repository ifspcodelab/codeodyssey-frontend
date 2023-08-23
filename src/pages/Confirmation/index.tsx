import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";
import {useParams} from "react-router-dom"
import {Container, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useApiRegistration} from "../../core/hooks/useApiRegistration";
import {AxiosError} from "axios";
import Spinner from "../../components/Spinner";
import {useTranslation} from "react-i18next";
import i18n from "../../locales/i18n";

const Confirmation = () => {
    const { t } = useTranslation();
    const { token } = useParams();
    const { confirmation } = useApiRegistration();
    const [confirmationError, setConfirmationError] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [requested, setRequested] = useState(false);

    useEffect(() => {
        if (!requested) {
        setLoading(true);
        confirmation(token)
            .then((response) => {
                setEmail(response.email)
                setLoading(false);
            }).catch((error: AxiosError) => {
                handleError(error);
                setLoading(false);
            });
        }
        setRequested(true);
    }, [requested, confirmation, token]);

    function handleError(error: AxiosError) {
        let responseStatus: number
        let problemDetail: ProblemDetail = { title: '', detail: '' , instance: '', status: 0, type: ''}
        if (error.response) {
            problemDetail = error.response.data as ProblemDetail
            responseStatus = problemDetail.status
            if (responseStatus == 400) {
                setConfirmationError(i18n.t('confirmation.error.badRequest'))
            } else if (responseStatus == 409) {
                problemDetail = error.response.data as ProblemDetail
                if (problemDetail.title == "Validation" && problemDetail.detail == "User is already validated") {
                    setConfirmationError(i18n.t('confirmation.error.exists'))
                }
            } else if (responseStatus == 404) {
               problemDetail = error.response.data as ProblemDetail
                if (problemDetail.title == "Token problem" && problemDetail.detail == "No user associated with this token") {
                    setConfirmationError(i18n.t('confirmation.error.notFound'))
                } else if (problemDetail.title == "Token problem" && problemDetail.detail == "Token Expired") {
                    setConfirmationError(i18n.t('confirmation.error.expired'))
                }
            }
        } else if (error.message == "Network Error") {
            setConfirmationError(i18n.t('confirmation.error.network'))
        }
    }

    return (
        <Container maxWidth="md">
            <PageHeader title={t("confirmation.title")} text={t("confirmation.text")}/>
            { loading ? <Spinner size={40}/> :
                <Typography variant="h4" component="div">
                    { email && <p>{t("confirmation.success", {email: email})}</p> }
                    { confirmationError && <p>{confirmationError}</p> }
                </Typography> }
            <PageFooter text={t("confirmation.footer")}/>
        </Container>
    );
};

export default Confirmation;