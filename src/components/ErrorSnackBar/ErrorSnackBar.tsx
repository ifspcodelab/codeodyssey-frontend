import React from 'react';
import {Alert, Snackbar} from "@mui/material";
import i18n from "../../locales/i18n";

interface SnackBarProps {
    open: boolean;
    handleClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
    errorType: string;
}

const ErrorSnackBar = (props: SnackBarProps) => {
    let message = '';

    switch (props.errorType) {
        case 'badRequest': { message = i18n.t("registration.exception.badRequest"); break; }
        case 'emailAlreadyExists': { message = i18n.t("registration.exception.email"); break; }
        case 'courselAlreadyExists': { message = i18n.t("createcourse.exception.slug");break }
        case 'networkError': { message = i18n.t("registration.exception.network"); break; }
        case 'unexpected': { message = i18n.t("registration.exception.unexpected"); break; }
        case 'notFound': { message = i18n.t("resendEmail.exception.notFound"); break; }
        case 'slugNotFound': { message = i18n.t("students.exception.notFound"); break; }
        case 'resendEmailDelay': { message = i18n.t("resendEmail.exception.resendEmailDelay"); break; }
    }

    return (
        <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "center" }} open={props.open} autoHideDuration={6000} onClose={props.handleClose}>
            <Alert onClose={props.handleClose} severity="error" sx={{ width: '100%'}}>
                { message }
            </Alert>
        </Snackbar>
    );
};

export default ErrorSnackBar;