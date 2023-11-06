import { useTranslation } from "react-i18next";
import { Button, Tab, Tabs } from "@mui/material";
import { useNavigate } from "react-router-dom"
import { AuthConsumer } from "../../core/auth/AuthContext.tsx";
import { useEffect, useState } from "react";
import { JwtService } from "../../core/auth/JwtService.ts";
import { useParams } from "react-router-dom";
import ErrorSnackBar from "../../core/components/error-snack-bar/ErrorSnackBar.tsx";
import { AxiosError } from "axios";
import { PageBaseLayout } from "../../core/layout/PageBaseLayout.tsx";
import { useErrorHandler } from "../../core/hooks/useErrorHandler.ts";
import { CoursesService, ICourseResponse } from "../../core/services/api/courses/CoursesService.ts";
import CreateInviteModal from "../../components/CreateInviteModal/index.tsx";
import TestComponent from "./TestComponent.tsx";


const Course: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate()
  const authConsumer = AuthConsumer();
  const USER_ID: string = authConsumer.id;
  const [course, setCourse] = useState<ICourseResponse>();
  const rawAccessToken = new JwtService().getRawAccessToken() as string;
  const { idCourse } = useParams()
  const { handleError, openError, errorType, handleCloseError } = useErrorHandler();

  useEffect(() => {
    if (idCourse !== undefined) {
      CoursesService.getById(idCourse, rawAccessToken)
        .then((response) => {
          setCourse(response as ICourseResponse);
        }).catch((error: AxiosError<ProblemDetail>) => {
          handleError(error)
        })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [USER_ID, rawAccessToken])
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChangeTab = (event, newValue) => {
    navigate(`${newValue}`);
  };
  return (
    <>
      <PageBaseLayout title={course?.name !== undefined ? course?.name : "title"}
      > </PageBaseLayout>

      <div>
        <Tabs value={selectedTab} onChange={handleChangeTab} centered>
          <Tab label="Home" />
          <Tab label="Ver Atividades" value="activities" />
          {USER_ID === course?.professor?.id && <Tab label="Ver Alunos" value="students" />}
        </Tabs>
        {selectedTab === 0 && <TestComponent course={course} />}
      </div>

      {USER_ID === course?.professor?.id && course && <CreateInviteModal course={course} />}

      <ErrorSnackBar open={openError} handleClose={handleCloseError} errorType={errorType} />
    </>
  );
}

export default Course