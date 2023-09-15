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
import {AccessToken} from "../../core/models/AccessToken";
import {UserRole} from "../../core/models/UserRole";
import {useNavigate} from "react-router-dom";


function Navbar() {
  const { t } = useTranslation();
  const [token, setToken] = useState<AccessToken | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const jwtService = new JwtService();
    setToken(jwtService.getAccessToken());
  }, []);

  const handleLogout = () => {
    const jwtService = new JwtService();
    jwtService.removeTokens();
    setToken(null);
    navigate("/");
    window.location.reload();
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
            {!token &&
                <Link className="link" to="/registration" >
                  {t("navbar.register")}
                </Link>            }
            <Link className="link" to="/contact">
              {t("navbar.contact")}
            </Link>
            {token?.role === UserRole.PROFESSOR &&
                <Link className="link" to="/create-course">
                  {t("navbar.createCourse")}
                </Link>}
            {!token ?
                <Link className="link" to="/login" >
                  {t("navbar.login")}
                </Link>
                :
                <>
                  <Link className="link" to="/courses">
                    {t("navbar.courses")}
                  </Link>
                  <Link className="link" onClick={handleLogout} to="/">
                    {t("navbar.logout")}
                  </Link>
                </>
            }
          </div>
      </Toolbar>
    </AppBar>
  );
}
export default Navbar;