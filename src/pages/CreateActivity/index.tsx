import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import PageHeader from "../../components/PageHeader";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { schema } from "./schema.ts";
import React from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import i18n from '../../locales/i18n.ts'
import 'dayjs/locale/pt-br'
import 'dayjs/locale/en'


interface ActivityForm {
  name: string;
  description: string;
  language: string;
  startDate: Date;
  endDate: Date;
}

function CreateActivity() {
  const onSubmit: SubmitHandler<ActivityForm> = (data) => console.log(data)
  const { register, control, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  const [language, setLanguage] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
  };
  return (
    // TO-DO: Send files (initial, tests and resolution)
    // TO-D0: Select and define evaluation criteria 
    <>
      <PageHeader title="CreateActivity" text="CreateActivity" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={1} rowSpacing={2}>
          <Grid item xs={12}>
            <TextField
              sx={{ width: "100%" }}
              {...register("name")}
              label="name"
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name && <span>{errors.name.message}</span>}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              sx={{ width: "100%" }}
              {...register("description")}
              label="description"
              variant="outlined"
              error={!!errors.description}
            // helperText={errors.description && <span>{errors.description.message}</span>}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel id="demo-simple-select-label">Language</InputLabel>
            <Select
              {...register("language")}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={language}
              label="Language"
              onChange={handleChange}
            >
              <MenuItem value={"Java"}>Java</MenuItem>
              <MenuItem value={"Javascript"}>Javascript</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12} textAlign="right" display="flex" alignItems="spaceBetween">
            <Grid item xs={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language == "pt" ? "pt-br" : "en"} >
                <Controller
                  name={"startDate"}
                  control={control}

                  render={({ field: { ref, onChange, ...field } }) => (

                    <DatePicker
                      {...field}
                      inputRef={ref}
                      label="createcourse.form.startDate" disablePast
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
                  control={control}
                  defaultValue={undefined}
                  render={({ field: { ref, onChange, value, ...field } }) => (

                    <DatePicker
                      {...field}
                      inputRef={ref}
                      label="createcourse.form.endDate" data-testid="endDateField"
                      value={value ? value : null}
                      onChange={onChange as never}


                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

          </Grid>
          <Grid item xs={12} textAlign="right">
            <Button variant="outlined" type="submit">create activity</Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}

export default CreateActivity