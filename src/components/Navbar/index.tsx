import {
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import {useTranslation} from "react-i18next";



function Navbar() {
  const { t } = useTranslation();

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4">
          CodeOdyssey
        </Typography>
          <div>
            <Link to="/">
              Home
            </Link>
            <Link to="/registration" >
              {t("navbar.register")}
            </Link>
            <Link to="/login" >
              {t("navbar.login")}
            </Link>
            <Link to="/courses">
              {t("navbar.courses")}
            </Link>
            <Link to="/create-course">
              {t("navbar.createCourse")}
            </Link>
            <Link to="/contact">
              {t("navbar.contact")}
            </Link>
          </div>
      </Toolbar>
    </AppBar>
  );
}
export default Navbar;