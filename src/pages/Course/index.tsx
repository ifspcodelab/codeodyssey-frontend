import { useEffect, useState } from "react";
import { Card, CardActions, CardContent, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom"
import { AxiosError } from "axios";

import { CoursesService } from "../../core/services/api/courses/CoursesService.ts";
import ErrorSnackBar from "../../core/components/error-snack-bar/ErrorSnackBar.tsx";
import CreateInviteModal from "../../core/components/create-invite-modal/index.tsx";
import { useErrorHandler } from "../../core/hooks/useErrorHandler.ts";
import { AuthConsumer } from "../../core/auth/AuthContext.tsx";
import { ICourseResponse } from "../../core/models/Course.ts";
import { JwtService } from "../../core/auth/JwtService.ts";
import TabsComponent from "./TabsComponent.tsx";
import i18n from "../../locales/i18n.ts";

const Course: React.FC = () => {

  const authConsumer = AuthConsumer();
  const USER_ID: string = authConsumer.id;
  const rawAccessToken = new JwtService().getRawAccessToken() as string;
  const { idCourse } = useParams()

  const [course, setCourse] = useState<ICourseResponse>();

  const { handleError, openError, errorType, handleCloseError } = useErrorHandler();

  const { t } = useTranslation();

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

  return (
    <>
      <TabsComponent />

      <Card>

        <CardContent>
          <Typography variant="h5">{course?.name}</Typography>
          <Typography variant="subtitle1"> {t("course.professor")}: {course?.professor?.name}</Typography>
          <Typography> {t("course.startDate")}: {course !== undefined && new Date(course?.startDate).toLocaleDateString(i18n.language)}</Typography>
          <Typography> {t("course.endDate")}: {course !== undefined && new Date(course?.endDate).toLocaleDateString(i18n.language)}</Typography>
        </CardContent>
        {USER_ID === course?.professor?.id && course && <CardActions>
          <CreateInviteModal course={course} />
        </CardActions>}

      </Card>

      <ErrorSnackBar open={openError} handleClose={handleCloseError} errorType={errorType} />
    </>
  );
}

export default Course