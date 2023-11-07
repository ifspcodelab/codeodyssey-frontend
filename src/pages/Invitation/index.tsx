import { useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import PageHeader from "../../core/components/PageHeader";
import { useTranslation } from "react-i18next";
import PageFooter from "../../core/components/PageFooter";
import { AxiosError } from "axios";
import { EnrollmentResponse } from "../../core/models/invitations";
import { Container } from "@mui/material";
import TextComponent from "./text-component";
import Spinner from "../../core/components/spinner";
import { InvitationService } from "../../core/services/api/invitation/InvitationService";


function Invitation() {
    const { idInvitation: invitationId } = useParams();
    const { t } = useTranslation();
    const requestSentRef = useRef(false);
    const [loading, setLoading] = useState(false);
    const [messageType, setMessageType] = useState('');
    const [courseName, setCourseName] = useState('');

    const handleErrors = useCallback((error: AxiosError) => {
        switch (error.response?.status) {
            case 400: setMessageType('invalid'); break;
            case 403: setMessageType('unauthorized'); break;
            case 404: setMessageType('notFound'); break;
            case 409: setMessageType('already'); break;
            case 410: setMessageType('expired'); break;
            default: setMessageType('network');
        }
    }, []);

    useEffect(() => {
        if (!requestSentRef.current) {
            setLoading(true);
            InvitationService.acceptInvitation(invitationId)
                .then((enrollmentResponse: EnrollmentResponse) => {
                    setMessageType('accepted');
                    setCourseName(enrollmentResponse.invitation.course.name)
                    setLoading(false);
                }).catch((error: AxiosError) => {
                    handleErrors(error);
                    setLoading(false);
                });
        }
        requestSentRef.current = true;
    }, [handleErrors, invitationId])

    return (
        <Container maxWidth="sm">
            <PageHeader title={t("invitation.title")} text={t("invitation.text")} />
            <TextComponent messageType={messageType} courseName={courseName} />
            {loading && <Spinner size={20} />}
            <PageFooter text={t("invitation.footer")} />
        </Container>
    );
}

export default Invitation;