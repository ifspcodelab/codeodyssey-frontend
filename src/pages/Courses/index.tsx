import { useTranslation } from "react-i18next";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PageHeader from "../../components/PageHeader";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom"
import { CourseResponse } from "../../core/models/CourseResponse";
import { useApiGetCourses } from "../../core/hooks/useApiGetCourses.ts";
import { AuthConsumer } from "../../core/auth/AuthContext.tsx";
import { JwtService } from "../../core/auth/JwtService.ts";
import ErrorSnackBar from "../../components/ErrorSnackBar/ErrorSnackBar";
import Spinner from "../../components/Spinner";
import i18n from '../../locales/i18n.ts'

function Courses() {

  const { t } = useTranslation();
  const authConsumer = AuthConsumer();
  const [coursesStudent, setCoursesStudent] = useState<CourseResponse[] | ProblemDetail>([]);
  const [coursesProfessor, setCoursesProfessor] = useState<CourseResponse[] | ProblemDetail>([]);
  const navigate = useNavigate()
  const USER_ID: string = authConsumer.id;
  const USER_ROLE: string = authConsumer.role;
  const rawAccessToken = new JwtService().getRawAccessToken() as string;
  const { getCoursesProfessor, getCoursesStudent } = useApiGetCourses()
  const [errorType, setErrorType] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      if (USER_ROLE == "PROFESSOR") {
        try {
          const coursesProfessorResponse = await getCoursesProfessor(USER_ID, rawAccessToken);
          setCoursesProfessor(coursesProfessorResponse)
          const coursesStudentResponse = await getCoursesStudent(USER_ID, rawAccessToken)
          setCoursesStudent(coursesStudentResponse)
          setLoading(false)
        } catch (error) {
          if (axios.isAxiosError(error)) {
            handleError(error)
          } else {
            setErrorType('unexpected')
          }
        }
      } else if (USER_ROLE == "STUDENT") {
        const coursesStudentResponse = await getCoursesStudent(USER_ID, rawAccessToken)
        setCoursesStudent(coursesStudentResponse)
        setLoading(false)
      }
    })();
    // eslint-disable-next-line
  }, [USER_ID, USER_ROLE, rawAccessToken]);


  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway' || event === undefined) {
      return;
    }

    setOpen(false);
  };


  const handleError = (error: AxiosError) => {
    let responseStatus: number
    let problemDetail: ProblemDetail = { title: '', detail: '', instance: '', status: 0, type: '' }
    if (error.response) {
      problemDetail = error.response.data as ProblemDetail
      responseStatus = problemDetail.status
      if (responseStatus == 400) {
        setErrorType('badRequest')
        setOpen(true);
      }
    } else if (error.message == "Network Error") {
      setErrorType('networkError')
      setOpen(true);
    }
  }

  return (
    <>
      <PageHeader title={t('courses.title')} text={t('courses.text')} />
      {
        (Array.isArray(coursesProfessor) && coursesProfessor.length) || (Array.isArray(coursesStudent) && coursesStudent.length) ? (
          <div>
            <div>
              {Array.isArray(coursesProfessor) && coursesProfessor.map((course: CourseResponse) => (
                <Card key={course.id} variant="outlined" sx={{ minWidth: 275, display: "flex", mb: 1.5, borderColor: "primary.main" }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {course.name}
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      {course.professor.name}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {new Date(course.startDate).toLocaleDateString(i18n.language, { timeZone: "Europe/London" })} {t("courses.until")} {new Date(course.endDate).toLocaleDateString(i18n.language, { timeZone: "Europe/London" })}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginLeft: "auto", }}>
                    <Button variant="contained" size="medium" sx={{ p: 1, m: 1, width: 200 }}
                      onClick={() => {
                        navigate('/invitation')
                      }}
                    >{t("courses.button.invite")}</Button>
                    <Button variant="contained" size="medium" sx={{ p: 1, m: 1, width: 200 }}
                      onClick={() => {
                        navigate('/students')
                      }}
                    >{t("courses.button.students")}</Button>
                  </CardActions>
                </Card>
              ))}
            </div>

            <div>
              {Array.isArray(coursesStudent) && coursesStudent.map((course: CourseResponse) => (
                <Card key={course.id} variant="outlined" sx={{ minWidth: 275, display: "flex", mb: 1.5, borderColor: "primary.main" }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {course.name}
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      {course.professor.name}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {new Date(course.startDate).toLocaleDateString(i18n.language, { timeZone: "Europe/London" })} {t("courses.until")} {new Date(course.endDate).toLocaleDateString(i18n.language, { timeZone: "Europe/London" })}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : loading ? (
          <Spinner />
        ) : (
          <Typography>{t("courses.emptyList")}</Typography>
        )
      }

      <ErrorSnackBar open={open} handleClose={handleClose} errorType={errorType} />
    </>)
}

export default Courses