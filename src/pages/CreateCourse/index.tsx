import { useTranslation } from "react-i18next";
import { Box, Grid, Paper, TextField, Typography } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./schema.ts";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AxiosError } from "axios";
import dayjs from 'dayjs';
import { useNavigate } from "react-router-dom"
import { CreateCourseResponse } from "../../core/models/CreateCourseResponse";
import { CustomDate } from "../../core/models/CustomDate";
import ErrorSnackBar from "../../core/components/error-snack-bar/ErrorSnackBar.tsx";
import { AuthConsumer } from "../../core/auth/AuthContext.tsx";
import { JwtService } from "../../core/auth/JwtService.ts";
import 'dayjs/locale/pt-br'
import 'dayjs/locale/en'
import i18n from '../../locales/i18n.ts'
import { PageBaseLayout } from "../../core/layout/PageBaseLayout.tsx";
import { CoursesService } from "../../core/services/api/courses/CoursesService.ts";
import { useErrorHandler } from "../../core/hooks/useErrorHandler.ts";
import { ToolDetails } from "../../core/components/tool-details/ToolDetails.tsx";

function CreateCourse() {
  const { t } = useTranslation();
  const { handleError, openError, errorType, handleCloseError } = useErrorHandler();
  const authConsumer = AuthConsumer();
  const onSubmit: SubmitHandler<CreateCourseResponse> = (data) => submitCreateCourse(data)
  const { register, handleSubmit, watch, getValues, trigger, control, formState: { errors } } = useForm({ resolver: yupResolver(schema) })
  const navigate = useNavigate()
  const PROFESSOR_ID: string = authConsumer.id;
  const rawAccessToken = new JwtService().getRawAccessToken() as string;

  const submitCreateCourse = async (data: CreateCourseResponse) => {
    await CoursesService.create(data.name, data.slug, data.startDate.toISOString(), data.endDate.toISOString(), PROFESSOR_ID, rawAccessToken)
      .then(() => {
        navigate('/courses?success=true')
      }).catch((error: AxiosError<ProblemDetail>) => {
        handleError(error)
      })
  }

  const convertedDate: CustomDate = dayjs(new Date()) as unknown as CustomDate;


  const handleSave = async () => {
    const isValid = await trigger();
    if (isValid) {
      const formData = getValues();
      await submitCreateCourse(formData);
    }
  };

  return (
    <>
      <PageBaseLayout title={t('createcourse.title')} toolbar={
        <ToolDetails
          onClickSave={() => handleSave()}
          onClickBack={() => { navigate('/courses') }}
        />
      }>
      </PageBaseLayout>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined">
          <Grid container direction="column" padding={2} spacing={2}>

            <Grid item>
              <Typography variant='h6'>Course</Typography>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <TextField
                  sx={{ width: "100%" }}
                  {...register("name")}
                  label={t("createcourse.form.name")}
                  variant="outlined"
                  error={!!errors.name}
                  helperText={errors.name && <span>{errors.name.message}</span>}
                  inputProps={{ "data-testid": "nameField" }}
                />
              </Grid>
            </Grid>


            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <TextField
                  sx={{ width: "100%" }}
                  {...register("slug")}
                  label={t("createcourse.form.slug")}
                  variant="outlined"
                  error={!!errors.slug}
                  helperText={errors.slug && <span>{errors.slug.message}</span>}
                  inputProps={{ "data-testid": "slugField" }}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language == "pt" ? "pt-br" : "en"} >
                  <Controller
                    name={"startDate"}
                    control={control}
                    defaultValue={convertedDate}
                    render={({ field: { ref, onChange, value, ...field } }) => (

                      <DatePicker
                        {...field}
                        inputRef={ref}
                        label={t("createcourse.form.startDate")} disablePast value={value ?? " "}
                        onChange={onChange as never}
                        slotProps={{
                          textField: {
                            helperText: errors.startDate && <span>{errors.startDate.message}</span>
                          },
                        }}
                      />
                    )}

                  />
                </LocalizationProvider>
              </Grid>
            </Grid>


            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language == "pt" ? "pt-br" : "en"} >
                  <Controller
                    name={"endDate"}
                    control={control}
                    defaultValue={undefined}
                    render={({ field: { ref, onChange, value, ...field } }) => (

                      <DatePicker
                        {...field}
                        inputRef={ref}
                        minDate={watch().startDate}
                        label={t("createcourse.form.endDate")} data-testid="endDateField"
                        value={value ? value : null}
                        onChange={onChange as never}

                        slotProps={{
                          textField: {
                            helperText: errors.endDate && <span>{errors.endDate.message}</span>
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

          </Grid>
        </Box>

      </form>

      <ErrorSnackBar open={openError} handleClose={handleCloseError} errorType={errorType} />
    </>
  )
}

export default CreateCourse