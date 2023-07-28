import axios from "axios";
import i18n from "../../locales/i18n";

const BASE_URL: string = import.meta.env.VITE_BASE_URL as string;

export async function createUser(name: string, email: string, password: string, navigate) {
    try {
        await axios.post<CreateUserResponse>(
            BASE_URL + '/users',
            { name: name, email: email.toLowerCase(), password: password },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
        );
        navigate('/resend-email', { state: { data: email }})
    }
    catch(error) {
        if (axios.isAxiosError(error)) {
            handleError(error)
        } else {
            console.log('unexpected error: ', error);
            return 'An unexpected error ocurred';
        }
    }
}

const handleError = (error) => {
    let responseStatus: number
    let problemDetail: ProblemDetail
    responseStatus = error.response.data.status
    if (responseStatus == 400) {
        alert(i18n.t("registration.exception.badRequest"))
    } else if (responseStatus == 409) {
        problemDetail = error.response.data;
        if (problemDetail.title == "User Already exists" && problemDetail.detail == "Email already exists")
            alert(i18n.t("registration.exception.email"))
    }
}