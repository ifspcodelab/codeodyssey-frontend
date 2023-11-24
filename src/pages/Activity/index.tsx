import { useEffect, useState } from "react";
import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";

import { ActivitiesService } from "../../core/services/api/activities/ActivitiesService.ts";
import { ResolutionsService } from "../../core/services/api/resolutions/ResolutionsService.ts";
import { IResolutionForm, IResolutionResponse } from "../../core/models/Resolution.ts";
import ErrorSnackBar from "../../core/components/error-snack-bar/ErrorSnackBar.tsx";
import { CoursesService } from "../../core/services/api/courses/CoursesService.ts";
import SuccessrSnackBar from "../../core/components/success-snack-bar/index.tsx";
import { useErrorHandler } from "../../core/hooks/useErrorHandler.ts";
import { PageBaseLayout } from "../../core/layout/PageBaseLayout.tsx";
import FileUpload from "../../core/components/Form/FileUpload.tsx";
import { IActivityResponse } from "../../core/models/Activity.ts";
import { AuthConsumer } from "../../core/auth/AuthContext.tsx";
import { ICourseResponse } from "../../core/models/Course.ts";
import { JwtService } from "../../core/auth/JwtService.ts";
import Resolutions from "../Resolutions/index.tsx";
import i18n from "../../locales/i18n";
import { schema } from "./schema.ts";
import "./style.css";


const Activity: React.FC = () => {
  const { handleError, openError, errorType, handleCloseError } = useErrorHandler();

  const [activity, setActivity] = useState<IActivityResponse>();
  const [resolutions, setResolutions] = useState<IResolutionResponse[]>();
  const { idCourse, idActivity } = useParams()
  const [fileType, setFileType] = useState("");

  const { t } = useTranslation();

  const rawAccessToken = new JwtService().getRawAccessToken() as string;
  const authConsumer = AuthConsumer();
  const USER_ID: string = authConsumer.id;

  const [openSuccess, setOpenSuccess] = useState(false);
  const [course, setCourse] = useState<ICourseResponse>();

  const onSubmit: SubmitHandler<IResolutionForm> = (data) => submitResolutionActivity(data)

  const handleCloseSuccess = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway' || event === undefined) {
      return;
    }
    setOpenSuccess(false);
  };

  const methods = useForm({
    resolver: yupResolver(schema),
  });

  const submitResolutionActivity = async (data: IResolutionForm) => {
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

  const handleDecodeAndDownload = (file: string) => {
    const base64String = file;

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

  useEffect(() => {
    if ((idCourse !== undefined) && (idActivity !== undefined)) {
      ResolutionsService.getAllResolutions(idCourse, idActivity, rawAccessToken)
        .then((response) => {
          setResolutions(response as IResolutionResponse[])
        }).catch((error: AxiosError<ProblemDetail>) => {
          handleError(error)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idActivity, idCourse, rawAccessToken])



  useEffect(() => {
    if (idCourse !== undefined) {
      CoursesService.getById(idCourse, rawAccessToken)
        .then((response) => {
          setCourse(response as ICourseResponse);
        }).catch((error: AxiosError<ProblemDetail>) => {
          handleError(error)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [USER_ID, rawAccessToken])

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

      <PageBaseLayout title={activity?.title || ""}>
      </PageBaseLayout>

      <Card>
        <CardContent>
          <Typography variant="h5"> {activity?.description}</Typography>
          <Typography variant="subtitle1"> <strong>  {t("activity.language")}</strong>: {activity?.extension === '.java' && 'Java'}</Typography>
          <Typography> <strong>{t('activity.date')}</strong>: {activity?.startDate ? new Date(activity?.startDate).toLocaleDateString(i18n.language) : null} {t('activity.until')} {activity?.endDate ? new Date(activity?.endDate).toLocaleDateString(i18n.language) : null}</Typography>
          <Typography><strong>{t('activity.initialfile')}</strong>: <button onClick={() => {
            activity?.initialFile !== undefined && handleDecodeAndDownload(activity?.initialFile)
          }}>{t('activity.button.download')}</button></Typography>
        </CardContent>
      </Card>

      {course?.professor?.id !== USER_ID && <Grid item xs={12}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>

            <FileUpload fieldName="resolutionFile" fileType={fileType} />

            <Button variant="outlined" type="submit">{t('activity.form.button.resolution')}</Button>
          </form>
        </FormProvider>
      </Grid>}

      {course?.professor?.id !== USER_ID && resolutions !== undefined && <Resolutions resolutions={resolutions} fileType={fileType} />}

      <ErrorSnackBar open={openError} handleClose={handleCloseError} errorType={errorType} />
    </>
  );
}

export default Activity