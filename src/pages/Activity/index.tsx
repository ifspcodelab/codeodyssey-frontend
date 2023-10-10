import PageHeader from "../../components/PageHeader";
import { Button, Grid, Typography } from "@mui/material";
// import DropFileInput from '../../components/DropFileInput'
import { useApiGetActivity } from "../../core/hooks/useApiGetActivity.ts";
import { useApiSendResolution } from "../../core/hooks/useApiSendResolution.ts";
import { JwtService } from "../../core/auth/JwtService.ts";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthConsumer } from "../../core/auth/AuthContext.tsx";

function Activity() {
  const { getActivity } = useApiGetActivity()
  const { sendResolution } = useApiSendResolution()
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

  const resolutionFile = "cGFja2FnZSBhcHAuY29kZW9keXNzZXkuY29kZW9keXNzZXlhcGkuYWN0aXZpdHkuYXBpOwoKaW1wb3J0IGFwcC5jb2Rlb2R5c3NleS5jb2Rlb2R5c3NleWFwaS5jb3Vyc2UuZGF0YS5Db3Vyc2U7CgppbXBvcnQgamF2YS50aW1lLkluc3RhbnQ7CmltcG9ydCBqYXZhLnV0aWwuVVVJRDsKCnB1YmxpYyByZWNvcmQgQWN0aXZpdHlSZXNwb25zZShVVUlEIGlkLAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RyaW5nIHRpdGxlLAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RyaW5nIGRlc2NyaXB0aW9uLAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdGFudCBzdGFydERhdGUsCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0YW50IGVuZERhdGUsCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBieXRlW10gaW5pdGlhbEZpbGUsCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBieXRlW10gc29sdXRpb25GaWxlLAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnl0ZVtdIHRlc3RGaWxlLAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RyaW5nIGV4dGVuc2lvbikgewp9Cg=="

  useEffect(() => {
    void (async () => {
      const resolutionResponse = await sendResolution(resolutionFile, rawAccessToken, idCourse, idActivity);
      console.log(resolutionResponse)
      // setActivity(activityResponse)
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