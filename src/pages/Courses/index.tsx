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

  type User = {
    name: string;
  };

  type Course = {
    name: string,
    slug: string,
    startDate: Date,
    endDate: Date,
    professor: User,
  };

  type GetCoursesResponse = {
    data: Course[];
  }


  // async function getUserCourses() {
  //   const res = await axios.get<GetCoursesResponse>('http://localhost:3000/courses')
  //   return res.data;
  // }

  // async function getUserEnrollments() {
  //   const res = await axios.get<GetCoursesResponse>('http://localhost:3000/enrollments');
  //   return res.data;
  // }

  async function getProfessorCourses() {
    try {
      const { data, status } = await axios.get<GetCoursesResponse>(
        'http://localhost:3000/courses',
        {
          headers: {
            Accept: 'application/json',
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

  async function getStudentCourses() {
    try {
      const { data, status } = await axios.get<Course[]>(
        'http://localhost:3000/courses',
        {
          headers: {
            Accept: 'application/json',
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

function Courses() {
    const { t } = useTranslation();

    const [coursesStudent, setCoursesStudent] = useState<[] | Course[]>([]);
    const [coursesProfessor, setCoursesProfessor] = useState<[] | Course[]>([]);
    const navigate = useNavigate()

    useEffect(() => {
      void (async () => {
        const cursoAluno = await getStudentCourses();
        const cursoProfessor = await getProfessorCourses();
        setCoursesStudent(cursoAluno)
        setCoursesProfessor(cursoProfessor)
      })();
    }, []);

    

    

    return (
        <>
        <PageHeader title={t('courses.title')} text={t('courses.text')} />
          {coursesProfessor.length || coursesStudent.length ? 
          
          <div>
            <div>{coursesProfessor?.map((course: Course) => (
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
          <div>{coursesStudent?.map((course: Course) => (
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

          </div> : <Typography>{t("courses.emptyList")}</Typography>}

        </>)
}

export default Courses