import {
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import {useTranslation} from "react-i18next";
import './style.css'



function Navbar() {
  const { t } = useTranslation();

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
            <Link className="link" to="/login" >
              {t("navbar.login")}
            </Link>
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