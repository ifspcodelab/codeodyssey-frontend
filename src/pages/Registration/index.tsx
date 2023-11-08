import React, { useState } from "react";
import { Button, Checkbox, FormControlLabel, FormGroup, Grid, TextField, Link, Typography, Box, Paper } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";

import SwipeableTextMobileStepper from "../../core/components/swipeable-text-mobile-stepper";
import ErrorSnackBar from "../../core/components/error-snack-bar/ErrorSnackBar";
import { UserService } from "../../core/services/api/user/UserService";
import { useErrorHandler } from "../../core/hooks/useErrorHandler";
import { PageBaseLayout } from "../../core/layout/PageBaseLayout";
import { IRegistrationRequest } from "../../core/models/User";
import PageFooter from "../../core/components/page-footer";
import Spinner from "../../core/components/spinner";
import { schema } from "./schema";
import './style.css'

const Registration: React.FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

    const [loading, setLoading] = useState(false);
    const [disableSubmitButton, setDisableSubmitButton] = useState(false);
    const [dialog, setDialog] = useState(false);

    const { handleError, openError, errorType, handleCloseError } = useErrorHandler();

    const toggleDialog = () => {
        setDialog(!dialog);
    };

    const onSubmit = async (data: IRegistrationRequest) => {
        setDisableSubmitButton(true)
        setLoading(true)
        await UserService.register(data.name.trim(), data.email.trim(), data.password)
            .then(() => {
                setDisableSubmitButton(false)
                setLoading(false)
                navigate('/resend-email', { state: { data: data.email } })
            }).catch((error: AxiosError<ProblemDetail>) => {
                setDisableSubmitButton(false)
                setLoading(false)
                handleError(error)
            });
    };

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

            <ErrorSnackBar open={openError} handleClose={handleCloseError} errorType={errorType} />

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