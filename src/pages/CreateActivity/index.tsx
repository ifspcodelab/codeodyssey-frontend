import React, { useEffect, useState } from "react";
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Typography } from "@mui/material";
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate, useParams } from "react-router-dom"
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br'
import 'dayjs/locale/en'

import { CoursesService } from "../../core/services/api/courses/CoursesService.ts";
import { ActivitiesService } from "../../core/services/api/activities/ActivitiesService.ts";
import ErrorSnackBar from "../../core/components/error-snack-bar/ErrorSnackBar.tsx";
import { ToolDetails } from "../../core/components/tool-details/ToolDetails.tsx";
import TextAreaField from "../../core/components/form/TextAreaField.tsx";
import { useErrorHandler } from "../../core/hooks/useErrorHandler.ts";
import { PageBaseLayout } from "../../core/layout/PageBaseLayout.tsx";
import FileUpload from "../../core/components/form/FileUpload.tsx";
import InputField from '../../core/components/form/InputField.tsx';
import { IActivityRequest } from "../../core/models/Activity.ts";
import { ICourseResponse } from "../../core/models/Course.ts";
import { JwtService } from "../../core/auth/JwtService.ts";
import { CustomDate } from "../../core/models/CustomDate";
import i18n from '../../locales/i18n.ts'
import { schema } from "./schema.ts";

const CreateActivity: React.FC = () => {
  const navigate = useNavigate()
  const [course, setCourse] = useState<ICourseResponse>();
  const { idCourse, slug } = useParams()
  const rawAccessToken = new JwtService().getRawAccessToken() as string;
  const { t } = useTranslation();

  const { handleError, openError, errorType, handleCloseError } = useErrorHandler();

  const [fileType, setFileType] = useState("");
  const [language, setLanguage] = React.useState('');

  const onSubmit: SubmitHandler<IActivityRequest> = (data) => submitCreateActivity(data)

  const methods = useForm({
    resolver: yupResolver(schema),
  });

  const convertedDate: CustomDate = dayjs(new Date()) as unknown as CustomDate;
  const convertedEndDate: CustomDate = course?.endDate ? dayjs(new Date(course?.endDate)) as unknown as CustomDate : dayjs(new Date()) as unknown as CustomDate;

  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
  };

  const submitCreateActivity = async (data: IActivityRequest) => {
    if ((course !== undefined) && (data.initialFile !== null) && (data.solutionFile !== null) && (data.testFile !== null)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await ActivitiesService.create(data.title, data.description, data.startDate.toISOString(), data.endDate.toISOString(), data.initialFile, data.solutionFile, data.testFile, data.extension, rawAccessToken, course.id)
        .then(() => {
          navigate(`/courses/${course.id}/${course.slug}/activities?success=true`)
        }).catch((error: AxiosError<ProblemDetail>) => {
          handleError(error)
        })
    }
  }

  const handleSave = async () => {
    const isValid = await methods.trigger();
    if (isValid) {
      const formData = methods.getValues();
      await submitCreateActivity(formData);
    }
  };

  useEffect(() => {
    if (language === ".java") {
      setFileType(".java")
    } else if (language === ".js") {
      setFileType(".js")
    }
  }, [fileType, language]);

  useEffect(() => {
    if (idCourse !== undefined) {
      CoursesService.getById(idCourse, rawAccessToken)
        .then((response) => {
          setCourse(response as ICourseResponse);
        }).catch((error: AxiosError<ProblemDetail>) => {
          handleError(error)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawAccessToken])


  return (
    <>
      <PageBaseLayout title={t('createactivity.title')} toolbar={
        <ToolDetails
          onClickSave={() => handleSave()}
          onClickBack={() => { navigate(`/courses/${idCourse}/${slug}/activities`) }}
        />
      }>
      </PageBaseLayout>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined">
            <Grid container direction="column" padding={2} spacing={2}>

              <Grid item>
                <Typography variant='h6'>Activity</Typography>
              </Grid>

              <Grid container item direction="row" spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                  <InputField fieldName="title" labelName="createactivity.form.title" />
                </Grid>
              </Grid>

              <Grid container item direction="row" spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                  <TextAreaField fieldName="description" labelName="createactivity.form.desc" minRows={2} maxRows={5} />
                </Grid>
              </Grid>

              <Grid container item direction="row" spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language == "pt" ? "pt-br" : "en"} >
                    <Controller
                      name={"startDate"}
                      control={methods.control}
                      defaultValue={convertedDate}
                      render={({ field: { ref, onChange, value, ...field } }) => (

                        <DatePicker
                          {...field}
                          inputRef={ref}
                          label={t('createactivity.form.startDate')}
                          disablePast value={value ?? " "}
                          maxDate={convertedEndDate}
                          onChange={onChange as never}
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
                      control={methods.control}
                      defaultValue={undefined}
                      render={({ field: { ref, onChange, value, ...field } }) => (

                        <DatePicker
                          {...field}
                          inputRef={ref}
                          minDate={methods.watch().startDate}
                          maxDate={convertedEndDate}
                          label={t('createactivity.form.endDate')}
                          value={value ? value : null}
                          onChange={onChange as never}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>

              <Grid container item direction="row" spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                  <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="language-label">Language</InputLabel>
                    <Select
                      {...methods.register("extension")}
                      labelId="language-label"
                      id="demo-simple-select"
                      value={language}
                      label={t('createactivity.form.language')}
                      onChange={handleChange}
                    >
                      <MenuItem value={".java"}>Java</MenuItem>
                      <MenuItem value={".js"}>Javascript</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container item direction="row" spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                  <FileUpload fieldName="initialFile" fileType={fileType} />
                  <FileUpload fieldName="testFile" fileType={fileType} />
                  <FileUpload fieldName="solutionFile" fileType={fileType} />
                </Grid>
              </Grid>

              <Grid item xs={12} textAlign="right">
                <Button variant="outlined" type="submit">{t('createactivity.form.button.publish')}</Button>
              </Grid>
            </Grid>
          </Box>
        </form>
      </FormProvider>

      <ErrorSnackBar open={openError} handleClose={handleCloseError} errorType={errorType} />
    </>
  );
}

export default CreateActivity

// TO-DO: Criteria Part

// , defaultValues: {
//   criteria: [{ name: "", weight: 0 }]
// }
// const { fields, append, remove } = useFieldArray({
//   name: "criteria",
//   control,
//   rules: {
//     required: "Please append at least 1 item"
//   }
// });


{/* <Grid item xs={12}>
              <span>
                {t('createactivity.form.evaluation')}
              </span>
              {fields.map((field, index) => {
                return (
                  <section key={field.id}>
                    <label>
                      <span>{t('createactivity.form.evaluationField.name')}</span>
                      <input
                        {...register(`criteria.${index}.name`, { required: true })}
                      />
                    </label>
                    <label>
                      <span>{t('createactivity.form.evaluationField.weight')}</span>
                      <input
                        type="number"
                        {...register(`criteria.${index}.weight`, { valueAsNumber: true })}
                      />
                    </label>
                    <button type="button" onClick={() => remove(index)}>
                      {t('createactivity.form.evaluationField.delete')}
                    </button>
                  </section>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  append({
                    name: "",
                    weight: 0
                  });
                }}
              >
                {t('createactivity.form.evaluationField.add')}
              </button>
            </Grid> */}