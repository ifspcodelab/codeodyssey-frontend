import { useEffect, useState } from "react";
import { AuthConsumer } from "../../core/auth/AuthContext.tsx";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { JwtService } from "../../core/auth/JwtService.ts";
import { useParams } from "react-router-dom";
import { StudentResponse } from "../../core/models/StudentResponse";
import { useTranslation } from "react-i18next";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom"
import { AxiosError } from "axios";
import ErrorSnackBar from "../../components/ErrorSnackBar/ErrorSnackBar";
import './style.css'
import Avatar from '@mui/material/Avatar';
import { CardContent } from "@mui/material";
import { IStudentResponse, StudentService } from "../../core/services/api/students/StudentsService.ts";
import { PageBaseLayout } from "../../core/layout/PageBaseLayout.tsx";
import { useErrorHandler } from "../../core/hooks/useErrorHandler.ts";

const Students: React.FC = () => {
  const [students, setStudents] = useState<StudentResponse[] | ProblemDetail>([]);
  const authConsumer = AuthConsumer();
  const rawAccessToken = new JwtService().getRawAccessToken() as string;
  const { slug } = useParams()
  const { t } = useTranslation();
  const USER_ID: string = authConsumer.id;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const { handleError, openError, errorType, handleCloseError } = useErrorHandler();

  useEffect(() => {
    if (typeof slug === 'string') {
      StudentService.getAll(USER_ID, slug, rawAccessToken)
        .then((response) => {
          setStudents(response as IStudentResponse[]);
        }).catch((error: AxiosError<ProblemDetail>) => {
          handleError(error)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [USER_ID, rawAccessToken, slug])

  return (
    <>
      <PageBaseLayout title={t('students.title')}
      > </PageBaseLayout>
      <div>
        {
          (Array.isArray(students) && students.length) ? (
            students.map((student: StudentResponse) => (
              <Card key={student.id} variant="outlined" sx={{ minWidth: 275, display: "flex", mb: 1.5, borderColor: "primary.main", margin: 2 }}>
                <CardContent className="cardContentStudents">
                  <Avatar>
                    {student.name.charAt(0)}
                  </Avatar>
                  <div>
                    <Typography variant="h6" component="div" className="studentName">
                      {student.name}
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} gutterBottom>
                      {student.email}
                    </Typography>
                  </div>

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
                    navigate('/courses')
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