import PageHeader from "../../components/PageHeader";
import {useTranslation} from "react-i18next";
import {Button, Container, Grid, TextField} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import {schema} from "./schema.ts";
import {SubmitHandler, useForm} from "react-hook-form";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';


function CreateCourse() {
  const {t} = useTranslation();

  interface CreateCourse {
    name: string;
    slug: string;
    startDate: string;
    endDate: string;
}

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema)})

  const onSubmit: SubmitHandler<CreateCourse> = (data) => console.log(data)


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
            />
          </Grid>

          <Grid item xs={12} textAlign="right" display="flex" alignItems="spaceBetween">
            <Grid item xs={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs} >
                <DemoContainer components={['DatePicker']}>
                  <DatePicker 
                    label={t('createcourse.form.startDate')} 
                    defaultValue={dayjs()}
                    disablePast
                    />   
                </DemoContainer>
              </LocalizationProvider>   
            </Grid>

            <Grid >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker label={t('createcourse.form.endDate')} disablePast/>
              </DemoContainer>
            </LocalizationProvider>   
            </Grid>        
            
          </Grid>

          <Grid item xs={12} textAlign="right">
            <Button variant="outlined" color="error">{t('createcourse.form.cancel')}</Button>
            <Button variant="outlined" type="submit">{t('createcourse.form.submit')}</Button>
           </Grid>
        </Grid>
       </form>
    </Container>


  )

}

export default CreateCourse