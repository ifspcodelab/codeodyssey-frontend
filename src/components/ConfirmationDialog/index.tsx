import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom"
import {useTranslation} from "react-i18next";

interface ConfirmationDialogProps {
  title: string;
  desc: string;
  isShowing: boolean;
  hide: boolean;
}

function ConfirmationDialog({ isShowing, hide, title, desc}: ConfirmationDialogProps) {
  const navigate = useNavigate()
  const {t} = useTranslation();

  return isShowing ? (
    <Dialog open={hide} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{desc}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="error" variant="outlined" onClick={() => {navigate("/");}}>
        {t('createcourse.form.confimationdialog.leave')}
        </Button>
        <Button color="success" variant="outlined" onClick={hide} autoFocus>
        {t('createcourse.form.confimationdialog.continue')}
        </Button>
      </DialogActions>
    </Dialog>
  ) : null;
}

export default ConfirmationDialog