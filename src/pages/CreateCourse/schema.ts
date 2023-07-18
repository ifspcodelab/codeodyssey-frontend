import Yup from "../../config/yup.ts";

export const schema = Yup.object({
    name: Yup.string().required().min(5).max(50),
    slug: Yup.string().required(),
    startDate: Yup.date().nullable(),
    endDate: Yup.date().nullable()
}).required()
