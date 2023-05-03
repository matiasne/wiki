"use client";
import DropZone from "@/shared/components/file-drop-zone/DropZone";
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
  Box,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useReducer, useState } from "react";
import uploadFileService from "@/features/files/services/upload-file.service";

type UploadFileModalProps = {
  open: boolean;
  parentId: string;
  onClose: () => void;
  onAddFile: () => void;
  onAddDocument?: () => void;
};

export default function UploadFileModal({
  open,
  parentId,
  onClose,
  onAddFile,
  onAddDocument,
}: UploadFileModalProps) {
  const [files, setFiles] = useState<File[] | null>(null);

  const mutationUploadFile = useMutation({
    mutationFn: async () => {
      if (files) {
        let resp = await uploadFileService.upload(parentId, files[0]);
      }
      onAddFile();
      return true;
    },
  });

  const reducer = (state: any, action: any) => {
    switch (action.type) {
      case "SET_IN_DROP_ZONE":
        return { ...state, inDropZone: action.inDropZone };
      case "ADD_FILE_TO_LI":
        return { ...state, fileList: state.fileList.concat(action.files) };
      default:
        return state;
    }
  };

  const [data, dispatch] = useReducer(reducer, {
    inDropZone: false,
    fileList: [],
  });

  return (
    <Dialog
      open={open}
      sx={{
        "& .MuiTextField-root": { m: 1 },
      }}
    >
      <DialogTitle>Add New Item</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <DropZone
            data={data}
            dispatch={dispatch}
            onFilesAdded={function (files: any): void {
              console.log(files);
              setFiles(files);
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose();
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={() => {
            onClose();
            mutationUploadFile.mutate();
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
