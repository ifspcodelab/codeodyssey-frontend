import { useTranslation } from "react-i18next";
import PageHeader from "../../components/PageHeader";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom"
import { AuthConsumer } from "../../core/auth/AuthContext.tsx";
import { useEffect, useState } from "react";
import { useApiGetCourse } from "../../core/hooks/useApiGetCourse.ts";
import { JwtService } from "../../core/auth/JwtService.ts";
import { useParams } from "react-router-dom";
import { CourseResponse } from "../../core/models/CourseResponse";
import ErrorSnackBar from "../../components/ErrorSnackBar/ErrorSnackBar";
import axios, { AxiosError } from "axios";

function Course() {
  const { t } = useTranslation();
  const navigate = useNavigate()
  const authConsumer = AuthConsumer();
  const USER_ID: string = authConsumer.id;
  const [course, setCourse] = useState<CourseResponse[] | ProblemDetail>([]);
  const rawAccessToken = new JwtService().getRawAccessToken() as string;
  const { getCourse } = useApiGetCourse()
  const { idCourse } = useParams()
  const [errorType, setErrorType] = useState('');
  const [openError, setOpenError] = useState(false);

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

  useEffect(() => {
    void (async () => {
      if (idCourse !== undefined) {
        try {
          const courseResponse = await getCourse(idCourse, rawAccessToken);
          setCourse(courseResponse)
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

  return (
    <>
      <PageHeader title={course?.name} text={t("course.text")} />
      {course.professor?.id === USER_ID ? <Button variant="contained" size="medium" sx={{ p: 1, m: 1, width: 200 }}
        onClick={() => {
          navigate('create-activity');
        }}
      >{t('course.button.create')}</Button> : <span></span>}
      <Button variant="contained" size="medium" sx={{ p: 1, m: 1, width: 200 }}
        onClick={() => {
          navigate('activities');
        }}
      >{t('course.button.activities')}</Button>

      <Button variant="contained" size="medium" sx={{ p: 1, m: 1, width: 200 }}
        onClick={() => {
          navigate('students');
        }}
      >{t("courses.button.students")}</Button>

      <ErrorSnackBar open={openError} handleClose={handleCloseError} errorType={errorType} />
    </>
  );
}

export default Course