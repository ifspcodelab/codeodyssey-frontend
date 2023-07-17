import {useTranslation} from "react-i18next";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import axios from "axios";
import React from "react";
import i18next from 'i18next';

function Courses() {
    const { t } = useTranslation();

    const [courses, setCourses] = useState([])

    const baseURL = "http://localhost:3000/courses";

    React.useEffect(() => {
        axios.get(baseURL).then((response) => {
            setCourses(response.data);
        });
      }, []);

    return (
        <>
            <h1>{t("courses.title")}</h1>

        <div>
            {courses.map((course) => (
            <Card variant="outlined" sx={{ minWidth: 275 ,display: "flex", mb: 1.5 , borderColor: "primary.main"}}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        {course.name}
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {course.teacherName}    
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {course.startDate} until {course.endDate}
                    </Typography>
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