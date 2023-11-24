import React from 'react';
import {Alert, Snackbar} from "@mui/material";

interface SnackBarProps {
    open: boolean;
    handleClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
    message: string;
}

const SuccessSnackBar = (props: SnackBarProps) => {
    return (
        <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={props.open}  onClose={props.handleClose}>
            <Alert onClose={props.handleClose} severity="success" sx={{ width: '100%'}}>
                { props.message }
            </Alert>
        </Snackbar>
    );
};

export default SuccessSnackBar;