import { useTranslation } from "react-i18next";
import PageHeader from "../../components/PageHeader";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom"
import { AuthConsumer } from "../../core/auth/AuthContext.tsx";
import { useEffect, useState } from "react";

function Course() {
  const { t } = useTranslation();
  const navigate = useNavigate()
  const authConsumer = AuthConsumer();
  const USER_ID: string = authConsumer.id;
  const USER_ROLE: string = authConsumer.role;
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    setUserRole(USER_ROLE)
  }, [USER_ROLE]);
  return (
    <>
      <PageHeader title="Course" text="My Course" />
      {/* TO-DO: Verficar se o usuário possui o mesmo ID de quem criou o Curso */}
      {userRole === 'PROFESSOR' ? <Button variant="contained" size="medium" sx={{ p: 1, m: 1, width: 200 }}
        onClick={() => {
          navigate('create-activity');
        }}
      >{t('course.button.create')}</Button> : <span></span>}
      <Button variant="contained" size="medium" sx={{ p: 1, m: 1, width: 200 }}
        onClick={() => {
          navigate('activities');
        }}
      >{t('course.button.activities')}</Button>
    </>
  );
}

export default Course