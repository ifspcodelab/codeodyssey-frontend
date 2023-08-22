import {useNavigate} from "react-router-dom"
import { useState } from "react";
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
  
  const [value, setValue] = useState<string>('1');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
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
                 value={value}
                 onChange={handleChange}
                >
                    <Tab  value="1" sx={{color: "#fff"}} onClick={() => {
                            navigate('/registration')
                            }}label={t("navbar.register")} />
                    <Tab value="2" sx={{color: "#fff"}} onClick={() => {
                            navigate('/login')
                            }}label={t("navbar.login")} />
                    <Tab value="3" sx={{color: "#fff"}} onClick={() => {
                            navigate('/courses')
                            }}label={t("navbar.courses")} />
                    <Tab value="4" sx={{color: "#fff"}} onClick={() => {
                            navigate('/create-course')
                            }}label={t("navbar.createCourse")} />
                    <Tab value="5" sx={{color: "#fff"}} onClick={() => {
                            navigate('/contact')
                            }}label={t("navbar.contact")} />
                </Tabs>
                </Toolbar>
            </AppBar>
        </>
    );
}

export default Home