
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";



function Login() {
    return (
        <React.Fragment>
        <CssBaseline />
        <Container maxWidth="sm">
        <PageHeader title={('Login')} text={('Log in or Sign in')} />
        
        <div>
        <TextField id="outlined-basic" label="Email" variant="outlined" />   
        </div> 
        <div> 
        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
        /> 
        </div>     
        <div>
        <Button variant="contained">Log In!</Button>
        </div> 
        <PageFooter text={('login')} />
        </Container>
      </React.Fragment>
    );
}

export default Login