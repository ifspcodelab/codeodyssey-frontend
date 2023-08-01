import i18n from "../../locales/i18n";
import * as yup from "yup"

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