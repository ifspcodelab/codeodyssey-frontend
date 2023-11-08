import { Box, Grid, Link, Paper, TextField, Typography, Button } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";

import ErrorSnackBar from "../../core/components/error-snack-bar/ErrorSnackBar.tsx";
import { UserService } from "../../core/services/api/user/UserService.ts";
import { useErrorHandler } from "../../core/hooks/useErrorHandler.ts";
import { PageBaseLayout } from "../../core/layout/PageBaseLayout.tsx";
import { LoginRequest, LoginResponse } from "../../core/models/login";
import PageFooter from "../../core/components/page-footer/index.tsx";
import { AuthConsumer } from "../../core/auth/AuthContext.tsx";
import { AccessToken } from "../../core/models/AccessToken";
import { JwtService } from "../../core/auth/JwtService.ts";
import { schema } from "./schema";
import "./style.css";

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const { handleError, openError, errorType, handleCloseError } = useErrorHandler();

  const onSubmit = async (data: LoginRequest) => {
    await UserService.login(data.email, data.password)
      .then((response) => {
        handleLoginResponse(response as LoginResponse);
      }).catch((error: AxiosError<ProblemDetail>) => {
        handleError(error);
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
    return navigate("/", { state: { data: true } });
  };

  return (
    <>
      <PageBaseLayout title={t("login.title")}>
      </PageBaseLayout>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined">
          <Grid container direction="column" padding={2} spacing={2}>
            <Grid item>
              <Typography variant='h6'>Account</Typography>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <TextField
                  sx={{ width: "100%" }}
                  {...register("email", { required: true })}
                  label={t("login.form.email")}
                  variant="outlined"
                  error={!!errors.email}
                  helperText={errors.email && <span>{errors.email.message}</span>}
                  inputProps={{ "data-testid": "nameField" }}
                  aria-labelledby="email" />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <TextField
                  sx={{ width: "100%" }}
                  {...register("password")}
                  label={t("login.form.password")}
                  variant="outlined"
                  error={!!errors.password}
                  helperText={errors.password && <span>{errors.password.message}</span>}
                  inputProps={{ "data-testid": "passwordField" }}
                  aria-labelledby="password"
                  type="password" />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <Button
                  variant='contained'
                  type="submit"
                >
                  {t("login.form.login")}
                </Button>
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <Trans i18nKey="login.register">
                  New to Code Odyssey?
                  <Link href="/registration">
                    Register
                  </Link>
                </Trans>
              </Grid>
            </Grid>

          </Grid>
        </Box>

      </form>

      <ErrorSnackBar open={openError} handleClose={handleCloseError} errorType={errorType} />
      <PageFooter text={t("login.footer")} />
    </>
  );
}

export default Login;
