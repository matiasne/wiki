import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import CustomDialog from "./CustomDialog";

type ConfirmationDialogProps = {
  open: boolean;
  onClose: () => void;
  message: string;
  onAccept: () => void;
};

const ConfirmationDialog = ({
  open,
  message,
  onClose,
  onAccept,
}: ConfirmationDialogProps) => {
  const handleAgree = () => {
    onAccept();
  };

  const handleDisagree = () => {
    onClose();
  };

  return (
    <CustomDialog open={open} onClose={handleDisagree}>
      <>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDisagree}>CANCEL</Button>
          <Button onClick={handleAgree} autoFocus>
            OK
          </Button>
        </DialogActions>
      </>
    </CustomDialog>
  );
};

export default ConfirmationDialog;
