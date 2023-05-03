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

type DataDeleteModalProps = {
  open: boolean;
  name: string;
  onCancel?: () => void;
  onYes?: () => void;
};

export default function DataDeleteModal({
  open,
  name,
  onCancel,
  onYes,
}: DataDeleteModalProps) {
  return (
    <Dialog
      open={open}
      sx={{
        "& .MuiTextField-root": { m: 1 },
      }}
    >
      <DialogTitle>Delete Folder</DialogTitle>
      <DialogContent>
        {"Are you sure to delete " + name + " folder?"}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onYes}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}
