import PageHeader from "../../components/PageHeader";
import { Button, Grid, Typography } from "@mui/material";

function Activity() {

  return (
    <>
      <PageHeader title="Course" text="My Course" />
      <Typography sx={{ fontSize: 14 }} gutterBottom>
        Title: Activity 1
        <br />
        Description: Course Java Spring
        <br />
        Date: xx/xx/xxxx until xx/xx/xxxx
        <br />
        Initial File: example.java
        <Button>Download file</Button>
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