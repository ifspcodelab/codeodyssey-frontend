import { Button, Grid, Typography } from "@mui/material";
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
import SuccessrSnackBar from "../../core/components/SuccessSnackBar/index.tsx";
import { AxiosError } from "axios";
import ErrorSnackBar from "../../core/components/error-snack-bar/ErrorSnackBar.tsx";
import "./style.css";
import FileUpload from "../../core/components/Form/FileUpload.tsx";
import { ActivitiesService, IActivityResponse } from "../../core/services/api/activities/ActivitiesService.ts";
import { useErrorHandler } from "../../core/hooks/useErrorHandler.ts";
import { ResolutionsService } from "../../core/services/api/resolutions/ResolutionsService.ts";

function Activity() {
  const rawAccessToken = new JwtService().getRawAccessToken() as string;
  const { idCourse, idActivity } = useParams()
  const [activity, setActivity] = useState<IActivityResponse>();
  const [openSuccess, setOpenSuccess] = useState(false);
  const { handleError, openError, errorType, handleCloseError } = useErrorHandler();

  const handleCloseSuccess = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway' || event === undefined) {
      return;
    }
    setOpenSuccess(false);
  };

  const [fileType, setFileType] = useState("");

  const { t } = useTranslation();

  useEffect(() => {
    if ((idCourse !== undefined) && (idActivity !== undefined)) {
      ActivitiesService.getById(idCourse, idActivity, rawAccessToken)
        .then((response) => {
          setActivity(response as IActivityResponse);
        }).catch((error: AxiosError<ProblemDetail>) => {
          handleError(error)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawAccessToken])

  const authConsumer = AuthConsumer();

  const USER_ID: string = authConsumer.id;

  const onSubmit: SubmitHandler<ResolutionForm> = (data) => submitResolutionActivity(data)

  const methods = useForm({
    resolver: yupResolver(schema),
  });


  const submitResolutionActivity = async (data: ResolutionForm) => {
    if ((idCourse !== undefined) && (idActivity !== undefined)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await ResolutionsService.create(data.resolutionFile, rawAccessToken, idCourse, idActivity)
        .then(() => {
          setOpenSuccess(true)
        }).catch((error: AxiosError<ProblemDetail>) => {
          handleError(error)
        })
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
        {activity?.description}
        <br />
        {t("activity.language")}: {activity?.extension === '.java' && 'Java'}
        <br />
        {t('activity.date')}: {activity?.startDate ? new Date(activity?.startDate).toLocaleDateString(i18n.language, { timeZone: "Europe/London" }) : null} {t('activity.until')} {activity?.endDate ? new Date(activity?.endDate).toLocaleDateString(i18n.language, { timeZone: "Europe/London" }) : null}
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