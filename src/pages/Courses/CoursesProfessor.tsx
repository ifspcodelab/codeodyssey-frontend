import * as React from 'react';
import { Button, Card, CardActions, CardContent } from "@mui/material";
import Typography from '@mui/material/Typography';
import { useTranslation } from "react-i18next";
import { CourseResponse } from '../../core/models/CourseResponse.ts';
import './style.css'
import i18n from "../../locales/i18n.ts";
import { Link, useNavigate } from "react-router-dom"
import CreateInviteModal from '../../components/CreateInviteModal/index.tsx';


interface ItemComponentProps {
  course: CourseResponse;
}

const CoursesList: React.FC<ItemComponentProps> = ({ course }) => {
  const { t } = useTranslation();


  const navigate = useNavigate()


  return (
    <div>
      <Card key={course.id} variant="outlined" sx={{ minWidth: 275, display: "flex", mb: 1.5, borderColor: "primary.main", margin: 2 }}>
        <CardContent className="cardContent">
          <Typography variant="h6" component="div" className="title">
            <Link to={'react'}>{course.name}</Link>
          </Typography>
          <Typography sx={{ fontSize: 14 }} gutterBottom>
            Professor: {course.professor.name}
          </Typography>
          <Typography sx={{ mb: 1.5 }}>
            {new Date(course.startDate).toLocaleDateString(i18n.language, { timeZone: "Europe/London" })} {t("courses.until")} {new Date(course.endDate).toLocaleDateString(i18n.language, { timeZone: "Europe/London" })}
          </Typography>
        </CardContent>

        <CardActions key={course.id} className="cardActions">
          <CreateInviteModal course={course} />

          <Button variant="contained" size="medium" sx={{ p: 1, m: 1, width: 200 }}
            onClick={() => {
              navigate(course.slug + '/students');
            }}
          >{t("courses.button.students")}</Button>
        </CardActions>
      </Card>

    </div>
  );
};

export default CoursesList;

