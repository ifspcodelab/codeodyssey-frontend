import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
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
import { useEffect, useState } from "react";

interface UserRequest {
  email: string;
  password: string;
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
    setValue,
  } = useForm({ resolver: yupResolver(schema) });
  const navigate = useNavigate();

  const [loginError, setLoginError] = useState<string | null>(null);

  const onSubmit = (data: UserRequest) => {
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");

    if (storedEmail === data.email && storedPassword === data.password) {
      void loginUser(data)
        .then(() => navigate("/?"))
        .catch((error) => {
          setLoginError("Invalid credentials. Please try again."); // Update the error state with the error message
        });
    } else {
      setLoginError("Invalid credentials. Please try again."); // Update the error state with the error message
    }
  };
  //const BASE_URL: string = import.meta.env.VITE_BASE_URL;
  //base_url vai ser usado na production
  const loginUser = async (data: UserRequest) => {
    return await axios.post(BASE_URL + "/login", {
      email: data.email,
      password: data.password,
    });
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");

    if (storedEmail && storedPassword) {
      setValue("email", storedEmail);
      setValue("password", storedPassword);
    }
  }, [setValue]);

  const handleLogin = () => {
    return navigate("/courses");
  };
  const handleRegister = () => {
    return navigate("/registration");
  };

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
