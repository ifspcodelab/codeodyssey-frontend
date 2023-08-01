import Container from "@mui/material/Container";
import "./style.css";
import Button from "@mui/material/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import i18n from "../../locales/i18n";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";
import { useState } from "react";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string,
  refreshToken: string,
}

export const schema = yup
  .object({
    email: yup.string().required().email().max(350),
    password: yup
      .string()
      .required()
      .min(8)
      .max(64)
      .matches(/\d+/, i18n.t("login.form.validation.password.number"))
      .matches(/[a-z]+/, i18n.t("login.form.validation.password.lowercase"))
      .matches(/[A-Z]+/, i18n.t("login.form.validation.password.uppercase"))
      .matches(/[\W_]+/, i18n.t("login.form.validation.password.special")),
  })
  .required();

function Login() {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    // setValue,
  } = useForm({ resolver: yupResolver(schema) });
  const navigate = useNavigate();

  const [loginError, setLoginError] = useState<string | null>(null);

  const onSubmit = (data: LoginRequest) => {
    console.log(data);
    loginUser(data)
         .then(() => navigate('/courses'))
         .catch((errors) => {
           console.log(errors);
           setLoginError('An error has occurred')
         });
  };

  const BASE_URL: string = import.meta.env.VITE_BASE_URL as string;
  const loginUser = async (data: LoginRequest) => {
    try {
      await axios.post<LoginResponse>(
          BASE_URL + '/login',
          { email: data.email, password: data.password },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
      );
    }
    catch (error: any) {
      if (axios.isAxiosError(error)) {
        handleError(error)
      } else {
        console.log('An error has occurred: ', error);
        return 'An error has occurred.';
      }
    }
  };

  const handleError = (error: any) => {
    // TODO: 403 error format:
    // detail
    //     :
    //     "Bad credentials"
    // instance
    //     :
    //     "/api/v1/login"
    // status
    //     :
    //     403
    const responseStatus: number = error.response.data.status as number;
    const problemDetail: ProblemDetail = error.response.data as ProblemDetail;
    console.log('Response status code: ', responseStatus);
    console.log('Problem detail: ', problemDetail);
  }

  // const handleLogin = () => {
  //   return navigate("/courses");
  // };

  const handleRegister = () => {
    return navigate("/registration");
  };

  // useEffect(() => {
  //   const storedEmail = localStorage.getItem("email");
  //   const storedPassword = localStorage.getItem("password");
  //
  //   if (storedEmail && storedPassword) {
  //     setValue("email", storedEmail);
  //     setValue("password", storedPassword);
  //   }
  // }, [setValue]);

  return (
    <Container maxWidth="sm" className="formContainer">
      <PageHeader title={"Login"} text={"Log in or Register"} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="formInput">
          <label id="email" htmlFor={"email"}>
            {t("Email")}
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
            {t("Password")}
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
            Log In!
          </Button>
        </div>
        {loginError && <p className="error">{loginError}</p>}
        <div>
          <Button variant="contained" onClick={handleRegister}>
            Register
          </Button>
        </div>
      </form>
      <PageFooter text={"login"} />
    </Container>
  );
}

export default Login;
