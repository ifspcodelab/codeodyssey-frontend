import { useTranslation } from "react-i18next";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InviteForm from '../../core/models/InviteForm.ts'
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
import { useLocation } from 'react-router-dom';
import SuccessrSnackBar from "../../components/SuccessSnackBar/index.tsx";
import './style.css'
import { Grid } from "@mui/material";
import Modal from '@mui/material/Modal';
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { schema } from "./schema.ts";
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useApiSendInvitation } from "../../core/hooks/useApiSendInvitation";

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
  const [openSuccess, setOpenSuccess] = useState(true);
  const [openError, setOpenError] = useState(false);
  const [loading, setLoading] = useState(true);
  const { sendInvitation } = useApiSendInvitation();
  const [inviteLink, setInviteLink] = useState(" ");
  const [courseId, setCourseId] = useState("")

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const success = queryParams.get('success');
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const { register, handleSubmit, control, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  const onSubmit: SubmitHandler<InviteForm> = (data) => submitCreateInvite(data)

  async function submitCreateInvite(data: InviteForm) {
    try {
      console.log("@ create course | rawAccessToken", rawAccessToken)
      const dataResponse = await sendInvitation(data.endDate.toISOString(), courseId, rawAccessToken);
      console.log("response da request")
      console.log(dataResponse.link)
      setInviteLink(dataResponse.link)
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        handleError(error)
      } else {
        setErrorType('unexpected')
        setOpen(true);
      }
    }
  }


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

  const handleCloseError = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway' || event === undefined) {
      return;
    }

    setOpenError(false);
  };

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

  return (
    <>
      <PageHeader title={t('courses.title')} text={t('courses.text')} />
      {success && <SuccessrSnackBar message={t('createcourse.successMessage')} open={openSuccess} handleClose={handleCloseSuccess} />}
      {
        (Array.isArray(coursesProfessor) && coursesProfessor.length) || (Array.isArray(coursesStudent) && coursesStudent.length) ? (
          <div>
            <div>
              {Array.isArray(coursesProfessor) && coursesProfessor.map((course: CourseResponse) => (
                <><Card key={course.id} variant="outlined" className="cardContainer">
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

                  <CardActions className="cardActions">
                    <Button variant="contained" size="medium" sx={{ p: 1, m: 1, width: 200 }}
                      onClick={() => {
                        setInviteLink(" ")
                        setOpen(true)
                        setCourseId(course.id)
                      }}
                    >{t("courses.button.invite")}</Button>
                    <Button variant="contained" size="medium" sx={{ p: 1, m: 1, width: 200 }}
                      onClick={() => {
                        navigate(course.slug + '/students');
                      }}
                    >{t("courses.button.students")}</Button>
                  </CardActions>
                </Card><Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                      <Typography id="modal-modal-title" variant="h6" component="h2">
                        Create invite
                      </Typography>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={1} rowSpacing={2}>

                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            {/* <DatePicker label="Uncontrolled picker" defaultValue={dayjs('2022-04-17')} /> */}

                            <Controller
                              name={"endDate"}
                              control={control}
                              defaultValue={undefined}
                              render={({ field: { ref, onChange, value, ...field } }) => (

                                <DatePicker
                                  {...field}
                                  inputRef={ref}
                                  label={t("createcourse.form.endDate")} data-testid="endDateField"
                                  value={value ? value : null}
                                  onChange={onChange as never}

                                />
                              )}
                            />

                          </LocalizationProvider>



                          <Grid item xs={12} textAlign="right">
                            <Button variant="outlined" type="submit" onClick={() => {
                              console.log("generate convite request")
                            }}>gerar convite</Button>
                          </Grid>

                          <Grid item xs={12} textAlign="right">
                            {inviteLink}
                          </Grid>
                        </Grid>
                      </form>

                    </Box>
                  </Modal></>
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
          <Spinner size={150} />
        ) : (
          <Typography>{t("courses.emptyList")}</Typography>
        )
      }

      <ErrorSnackBar open={openError} handleClose={handleCloseError} errorType={errorType} />
    </>)
}

export default Courses