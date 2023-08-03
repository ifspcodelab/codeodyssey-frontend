import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";
import './style.css'
import {useNavigate} from "react-router-dom"
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {Trans, useTranslation} from "react-i18next";
import {CreateUserResponse} from "../../core/models/CreateUserResponse";
import {schema} from "./schema";
import {useApi} from "../../core/hooks/useApi";
import {
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    FormGroup,
    Grid,
    TextField,
    Link,
    Typography
} from "@mui/material";


function Registration() {
    const {t} = useTranslation()
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema)})
    const navigate = useNavigate()
    const api = useApi()

    const onSubmit = async (data: CreateUserResponse) => {
        const response = await api.register(data.name, data.email, data.password)
        if (response) {
            navigate('/resend-email', { state: { data: data.email }})
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
                                    <Button data-testid="registerButton" type="submit" variant="contained" size="large">{t('registration.form.submit')}</Button>
                                    <Link data-testid="loginLink" href="/login" rel="noopener noreferrer" underline="hover">
                                        {t('registration.form.login')}
                                    </Link>
                                </div>
                            </Grid>
                        </Grid>
                    </form>
                    <PageFooter text={t('registration.footer')}/>
                </div>
            </Container>
        </>
    );
}

export default Registration;