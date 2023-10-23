import { Button, Grid, Typography } from "@mui/material";
import { useApiGetActivity } from "../../core/hooks/useApiGetActivity.ts";
import { useApiSendResolution } from "../../core/hooks/useApiSendResolution.ts";
import { JwtService } from "../../core/auth/JwtService.ts";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthConsumer } from "../../core/auth/AuthContext.tsx";
import { ResolutionForm } from "../../core/models/ResolutionForm.ts"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { schema } from "./schema.ts";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import i18n from "../../locales/i18n";
import SuccessrSnackBar from "../../components/SuccessSnackBar/index.tsx";
import axios, { AxiosError } from "axios";
import ErrorSnackBar from "../../components/ErrorSnackBar/ErrorSnackBar";
import { ActivityResponse } from './../../core/models/ActivityResponse';
import "./style.css";
import FileUpload from "../../components/FileUpload/FileUpload.tsx";

function Activity() {
  const { getActivity } = useApiGetActivity()
  const { sendResolution } = useApiSendResolution()
  const rawAccessToken = new JwtService().getRawAccessToken() as string;
  const { idCourse, idActivity } = useParams()
  const [activity, setActivity] = useState<ActivityResponse>();
  const [openSuccess, setOpenSuccess] = useState(false);

  const handleCloseSuccess = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway' || event === undefined) {
      return;
    }
    setOpenSuccess(false);
  };

  const [fileType, setFileType] = useState("");

  const { t } = useTranslation();

  useEffect(() => {
    void (async () => {
      if ((idCourse !== undefined) && (idActivity !== undefined)) {
        try {
          const activityResponse = await getActivity(idCourse, idActivity, rawAccessToken);
          setActivity(activityResponse)

        } catch (error) {
          if (axios.isAxiosError(error)) {
            handleError(error)
          } else {
            setErrorType('unexpected')
          }
        }
      }
    })();
    // eslint-disable-next-line
  }, []);

  const [errorType, setErrorType] = useState('');
  const [openError, setOpenError] = useState(false);
  const authConsumer = AuthConsumer();

  const USER_ID: string = authConsumer.id;

  const onSubmit: SubmitHandler<ResolutionForm> = (data) => submitResolutionActivity(data)


  const methods = useForm({
    resolver: yupResolver(schema),
  });

  const handleError = (error: AxiosError) => {
    let responseStatus: number
    let problemDetail: ProblemDetail = { title: '', detail: '', instance: '', status: 0, type: '' }
    if (error.response) {
      problemDetail = error.response.data as ProblemDetail
      responseStatus = problemDetail.status
      if (responseStatus == 400) {
        setErrorType('badRequest')
        setOpenError(true);
      }
    } else if (error.message == "Network Error") {
      setErrorType('networkError')
      setOpenError(true);
    }
  }

  const handleCloseError = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway' || event === undefined) {
      return;
    }
    setOpenError(false);
  };

  async function submitResolutionActivity(data: ResolutionForm) {
    try {
      if ((idCourse !== undefined) && (idActivity !== undefined)) {
        await sendResolution(data.resolutionFile, rawAccessToken, idCourse, idActivity);
        setOpenSuccess(true)
      }
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        handleError(error)
      } else {
        setErrorType('unexpected')
      }
    }
  }

  const handleDecodeAndDownload = () => {
    const base64String = activity?.initialFile;
    if (typeof base64String === 'string') {
      const decodedString = atob(base64String);
      const blob = new Blob([decodedString], { type: 'text/plain' });
      const blobUrl = window.URL.createObjectURL(blob);

      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;

      downloadLink.download = `initialFile${fileType}`;

      document.body.appendChild(downloadLink);
      downloadLink.click();

      window.URL.revokeObjectURL(blobUrl);
    }

  }

  useEffect(() => {
    if (activity?.extension === ".java") {
      setFileType(".java")
    } else if (activity?.extension === ".js") {
      setFileType(".js")
    }
  }, [fileType, activity]);

  return (
    <>
      {<SuccessrSnackBar message={t('activity.successMessage')} open={openSuccess} handleClose={handleCloseSuccess} />}

      <h1>{activity?.title}</h1>
      <Typography sx={{ fontSize: 14 }} gutterBottom>
        Professor:  {activity?.course?.professor.name}
        <br />
        {t('activity.course')}: {activity?.course?.name}
        <br />
        {t("activity.language")}: {activity?.extension === '.java' && 'Java'}
        <br />
        {t('activity.date')}: {new Date(activity?.course?.startDate).toLocaleDateString(i18n.language, { timeZone: "Europe/London" })} {t('activity.until')} {new Date(activity?.course?.endDate).toLocaleDateString(i18n.language, { timeZone: "Europe/London" })}
        <br />

        <button onClick={handleDecodeAndDownload}>{t('activity.button.download')}</button>
      </Typography>

      {activity?.course?.professor?.id === USER_ID ? <span></span> : <Grid item xs={12}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>

            <FileUpload fieldName="resolutionFile" fileType={fileType} />

            <Button variant="outlined" type="submit">{t('activity.button.resolution')}</Button>
          </form>
        </FormProvider>

      </Grid>}

      <ErrorSnackBar open={openError} handleClose={handleCloseError} errorType={errorType} />
    </>
  );
}

export default Activity