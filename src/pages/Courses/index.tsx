import { useEffect, useState } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";
// import { AxiosError } from "axios";

import { ICourseResponse, CoursesService, } from '../../core/services/api/courses/CoursesService.ts';
import SuccessrSnackBar from "../../components/SuccessSnackBar/index.tsx";
import { PageBaseLayout } from "../../core/layout/PageBaseLayout.tsx";
import { ToolBar } from "../../core/components/tool-bar/ToolBar.tsx";
import { AuthConsumer } from "../../core/auth/AuthContext.tsx";
import { JwtService } from "../../core/auth/JwtService.ts";
import i18n from "../../locales/i18n";
// import ErrorSnackBar from "../../components/ErrorSnackBar/ErrorSnackBar";

const Courses: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const success = queryParams.get('success');

  const authConsumer = AuthConsumer();
  const USER_ID: string = authConsumer.id;
  const USER_ROLE: string = authConsumer.role;
  const rawAccessToken = new JwtService().getRawAccessToken() as string;

  const [coursesStudent, setCoursesStudent] = useState<ICourseResponse[]>([]);
  const [coursesProfessor, setCoursesProfessor] = useState<ICourseResponse[]>([]);
  const [openSuccess, setOpenSuccess] = useState(true);
  // const [errorType, setErrorType] = useState('');
  // const [openError, setOpenError] = useState(false);

  useEffect(() => {
    if (USER_ROLE == "PROFESSOR") {
      void CoursesService.getAllCourses(USER_ID, rawAccessToken)
        .then((response) => {
          if (response instanceof Error) {
            alert(response.message);
          } else {
            setCoursesProfessor(response);
          }
        });
      // } catch (error) {
      //   if (axios.isAxiosError(error)) {
      //     handleError(error)
      //   } else {
      //     setErrorType('unexpected')
      //   }
      // }
    } else if (USER_ROLE == "STUDENT") {
      void CoursesService.getAllEnrollments(USER_ID, rawAccessToken)
        .then((response) => {
          if (response instanceof Error) {
            alert(response.message);
          } else {
            setCoursesStudent(response);
          }
        });
    }
    // eslint-disable-next-line
  }, [USER_ID, USER_ROLE, rawAccessToken]);

  useEffect(() => {
    if (success) {
      const newURL = window.location.pathname;
      window.history.replaceState({}, document.title, newURL);
    }
  }, [success]);

  const handleCloseSuccess = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway' || event === undefined) {
      return;
    }

    setOpenSuccess(false);
  };

  // const handleCloseError = (event?: React.SyntheticEvent | Event, reason?: string) => {
  //   if (reason === 'clickaway' || event === undefined) {
  //     return;
  //   }

  //   setOpenError(false);
  // };

  // const handleError = (error: AxiosError) => {
  //   let responseStatus: number
  //   let problemDetail: ProblemDetail = { title: '', detail: '', instance: '', status: 0, type: '' }
  //   if (error.response) {
  //     problemDetail = error.response.data as ProblemDetail
  //     responseStatus = problemDetail.status
  //     if (responseStatus == 400) {
  //       setErrorType('badRequest')
  //       setOpenError(true);
  //     }
  //   } else if (error.message == "Network Error") {
  //     setErrorType('networkError')
  //     setOpenError(true);
  //   }
  // }

  return (
    <>
      <PageBaseLayout title={t('courses.title')}
        toolbar={USER_ROLE === "PROFESSOR" && (<ToolBar />
        )}>
      </PageBaseLayout>

      {success && <SuccessrSnackBar message={t('createcourse.successMessage')} open={openSuccess} handleClose={handleCloseSuccess} />}


      {USER_ROLE == "PROFESSOR" && <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Professor</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coursesProfessor?.map(course => (
              <TableRow key={course.id}>
                <TableCell><Link to={course.id + "/" + course.slug}>{course.name}</Link></TableCell>
                <TableCell>{course.professor.name}</TableCell>
                <TableCell>{new Date(course.startDate).toLocaleDateString(i18n.language, { timeZone: "Europe/London" })}  </TableCell>
                <TableCell>{new Date(course.endDate).toLocaleDateString(i18n.language, { timeZone: "Europe/London" })}</TableCell>
                <TableCell>Edit | Delete</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>}

      {<TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Professor</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          {coursesStudent.length > 0 ? <TableBody>
            {coursesStudent?.map(course => (
              <TableRow key={course.id}>
                <TableCell><Link to={course.id + "/" + course.slug}>{course.name}</Link></TableCell>
                <TableCell>{course.professor.name}</TableCell>
                <TableCell>{new Date(course.startDate).toLocaleDateString(i18n.language, { timeZone: "Europe/London" })}  </TableCell>
                <TableCell>{new Date(course.endDate).toLocaleDateString(i18n.language, { timeZone: "Europe/London" })}</TableCell>
                <TableCell>Edit | Delete</TableCell>
              </TableRow>
            ))}
          </TableBody> : <Typography>{t("courses.emptyList")}</Typography>
          }
        </Table>
      </TableContainer>}


      {/* <ErrorSnackBar open={openError} handleClose={handleCloseError} errorType={errorType} /> */}
    </>)
}

export default Courses