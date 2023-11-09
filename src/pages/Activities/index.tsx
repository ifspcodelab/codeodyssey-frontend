import React from "react";
import { useEffect, useState } from "react";
import { Icon, IconButton, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";

import { ActivitiesService, } from '../../core/services/api/activities/ActivitiesService.ts';
import ErrorSnackBar from "../../core/components/error-snack-bar/ErrorSnackBar.tsx";
import SuccessrSnackBar from "../../core/components/success-snack-bar/index.tsx";
import { useErrorHandler } from "../../core/hooks/useErrorHandler.ts";
import { JwtService } from "../../core/auth/JwtService.ts";
import i18n from "../../locales/i18n";
import { IActivityResponse } from "../../core/models/Activity.ts";
import TabsComponent from "../Course/TabsComponent.tsx";
import { PageBaseLayout } from "../../core/layout/PageBaseLayout.tsx";
import { ToolBar } from "../../core/components/tool-bar/ToolBar.tsx";
import { AuthConsumer } from "../../core/auth/AuthContext.tsx";

const Activities: React.FC = () => {
  const queryParams = new URLSearchParams(location.search);
  const success = queryParams.get('success');
  const [openSuccess, setOpenSuccess] = useState(true);
  const navigate = useNavigate();

  const { idCourse, slug } = useParams()
  const rawAccessToken = new JwtService().getRawAccessToken() as string;
  const authConsumer = AuthConsumer();
  const USER_ROLE: string = authConsumer.role;

  const { t } = useTranslation();

  const [activities, setActivities] = useState<IActivityResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { handleError, openError, errorType, handleCloseError } = useErrorHandler();

  const handleCloseSuccess = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway' || event === undefined) {
      return;
    }
    setOpenSuccess(false);
  };

  useEffect(() => {
    if (idCourse !== undefined) {
      setIsLoading(true)
      ActivitiesService.getAll(idCourse, rawAccessToken)
        .then((response) => {
          setIsLoading(false)
          setActivities(response as IActivityResponse[]);
        }).catch((error: AxiosError<ProblemDetail>) => {
          handleError(error)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawAccessToken])

  return (
    <>
      <TabsComponent />

      {USER_ROLE === "PROFESSOR" &&
        (<ToolBar onClickNewButton={() => navigate(`/courses/${idCourse}/${slug}/create-activity`)} />
        )}


      {success && <SuccessrSnackBar message={t('createactivity.successMessage')} open={openSuccess} handleClose={handleCloseSuccess} />}

      <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
        <Table>

          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell> {t("activity.language")}</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {activities?.map(activity => (
              <TableRow key={activity.id}>
                <TableCell><Link to={`${activity.id}`}>{activity.title}</Link></TableCell>
                <TableCell> {activity.extension === '.java' && 'Java'}</TableCell>
                <TableCell>{new Date(activity.startDate).toLocaleDateString(i18n.language, { timeZone: "Europe/London" })}  </TableCell>
                <TableCell>{new Date(activity.endDate).toLocaleDateString(i18n.language, { timeZone: "Europe/London" })}</TableCell>
                <TableCell>
                  <IconButton size="small">
                    <Icon>edit</Icon>
                  </IconButton>
                  <IconButton size="small">
                    <Icon>delete</Icon>
                  </IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>

          {activities.length === 0 && !isLoading && <caption>{t("activities.emptyList")}</caption>}

          <TableFooter>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5}>
                  <LinearProgress variant='indeterminate' />
                </TableCell>
              </TableRow>
            )}
          </TableFooter>

        </Table>
      </TableContainer>

      <ErrorSnackBar open={openError} handleClose={handleCloseError} errorType={errorType} />
    </>
  );
}

export default Activities