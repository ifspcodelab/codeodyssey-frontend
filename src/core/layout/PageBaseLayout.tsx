import { Box, useTheme, IconButton, Typography, Icon, useMediaQuery } from "@mui/material";
import React, { ReactNode } from "react";
import { useDrawerContext } from "../contexts/DrawerContext";


interface IPageBaseLayoutProps {
  children: React.ReactNode

  title: string;
  toolbar?: ReactNode;

}

export const PageBaseLayout: React.FC<IPageBaseLayoutProps> = ({ children, title, toolbar }) => {
  const theme = useTheme()
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))
  const mdDown = useMediaQuery(theme.breakpoints.down('md'))

  const { toggleDrawerOpen } = useDrawerContext()

  return (
    <Box height="100%" display="flex" flexDirection="column" gap={1}>
      <Box padding={1} height={theme.spacing(smDown ? 6 : mdDown ? 8 : 12)} display="flex" alignItems="center" gap={1}>
        {smDown && (<IconButton onClick={toggleDrawerOpen}>
          <Icon>menu</Icon>
        </IconButton>)}

        <Typography
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipses"
          variant={smDown ? "h5" : mdDown ? "h4" : "h3"}
        >
          {title}
        </Typography>
      </Box>

      {toolbar && (<Box>
        {toolbar}
      </Box>)}

      <Box flex={1} overflow="auto">
        {children}
      </Box>
    </Box>
  )
}