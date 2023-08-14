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



  const token = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUFJPRkVTU09SIiwibmFtZSI6Ik1vcmlhcnR5IiwiZW1haWwiOiJtb3JpYXJ0eUBnbWFpbC5jb20iLCJzdWIiOiJiMDM0OWY2NS0xNDBkLTRiNzEtOGE3OS04MDYxNThiMzExZmUiLCJpc3MiOiJjb2RlLW9keXNzZXkiLCJpYXQiOjE2OTE3MDY5MzAsImV4cCI6MTY5MTcwNzgzMH0.jl-Us8PHnVygjJ7z3qn2_KDv1cCj1C8GlW8m5Bs7W5M"
  
  

  // async function getStudentCourses() {
  //   try {
  //     const { data, status } = await axios.get<CourseResponse[]>(
  //       'http://localhost:8080/api/v1/users/b0349f65-140d-4b71-8a79-806158b311fe/enrollments',
  //       {
  //         headers: {
  //           Accept: 'application/json',
  //         },
  //       },
  //     );
  //     console.log(JSON.stringify(data, null, 4));
  //     console.log('response status is: ', status);
  //     return data;
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       console.log('error message: ', error.message);
  //       return error.message;
  //     } else {
  //       console.log('unexpected error: ', error);
  //       return 'An unexpected error occurred';
  //     }
  //   }
  // }

function Courses() {
  
    const { t } = useTranslation();
    const authConsumer = AuthConsumer();
   

    const [coursesStudent, setCoursesStudent] = useState([]);
    const [coursesProfessor, setCoursesProfessor] = useState([]);
    // const [emptyList, setEmptyList] = useState<string | null>(null);
    const navigate = useNavigate()
    async function getProfessorCourses() {
      try {
        const rawAccessToken = new JwtService().getRawAccessToken() as string;
        const PROFESSOR_ID: string = authConsumer.id;
        const USER_ROLE: string = authConsumer.role;
        let URL = ""
        if(USER_ROLE == "PROFESSOR") {
          URL = "http://localhost:8080/api/v1/users/b0349f65-140d-4b71-8a79-806158b311fe/courses"
        } else if(USER_ROLE == "STUDENT") {
          URL = "http://localhost:8080/api/v1/users/444613dd-bdc7-4b78-8617-3134b6d5af95/enrollments"
        }

        const { data, status } = await axios.get<CourseResponse>(
          URL,
          {
            headers: {
              Accept: 'application/json',
              'Authorization': `Bearer ${rawAccessToken}` 
            },
          },
        );
  
        console.log(rawAccessToken )
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
        // const cursoAluno = await getStudentCourses();
        const cursoProfessor = await getProfessorCourses();
        // console.log(Array.isArray(cursoAluno))
        // console.log(Array.isArray(coursesStudent))
        // setCoursesStudent(cursoAluno)
        setCoursesProfessor(cursoProfessor)
      })();
    }, []);

    
    // useEffect(() => {
    //   {Array.isArray(coursesStudent) ? <h1>é verdadeiro</h1> : setEmptyList('Nenhum aluno curso')}
    // }, [coursesStudent])            

    // useEffect(() => {
    //   {Array.isArray(coursesProfessor) ? <h1>é verdadeiro</h1> : setEmptyList('Nenhum professor curso')}
    // }, [coursesProfessor]) 

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
          </div> : <Typography>{t("courses.emptyList")}</Typography>}
          

          {/* <div>{coursesStudent?.map((course: Course) => (
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
            ))}</div>  */}

          {/* {emptyList && <p>{emptyList}</p>} */}
        </>)
}

export default Courses