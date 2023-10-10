import PageHeader from "../../components/PageHeader";
import { Button, Grid, Typography } from "@mui/material";
// import DropFileInput from '../../components/DropFileInput'
import { useApiGetActivity } from "../../core/hooks/useApiGetActivity.ts";
import { JwtService } from "../../core/auth/JwtService.ts";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthConsumer } from "../../core/auth/AuthContext.tsx";

function Activity() {
  const { getActivity } = useApiGetActivity()
  const rawAccessToken = new JwtService().getRawAccessToken() as string;
  const { idCourse, idActivity } = useParams()
  const [activity, setActivity] = useState();

  useEffect(() => {
    void (async () => {
      const activityResponse = await getActivity(idCourse, idActivity, rawAccessToken);
      console.log(activityResponse)
      setActivity(activityResponse)
    })();
  }, []);
  // const onFileChange = (files) => {
  //   console.log(files)
  // }
  const authConsumer = AuthConsumer();

  const USER_ID: string = authConsumer.id;
  const USER_ROLE: string = authConsumer.role;
  return (
    <>


      <PageHeader title="Activity" text="Desc Example" />
      <Typography sx={{ fontSize: 14 }} gutterBottom>
        Title: {activity?.title}
        <br />
        Name course: {activity?.course.name}
        <br />
        {/* Description: {activity.description} */}
        <br />
        Date: {activity?.startDate} until {activity?.endDate}
        <br />
        Initial File: example.java
        <Button>Download file</Button>
      </Typography>


      {activity?.course.professor.id === USER_ID ? <span></span> : <Grid item xs={12}>
        <label htmlFor="resolution-file">Resolution file</label>
      </Grid>}
      {/* TO-DO: put id and accept in the input tag */}
      {/* <DropFileInput onFileChange={(files) => onFileChange(files)} /> */}
    </>
  );
}

export default Activity