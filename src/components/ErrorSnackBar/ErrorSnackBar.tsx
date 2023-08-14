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
        case 'networkError': { message = i18n.t("registration.exception.network"); break; }
        case 'unexpected': { message = i18n.t("registration.exception.unexpected"); break; }
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