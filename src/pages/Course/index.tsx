import { useTranslation } from "react-i18next";
import PageHeader from "../../components/PageHeader";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom"

function Course() {
  const { t } = useTranslation();
  const navigate = useNavigate()

  return (
    <>
      <PageHeader title="Course" text="My Course" />
      <Button variant="contained" size="medium" sx={{ p: 1, m: 1, width: 200 }}
        onClick={() => {
          navigate('create-activity');
        }}
      >Create Activity</Button>
    </>
  );
}

export default Course