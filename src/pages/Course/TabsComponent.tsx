import { Tab, Tabs, } from '@mui/material'
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { AuthConsumer } from '../../core/auth/AuthContext';
import { ICourseResponse } from '../../core/models/Course';
import { JwtService } from '../../core/auth/JwtService';
import { CoursesService } from '../../core/services/api/courses/CoursesService';
import { AxiosError } from 'axios';
import { useErrorHandler } from '../../core/hooks/useErrorHandler';
import { PageBaseLayout } from '../../core/layout/PageBaseLayout';
import ErrorSnackBar from '../../core/components/error-snack-bar/ErrorSnackBar';

const TabsComponent: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const location = useLocation()

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };
  const { handleError, openError, errorType, handleCloseError } = useErrorHandler();

  const authConsumer = AuthConsumer();
  const USER_ID: string = authConsumer.id;
  const rawAccessToken = new JwtService().getRawAccessToken() as string;
  const [course, setCourse] = useState<ICourseResponse>();
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


  useEffect(() => {
    if (location.pathname.includes('/activities')) {
      setSelectedTab(2);
    } else if (location.pathname.includes('/students')) {
      setSelectedTab(1);
    } else {
      setSelectedTab(0);
    }
  }, [location.pathname]);

  const { idCourse, slug } = useParams()
  return (
    <>
      <PageBaseLayout title={course?.name !== undefined ? course?.name : ""}
      > </PageBaseLayout>

      <Tabs value={selectedTab} onChange={handleChangeTab} centered>
        <Tab label="Home" value={0} component={Link} to={`/courses/${idCourse}/${slug}`} />
        <Tab label="Students" value={1} component={Link} to={`/courses/${idCourse}/${slug}/students`} />
        <Tab label="Activities" value={2} component={Link} to={`/courses/${idCourse}/${slug}/activities`} />
      </Tabs>

      <ErrorSnackBar open={openError} handleClose={handleCloseError} errorType={errorType} />
    </>
  )
}

export default TabsComponent