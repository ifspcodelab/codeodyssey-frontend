import {useTranslation} from "react-i18next";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PageHeader from "../../components/PageHeader";
import { useEffect, useState } from "react";
import axios from "axios";

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

  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUFJPRkVTU09SIiwic3ViIjoibW9yaWFydHlAZ21haWwuY29tIiwiaWF0IjoxNjkwNDc4NTAyLCJleHAiOjE2OTA0Nzk0MDJ9.31BDiKdHLUGFhyzFfQ8PuY8VTTL7Hh130hsm1NazRCA'

  async function getCourses(): Promise<Course[]> {
    const response = await axios.get<Course>(
      'http://localhost:8080/api/v1/users/b0349f65-140d-4b71-8a79-806158b311fe/courses',
      {
        headers: {
          Accept: 'application/json',
          'Authorization': `Basic ${token}` ,
          'Content-Type': 'application/json',
          "Access-Control-Allow-Origin": "http://localhost:8080/api/v1/"
        },
      },
    );

    return response.data.courses;
  }


function Courses() {
    const { t } = useTranslation();

    const baseURL = "http://localhost:8080/api/v1/users/b0349f65-140d-4b71-8a79-806158b311fe/courses";

    // React.useEffect(() => {
    //     axios.get(baseURL).then((response) => {
    //         setCourses(response.data);
    //     });
    //   }, []);

   
    const [courses, setCourses] = useState<[] | Course[]>([]);


    useEffect(() => {
      (async () => {
        const courses = await getCourses();
        setCourses(courses);
      })();
    }, []);

    return (
        <>
             <PageHeader title={t('courses.title')} text={t('courses.text')} />
        <div>
            {courses.map((course: Course) => (
            <Card variant="outlined" sx={{ minWidth: 275 ,display: "flex", mb: 1.5 , borderColor: "primary.main"}}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        {course.name}
                    </Typography>
                    {/* <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
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
                    </Typography> */}
                </CardContent>

                <CardActions sx={{ display: "flex", flexDirection: "column", alignItems: "center",justifyContent: "center",marginLeft: "auto", }}>
                    <Button variant="contained" size="medium" sx={{ p: 1, m: 1, width:200 }}>{t("courses.button.invite")}</Button>
                    <Button variant="contained" size="medium" sx={{ p: 1, m: 1,  width:200 }}>{t("courses.button.students")}</Button>
                </CardActions>
            </Card>
            ))}
            
        </div>
        </>
    );
}

export default Courses