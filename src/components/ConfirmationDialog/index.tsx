import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom"

interface ConfirmationDialogProps {
  title: string;
  desc: string;
  leave: string;
  ok: string;
  isShowing: boolean;
  hide: () => void;
}

function ConfirmationDialog({ isShowing, hide, title, desc, leave, ok}: ConfirmationDialogProps) {
  const navigate = useNavigate()

  return isShowing ? (
    <Dialog open={hide} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{desc}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="error" variant="outlined" onClick={() => {navigate("/");}}>
          {leave}
        </Button>
        <Button color="success" onClick={hide} autoFocus>
          {ok}
        </Button>
      </DialogActions>
    </Dialog>
  ) : null;
}

export default ConfirmationDialog



// function ConfirmationDialog({ isShowing, hide, title, desc, cancel, ok }: ConfirmationDialogProps) {
//   return (
//     <>
//       <Dialog
//       open={hide}
//       fullWidth
//     >
//       <DialogTitle>
//         {title}  
//       </DialogTitle>
//       <DialogContent>
//         <DialogContentText>
//           {desc}
//         </DialogContentText>
//       </DialogContent>
//       <DialogActions>
//         <Button color="error" variant="outlined" onClick={() => {navigate("/");}}>  
//           {cancel}
//         </Button>
//         <Button color="success" onClick={hide} autoFocus>
//           {ok}
//         </Button>
//       </DialogActions>
//     </Dialog>
//     </>
// ) 
// }