import Container from "@mui/material/Container";
import "./style.css";
import Button from "@mui/material/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import i18n from "../../locales/i18n";
import {AxiosError} from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";
import {useState} from "react";
import {AccessToken, JwtService} from "../../core/auth/JwtService.ts";
import {AuthConsumer} from "../../core/auth/AuthContext.tsx";
import {schema} from "./schema";
import {LoginRequest, LoginResponse} from "../../core/models/login";
import {useApiLogin} from "../../core/hooks/useApiLogin";


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
    console.log(decodedAccessToken.role)
    return navigate("/");
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

  const handleRegister = () => {
    return navigate("/registration");
  };

  return (
    <Container maxWidth="sm" className="formContainer">
      <PageHeader title={t("login.title")} text={t("login.text")} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="formInput">
          <label id="email" htmlFor={"email"}>
            {t("login.form.email")}
          </label>
          <input
            aria-labelledby="email"
            type="text"
            {...register("email", { required: true })}
          />
          <p>{errors.email?.message}</p>
        </div>
        <div className="formInput">
          <label id="password" htmlFor={"password"}>
            {t("login.form.password")}
          </label>
          <input
            aria-labelledby="password"
            type="password"
            {...register("password", { required: true })}
          />
          <p>{errors.password?.message}</p>
        </div>
        <div>
          <Button type="submit" variant="contained">
            {t("login.form.login")}
          </Button>
        </div>
        {loginError && <p className="error">{loginError}</p>}
        <div>
          <Button variant="contained" onClick={handleRegister}>
            {t("login.register")}
          </Button>
        </div>
      </form>
      <PageFooter text={t("login.footer")} />
    </Container>
  );
}

export default Login;
