import PageFooter from "../../components/PageFooter";
import './style.css'
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Trans, useTranslation } from "react-i18next";
import { CreateUserResponse } from "../../core/models/CreateUserResponse";
import { schema } from "./schema";
import { useApiRegistration } from "../../core/hooks/useApiRegistration";
import {
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Grid,
    TextField,
    Link,
    Typography,
    Box,
    Paper,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import ErrorSnackBar from "../../core/components/error-snack-bar/ErrorSnackBar";
import Spinner from "../../components/Spinner";
import SwipeableTextMobileStepper from "../../components/SwipeableTextMobileStepper";
import { PageBaseLayout } from "../../core/layout/PageBaseLayout";


function Registration() {
    const { t } = useTranslation()
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })
    const navigate = useNavigate()
    const api = useApiRegistration()
    const [open, setOpen] = useState(false);
    const [errorType, setErrorType] = useState('');
    const [loading, setLoading] = useState(false);
    const [disableSubmitButton, setDisableSubmitButton] = useState(false);
    const [dialog, setDialog] = useState(false);

    const toggleDialog = () => {
        setDialog(!dialog);
    };

    const onSubmit = async (data: CreateUserResponse) => {
        try {
            setDisableSubmitButton(true)
            setLoading(true)
            const response = await api.register(data.name.trim(), data.email.trim(), data.password)
            if (response.name != "AxiosError") {
                setDisableSubmitButton(false)
                setLoading(false)
                navigate('/resend-email', { state: { data: data.email } })
            }
        } catch (error) {
            setDisableSubmitButton(false)
            setLoading(false)
            if (axios.isAxiosError(error)) {
                handleError(error)
            } else {
                setErrorType('unexpected')
                setOpen(true);
            }
        }
    }

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway' || event === undefined) {
            return;
        }

        setOpen(false);
    };

    const handleError = (error: AxiosError) => {
        let responseStatus: number
        let problemDetail: ProblemDetail = { title: '', detail: '', instance: '', status: 0, type: '' }
        if (error.response) {
            problemDetail = error.response.data as ProblemDetail
            responseStatus = problemDetail.status
            if (responseStatus == 400) {
                setErrorType('badRequest')
                setOpen(true);
            } else if (responseStatus == 409) {
                if (error.response) problemDetail = error.response.data as ProblemDetail
                if (problemDetail.title == "User Already exists" && problemDetail.detail == "Email already exists")
                    setErrorType('emailAlreadyExists')
                setOpen(true);
            }
        } else if (error.message == "Network Error") {
            setErrorType('networkError')
            setOpen(true);
        }
    }

    const handleNameInput = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        event.target.value = event.target.value
            .replace(/[\d!@#$%¨&*()_=+\\{}?:;.,|-]/ig, '')
    }

    return (
        <>
            <PageBaseLayout title={t('registration.title')}>

            </PageBaseLayout>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined">
                    <Grid container direction="column" padding={2} spacing={2}>


                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                <TextField
                                    sx={{ width: "100%" }}
                                    {...register("name")}
                                    label={t("registration.form.name")}
                                    variant="outlined"
                                    error={!!errors.name}
                                    helperText={errors.name && <span>{errors.name.message}</span>}
                                    inputProps={{ "data-testid": "nameField" }}
                                    aria-labelledby="name"
                                    onChange={(e) => handleNameInput(e)}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                <TextField
                                    sx={{ width: "100%" }}
                                    {...register("email")}
                                    label={t("registration.form.email")}
                                    variant="outlined"
                                    error={!!errors.email}
                                    helperText={errors.email && <span>{errors.email.message}</span>}
                                    inputProps={{ "data-testid": "emailField" }}
                                    aria-labelledby="email"
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                <TextField
                                    sx={{ width: "100%" }}
                                    {...register("password")}
                                    label={t("registration.form.password")}
                                    variant="outlined"
                                    error={!!errors.password}
                                    helperText={errors.password && <span>{errors.password.message}</span>}
                                    inputProps={{ "data-testid": "passwordField" }}
                                    aria-labelledby="password"
                                    type="password"
                                />
                            </Grid>
                        </Grid>

                        <Typography id="emailMessage">* {t("registration.form.email_message")}</Typography>
                        <Grid item xs={12}>
                            <FormGroup aria-labelledby="terms" >
                                <FormControlLabel {...register("terms")} control={<Checkbox />} label={
                                    <Trans i18nKey="registration.form.termsCheckbox">
                                        I have read and agree with the
                                        <Link href="/terms-of-use" target="_blank">Terms of Use</Link>
                                        and
                                        <Link href="/privacy-policy" target="_blank">Privacy Policy</Link>
                                    </Trans>
                                } />
                                <Typography color="error">{errors.terms?.message}</Typography>
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12}>
                            <div id="registration-menu">
                                <Button data-testid="registerButton" disabled={disableSubmitButton} type="submit" variant="contained" size="large">{t('registration.form.submit')}</Button>
                                {loading && <Spinner size={10} />}
                                <div>
                                    <Trans i18nKey="registration.form.login">
                                        Already have an account?
                                        <Link data-testid="loginLink" href="/login">
                                            Login
                                        </Link>
                                    </Trans>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
            </form>
            <ErrorSnackBar open={open} handleClose={handleClose} errorType={errorType} />
            <PageFooter text={t('registration.footer')} />
            <Button size='small' id="tutorialButton" variant="contained" onClick={toggleDialog}>
                {!dialog ? t('registration.tutorial.open') : t('registration.tutorial.close')}
            </Button>
            {
                dialog && (
                    <div id="swipeable">
                        <SwipeableTextMobileStepper />
                    </div>
                )
            }
        </>
    );
}

export default Registration;