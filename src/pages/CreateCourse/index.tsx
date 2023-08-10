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
import { ptBR } from "@mui/x-date-pickers";
import {CreateCourseResponse} from "../../core/models/CreateCourseResponse";
import {useApiCourse} from "../../core/hooks/useApiCourse";
import ErrorSnackBar from "../../components/ErrorSnackBar/ErrorSnackBar";
import {useState} from "react";

function CreateCourse() {
  const {t} = useTranslation();

  const onSubmit: SubmitHandler<CreateCourseResponse> = (data) => submitCreateCourse(data)
  const { register, handleSubmit, watch, control, formState: { errors } } = useForm({ resolver: yupResolver(schema)})
  const navigate = useNavigate()
  const PROFESSOR_ID: string = import.meta.env.VITE_PROFESSOR_ID as string;
  const { createCourse } = useApiCourse();

  const {isShowing, toggle} = useConfirmationDialog()
  const [errorType, setErrorType] = useState('');
  const [open, setOpen] = useState(false);

  async function submitCreateCourse(data: CreateCourseResponse) {
    try {
      await createCourse(data.name, data.slug, data.startDate.toISOString(),  data.endDate.toISOString(), PROFESSOR_ID);

      navigate('/courses')
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
        if (responseStatus == 400) {
            setErrorType('badRequest')
            setOpen(true);
        } else if (responseStatus == 409) {
            // if (error.response) problemDetail = error.response.data as ProblemDetail
            // if (problemDetail.title == "Slug Already exists" && problemDetail.detail == "Slug already exists")
                setErrorType('sluglAlreadyExists')
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
        <form onSubmit={handleSubmit(onSubmit) }>
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name={"startDate"}
                  control={control}
                  defaultValue={dayjs(new Date())}

                  render={({ field: { onChange, value } }) => (
                  <DatePicker label={t("createcourse.form.startDate")} disablePast  value={value ?? " "} onChange={onChange} 
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
              <LocalizationProvider dateAdapter={AdapterDayjs} localeText={ptBR}>
              <Controller
                  name={"endDate"}
                  control={control}
                  defaultValue={null}
                  render={({ field: { onChange, value } }) => (
                      <DatePicker label={t("createcourse.form.endDate")} data-testid="endDateField" value={value || null} onChange={onChange} minDate={watch().startDate}
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
              <Button data-testid="cancelButton" variant="outlined" color="error" onClick={toggle}>{t('createcourse.form.cancel')}</Button>
              <Button data-testid="submitButton" variant="outlined" type="submit">{t('createcourse.form.submit')}</Button>
              <ConfirmationDialog isShowing={isShowing}
              hide={toggle} title={t('createcourse.form.confimationdialog.title')} desc={t('createcourse.form.confimationdialog.description')}> leave={t('createcourse.form.confimationdialog.leave')} ok={t('createcourse.form.confimationdialog.continue')} </ConfirmationDialog>
            </Grid>
          </Grid>
        </form>
        <ErrorSnackBar open={open} handleClose={handleClose} errorType={errorType}/>
      </Container>
      </>
  )
}

export default CreateCourse