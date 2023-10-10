import Yup from "../../config/yup.ts";

export const schema = Yup.object({
    resolutionFile: Yup.mixed().required('File is required'),
}).required()
