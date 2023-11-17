import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { IResolutionResponse } from "../../core/models/Resolution";
import { Link } from "react-router-dom";
import i18n from "../../locales/i18n";

interface IResolutionsProps {
  resolutions: IResolutionResponse[];
  fileType: string;
}

const Resolutions: React.FC<IResolutionsProps> = ({ resolutions, fileType }) => {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EXECUTED_SUCCESS':
        return '#00FF00';
      case 'EXECUTED_ERROR':
        return '#FF0000';
      case 'WAITING_FOR_RESULTS':
        return '#DAA520';
      default:
        return '#ccc';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'EXECUTED_SUCCESS':
        return t('resolution.statusMessage.executedSuccess');
      case 'EXECUTED_ERROR':
        return t('resolution.statusMessage.executedError');
      case 'WAITING_FOR_RESULTS':
        return t('resolution.statusMessage.waiting');
      default:
        return '#ccc';
    }
  };

  const handleDecodeAndDownload = (file: string) => {
    const base64String = file;

    if (typeof base64String === 'string') {
      const decodedString = atob(base64String);
      const blob = new Blob([decodedString], { type: 'text/plain' });
      const blobUrl = window.URL.createObjectURL(blob);

      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;

      downloadLink.download = `initialFile${fileType}`;

      document.body.appendChild(downloadLink);
      downloadLink.click();

      window.URL.revokeObjectURL(blobUrl);
    }
  }

  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleDateString(i18n.language);
  };

  const formatTime = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleTimeString(i18n.language);
  };

  return (
    resolutions?.map((resolution) => (
      <Card key={resolution.id} variant="outlined" sx={{ margin: '24px', border: '1px solid #ccc', borderColor: getStatusColor(resolution.status) }}>
        <CardContent>
          <Typography><strong>{t('resolution.send')}</strong>: {formatDate(resolution.submitDate)}{' '}
            {formatTime(resolution.submitDate)}</Typography>
          <Typography><strong>{t('resolution.status')}</strong> : {getStatusMessage(resolution.status)}</Typography>
          <Typography><strong>{t('resolution.fileSended')}</strong>: <button onClick={() => {
            handleDecodeAndDownload(resolution.activity?.initialFile)
          }}>{t('activity.button.download')}</button></Typography>
          {resolution.status === 'EXECUTED_SUCCESS' && <Typography><strong>{t('resolution.tests')}</strong>: 3 <span style={{ color: 'green' }}>{t('resolution.testPass')}: 2 </span><span style={{ color: 'red' }}>{t('resolution.testError')}: 1</span></Typography>}
          {resolution.status === 'EXECUTED_ERROR' && <Typography>
            <span style={{ color: 'red' }}>{t('resolution.errorInExecution')}</span>
          </Typography>}
        </CardContent>
        {resolution.status !== 'WAITING_FOR_RESULTS' && <CardActions>

          <Button size="small"><Link to={"resolutions/" + resolution.id}>{t('resolution.button.seeResult')}</Link></Button>
        </CardActions>}
      </Card>
    ))
  )
}

export default Resolutions