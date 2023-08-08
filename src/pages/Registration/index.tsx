import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";
import './style.css'
import {useNavigate} from "react-router-dom"
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {Trans, useTranslation} from "react-i18next";
import {CreateUserResponse} from "../../core/models/CreateUserResponse";
import {schema} from "./schema";
import {useRegisterApi} from "../../core/hooks/useRegisterApi";
import {
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    FormGroup,
    Grid,
    TextField,
    Link,
    Typography,
} from "@mui/material";
import axios, {AxiosError} from "axios";
import {useState} from "react";
import ErrorSnackBar from "../../components/ErrorSnackBar/ErrorSnackBar";
import Spinner from "../../components/Spinner";


function Registration() {
    const {t} = useTranslation()
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema)})
    const navigate = useNavigate()
    const api = useRegisterApi()
    const [open, setOpen] = useState(false);
    const [errorType, setErrorType] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: CreateUserResponse) => {
        try {
            setLoading(true)
            const response = await api.register(data.name, data.email, data.password)
            if (response.name != "AxiosError") {
                setLoading(false)
                navigate('/resend-email', { state: { data: data.email }})
            }
        } catch (error) {
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
        let problemDetail: ProblemDetail = { title: '', detail: '' , instance: '', status: 0, type: ''}
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

    return (
        <>
            <Container maxWidth="md">
                <div className="formContainer">
                    <PageHeader title={t('registration.title')} text={t('registration.text')}/>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={1} rowSpacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    sx={{ width: "100%" }}
                                    {...register("name")}
                                    label={t("registration.form.name")}
                                    variant="outlined"
                                    error={!!errors.name}
                                    helperText={errors.name && <span>{errors.name.message}</span> }
                                    inputProps={{ "data-testid": "nameField" }}
                                    aria-labelledby="name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    sx={{ width: "100%" }}
                                    {...register("email")}
                                    label={t("registration.form.email")}
                                    variant="outlined"
                                    error={!!errors.email}
                                    helperText={errors.email && <span>{errors.email.message}</span> }
                                    inputProps={{ "data-testid": "emailField" }}
                                    aria-labelledby="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    sx={{ width: "100%" }}
                                    {...register("password")}
                                    label={t("registration.form.password")}
                                    variant="outlined"
                                    error={!!errors.password}
                                    helperText={errors.password && <span>{errors.password.message}</span> }
                                    inputProps={{ "data-testid": "passwordField" }}
                                    aria-labelledby="password"
                                    type="password"
                                />
                            </Grid>
                            <Typography id="emailMessage">* {t("registration.form.email_message")}</Typography>
                            <Grid item xs={12}>
                                <FormGroup aria-labelledby="terms" >
                                    <FormControlLabel {...register("terms")} control={<Checkbox  />} label={
                                        <Trans i18nKey="registration.form.termsCheckbox">
                                            I have read and agree with the
                                            <Link href="/terms-of-use" target="_blank" rel="noopener noreferrer">Terms of Use</Link>
                                            and
                                            <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>
                                        </Trans>
                                    } />
                                    <Typography color="error">{errors.terms?.message}</Typography>
                                </FormGroup>
                            </Grid>
                            <Grid item xs={12}>
                                <div id="registration-menu">
                                    <Button data-testid="registerButton" type="submit" variant="contained" size="large">{t('registration.form.submit')}</Button>{loading && <Spinner/>}
                                    <Link data-testid="loginLink" href="/login" rel="noopener noreferrer" underline="hover">
                                        {t('registration.form.login')}
                                    </Link>
                                </div>
                            </Grid>
                        </Grid>
                    </form>
                    <ErrorSnackBar open={open} handleClose={handleClose} errorType={errorType}/>
                    <PageFooter text={t('registration.footer')}/>
                </div>
            </Container>
        </>
    );
}

export default Registration;