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


function CreateCourse() {
  const {t} = useTranslation();

type CreateCourse = {
  name: string;
  slug: string;
  startDate: Date;
  endDate: Date;
};

const onSubmit: SubmitHandler<CreateCourse> = (data) => createCourse(data)


  const { register, handleSubmit, control, formState: { errors } } = useForm({ resolver: yupResolver(schema)})

  const baseURL = "http://localhost:8080/api/v1"

  const createCourse = async (data) => {
    await axios
        .post(baseURL + '/courses', {
          name: data.name,
          slug: data.slug,
          startDate: data.startDate.toISOString(),
          endDate: data.endDate.toISOString(),
          professorId: "e549c674-e8a6-4134-9655-aa98d66d596b"
        })
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
                render={({ field: { onChange, value } }) => (
                <DatePicker label="Start Date" value={value ?? " "} onChange={onChange} disablePast />
                )}
              />
            </LocalizationProvider>
            </Grid>

            <Grid >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
                name={"endDate"}
                control={control}
                render={({ field: { onChange, value } }) => (
                    <DatePicker label="End Date" data-testid="endDateField" value={value ?? " "} onChange={onChange}  
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