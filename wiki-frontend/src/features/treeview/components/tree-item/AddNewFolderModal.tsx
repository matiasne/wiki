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
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import INewNodeDTO, { EnumContentNodeType } from "../../models/newFolderDTO";
import NodeService from "../../services/node.service";

type AddNewFolderModalProps = {
  parentId: string;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
};

export default function AddNewFolderModal({
  parentId,
  open,
  onClose,
  onSave,
}: AddNewFolderModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    let newNode: INewNodeDTO = {
      name: data.name,
      parentId: parentId,
      type: EnumContentNodeType.FOLDER,
    };
    await NodeService.createNew(newNode);
    onSave();
  };

  return (
    <Dialog
      open={open}
      sx={{
        "& .MuiTextField-root": { m: 1 },
      }}
    >
      <DialogTitle>Add New Folder</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <TextField
            label="Folder Name"
            type="text"
            size="small"
            {...register("name")}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
