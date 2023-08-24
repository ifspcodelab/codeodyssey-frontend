import PageHeader from "../../components/PageHeader";
import ConfirmationDialog from "../../components/ConfirmationDialog/index.tsx";
import useConfirmationDialog from "../../core/hooks/useConfirmationDialog.tsx";
import {useTranslation} from "react-i18next";
import {Button, Container, Grid, TextField} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import {schema} from "./schema.ts";
import {SubmitHandler, useForm, Controller} from "react-hook-form";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios, {AxiosError} from "axios";
import dayjs from 'dayjs';
import {useNavigate} from "react-router-dom"
import {CreateCourseResponse} from "../../core/models/CreateCourseResponse";
import ErrorSnackBar from "../../components/ErrorSnackBar/ErrorSnackBar";
import {useState} from "react";
import * as React from 'react';
import {AuthConsumer} from "../../core/auth/AuthContext.tsx";
import {JwtService} from "../../core/auth/JwtService.ts";
import {useApiCreateCourse} from "../../core/hooks/useApiCreateCourse";
import 'dayjs/locale/pt-br'
import 'dayjs/locale/en'
import i18n from '../../locales/i18n.ts'

function CreateCourse() {
  const {t} = useTranslation();

  const authConsumer = AuthConsumer();
  const onSubmit: SubmitHandler<CreateCourseResponse> = (data) => submitCreateCourse(data)
  const { register, handleSubmit, watch, control, formState: { errors } } = useForm({ resolver: yupResolver(schema)})
  const navigate = useNavigate()
  const PROFESSOR_ID: string = authConsumer.id;
  const rawAccessToken = new JwtService().getRawAccessToken() as string;
  const [open, setOpen] = React.useState(false);
  const { createCourse } = useApiCreateCourse();

  const {isShowing, toggle} = useConfirmationDialog()
  const [errorType, setErrorType] = useState('');


  async function submitCreateCourse(data: CreateCourseResponse) {
    try {
      console.log("@ create course | rawAccessToken", rawAccessToken)
        await createCourse(data.name, data.slug, data.startDate.toISOString(),  data.endDate.toISOString(), PROFESSOR_ID, rawAccessToken);
        navigate('/courses?success=true')
    }
    catch(error) {
        if (axios.isAxiosError(error)) {
          handleError(error)
        } else {
          setErrorType('unexpected')
          setOpen(true);
        }
    }
  }

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway' || event === undefined) {
        return;
    }

    setOpen(false);
};

  const handleError = (error: AxiosError) => {
    let responseStatus: number
    let problemDetail: ProblemDetail = { title: '', detail: '' , instance: '', status: 0, type: ''}
    if (error.response) {
        problemDetail = error.response.data as ProblemDetail
        responseStatus = problemDetail.status
        console.log(error.response.data)
        if (responseStatus == 400) {
            setErrorType('badRequest')
            setOpen(true);
        } else if (responseStatus == 409) {
            if (error.response) problemDetail = error.response.data as ProblemDetail
            if (problemDetail.title == "Course Already exists")
                setErrorType('courselAlreadyExists')
                setOpen(true);
        }  
    } else if (error.message == "Network Error") {
        setErrorType('networkError')
        setOpen(true);
    }
}

  return (
    <>
      <Container maxWidth="md">
        <PageHeader title={t('createcourse.title')} text={t('createcourse.text')} />
        <form onSubmit={handleSubmit(onSubmit as any) }>
          <Grid container spacing={1} rowSpacing={2}>
            <Grid item xs={12}>
              <TextField
                sx={{ width: "100%" }}
                {...register("name")}
                label={t("createcourse.form.name")}
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name && <span>{errors.name.message}</span> }
                inputProps={{ "data-testid": "nameField" }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                sx={{ width: "100%" }}
                {...register("slug")}
                label={t("createcourse.form.slug")}
                variant="outlined"
                error={!!errors.slug}
                helperText={errors.slug && <span>{errors.slug.message}</span> }
                inputProps={{ "data-testid": "slugField" }}
              />
            </Grid>

            <Grid item xs={12} textAlign="right" display="flex" alignItems="spaceBetween">
              <Grid item xs={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language == "pt" ? "pt-br" : "en"} >
                <Controller
                  name={"startDate"}
                  control={control}
                  defaultValue={dayjs(new Date()) as any}

                  render={({ field: { onChange, value } }) => (
                  <DatePicker label={t("createcourse.form.startDate")} disablePast  value={value ?? " "} onChange={onChange as any}
                  slotProps={{
                    textField: {
                      helperText: errors.startDate && <span>{errors.startDate.message}</span> 
                    },
                  }}/>
                  )}
                />
              </LocalizationProvider>
              </Grid>

              <Grid >
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language == "pt" ? "pt-br" : "en"} >
              <Controller
                  name={"endDate"}
                  control={control}
                  defaultValue={undefined}
                  render={({ field: { onChange, value } }) => (
                      <DatePicker label={t("createcourse.form.endDate")} data-testid="endDateField" value={value || null} onChange={onChange as any} minDate={watch().startDate}
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

            <Grid item xs={12} textAlign="right">
              <Button data-testid="submitButton" variant="outlined" type="submit">{t('createcourse.form.submit')}</Button>
            </Grid>
          </Grid>
        </form>
        <ErrorSnackBar open={open} handleClose={handleClose} errorType={errorType}/>
      </Container>
      </>
  )
}

export default CreateCourse