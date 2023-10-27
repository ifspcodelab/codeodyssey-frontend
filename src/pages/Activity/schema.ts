import Yup from "../../config/yup.ts";
import i18n from "../../locales/i18n";

export const schema = Yup.object({
    resolutionFile: Yup.mixed().required(i18n.t('activity.form.validation.resolutionfile')),
}).required()
