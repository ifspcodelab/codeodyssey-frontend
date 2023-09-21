import * as React from 'react';
import { Card, CardContent } from "@mui/material";
import Typography from '@mui/material/Typography';
import { useTranslation } from "react-i18next";
import { CourseResponse } from '../../core/models/CourseResponse.ts';
import './style.css'
import i18n from "../../locales/i18n";


interface ItemComponentProps {
  course: CourseResponse;
}

const CoursesList: React.FC<ItemComponentProps> = ({ course }) => {
  const { t } = useTranslation();




  return (
    <div>
      <Card key={course.id} variant="outlined" sx={{ minWidth: 275, display: "flex", mb: 1.5, borderColor: "primary.main", margin: 2 }}>
        <CardContent className="cardContent">
          <Typography variant="h6" component="div" className="title">
            {course.name}
          </Typography>
          <Typography sx={{ fontSize: 14 }} gutterBottom>
            Professor: {course.professor.name}
          </Typography>
          <Typography sx={{ mb: 1.5 }}>
            {new Date(course.startDate).toLocaleDateString(i18n.language, { timeZone: "Europe/London" })} {t("courses.until")} {new Date(course.endDate).toLocaleDateString(i18n.language, { timeZone: "Europe/London" })}
          </Typography>
        </CardContent>


      </Card>

    </div>
  );
};

export default CoursesList;

