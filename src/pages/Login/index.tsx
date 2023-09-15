import Container from "@mui/material/Container";
import "./style.css";
import Button from "@mui/material/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import {Trans, useTranslation} from "react-i18next";
import i18n from "../../locales/i18n";
import {AxiosError} from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";
import {useState} from "react";
import {JwtService} from "../../core/auth/JwtService.ts";
import {AuthConsumer} from "../../core/auth/AuthContext.tsx";
import {schema} from "./schema";
import {LoginRequest, LoginResponse} from "../../core/models/login";
import {useApiLogin} from "../../core/hooks/useApiLogin";
import {Grid, Link, TextField} from "@mui/material";
import {AccessToken} from "../../core/models/AccessToken";


function Login() {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const navigate = useNavigate();

  const [loginError, setLoginError] = useState<string | null>(null);

  const { login } = useApiLogin();

  const onSubmit = async (data: LoginRequest) => {
    await login(data.email, data.password)
        .then((response) => {
          handleLoginResponse(response as LoginResponse);
        }).catch((error: AxiosError<ProblemDetail>) => {
          handleLoginError(error);
        });
  };

  const authConsumer = AuthConsumer();
  const handleLoginResponse = (response: LoginResponse) => {
    const jwtService = new JwtService();
    jwtService.setAccessToken(response.accessToken);
    jwtService.setRefreshToken(response.refreshToken);
    const decodedAccessToken = jwtService.getAccessToken() as AccessToken;
    authConsumer.setAuthenticated(true);
    authConsumer.setId(decodedAccessToken.sub);
    authConsumer.setEmail(decodedAccessToken.email);
    authConsumer.setRole(decodedAccessToken.role);
    console.log(authConsumer)
    return navigate("/", {state: {data: true}});
  };

  const handleLoginError = (error: AxiosError<ProblemDetail>): void => {
    if (error.response) {
      const problemDetail = error.response.data;
      if (problemDetail.detail == 'Bad credentials' && problemDetail.status == 403) setLoginError('Email or password is incorrect');
    } else {
        setLoginError(i18n.t("login.loginError"));
        console.log('Something went wrong:\n', error);
    }
  }

  return (
    <Container maxWidth="sm" className="formContainer">
      <PageHeader title={t("login.title")} text={t("login.text")} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={1} rowSpacing={2}>
          <Grid item xs={12}>
            <TextField
                sx={{ width: "100%" }}
                {...register("email", { required: true })}
                label={t("login.form.email")}
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email && <span>{errors.email.message}</span> }
                inputProps={{ "data-testid": "nameField" }}
                aria-labelledby="email"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
                sx={{ width: "100%" }}
                {...register("password")}
                label={t("login.form.password")}
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password && <span>{errors.password.message}</span> }
                inputProps={{ "data-testid": "passwordField" }}
                aria-labelledby="password"
                type="password"
            />
          </Grid>
          <div className="buttonContainer">
            <Button type="submit" variant="contained">
              {t("login.form.login")}
            </Button>
          </div>
          <div className="registerLink">
            <Trans i18nKey="login.register">
              New to Code Odyssey?
              <Link href="/registration">
                Register
              </Link>
            </Trans>
          </div>

          {loginError && <p className="error">{loginError}</p>}
        </Grid>
      </form>
      <PageFooter text={t("login.footer")} />
    </Container>
  );
}

export default Login;
