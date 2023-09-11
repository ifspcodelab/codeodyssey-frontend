import * as React from 'react';
import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import { Button, Grid, Modal } from "@mui/material";
import Typography from '@mui/material/Typography';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./schema.ts";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CourseResponse } from '../../core/models/CourseResponse.ts';
import { InviteForm } from '../../core/models/InviteForm.ts'
import { useApiSendInvitation } from "../../core/hooks/useApiSendInvitation.ts";
import { JwtService } from "../../core/auth/JwtService.ts";
import dayjs from 'dayjs';
import { useCopyToClipboard } from '../../pages/Courses/usehooks-ts.ts'
import axios, { AxiosError } from 'axios';
import './style.css'

interface ItemComponentProps {
  course: CourseResponse;
}

const CreateInviteModal: React.FC<ItemComponentProps> = ({ course }) => {
  const { t } = useTranslation();
  const rawAccessToken = new JwtService().getRawAccessToken() as string;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { handleSubmit, control, formState: { errors } } = useForm({ resolver: yupResolver(schema) })
  const { sendInvitation } = useApiSendInvitation();
  const [inviteLink, setInviteLink] = useState(" ");
  const [courseExpirationDate, setCourseExpirationDate] = useState("")
  const [errorType, setErrorType] = useState('');
  const [value, copy] = useCopyToClipboard()
  
  const onSubmit: SubmitHandler<InviteForm> = (data) => submitCreateInvite(data)
  useEffect(() => {
    setCourseExpirationDate(dayjs(course.endDate))
  }, []);

  async function submitCreateInvite(data: InviteForm) {
    try {
      const dataResponse = await sendInvitation(data.endDate.toISOString(), course.id, rawAccessToken);
      console.log(dataResponse.link)
      setInviteLink(dataResponse.link)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        handleError(error)
      } else {
        setErrorType('unexpected')
      }
    }
  }

  const handleError = (error: AxiosError) => {
    let responseStatus: number
    let problemDetail: ProblemDetail = { title: '', detail: '', instance: '', status: 0, type: '' }
    if (error.response) {
      problemDetail = error.response.data as ProblemDetail
      responseStatus = problemDetail.status
      setInviteLink(" ")
      if (responseStatus == 400) {
        setErrorType('badRequest')
      } else if (responseStatus == 409 && error.response.data.title === "Invitation Expiration date is in the past") {
        setErrorType('Invitation Expiration date is in the past')
      } else if (responseStatus == 409 && error.response.data.title === "Invitation Expiration date is earlier than the course end date") {
        setErrorType('Invitation Expiration date is earlier than the course end date')
      }
    } else if (error.message == "Network Error") {
      setErrorType('networkError')
    }
  }

  return (
    <div>
       <Button variant="contained" size="medium" sx={{ p: 1, m: 1, width: 200 }}
            onClick={handleOpen}>{t("courses.button.invite")}
      </Button>
      
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="modal-container"
      >
        <Box className="modal">
          <Typography id="modal-modal-title" variant="h6" component="h2" className="modal-title">
          {t("invite.title")}
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>

            <Grid item xs={12} textAlign="center" className="modal-form">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name={"endDate"}
                  control={control}
                  defaultValue={courseExpirationDate}
                  render={({ field: { ref, onChange, value, ...field } }) => (

                    <DatePicker
                      {...field}
                      inputRef={ref}
                      label={t("invite.date")} data-testid="endDateField"
                      value={courseExpirationDate}
                      onChange={onChange}
                      disablePast
                      className="modal-date-picker"
                      slotProps={{
                        textField: {
                          helperText: errors.endDate && <span>{errors.endDate.message}</span>
                        },
                      }}
                    />
                  )}
                />

              </LocalizationProvider>

              <Button variant="outlined" type="submit" className="modal-button">{t("invite.button.generate")}</Button>
            </Grid>

          </form>

          <Grid item xs={12} textAlign="right">
            {inviteLink !== " " ?
              <>
                <a className="modal-link" href="/">{`localhost:5173 ${inviteLink}`}</a>
                <Button variant="outlined" onClick={(event) => {
                  event?.preventDefault()
                  copy("localhost:5173" + inviteLink)
                }}>{t("invite.button.copy")}</Button>
              </>
              : " "}
            <Grid item xs={12} textAlign="right">
              {errorType}
            </Grid>
          </Grid>
        </Box>
      </Modal>

    </div>
  );
};

export default CreateInviteModal;

