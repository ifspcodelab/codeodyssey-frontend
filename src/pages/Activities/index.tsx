import React from "react";
import { useEffect, useState } from "react";
import i18n from "../../locales/i18n";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { JwtService } from "../../core/auth/JwtService.ts";
import SuccessrSnackBar from "../../components/SuccessSnackBar/index.tsx";
import ErrorSnackBar from "../../core/components/error-snack-bar/ErrorSnackBar.tsx";
import { PageBaseLayout } from "../../core/layout/PageBaseLayout.tsx";
import { LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import { IActivityResponse, ActivitiesService, } from '../../core/services/api/activities/ActivitiesService.ts';
import { useErrorHandler } from "../../core/hooks/useErrorHandler.ts";
import { AxiosError } from "axios";

const Activities: React.FC = () => {
  const queryParams = new URLSearchParams(location.search);
  const { idCourse } = useParams()
  const success = queryParams.get('success');
  const { t } = useTranslation();

  const rawAccessToken = new JwtService().getRawAccessToken() as string;
  const [activities, setActivities] = useState<IActivityResponse[]>([]);

  const [openSuccess, setOpenSuccess] = useState(true);
  const { handleError, openError, errorType, handleCloseError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(true);

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
      <PageBaseLayout title={t('activities.title')}
      > </PageBaseLayout>

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
                <TableCell><Link to={activity.id}>{activity.title}</Link></TableCell>
                <TableCell> {activity.extension === '.java' && 'Java'}</TableCell>
                <TableCell>{new Date(activity.startDate).toLocaleDateString(i18n.language, { timeZone: "Europe/London" })}  </TableCell>
                <TableCell>{new Date(activity.endDate).toLocaleDateString(i18n.language, { timeZone: "Europe/London" })}</TableCell>
                <TableCell>Edit | Delete</TableCell>
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