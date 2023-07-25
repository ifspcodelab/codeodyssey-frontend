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
  // professor: UserResponse;
};


const onSubmit: SubmitHandler<CourseResponse> = (data) => createCourse(data)
  const { register, handleSubmit, watch, control, formState: { errors } } = useForm({ resolver: yupResolver(schema)})
  const navigate = useNavigate()
  const professorId = "8544a9bc-6aa7-4e40-9f7f-88e0eb0e35c1"
  const BASE_URL: string = import.meta.env.VITE_BASE_URL as string;
async function createCourse(data: CourseResponse) {
  try {
      await axios.post<CourseResponse>(
        BASE_URL + "/users/" + professorId + "/courses",
          { name: data.name, slug: data.slug, startDate: data.startDate.toISOString(),  endDate: data.endDate.toISOString() },
          {
              headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
              },
          },
      );
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

const handleError = (error) => {
  let responseStatus: number
  responseStatus = error.response.data.status
  if (responseStatus == 400) {
      alert(i18n.t("registration.exception.badRequest"))
  }
}

  return (
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
              data-testid="nameField"
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
              data-testid="slugField"
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
            <Button data-testid="cancelButton" variant="outlined" color="error">{t('createcourse.form.cancel')}</Button>
            <Button data-testid="submitButton" variant="outlined" type="submit">{t('createcourse.form.submit')}</Button>
           </Grid>
        </Grid>
       </form>
    </Container>
  )

}

export default CreateCourse