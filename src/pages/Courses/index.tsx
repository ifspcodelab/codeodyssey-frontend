import {useTranslation} from "react-i18next";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PageHeader from "../../components/PageHeader";
import { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom"
import {CourseResponse} from "../../core/models/CourseResponse";
import {useApiCourse} from "../../core/hooks/useApiCourse";
import {AuthConsumer} from "../../core/auth/AuthContext.tsx";
import {JwtService} from "../../core/auth/JwtService.ts";

function Courses() {
  
    const { t } = useTranslation();
    const authConsumer = AuthConsumer();
    const [coursesStudent, setCoursesStudent] = useState([]);
    const [coursesProfessor, setCoursesProfessor] = useState([]);
    const navigate = useNavigate()
    const PROFESSOR_ID: string = authConsumer.id;
    const USER_ID: string = authConsumer.id;
    const USER_ROLE: string = authConsumer.role;
    const rawAccessToken = new JwtService().getRawAccessToken() as string;

    async function getStudentCourses() {
      try {
        const { data, status } = await axios.get<CourseResponse[]>(
          // 'http://localhost:8080/api/v1/users/' + USER_ID + '/enrollments',
          'http://localhost:3000/enrollments',
          {
            headers: {
              Accept: 'application/json',
              'Authorization': `Bearer ${rawAccessToken}` 

            },
          },
        );
        console.log(JSON.stringify(data, null, 4));
        console.log('response status is: ', status);
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log('error message: ', error.message);
          return error.message;
        } else {
          console.log('unexpected error: ', error);
          return 'An unexpected error occurred';
        }
      }
    }

    async function getProfessorCourses() {
      try {
        const { data, status } = await axios.get<CourseResponse>(
          'http://localhost:8080/api/v1/users/' + USER_ID + '/courses',
          {
            headers: {
              Accept: 'application/json',
              'Authorization': `Bearer ${rawAccessToken}` 
            },
          },
        );
  
        console.log(USER_ROLE)
        console.log(PROFESSOR_ID)
        console.log(JSON.stringify(data, null, 4));
        console.log('response status is: ', status);
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log('error message: ', error.message);
          return error.message;
        } else {
          console.log('unexpected error: ', error);
          return 'An unexpected error occurred';
        }
      }
    }

    useEffect(() => {
      void (async () => {
        if(USER_ROLE == "PROFESSOR") {
          const cursoProfessor = await getProfessorCourses();
          setCoursesProfessor(cursoProfessor)
          const cursoAluno = await getStudentCourses()
          setCoursesStudent(cursoAluno)
        } else if(USER_ROLE == "STUDENT") {
          const cursoAluno = await getStudentCourses()
          setCoursesStudent(cursoAluno)
        }
      })();
    }, []);

    return (
        <>
        <PageHeader title={t('courses.title')} text={t('courses.text')} />
        {coursesProfessor.length || coursesStudent.length ?      
          <div>
            <div>{coursesProfessor?.map((course: CourseResponse) => (
              <Card variant="outlined" sx={{ minWidth: 275 ,display: "flex", mb: 1.5 , borderColor: "primary.main"}}>
                  <CardContent>
                      <Typography variant="h5" component="div">
                          {course.name}
                      </Typography>
                      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                          {course.professor.name}    
                      </Typography>
                      <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {t("courses.intlDate", { date: new Date(course.startDate),
                  formatParams: {
                      date: { year: 'numeric', month: 'short', day: 'numeric'},
                    },
                  })} {t("courses.until")} {t("courses.intlDate", {
                      date: new Date((course.endDate)),
                      formatParams: {
                        date: {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        }
                      }
                    })}
                      </Typography>
                  </CardContent>

                  <CardActions sx={{ display: "flex", flexDirection: "column", alignItems: "center",justifyContent: "center",marginLeft: "auto", }}>
                      <Button variant="contained" size="medium" sx={{ p: 1, m: 1, width:200 }}
                        onClick={() => {
                          navigate('/invitation')
                        }}
                      >{t("courses.button.invite")}</Button>
                      <Button variant="contained" size="medium" sx={{ p: 1, m: 1,  width:200 }}
                        onClick={() => {
                          navigate('/students')
                        }}
                      >{t("courses.button.students")}</Button>
                  </CardActions>
              </Card>
            ))}</div> 

            <div>{coursesStudent?.map((course: CourseResponse) => (
              <Card variant="outlined" sx={{ minWidth: 275 ,display: "flex", mb: 1.5 , borderColor: "primary.main"}}>
                  <CardContent>
                      <Typography variant="h5" component="div">
                          {course.name}
                      </Typography>
                      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                          {course.professor.name}    
                      </Typography>
                      <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {t("courses.intlDate", { date: new Date(course.startDate),
                  formatParams: {
                      date: { year: 'numeric', month: 'short', day: 'numeric'},
                    },
                  })} {t("courses.until")} {t("courses.intlDate", {
                      date: new Date((course.endDate)),
                      formatParams: {
                        date: {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        }
                      }
                    })}
                      </Typography>
                  </CardContent>

                <CardActions sx={{ display: "flex", flexDirection: "column", alignItems: "center",justifyContent: "center",marginLeft: "auto", }}>
                    <Button variant="contained" size="medium" sx={{ p: 1, m: 1,  width:200 }}
                      onClick={() => {
                        navigate('/students')
                      }}
                    >{t("courses.button.students")}</Button>
                </CardActions>
            </Card>
            ))}</div>  
          </div> 
        : <Typography>{t("courses.emptyList")}</Typography>}
        </>)
}

export default Courses