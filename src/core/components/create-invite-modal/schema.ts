import Yup from "../../../config/yup.ts";

export const schema = Yup.object({
    expirationDate: Yup.date().required(),
}).required()
