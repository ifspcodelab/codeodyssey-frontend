import { useApiGetStudents } from "../../core/hooks/useApiGetStudents.ts";
import { useEffect, useState } from "react";
import { AuthConsumer } from "../../core/auth/AuthContext.tsx";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { JwtService } from "../../core/auth/JwtService.ts";
import { useParams } from "react-router-dom";
import { StudentResponse } from "../../core/models/StudentResponse";
import { useTranslation } from "react-i18next";
import PageHeader from "../../components/PageHeader";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom"
import axios, { AxiosError } from "axios";
import ErrorSnackBar from "../../components/ErrorSnackBar/ErrorSnackBar";

function Students() {
  const [students, setStudents] = useState<StudentResponse[] | ProblemDetail>([]);
  const { getStudents } = useApiGetStudents()
  const authConsumer = AuthConsumer();
  const rawAccessToken = new JwtService().getRawAccessToken() as string;
  const { slug } = useParams()
  const { t } = useTranslation();
  const USER_ID: string = authConsumer.id;
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const [errorType, setErrorType] = useState('');
  const [openError, setOpenError] = useState(false);

  useEffect(() => {
    void (async () => {
      if (typeof slug === 'string') {
        try {
          const studentsResponse = await getStudents(USER_ID, slug, rawAccessToken)
          setStudents(studentsResponse)
          setLoading(false)
        } catch (error) {
          if (axios.isAxiosError(error)) {
            handleError(error)
          } else {
            setErrorType('unexpected')
          }
        }
      } else {
        setErrorType('unexpected')
      }

    })();
    // eslint-disable-next-line
  }, [rawAccessToken]);

  const handleError = (error: AxiosError) => {
    let responseStatus: number
    let problemDetail: ProblemDetail = { title: '', detail: '', instance: '', status: 0, type: '' }
    if (error.response) {
      problemDetail = error.response.data as ProblemDetail
      responseStatus = problemDetail.status
      if (responseStatus == 400) {
        setErrorType('badRequest')
        setOpenError(true);
      } else if (responseStatus == 409) {
        setErrorType('slugNotFound')
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

  return (
    <>
      <PageHeader title={t('students.title')} text={t('students.text')} />
      <div>
        {
          (Array.isArray(students) && students.length) ? (
            students.map((student: StudentResponse) => (
              <Card key={student.id} variant="outlined" className="cardContainer">
                <CardContent>
                  <Typography variant="h5" component="div">
                    {t('students.name')}: {student.name}
                  </Typography>
                  <Typography variant="h5" component="div">
                    {t('students.email')}: {student.email}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : loading ? (
            <Spinner size={150} />
          ) : (
            <>
              <Typography>
                {t("students.emptyList")}
              </Typography><Typography>
                {t("students.emptyListQuestion")}
              </Typography>
              <CardActions className="cardActions">
                <Button variant="contained" size="medium" sx={{ p: 1, m: 1, width: 200 }}
                  onClick={() => {
                    navigate('/invitation')
                  }}
                >{t("courses.button.invite")}</Button>
              </CardActions>
            </>
          )
        }
      </div>

      <ErrorSnackBar open={openError} handleClose={handleCloseError} errorType={errorType} />
    </>
  );
}

export default Students