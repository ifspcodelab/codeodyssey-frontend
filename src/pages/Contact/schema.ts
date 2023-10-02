import Yup from "../../config/yup.ts";

export const schema = Yup.object({
    name: Yup.string().required().min(5).max(50),
    email: Yup.string().required().email(),
}).required()
