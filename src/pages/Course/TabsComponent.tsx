import { Tab, Tabs, } from '@mui/material'
import { useEffect, useState } from 'react';
import Students from '../Students';
import Activities from '../Activities';
import { useNavigate } from 'react-router-dom';
import { Link, useLocation, useParams } from 'react-router-dom';

const TabsComponent: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate()

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);

  };
  const { idCourse, slug } = useParams()
  return (
    <>
      <Tabs value={selectedTab} onChange={handleChangeTab} centered>
        <Tab label="Home" value={0} component={Link} to={`/courses/${idCourse}/${slug}`} />
        <Tab label="Students" value={1} component={Link} to={`/courses/${idCourse}/${slug}/students`} />
        <Tab label="Activities" value={2} component={Link} to={`/courses/${idCourse}/${slug}/activities`} />
      </Tabs>


    </>
  )
}

export default TabsComponent