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
          label: 'Home'
        },
        {
          icon: 'app_registration',
          path: '/registration',
          label: t("navbar.register")
        },
        {
          icon: 'login',
          path: '/login',
          label: t("navbar.login")
        },
        {
          icon: 'call',
          path: '/contact',
          label: t("navbar.contact")
        }
      ])
    } else if (token) {
      setDrawerOptions([
        {
          icon: 'home',
          path: '/',
          label: 'Home'
        },
        {
          icon: 'code',
          path: '/courses',
          label: t("navbar.courses")
        },
        {
          icon: 'call',
          path: '/contact',
          label: t("navbar.contact")
        },
        {
          icon: 'logout',
          path: '/',
          label: t("navbar.logout")
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