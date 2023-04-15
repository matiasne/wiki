import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogActions,
  Button,
} from "@mui/material";

type AddNewFolderModalProps = {
  open: boolean;
  onClose?: () => void;
  onSave?: () => void;
};

export default function AddNewFolderModal({
  open,
  onClose,
  onSave,
}: AddNewFolderModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiTextField-root": { m: 1 },
      }}
    >
      <DialogTitle>Add New Folder</DialogTitle>
      <DialogContent>
        <TextField label="Folder Name" type="text" size="small" name="name" />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
