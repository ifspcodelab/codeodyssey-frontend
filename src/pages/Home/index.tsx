import {useNavigate} from "react-router-dom"
import {useTranslation} from "react-i18next";
import {
    AppBar,
    Tab,
    Tabs,
    Toolbar,
    Typography
  } from "@mui/material";


function Home() {
  const navigate = useNavigate()
  const { t } = useTranslation();

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
                            }}label={t("navbar.register")} />
                    <Tab sx={{color: "#fff"}} onClick={() => {
                            navigate('/login')
                            }}label={t("navbar.login")} />
                    <Tab sx={{color: "#fff"}} onClick={() => {
                            navigate('/courses')
                            }}label={t("navbar.courses")} />
                    <Tab sx={{color: "#fff"}} onClick={() => {
                            navigate('/create-course')
                            }}label={t("navbar.createCourse")} />
                    <Tab sx={{color: "#fff"}} onClick={() => {
                            navigate('/contact')
                            }}label={t("navbar.contact")} />
                </Tabs>
                </Toolbar>
            </AppBar>
        </>
    );
}

export default Home