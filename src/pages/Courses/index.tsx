import { useEffect, useState } from "react";
import { Icon, IconButton, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import { ICourseResponse, CoursesService, } from '../../core/services/api/courses/CoursesService.ts';
import SuccessrSnackBar from "../../components/SuccessSnackBar/index.tsx";
import { PageBaseLayout } from "../../core/layout/PageBaseLayout.tsx";
import { ToolBar } from "../../core/components/tool-bar/ToolBar.tsx";
import { AuthConsumer } from "../../core/auth/AuthContext.tsx";
import { JwtService } from "../../core/auth/JwtService.ts";
import i18n from "../../locales/i18n";
import ErrorSnackBar from "../../core/components/error-snack-bar/ErrorSnackBar.tsx";
import { useErrorHandler } from "../../core/hooks/useErrorHandler.ts";

const Courses: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const success = queryParams.get('success');

  const authConsumer = AuthConsumer();
  const USER_ID: string = authConsumer.id;
  const USER_ROLE: string = authConsumer.role;
  const rawAccessToken = new JwtService().getRawAccessToken() as string;
  const { handleError, openError, errorType, handleCloseError } = useErrorHandler();
  const [coursesStudent, setCoursesStudent] = useState<ICourseResponse[]>([]);
  const [coursesProfessor, setCoursesProfessor] = useState<ICourseResponse[]>([]);
  const [openSuccess, setOpenSuccess] = useState(true);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(true);

  useEffect(() => {
    setIsLoadingEnrollments(true);
    CoursesService.getAllEnrollments(USER_ID, rawAccessToken)
      .then((response) => {
        setCoursesStudent(response as ICourseResponse[]);
        setIsLoadingEnrollments(false);
      }).catch((error: AxiosError<ProblemDetail>) => {
        handleError(error)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [USER_ID, rawAccessToken])

  useEffect(() => {
    if (USER_ROLE == "PROFESSOR") {
      setIsLoadingCourses(true)
      CoursesService.getAllCourses(USER_ID, rawAccessToken)
        .then((response) => {
          setIsLoadingCourses(false)
          setCoursesProfessor(response as ICourseResponse[]);
        }).catch((error: AxiosError<ProblemDetail>) => {
          handleError(error)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [USER_ID, USER_ROLE, rawAccessToken])

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

  const theme = useTheme()
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))
  const mdDown = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate();
  return (
    <>
      <PageBaseLayout title={t('courses.title')}
        toolbar={USER_ROLE === "PROFESSOR" && (<ToolBar onClickNewButton={() => navigate('/create-course')} />
        )}>
      </PageBaseLayout>

      {success && <SuccessrSnackBar message={t('createcourse.successMessage')} open={openSuccess} handleClose={handleCloseSuccess} />}



      {USER_ROLE == "PROFESSOR" && <><Typography
        overflow="hidden"
        whiteSpace="nowrap"
        textOverflow="ellipses"
        variant={smDown ? 'h5' : mdDown ? 'h4' : 'h3'}
      >
        Your Courses
      </Typography><TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
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
            {coursesProfessor.length === 0 && !isLoadingCourses && <caption>{t("courses.emptyList")}</caption>
            }

            <TableFooter>
              {isLoadingCourses && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <LinearProgress variant='indeterminate' />
                  </TableCell>
                </TableRow>
              )}
            </TableFooter>
          </Table>
        </TableContainer></>}

      <Typography
        overflow="hidden"
        whiteSpace="nowrap"
        textOverflow="ellipses"
        variant={smDown ? 'h5' : mdDown ? 'h4' : 'h3'}
      >
        Enrollments
      </Typography>

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
          <><TableBody>
            {coursesStudent?.map(course => (
              <TableRow key={course.id}>
                <TableCell><Link to={course.id + "/" + course.slug}>{course.name}</Link></TableCell>
                <TableCell>{course.professor.name}</TableCell>
                <TableCell>{new Date(course.startDate).toLocaleDateString(i18n.language, { timeZone: "Europe/London" })}  </TableCell>
                <TableCell>{new Date(course.endDate).toLocaleDateString(i18n.language, { timeZone: "Europe/London" })}</TableCell>
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

            {coursesStudent.length === 0 && !isLoadingEnrollments && <caption>{t("courses.emptyList")}</caption>
            }

            <TableFooter>
              {isLoadingEnrollments && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <LinearProgress variant='indeterminate' />
                  </TableCell>
                </TableRow>
              )}
            </TableFooter></>
        </Table>
      </TableContainer>}

      <ErrorSnackBar open={openError} handleClose={handleCloseError} errorType={errorType} />
    </>)
}

export default Courses