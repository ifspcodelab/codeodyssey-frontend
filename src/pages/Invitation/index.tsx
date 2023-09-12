import {useParams} from "react-router-dom";
import {useCallback, useEffect, useRef, useState} from "react";
import {useApiAcceptInvitation} from "../../core/hooks/useApiAcceptInvitation";
import PageHeader from "../../components/PageHeader";
import {useTranslation} from "react-i18next";
import PageFooter from "../../components/PageFooter";
import {AxiosError} from "axios";
import {EnrollmentResponse} from "../../core/models/invitations";
import {Container, Typography} from "@mui/material";
import Spinner from "../../components/Spinner";


function Invitation() {
    const { idInvitation } = useParams();
    const { acceptInvitation } = useApiAcceptInvitation();
    const { t } = useTranslation();
    const [invitationText, setInvitationText] = useState("");
    const requestSentRef = useRef(false);
    const [loading, setLoading] = useState(false);

    const handleErrors = useCallback((error: AxiosError) => {
        switch (error.response?.status) {
            case 400:
                setInvitationText(t("invitation.errors.invalid"));
                break;
            case 403:
                setInvitationText(t("invitation.errors.unauthorized"));
                break;
            case 404:
                setInvitationText(t("invitation.errors.notFound"));
                break;
            case 409:
                setInvitationText(t("invitation.errors.alreadyAccepted"));
                break;
            default:
                setInvitationText(t("invitation.errors.network"));
        }
    }, [t]);

    useEffect(() => {
        if (!requestSentRef.current) {
            setLoading(true);
            acceptInvitation(idInvitation)
                .then((enrollmentResponse: EnrollmentResponse) => {
                    setInvitationText(t("invitation.accepted", {courseName: enrollmentResponse.invitation.course.name }));
                    setLoading(false);
                }).catch((error: AxiosError) => {
                handleErrors(error);
                setLoading(false);
            });
        }
        requestSentRef.current = true;
    }, [acceptInvitation, handleErrors, idInvitation, t])

    return (
    <Container maxWidth="sm">
        <PageHeader title={t("invitation.title")} text={t("invitation.text")}/>
        <Typography align="center" paragraph>
            {invitationText}
        </Typography>
        {loading && <Spinner size={20}/>}
        <PageFooter text={t("invitation.footer")}/>
    </Container>
    );
}

export default Invitation