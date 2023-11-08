import { Box, Button, Grid, Paper, TextField } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";

import PageFooter from "../../core/components/page-footer/index.tsx";
import { PageBaseLayout } from "../../core/layout/PageBaseLayout.tsx";
import { schema } from "./schema.ts";

interface IContactForm {
    name: string;
    email: string;
    message?: string;
}

const Contact: React.FC = () => {
    const { t } = useTranslation();
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

    const onSubmit: SubmitHandler<IContactForm> = (data) => console.log(data)

    return (
        <>
            <PageBaseLayout title={t('contact.title')}  >

            </PageBaseLayout>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined">

                    <Grid container direction="column" padding={2} spacing={2}>
                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                <TextField
                                    sx={{ width: "100%" }}
                                    {...register("name")}
                                    label={t("contact.form.name")}
                                    variant="outlined"
                                    error={!!errors.name}
                                    helperText={errors.name && <span>{errors.name.message}</span>} />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                <TextField
                                    sx={{ width: "100%" }}
                                    {...register("email")}
                                    label={t("contact.form.email")}
                                    variant="outlined"
                                    error={!!errors.email}
                                    helperText={errors.email && <span>{errors.email.message}</span>} />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                <TextField
                                    sx={{ width: "100%" }}
                                    {...register("message")}
                                    label={t("contact.form.message")}
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    error={!!errors.message}
                                    helperText={errors.message && <span>{errors.message.message}</span>} />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                <Button variant="outlined" type="submit">{t('contact.form.submit')}</Button>
                            </Grid>
                        </Grid>

                    </Grid>
                </Box>
            </form>
            <PageFooter text={t('contact.footer')} />
        </>
    );
}

export default Contact