import React, {useState, useTransition} from 'react';
import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";
import './style.css'
import {useNavigate} from "react-router-dom"
import { useForm } from "react-hook-form";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";
import {useTranslation} from "react-i18next";
import i18n from "../../locales/i18n";
import axios from "axios";


const baseURL = "http://localhost:8080/api/v1"


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

function Registration() {
    const {t} = useTranslation()
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema)})
    const navigate = useNavigate()
    const [isChecked, setIsChecked] = useState(false);

    const onSubmit = (data) => {
        // void createUser(data).then(() => navigate("/resend-email"))
    }

    const createUser = async (data) => {
        return await axios
            .post(baseURL + '/users', {
                name: data.name,
                email: data.email,
                password: data.password,
            })
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
                        <input aria-labelledby="name" type="text" name="name" {...register("name", { required: true })} />
                        <p>{errors.name?.message}</p>
                    </div>
                    <div className="formInput">
                        <label htmlFor={"email"}>{t('registration.form.email')}</label>
                        <input type="text" name="email" {...register("email", { required: true })} />
                        <p>{errors.email?.message}</p>
                    </div>
                    <div className="formInput">
                        <label htmlFor={"password"}>{t('registration.form.password')}</label>
                        <input type="password" name="password" {...register("password", { required: true })} />
                        <p>{errors.password?.message}</p>
                    </div>
                    <div className="checkbox">
                        <input type="checkbox" data-testid="termsCheckBox" name="terms" id="terms" checked={isChecked}
                                {...register("terms", { onChange:(e) => setIsChecked(e.target.checked) })} />
                        <label htmlFor="terms">{t('registration.form.termsCheckbox')}</label>
                        <p>{errors.terms?.message}</p>
                    </div>
                    <div id="buttons">
                        <button onClick={handleLogin}>{t('registration.form.login')}</button>
                        <button data-testid="submitButton" type="submit">{t('registration.form.submit')}</button>
                    </div>
                </form>
                <PageFooter id="footer" text={t('registration.footer')}/>
            </div>
        </>
    );
}

export default Registration;