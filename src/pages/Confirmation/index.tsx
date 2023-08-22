import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";
import {useParams} from "react-router-dom"
import {Container} from "@mui/material";
import {t} from "i18next";
import {useEffect, useState} from "react";
import {useApiRegistration} from "../../core/hooks/useApiRegistration";
import {AxiosError} from "axios";

const Confirmation = () => {
    const { token } = useParams();
    const api = useApiRegistration();
    const [confirmationError, setConfirmationError] = useState<string | null>(null)
    const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null)

    useEffect(() => {
        api.confirmation(token)
            .then((response) => {
                console.log(response);
                setConfirmationMessage(response)
            }).catch((error: AxiosError) => {
                handleError(error);
            });
    }, []);

    function handleError(error: AxiosError) {
        let responseStatus: number
        let problemDetail: ProblemDetail = { title: '', detail: '' , instance: '', status: 0, type: ''}
        if (error.response) {
            problemDetail = error.response.data as ProblemDetail
            responseStatus = problemDetail.status
            if (responseStatus == 400) {
                console.log('bad request')
                setConfirmationError('bad request')
            } else if (responseStatus == 409) {
                if (error.response) problemDetail = error.response.data as ProblemDetail
                if (problemDetail.title == "Validation" && problemDetail.detail == "User is already validated")
                    console.log('email already exists')
                    setConfirmationError('email already exists')
            }
        } else if (error.message == "Network Error") {
            console.log('network error')
            setConfirmationError('network error')
        }
    }

    return (
        <div>
            <Container maxWidth="md">
                <PageHeader title={t('confirmation.title')} text={t('confirmation.text')}/>
                {confirmationMessage && <p className="error">{confirmationMessage}</p>}
                {confirmationError && <p className="error">{confirmationError}</p>}
                <PageFooter text={t('confirmation.footer')}/>
            </Container>
        </div>
    );
};

export default Confirmation;