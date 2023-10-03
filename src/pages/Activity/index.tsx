import PageHeader from "../../components/PageHeader";
import { Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom"

function Activity() {
  const navigate = useNavigate()

  return (
    <>
      <PageHeader title="Course" text="My Course" />
      <Typography sx={{ fontSize: 14 }} gutterBottom>
        Title: Activity 1
        Description: Course Java Spring
        Date: xx/xx/xxxx until xx/xx/xxxx
      </Typography>
      <Grid item xs={12}>
        <label htmlFor="resolution-file">Resolution file</label>
        <input
          id="resolution-file"
          accept=".java"
          type="file"
        />
      </Grid>
    </>
  );
}

export default Activity