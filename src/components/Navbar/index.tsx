import {
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import {useTranslation} from "react-i18next";
import './style.css'
import {useEffect, useState} from "react";
import {JwtService} from "../../core/auth/JwtService";


function Navbar() {
  const { t } = useTranslation();
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const jwtService = new JwtService();
    const token = jwtService.getAccessToken();
    if (token) {
      setAuthenticated(true)
    }
  }, []);

  const handleLogout = () => {
    const jwtService = new JwtService();
    jwtService.removeTokens();
    setAuthenticated(false)
  }

  return (
    <AppBar position="static">
      <Toolbar className="container">
        <Typography variant="h4">
          CodeOdyssey
        </Typography>
          <div className="linkList">
            <Link className="link" to="/">
              Home
            </Link>
            <Link className="link" to="/registration" >
              {t("navbar.register")}
            </Link>
            {!authenticated ?
              <Link className="link" to="/login" >
                {t("navbar.login")}
              </Link>
                :
                <Link className="link" onClick={handleLogout} to="/">
                  {t("navbar.logout")}
                </Link>
            }
            <Link className="link" to="/courses">
              {t("navbar.courses")}
            </Link>
            <Link className="link" to="/create-course">
              {t("navbar.createCourse")}
            </Link>
            <Link className="link" to="/contact">
              {t("navbar.contact")}
            </Link>
          </div>
      </Toolbar>
    </AppBar>
  );
}
export default Navbar;