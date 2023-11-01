import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom"
import { AuthConsumer } from "../../core/auth/AuthContext.tsx";
import { useEffect, useState } from "react";
import { JwtService } from "../../core/auth/JwtService.ts";
import { useParams } from "react-router-dom";
import ErrorSnackBar from "../../core/components/error-snack-bar/ErrorSnackBar.tsx";
import { AxiosError } from "axios";
import { PageBaseLayout } from "../../core/layout/PageBaseLayout.tsx";
import { useErrorHandler } from "../../core/hooks/useErrorHandler.ts";
import { CoursesService, ICourseResponse } from "../../core/services/api/courses/CoursesService.ts";

const Course: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate()
  const authConsumer = AuthConsumer();
  const USER_ID: string = authConsumer.id;
  const [course, setCourse] = useState<ICourseResponse>();
  const rawAccessToken = new JwtService().getRawAccessToken() as string;
  const { idCourse } = useParams()

  const { handleError, openError, errorType, handleCloseError } = useErrorHandler();

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
      <PageBaseLayout title={course?.name !== undefined ? course?.name : "title"}
      > </PageBaseLayout>

      {course?.professor?.id === USER_ID ? <><Button variant="contained" size="medium" sx={{ p: 1, m: 1, width: 200 }}
        onClick={() => {
          navigate('create-activity');
        }}
      >{t('course.button.create')}</Button><Button variant="contained" size="medium" sx={{ p: 1, m: 1, width: 200 }}
        onClick={() => {
          navigate('students');
        }}
      >{t("courses.button.students")}</Button></> : <span></span>}
      <Button variant="contained" size="medium" sx={{ p: 1, m: 1, width: 200 }}
        onClick={() => {
          navigate('activities');
        }}
      >{t('course.button.activities')}</Button>

      <ErrorSnackBar open={openError} handleClose={handleCloseError} errorType={errorType} />
    </>
  );
}

export default Course