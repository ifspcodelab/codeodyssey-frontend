import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { JwtService } from '../auth/JwtService';
import { AccessToken } from '../models/AccessToken';

interface IDrawerContextData {
  isDrawerOpen: boolean;
  drawerOptions: IDrawerOption[]
  toggleDrawerOpen: () => void;
  setDrawerOptions: (newDrawerOption: IDrawerOption[]) => void;
}

interface IDrawerOption {
  icon: string;
  label: string;
  path: string;
}

const DrawerContext = createContext({} as IDrawerContextData);

// eslint-disable-next-line react-refresh/only-export-components
export const useDrawerContext = () => {
  return useContext(DrawerContext);
};

interface IDrawerProvider {
  children: React.ReactNode
}

export const DrawerProvider: React.FC<IDrawerProvider> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerOptions, setDrawerOptions] = useState<IDrawerOption[]>([]);

  const toggleDrawerOpen = useCallback(() => {
    setIsDrawerOpen(oldDrawerOpen => !oldDrawerOpen);
  }, []);

  const handleSetDrawerOptions = useCallback((newDrawerOptions: IDrawerOption[]) => {
    setDrawerOptions(newDrawerOptions);
  }, []);

  const { t } = useTranslation();
  const [token, setToken] = useState<AccessToken | null>(null);

  useEffect(() => {
    const jwtService = new JwtService();
    setToken(jwtService.getAccessToken());
  }, []);


  useEffect(() => {
    if (!token) {
      setDrawerOptions([
        {
          icon: 'home',
          path: '/',
          label: t("sidebar.home")
        },
        {
          icon: 'app_registration',
          path: '/registration',
          label: t("registration.title")
        },
        {
          icon: 'login',
          path: '/login',
          label: t("login.title")
        },
        {
          icon: 'call',
          path: '/contact',
          label: t("contact.title")
        }
      ])
    } else if (token) {
      setDrawerOptions([
        {
          icon: 'home',
          path: '/',
          label: t("sidebar.home")
        },
        {
          icon: 'code',
          path: '/courses',
          label: t("courses.courses")
        },
        {
          icon: 'call',
          path: '/contact',
          label: t("contact.title")
        },
        {
          icon: 'logout',
          path: '/',
          label: t("sidebar.logout")
        }
      ])
    }
  }, [t, token]);

  return (
    <DrawerContext.Provider value={{ isDrawerOpen, drawerOptions, toggleDrawerOpen, setDrawerOptions: handleSetDrawerOptions }}>
      {children}
    </DrawerContext.Provider>
  );
};