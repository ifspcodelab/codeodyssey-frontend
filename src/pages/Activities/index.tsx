import { useState } from "react";
import PageHeader from "../../components/PageHeader";
// import { useApiGetActivities } from "../../core/hooks/useApiGetActivities.ts";
import axios from "axios";
import React from "react";
import { Card, CardContent } from "@mui/material";
import Typography from '@mui/material/Typography';
import i18n from "../../locales/i18n";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface ActivityResponse {
  id: string,
  name: string,
  language: string,
  description: string,
  startDate: Date,
  endDate: Date,
}

function Activities() {
  // const { getActivities } = useApiGetActivities()
  const [activities, setActivities] = useState([]);

  const baseURL = "https://localhost:3000/activities";

  const { t } = useTranslation();

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      console.log(response.data)
      setActivities(response.data);
    });
  }, []);

  return (

    <>
      <PageHeader title="Activities" text="Activities course" />
      {Array.isArray(activities) && activities.map((activity: ActivityResponse) => (
        <Card key={activity.id}>
          <CardContent className="cardContent">
            <Typography variant="h6" component="div" className="title">
              <Link to={activity.id}>{activity.name}</Link>
            </Typography>
            <Typography sx={{ fontSize: 14 }} gutterBottom>
              Description: {activity.description}
            </Typography>
            <Typography sx={{ fontSize: 14 }} gutterBottom>
              Language: {activity.language}
            </Typography>
            <Typography sx={{ mb: 1.5 }}>
              {new Date(activity.startDate).toLocaleDateString(i18n.language, { timeZone: "Europe/London" })} {t("courses.until")} {new Date(activity.endDate).toLocaleDateString(i18n.language, { timeZone: "Europe/London" })}
            </Typography>
          </CardContent>

        </Card>
      ))}
    </>
  );
}

export default Activities