import Yup from "../../config/yup.ts";
import i18n from "../../locales/i18n";

export const schema = Yup.object({
    title: Yup.string().required().min(5).max(50),
    description: Yup.string().required().min(5),
    extension: Yup.string().required(),
    startDate: Yup.date().required(),
    endDate: Yup.date().required().min(Yup.ref('startDate')),
    initialFile: Yup.mixed().required(i18n.t('createactivity.form.validation.initialfile')),
    testFile: Yup.mixed().required(i18n.t('createactivity.form.validation.testfile')),
    solutionFile: Yup.mixed().required(i18n.t('createactivity.form.validation.solutionfile')),
}).required()
