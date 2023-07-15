"use client";
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

type DeleteFolderModalProps = {
  open: boolean;
  name: string;
  onCancel?: () => void;
  onYes?: () => void;
};

export default function DeleteFolderModal({
  open,
  name,
  onCancel,
  onYes,
}: DeleteFolderModalProps) {
  return (
    <Dialog
      open={open}
      sx={{
        "& .MuiTextField-root": { m: 1 },
      }}
    >
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>{"Are you sure to delete " + name + " ?"}</DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onYes}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}
