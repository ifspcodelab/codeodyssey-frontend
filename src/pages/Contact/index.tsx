import {useTranslation} from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import {Button, Container, Grid, TextField} from "@mui/material";
import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";
import {useForm} from "react-hook-form";
import {schema} from "./schema.ts";

function Contact() {
    const {t} = useTranslation();
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema)})

    const onSubmit = (data: any) => console.log(data)

    return (
        <Container maxWidth="md">
            <PageHeader title={t('contact.title')} text={t('contact.text')} />
            <form onSubmit={ handleSubmit(onSubmit) }>
                <Grid container spacing={1} rowSpacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            sx={{ width: "100%" }}
                            {...register("name", { required: true })}
                            label={t("contact.form.name")}
                            variant="outlined"
                            error={!!errors.name}
                            helperText={errors.name && <span>{errors.name.message}</span> }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            sx={{ width: "100%" }}
                            {...register("email", { required: true })}
                            label={t("contact.form.email")}
                            variant="outlined"
                            error={!!errors.email}
                            helperText={errors.email && <span>{errors.email.message}</span> }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            sx={{ width: "100%" }}
                            {...register("message", { required: true })}
                            label={t("contact.form.message")}
                            variant="outlined"
                            multiline
                            rows={4}
                            error={!!errors.message}
                            helperText={errors.message && <span>{errors.message.message}</span>}
                        />
                    </Grid>
                    <Grid item xs={12} textAlign="right">
                        <Button variant="outlined" type="submit">{t('contact.form.submit')}</Button>
                    </Grid>
                </Grid>
            </form>
            <PageFooter text={t('contact.footer')} />
        </Container>
    );
}

export default Contact