import { Tab, Tabs, } from '@mui/material'
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthConsumer } from '../../core/auth/AuthContext';
import { ICourseResponse } from '../../core/models/Course';
import { JwtService } from '../../core/auth/JwtService';
import { CoursesService } from '../../core/services/api/courses/CoursesService';
import { AxiosError } from 'axios';
import { useErrorHandler } from '../../core/hooks/useErrorHandler';

const TabsComponent: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);

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
  const { idCourse, slug } = useParams()
  return (
    <>
      <Tabs value={selectedTab} onChange={handleChangeTab} centered>
        <Tab label="Home" value={0} component={Link} to={`/courses/${idCourse}/${slug}`} />
        {USER_ID === course?.professor?.id && <Tab label="Students" value="students" />}
        <Tab label="Activities" value={2} component={Link} to={`/courses/${idCourse}/${slug}/activities`} />
      </Tabs>
    </>
  )
}

export default TabsComponent