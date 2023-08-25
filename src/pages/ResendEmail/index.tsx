import PageHeader from "../../components/PageHeader";
import {Trans, useTranslation} from "react-i18next";
import {useLocation} from "react-router-dom"
import PageFooter from "../../components/PageFooter";
import {Container, Link, Typography} from "@mui/material";
import {useApiRegistration} from "../../core/hooks/useApiRegistration";


interface UseLocationState {
    data: string;
}

function ResendEmail() {
    const {t} = useTranslation();
    const location = useLocation();
    const { resendConfirmationEmail } = useApiRegistration();

    function resendEmail() {
        const state = location.state as UseLocationState;
        resendConfirmationEmail(state.data)
            .then((response) => {
                console.log(response);})
            .catch((error) => {
                console.log(error);
            })
    }


    return (
        <Container maxWidth="md">
            <PageHeader title={t("resendEmail.title")} text={t("resendEmail.text", { email: location.state.data })}/>
            <Typography variant="h6" gutterBottom>{t("resendEmail.emailMessage", { email: location.state.data })}</Typography>
            <Trans i18nKey="resendEmail.linkMessage">
                Click <Link sx={{marginRight: '3px'}} component="button" variant="body3" onClick={resendEmail}>here</Link>
                to resend the email.
            </Trans>
            <PageFooter text={t('resendEmail.footer')}/>
        </Container>
    )
}

export default ResendEmail;