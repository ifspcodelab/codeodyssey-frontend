import PageHeader from "../../components/PageHeader";
import { Button, Grid, Typography } from "@mui/material";
import DropFileInput from '../../components/DropFileInput'
function Activity() {

  const onFileChange = (files) => {
    console.log(files)
  }

  return (
    <>
      <PageHeader title="Activity" text="Desc Example" />
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
      </Grid>
      {/* TO-DO: put id and accept in the input tag */}
      <DropFileInput onFileChange={(files) => onFileChange(files)} />
    </>
  );
}

export default Activity