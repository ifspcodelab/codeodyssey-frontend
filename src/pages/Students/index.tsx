import { useEffect, useState } from "react";
import { Icon, IconButton, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import { AxiosError } from "axios";

import { IStudentResponse, StudentService } from "../../core/services/api/students/StudentsService.ts";
import ErrorSnackBar from "../../core/components/error-snack-bar/ErrorSnackBar.tsx";
import { useErrorHandler } from "../../core/hooks/useErrorHandler.ts";
import { PageBaseLayout } from "../../core/layout/PageBaseLayout.tsx";
import { AuthConsumer } from "../../core/auth/AuthContext.tsx";
import { JwtService } from "../../core/auth/JwtService.ts";

const Students: React.FC = () => {
  const [students, setStudents] = useState<IStudentResponse[]>([]);

  const rawAccessToken = new JwtService().getRawAccessToken() as string;
  const authConsumer = AuthConsumer();
  const USER_ID: string = authConsumer.id;
  const { slug } = useParams()
  const { t } = useTranslation();

  const { handleError, openError, errorType, handleCloseError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof slug === 'string') {
      setIsLoading(true)
      StudentService.getAll(USER_ID, slug, rawAccessToken)
        .then((response) => {
          setIsLoading(false)
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

          <TableBody>
            {students?.map(student => (
              <TableRow key={student.id}>
                <TableCell>
                  <Avatar>
                    {student.name.charAt(0)}
                  </Avatar>
                </TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  <IconButton size="small">
                    <Icon>edit</Icon>
                  </IconButton>
                  <IconButton size="small">
                    <Icon>delete</Icon>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          {students.length === 0 && !isLoading && <caption>{t("students.emptyList")}</caption>}

          <TableFooter>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4}>
                  <LinearProgress variant='indeterminate' />
                </TableCell>
              </TableRow>
            )}
          </TableFooter>

        </Table>
      </TableContainer>

      <ErrorSnackBar open={openError} handleClose={handleCloseError} errorType={errorType} />
    </>
  );
}

export default Students