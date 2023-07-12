import {useTranslation} from "react-i18next";

function Contact() {
    const {t} = useTranslation();
    return (
        <>
            <h1>{t('contact.title')}</h1>
            <p>{t('contact.text')}</p>
        </>
    );
}

export default Contact