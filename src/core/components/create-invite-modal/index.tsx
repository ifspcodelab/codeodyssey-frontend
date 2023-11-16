import * as React from 'react';
import { useEffect, useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid, Modal } from "@mui/material";
import Typography from '@mui/material/Typography';
import { useTranslation } from "react-i18next";
import Box from '@mui/material/Box';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';

import { InvitationService } from '../../services/api/invitation/InvitationService.ts';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard.ts'
import { ICourseResponse } from '../../models/Course.ts';
import { JwtService } from "../../auth/JwtService.ts";
import i18n from "../../../locales/i18n.ts";
import { schema } from "./schema.ts";
import './style.css'
import { IInvitationRequest } from '../../models/Invitation.ts';

interface ItemComponentProps {
  course: ICourseResponse;
}

const CreateInviteModal: React.FC<ItemComponentProps> = ({ course }) => {
  const { t } = useTranslation();
  const rawAccessToken = new JwtService().getRawAccessToken() as string;
  const [open, setOpen] = React.useState(false);

  const handleOpen = async () => {
    setOpen(true);
    await InvitationService.getInvitation(course.id, rawAccessToken)
      .then((response) => {
        if (response) {
          const expirationDate = new Date(response.expirationDate);
          const today = new Date();
          if (expirationDate > today && response.link !== null) {
            setInviteLink(response.link);
          } else if (expirationDate < today) {
            setInviteLink(" ")
          }
        } else {
          setInviteLink(" ")
        }
      }).catch((error: AxiosError<ProblemDetail>) => {
        handleError(error)
      });

  }

  const handleClose = () => {
    setErrorType("")
    setOpen(false)
  };
  const { handleSubmit, control, formState: { errors } } = useForm({ resolver: yupResolver(schema) })
  const [inviteLink, setInviteLink] = useState(" ");
  const [courseExpirationDate, setCourseExpirationDate] = useState<Date | undefined>(undefined);
  const [errorType, setErrorType] = useState('');
  const [value, copy] = useCopyToClipboard()

  const baseUrl = import.meta.env.VITE_BASE_URL_WEB as string
  const onSubmit: SubmitHandler<IInvitationRequest> = (data) => submitCreateInvite(data)
  useEffect(() => {
    void (() => {
      setCourseExpirationDate(new Date(course?.endDate))
    })();
  }, [course?.endDate]);

  const submitCreateInvite = async (data: IInvitationRequest) => {
    await InvitationService.sendInvitation(data.expirationDate.toISOString(), course.id, rawAccessToken)
      .then((response) => {
        setInviteLink(response?.link);
      }).catch((error: AxiosError<ProblemDetail>) => {
        handleError(error)
      })
  }

  const handleError = (error: AxiosError) => {
    let message: string
    let responseStatus: number
    let problemDetail: ProblemDetail = { title: '', detail: '', instance: '', status: 0, type: '' }
    if (error.response) {
      problemDetail = error.response.data as ProblemDetail
      responseStatus = problemDetail.status
      if (responseStatus == 400) {
        message = i18n.t("registration.exception.badRequest")
        setErrorType(message)
      } else if (responseStatus == 409 && problemDetail.title === "Invitation Expiration date is in the past") {
        message = i18n.t("invite.exception.datePast")
        setErrorType(message)
      } else if (responseStatus == 409 && problemDetail.title === "Invitation Expiration date is earlier than the course end date") {
        message = i18n.t("invite.exception.dateEarlier")
        setErrorType(message)
      }
    } else if (error.message == "Network Error") {
      setErrorType('networkError')
    }
  }

  return (
    <div>
      <Button size="medium" sx={{ p: 1, m: 1, width: 200 }}
        onClick={handleOpen}>{t("course.button.invite")}
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
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language == "pt" ? "pt-br" : "en"} >
                <Controller
                  name={"expirationDate"}
                  control={control}
                  defaultValue={courseExpirationDate}
                  render={({ field: { ref, onChange, ...field } }) => (

                    <DatePicker
                      {...field}
                      inputRef={ref}
                      label={t("invite.date")} data-testid="endDateField"
                      value={dayjs(courseExpirationDate)}
                      onChange={onChange}
                      disablePast
                      className="modal-date-picker"
                      slotProps={{
                        textField: {
                          helperText: errors.expirationDate && <span>{errors.expirationDate.message}</span>
                        },
                      }}
                    />
                  )}
                />

              </LocalizationProvider>

              <Button variant="outlined" type="submit" className="modal-button"
                onClick={() => {
                  setErrorType("");
                }}>{t("invite.button.generate")}</Button>
            </Grid>

          </form>

          <Grid item xs={12} textAlign="right">

            {inviteLink !== " " ?
              <>
                <a className="modal-link" href="/">{`${baseUrl} ${inviteLink}`}</a>
                <Button variant="outlined" onClick={(event) => {
                  event?.preventDefault()
                  void copy(baseUrl + inviteLink)
                }}>{t("invite.button.copy")}</Button>
              </>
              : " "}
            <Grid>{value ? i18n.t("invite.copied") : ''}</Grid>
            <Grid item xs={12} textAlign="right" color="red">
              {errorType}
            </Grid>
          </Grid>
        </Box>
      </Modal>

    </div>
  );
};

export default CreateInviteModal;

