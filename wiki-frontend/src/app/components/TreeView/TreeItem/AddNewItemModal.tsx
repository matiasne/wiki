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

type AddNewItemModalProps = {
  open: boolean;
  onAddFile?: () => void;
  onAddDocument?: () => void;
};

export default function AddNewItemModal({
  open,
  onAddFile,
  onAddDocument,
}: AddNewItemModalProps) {
  return (
    <Dialog
      open={open}
      sx={{
        "& .MuiTextField-root": { m: 1 },
      }}
    >
      <DialogTitle>Add New Item</DialogTitle>
      <DialogContent>
        <Button onClick={onAddFile}>File</Button>
        <Button onClick={onAddDocument}>Write a Document</Button>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
}
