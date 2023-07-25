import Yup from "../../config/yup.ts";

export const schema = Yup.object({
    name: Yup.string().required().min(1).max(255),
    slug: Yup.string().required().min(1).max(255).matches(
        /^[a-zA-Z0-9]+$/,
        "This field cannot contain white space and special character"
      ),
    startDate: Yup.date().required(),
    endDate: Yup.date().required().min(Yup.ref('startDate'))
}).required()
