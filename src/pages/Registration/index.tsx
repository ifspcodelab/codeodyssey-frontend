import {useState} from 'react';
import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";
import './style.css'
import {useNavigate} from "react-router-dom"
import { useForm } from "react-hook-form";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";
import {useTranslation} from "react-i18next";
import i18n from "../../locales/i18n";
import {CreateUserResponse} from "../../core/models/CreateUserResponse";
export const schema = yup.object({
    name: yup.string().required().min(5).max(100),
    email: yup.string().required().email().max(350),
    password: yup.string().required().min(8).max(64)
        .matches(/\d+/, i18n.t('registration.form.validation.password.number'))
        .matches(/[a-z]+/, i18n.t('registration.form.validation.password.lowercase'))
        .matches(/[A-Z]+/, i18n.t('registration.form.validation.password.uppercase'))
        .matches(/[\W_]+/, i18n.t('registration.form.validation.password.special')),
    terms: yup.boolean().oneOf([true], i18n.t('registration.form.validation.termsCheckbox'))
}).required()

function Registration({createUser}: any) {
    const {t} = useTranslation()
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema)})
    const navigate = useNavigate()
    const [isChecked, setIsChecked] = useState(false);

    const onSubmit = (data: CreateUserResponse) => {
        void createUser(data.name, data.email, data.password, navigate)
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
                        <label id="email" htmlFor={"email"}>{t('registration.form.email')}</label><span data-testid="immutabilityMessage" title={t('registration.form.email_message')}>*</span>
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
                        <label id="terms" htmlFor="terms">{t('registration.form.termsCheckbox')}</label>
                        <p>{errors.terms?.message}</p>
                    </div>
                    <div id="buttons">
                        <button data-testid="loginButton" onClick={handleLogin}>{t('registration.form.login')}</button>
                        <button data-testid="submitButton" type="submit">{t('registration.form.submit')}</button>
                    </div>
                </form>
                <PageFooter text={t('registration.footer')}/>
            </div>
        </>
    );
}

export default Registration;