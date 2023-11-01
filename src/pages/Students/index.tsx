import { useEffect, useState } from "react";
import { AuthConsumer } from "../../core/auth/AuthContext.tsx";
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { JwtService } from "../../core/auth/JwtService.ts";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"
import { AxiosError } from "axios";
import ErrorSnackBar from "../../core/components/error-snack-bar/ErrorSnackBar.tsx";
import Avatar from '@mui/material/Avatar';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { IStudentResponse, StudentService } from "../../core/services/api/students/StudentsService.ts";
import { PageBaseLayout } from "../../core/layout/PageBaseLayout.tsx";
import { useErrorHandler } from "../../core/hooks/useErrorHandler.ts";

const Students: React.FC = () => {
  const [students, setStudents] = useState<IStudentResponse[]>([]);
  const authConsumer = AuthConsumer();
  const rawAccessToken = new JwtService().getRawAccessToken() as string;
  const { slug } = useParams()
  const { t } = useTranslation();
  const USER_ID: string = authConsumer.id;
  const navigate = useNavigate()

  const { handleError, openError, errorType, handleCloseError } = useErrorHandler();

  useEffect(() => {
    if (typeof slug === 'string') {
      StudentService.getAll(USER_ID, slug, rawAccessToken)
        .then((response) => {
          setStudents(response as IStudentResponse[]);
          console.log("teste", students)
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

      <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          {students?.length > 0 ? <TableBody>
            {students?.map(student => (
              <TableRow key={student.id}>
                <TableCell>
                  <Avatar>
                    {student.name.charAt(0)}
                  </Avatar>
                </TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>Edit | Delete</TableCell>
              </TableRow>
            ))}
          </TableBody> : <>
            <Typography>
              {t("students.emptyList")}
            </Typography>
            <Typography>
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
          }
        </Table>
      </TableContainer>

      <ErrorSnackBar open={openError} handleClose={handleCloseError} errorType={errorType} />
    </>
  );
}

export default Students