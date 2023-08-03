import {useState} from 'react';
import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";
import './style.css'
import {Link, useNavigate} from "react-router-dom"
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {useTranslation, Trans} from "react-i18next";
import {CreateUserResponse} from "../../core/models/CreateUserResponse";
import {schema} from "./schema";
import {useApi} from "../../core/hooks/useApi";


function Registration() {
    const {t} = useTranslation()
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema)})
    const navigate = useNavigate()
    const api = useApi()
    const [isChecked, setIsChecked] = useState(false);

    const onSubmit = async (data: CreateUserResponse) => {
        const response = await api.register(data.name, data.email, data.password)
        if (response) {
            navigate('/resend-email', { state: { data: data.email }})
        }
    }
    
    const handleLogin = () => {
        return navigate("/login")
    }

    return (
        <>
            <div className="formContainer">
                <PageHeader title={t('registration.title')} text={t('registration.text')}/>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="formInput">
                        <label id="name" htmlFor={"name"}>{t('registration.form.name')}</label>
                        <input aria-labelledby="name" type="text" {...register("name", { required: true })} />
                        <p>{errors.name?.message}</p>
                    </div>
                    <div className="formInput">
                        <label id="email" htmlFor={"email"}>{t('registration.form.email')}</label><span data-testid="immutabilityMessage">{t('registration.form.email_message')}</span>
                        <input aria-labelledby="email" type="text" {...register("email", { required: true })} />
                        <p>{errors.email?.message}</p>
                    </div>
                    <div className="formInput">
                        <label id="password" htmlFor={"password"}>{t('registration.form.password')}</label>
                        <input aria-labelledby="password" type="password" {...register("password", { required: true })} />
                        <p>{errors.password?.message}</p>
                    </div>
                    <div className="checkbox">
                        <input aria-labelledby="terms" type="checkbox" checked={isChecked}
                                {...register("terms", { onChange:(e) => setIsChecked(e.target.checked) })} />
                        <label id="terms" htmlFor="terms">
                            <Trans i18nKey="registration.form.termsCheckbox">
                                I have read and agree with the <Link to="/terms-of-use" target="_blank">Terms of Use</Link> and <Link to="/privacy-policy" target="_blank">Privacy Policy</Link>
                            </Trans>
                        </label>
                        <p>{errors.terms?.message}</p>
                    </div>
                    <div id="registration-menu">
                        <button data-testid="registerButton" type="submit">{t('registration.form.submit')}</button>
                        <Link data-testid="loginLink" onClick={handleLogin}>{t('registration.form.login')}</Link>
                    </div>
                </form>
                <PageFooter id="registration-footer" text={t('registration.footer')}/>
            </div>
        </>
    );
}

export default Registration;