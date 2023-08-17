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
  TextareaAutosize,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useReducer, useState } from "react";
import uploadFileService from "@/features/files/services/upload-file.service";
import { useForm } from "react-hook-form";

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
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm();

  const [files, setFiles] = useState<File[] | null>(null);
  const [isImage, setIsImage] = useState<boolean>(false);

  const mutationUploadFile = useMutation({
    mutationFn: async () => {
      if (files) {
        let resp = await uploadFileService.upload(parentId, files[0]);
      }
      onAddFile();
      return true;
    },
  });

  const mutationTemporaryImageFile = useMutation({
    mutationFn: async () => {
      if (files) {
        let resp = await uploadFileService.uploadTemp(files[0]);
        setValue("imageDescription", resp.data.choices[0].text);
      }
      onAddFile();
      return true;
    },
  });

  const addFile = (files: any) => {
    if (files[0].type.includes("image")) {
      setIsImage(true);
      mutationTemporaryImageFile.mutate();
    }
    setFiles(files);
  };

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
              addFile(files);
            }}
          />
        </Box>
        {isImage ? (
          <FormControl fullWidth size="small">
            <TextareaAutosize
              aria-label="empty textarea"
              placeholder="Empty"
              {...register("imageDescription")}
              style={{ width: 500, height: 250, padding: "10px" }}
            />
          </FormControl>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose();
            setValue("imageDescription", "");
            setIsImage(false);
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={() => {
            onClose();
            mutationUploadFile.mutate();
            setValue("imageDescription", "");
            setIsImage(false);
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
