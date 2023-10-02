import Yup from "../../config/yup.ts";

export const schema = Yup.object({
    name: Yup.string().required().min(5).max(50),
    description: Yup.string().required(),
    language: Yup.string().required(),
    startDate: Yup.date().required(),
    endDate: Yup.date().required().min(Yup.ref('startDate'))
}).required()
