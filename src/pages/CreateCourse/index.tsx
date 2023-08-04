import PageHeader from "../../components/PageHeader";
import {useTranslation} from "react-i18next";
import {Button, Container, Grid, TextField} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import {schema} from "./schema.ts";
import {SubmitHandler, useForm, Controller} from "react-hook-form";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from "axios";
import dayjs from 'dayjs';
import {useNavigate} from "react-router-dom"
import i18n from "../../locales/i18n";
import { ptBR } from "@mui/x-date-pickers";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
import {AuthConsumer} from "../../core/auth/AuthContext.tsx";
import {useApi} from "../../core/hooks/useApi.ts";


function CreateCourse() {
  const {t} = useTranslation();

type UserResponse = {
  name: string;
  email: string;
  role: string;
};

type CourseResponse = {
  name: string;
  slug: string;
  startDate: Date;
  endDate: Date;
  professor: UserResponse;
};


  const authConsumer = AuthConsumer();
  const onSubmit: SubmitHandler<CourseResponse> = (data) => submitCreateCourse(data)
  const { register, handleSubmit, watch, control, formState: { errors } } = useForm({ resolver: yupResolver(schema)})
  const navigate = useNavigate()
  const PROFESSOR_ID: string = authConsumer.id;
  const [open, setOpen] = React.useState(false);
  const { createCourse } = useApi();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function submitCreateCourse(data: CourseResponse) {
    try {
        await createCourse(data.name, data.slug, data.startDate.toISOString(),  data.endDate.toISOString(), PROFESSOR_ID);
        navigate('/courses')
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

  const handleError = (error: any) => {
    let responseStatus: number
    responseStatus = error.response.data.status
    if (responseStatus == 400) {
        alert(i18n.t("createcourse.exception.badRequest"))
    } else if (responseStatus === 409) {
      alert(i18n.t("createcourse.exception.duplicate"))
    } else if (responseStatus === 401) {
      alert(i18n.t("createcourse.exception.unauthorized"))
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
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
              <LocalizationProvider dateAdapter={AdapterDayjs} localeText={ptBR as any}>
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
              <Button data-testid="cancelButton" variant="outlined" color="error" onClick={handleClickOpen}>{t('createcourse.form.cancel')}</Button>
              <Button data-testid="submitButton" variant="outlined" type="submit">{t('createcourse.form.submit')}</Button>
            </Grid>
          </Grid>
        </form>
      </Container>

        <Dialog
        open={open}
        onClose={handleClose}
        >
          <DialogTitle>
            {t('createcourse.form.confimationdialog.title')}  
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t('createcourse.form.confimationdialog.description')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {navigate("/");}}> 
              {t('createcourse.form.confimationdialog.leave')}
            </Button>
            <Button onClick={handleClose} autoFocus>
              {t('createcourse.form.confimationdialog.continue')}
            </Button>
          </DialogActions>
        </Dialog>
      </>
  )
}

export default CreateCourse