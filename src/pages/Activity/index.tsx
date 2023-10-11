import PageHeader from "../../components/PageHeader";
import { Button, Grid, Typography } from "@mui/material";
import { useApiGetActivity } from "../../core/hooks/useApiGetActivity.ts";
import { useApiSendResolution } from "../../core/hooks/useApiSendResolution.ts";
import { JwtService } from "../../core/auth/JwtService.ts";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthConsumer } from "../../core/auth/AuthContext.tsx";
import { ResolutionForm } from "../../core/models/ResolutionForm.ts"
import { ActivityResponse } from "../../core/models/ActivityResponse.ts"
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { schema } from "./schema.ts";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import i18n from "../../locales/i18n";
import SuccessrSnackBar from "../../components/SuccessSnackBar/index.tsx";
import axios, { AxiosError } from "axios";
import ErrorSnackBar from "../../components/ErrorSnackBar/ErrorSnackBar";

function Activity() {
  const { getActivity } = useApiGetActivity()
  const { sendResolution } = useApiSendResolution()
  const rawAccessToken = new JwtService().getRawAccessToken() as string;
  const { idCourse, idActivity } = useParams()
  const [activity, setActivity] = useState<ActivityResponse[] | ProblemDetail>([]);
  const [openSuccess, setOpenSuccess] = useState(false);
  const handleCloseSuccess = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway' || event === undefined) {
      return;
    }

    setOpenSuccess(false);
  };

  const convertBase64 = (file: Blob) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

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
  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    const [_, parts] = base64.split('base64,')
    return parts
  };
  const USER_ID: string = authConsumer.id;

  const onSubmit: SubmitHandler<ResolutionForm> = (data) => submitResolutionActivity(data)

  const { register, setValue, control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

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

  return (
    <>
      <PageHeader title={activity?.title} text={activity?.description} />
      {<SuccessrSnackBar message={t('activity.successMessage')} open={openSuccess} handleClose={handleCloseSuccess} />}
      <Typography sx={{ fontSize: 14 }} gutterBottom>
        Professor:  {activity.course?.professor.name}
        <br />
        {t('activity.course')}: {activity.course?.name}
        <br />
        {t("activity.language")}: {activity?.extension === '.java' && 'Java'}
        <br />
        {t('activity.date')}: {new Date(activity.course?.startDate).toLocaleDateString(i18n.language, { timeZone: "Europe/London" })} {t('activity.until')} {new Date(activity.course?.endDate).toLocaleDateString(i18n.language, { timeZone: "Europe/London" })}
        <br />
        {t('activity.initialfile')}: example.java
        <Button>{t('activity.button.download')}</Button>
      </Typography>

      {activity.course?.professor.id === USER_ID ? <span></span> : <Grid item xs={12}>
        <Typography sx={{ fontSize: 14 }}>
          {t('activity.title')}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="field"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input
                type="file"
                // accept={fileType}
                {...register("resolutionFile")}
                {...field}
                onChange={async (e) => {
                  const base64 = await uploadImage(e);
                  setValue("resolutionFile", base64);
                }} />
            )} />

          <Button variant="outlined" type="submit">{t('activity.button.resolution')}</Button>
        </form>
      </Grid>}

      <ErrorSnackBar open={openError} handleClose={handleCloseError} errorType={errorType} />
      {/* <DropFileInput onFileChange={(files) => onFileChange(files)} /> */}
    </>
  );
}

export default Activity



















