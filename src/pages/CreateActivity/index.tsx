import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import PageHeader from "../../components/PageHeader";
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { schema } from "./schema.ts";
import React, { useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import i18n from '../../locales/i18n.ts'
import 'dayjs/locale/pt-br'
import 'dayjs/locale/en'
import { CustomDate } from "../../core/models/CustomDate";
import dayjs from 'dayjs';
import { useTranslation } from "react-i18next";
import { ActivityForm } from "../../core/models/ActivityForm.ts"
import { JwtService } from "../../core/auth/JwtService.ts";
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import ErrorSnackBar from "../../core/components/error-snack-bar/ErrorSnackBar.tsx";
import FileUpload from "../../components/Form/FileUpload.tsx";
import InputField from '../../components/Form/InputField.tsx';
import TextAreaField from "../../components/Form/TextAreaField.tsx";
import { ActivitiesService } from "../../core/services/api/activities/ActivitiesService.ts";
import { useErrorHandler } from "../../core/hooks/useErrorHandler.ts";
import { CoursesService, ICourseResponse } from "../../core/services/api/courses/CoursesService.ts";

const CreateActivity: React.FC = () => {
  const onSubmit: SubmitHandler<ActivityForm> = (data) => submitCreateActivity(data)

  const navigate = useNavigate()
  const [course, setCourse] = useState<ICourseResponse>();
  const { idCourse } = useParams()
  const rawAccessToken = new JwtService().getRawAccessToken() as string;

  const { handleError, openError, errorType, handleCloseError } = useErrorHandler();

  const submitCreateActivity = async (data: ActivityForm) => {
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

  const methods = useForm({
    resolver: yupResolver(schema),
  });

  const [fileType, setFileType] = useState("");
  const [language, setLanguage] = React.useState('');

  useEffect(() => {
    if (language === ".java") {
      setFileType(".java")
    } else if (language === ".js") {
      setFileType(".js")
    }
  }, [fileType, language]);


  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
  };

  const { t } = useTranslation();

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

  const convertedDate: CustomDate = dayjs(new Date()) as unknown as CustomDate;

  const convertedEndDate: CustomDate = course?.endDate ? dayjs(new Date(course?.endDate)) as unknown as CustomDate : dayjs(new Date()) as unknown as CustomDate;


  return (
    <>
      <Container maxWidth="md">
        <PageHeader title={t('createactivity.title')} text={t('createactivity.text')} />
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Grid container spacing={1} rowSpacing={2}>

              <Grid item xs={12}>
                <InputField fieldName="title" labelName="createactivity.form.title" />
              </Grid>

              <Grid item xs={12}>
                <TextAreaField fieldName="description" labelName="createactivity.form.desc" minRows={2} maxRows={5} />
              </Grid>

              <Grid item xs={12} textAlign="right" display="flex" alignItems="spaceBetween">
                <Grid item xs={4}>
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

                <Grid >
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

              <Grid item xs={12}>
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

              {language ? <>
                <FileUpload fieldName="initialFile" fileType={fileType} />
                <FileUpload fieldName="testFile" fileType={fileType} />
                <FileUpload fieldName="solutionFile" fileType={fileType} />
              </> : <span></span>}

              <Grid item xs={12} textAlign="right">
                <Button variant="outlined" type="submit">{t('createactivity.form.button.publish')}</Button>
              </Grid>
            </Grid>
          </form>
        </FormProvider>

      </Container>
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