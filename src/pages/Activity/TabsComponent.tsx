import { Tab, Tabs, } from '@mui/material'
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const TabsComponent: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);

  };
  const { idCourse, slug, idActivity } = useParams()
  return (
    <>
      <Tabs value={selectedTab} onChange={handleChangeTab} centered>
        <Tab label="Home" value={0} component={Link} to={`/courses/${idCourse}/${slug}/activities/${idActivity}`} />
        <Tab label="Send Resolution" value={1} />
      </Tabs>
      {/* {selectedTab === 1 && <h1>q</h1>}
      {selectedTab === 2 && <h1>asdas</h1>} */}

    </>
  )
}

export default TabsComponent