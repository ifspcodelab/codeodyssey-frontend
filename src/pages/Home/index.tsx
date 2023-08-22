import {useNavigate} from "react-router-dom"
import {
    AppBar,
    Tab,
    Tabs,
    Toolbar,
    Typography
  } from "@mui/material";


function Home() {
  const navigate = useNavigate()

    return (
        <>
            <AppBar sx={{ background: "#063970" }}>
                <Toolbar>
                <Typography sx={{  paddingLeft: "10%", cursor: "pointer" }} onClick={() => {
                            navigate('/')
                            }}>
                    CodeOdyssey
                </Typography>
                <Tabs sx={{ marginLeft: "auto" }}
                >
                    <Tab sx={{color: "#fff"}} onClick={() => {
                            navigate('/registration')
                            }}label="Register" />
                    <Tab sx={{color: "#fff"}} onClick={() => {
                            navigate('/login')
                            }}label="Login" />
                    <Tab sx={{color: "#fff"}} onClick={() => {
                            navigate('/courses')
                            }}label="My Courses" />
                    <Tab sx={{color: "#fff"}} onClick={() => {
                            navigate('/create-course')
                            }}label="Create Course" />
                    <Tab sx={{color: "#fff"}} onClick={() => {
                            navigate('/contact')
                            }}label="Contact" />
                </Tabs>
                </Toolbar>
            </AppBar>
        </>
    );
}

export default Home