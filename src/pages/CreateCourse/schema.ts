import Yup from "../../config/yup.ts";
import i18n from "../../locales/i18n";


export const schema = Yup.object({
    name: Yup.string().required().min(1).max(255),
    slug: Yup.string().required().min(1).max(255).matches(
        /^[a-zA-Z0-9-]+$/,  i18n.t('createcourse.form.validation.special')),
    startDate: Yup.date().required(),
    endDate: Yup.date().required().min(Yup.ref('startDate'), i18n.t('createcourse.form.validation.endDate'))
}).required()
