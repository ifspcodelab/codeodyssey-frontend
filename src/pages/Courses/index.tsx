import {useTranslation} from "react-i18next";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PageHeader from "../../components/PageHeader";
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react"

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

  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUFJPRkVTU09SIiwic3ViIjoibW9yaWFydHlAZ21haWwuY29tIiwiaWF0IjoxNjkwNDg0OTI1LCJleHAiOjE2OTA0ODU4MjV9.jt6aqQbwmm3vIIdLXnEra9-NUsza9BDQ6HVnczKQyA0'

  // async function getCourses(): Promise<Course> {
  //   const response = await axios.get<Course>(
  //     'http://localhost:8080/api/v1/users/b0349f65-140d-4b71-8a79-806158b311fe/courses',
  //     {
  //       headers: {
  //         Accept: 'application/json',
  //         'Authorization': `Basic ${token}` ,
  //         'Content-Type': 'application/json',
  //         "Access-Control-Allow-Origin": "http://localhost:8080/api/v1/"
  //       },
  //     },
  //   );

  //   return response.data;
  // }

  async function getCourses() {
    try {

      // const response = await Promise.all([
      //   axios.get<GetCoursesResponse>('http://localhost:3000/enrollments'),
      //   axios.get<GetCoursesResponse>('http://localhost:3000/courses'),
      // ])

      const { data, status } = await axios.get<GetCoursesResponse>(
        'http://localhost:3000/enrollments',
        {
          headers: {
            Accept: 'application/json',
            'Authorization': `Basic ${token}` ,
          },
        },
      );
  
      console.log(JSON.stringify(data, null, 4));
  
      // 👇️ "response status is: 200"
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

    const [courses, setCourses] = useState<[] | Course[]>([]);


    useEffect(() => {
      (async () => {
        const course = await getCourses();
        setCourses(course);
      })();
    }, []);

    return (
        <>
        <PageHeader title={t('courses.title')} text={t('courses.text')} />
        
        {courses.length ? <div>{courses?.map((course: Course) => (
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
                    <Button variant="contained" size="medium" sx={{ p: 1, m: 1, width:200 }}>{t("courses.button.invite")}</Button>
                    <Button variant="contained" size="medium" sx={{ p: 1, m: 1,  width:200 }}>{t("courses.button.students")}</Button>
                </CardActions>
            </Card>
            ))}</div> : <Typography>{t("courses.emptyList")}</Typography>}
        </>
    );
}

export default Courses