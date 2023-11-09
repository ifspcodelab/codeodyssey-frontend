import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Card, CardContent, Typography } from "@mui/material";
import { AxiosError } from "axios";

import { CoursesService } from "../../core/services/api/courses/CoursesService.ts";
import ErrorSnackBar from "../../core/components/error-snack-bar/ErrorSnackBar.tsx";
import CreateInviteModal from "../../core/components/create-invite-modal/index.tsx";
import { PageBaseLayout } from "../../core/layout/PageBaseLayout.tsx";
import { useErrorHandler } from "../../core/hooks/useErrorHandler.ts";
import { AuthConsumer } from "../../core/auth/AuthContext.tsx";
import { JwtService } from "../../core/auth/JwtService.ts";
import { ICourseResponse } from "../../core/models/Course.ts";
import TabsComponent from "./TabsComponent.tsx";

const Course: React.FC = () => {

  const authConsumer = AuthConsumer();
  const USER_ID: string = authConsumer.id;
  const rawAccessToken = new JwtService().getRawAccessToken() as string;
  const { idCourse } = useParams()

  const [course, setCourse] = useState<ICourseResponse>();

  const { handleError, openError, errorType, handleCloseError } = useErrorHandler();

  // const handleChangeTab = (event, newValue) => {
  //   navigate(`${newValue}`);
  // };

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
  // const [selectedTab, setSelectedTab] = useState(0);

  return (
    <>
      <PageBaseLayout title={course?.name !== undefined ? course?.name : "title"}
      > </PageBaseLayout>
      <TabsComponent />
      <Card>
        <CardContent>
          <Typography variant="h5">{course?.name}</Typography>
          <Typography variant="subtitle1">Professor: {course?.professor?.name}</Typography>
          <Typography>Data de Início: {course?.startDate}</Typography>
          <Typography>Data de Término: {course?.endDate}</Typography>
        </CardContent>
      </Card>
      {/* <div>
        <Tabs value={selectedTab} onChange={handleChangeTab} centered>
          <Tab label="Home" />
          <Tab label="Ver Atividades" value="activities" />
          {USER_ID === course?.professor?.id && <Tab label="Ver Alunos" value="students" />}
        </Tabs>
        {selectedTab === 0 && <TestComponent course={course} />}
      </div> */}

      {USER_ID === course?.professor?.id && course && <CreateInviteModal course={course} />}

      <ErrorSnackBar open={openError} handleClose={handleCloseError} errorType={errorType} />
    </>
  );
}

export default Course