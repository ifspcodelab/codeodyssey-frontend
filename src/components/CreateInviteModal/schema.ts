import Yup from "../../config/yup.ts";

export const schema = Yup.object({
    endDate: Yup.date().required(),
}).required()
