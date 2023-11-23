import React from 'react';
import { Alert, Snackbar } from "@mui/material";
import i18n from "../../../locales/i18n";

interface SnackBarProps {
    open: boolean;
    handleClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
    errorType: string;
}

const ErrorSnackBar = (props: SnackBarProps) => {
    let message = '';

    switch (props.errorType) {
        case 'invalid': { message = i18n.t("exception.badRequest"); break; }
        case 'invalidStartDate': { message = i18n.t("exception.startdate"); break; }
        case 'invalidLoginOrEmail': { message = i18n.t("exception.loginOrEmail"); break; }
        case 'unauthorized': { message = i18n.t("exception.unauthorized"); break; }
        case 'notFound': { message = i18n.t("exception.notFound"); break; }
        case 'courselAlreadyExists': { message = i18n.t("exception.courseAlreadyExists"); break }
        case 'emailAlreadyExists': { message = i18n.t("registration.exception.email"); break; }
        case 'slugNotFound': { message = i18n.t("exception.courseNotFound"); break; }
        case 'unexpected': { message = i18n.t("registration.exception.unexpected"); break; }
        case 'resendEmailDelay': { message = i18n.t("resendEmail.exception.resendEmailDelay"); break; }
        case 'networkError': { message = i18n.t("registration.exception.network"); break; }
    }

    return (
        <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "center" }} open={props.open} autoHideDuration={6000} onClose={props.handleClose}>
            <Alert onClose={props.handleClose} severity="error" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default ErrorSnackBar;