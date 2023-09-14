import i18n from "../../locales/i18n";
import {Typography} from "@mui/material";

interface TextComponentProps {
    messageType: string;
    courseName?: string;
}

const TextComponent = (props: TextComponentProps) => {
    let message = '';

    switch (props.messageType) {
        case 'accepted': { message = i18n.t("invitation.accepted", {courseName: props.courseName}); break; }
        case 'invalid': { message = i18n.t("invitation.errors.invalid"); break; }
        case 'expired': { message = i18n.t("invitation.errors.expired");break }
        case 'notFound': { message = i18n.t("invitation.errors.notFound"); break; }
        case 'already': { message = i18n.t("invitation.errors.alreadyAccepted"); break; }
        case 'network': { message = i18n.t("invitation.errors.network"); break; }
        case 'unauthorized': { message = i18n.t("invitation.errors.unauthorized"); break; }
    }

    return (
        <Typography align="center" paragraph>
            { message }
        </Typography>
    );
};

export default TextComponent;