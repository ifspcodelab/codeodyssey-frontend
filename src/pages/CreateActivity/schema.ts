import Yup from "../../config/yup.ts";

export const schema = Yup.object({
    title: Yup.string().required().min(5).max(50),
    description: Yup.string().required().min(5),
    extension: Yup.string().required(),
    startDate: Yup.date().required(),
    endDate: Yup.date().required().min(Yup.ref('startDate')),
    initialFile: Yup.mixed().required('File is required'),
    testFile: Yup.mixed().required('File is required'),
    solutionFile: Yup.mixed().required('File is required'),
}).required()
