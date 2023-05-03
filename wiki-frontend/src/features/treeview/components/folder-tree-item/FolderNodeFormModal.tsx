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
import NodeService from "../../services/node.service";
import EmojiPicker, { Emoji, EmojiClickData } from "emoji-picker-react";
import EmojiSelector from "@/shared/components/EmojiSelector";
import styles from "./folderNodeForm.module.css";
import FolderNode from "../../models/folderNode";
import { EnumNodeType } from "../../models/contentNode";

type FolderNodeFormModalProps = {
  node: FolderNode;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
};

export default function FolderNodeFormModal({
  node,
  open,
  onClose,
  onSave,
}: FolderNodeFormModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue("name", node.name);
    setValue("emojiUnified", node.emojiUnified);
    setValue("type", EnumNodeType.FOLDER);
    setValue("data", "");
    setValue("description", node.description);
    setValue("extension", "");
    setValue("parentId", node.parentId);
  }, [node]);

  const onSubmit = async (data: any) => {
    if (node && node.id) {
      console.log(data);
      await NodeService.update(node.id, data);
    } else {
      await NodeService.createNew(data);
    }
    onSave();
  };

  return (
    <Dialog
      open={open}
      sx={{
        "& .MuiTextField-root": { m: 1 },
      }}
    >
      <DialogTitle>{node ? "Edit Folder" : "Add New Folder"}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.container}>
          <EmojiSelector
            default={"1f4c1"}
            onEmojiSelected={function (emojiUnified: string): void {
              setValue("emojiUnified", emojiUnified);
            }}
          />
          <DialogContent>
            <TextField
              label="Folder Name"
              type="text"
              size="small"
              {...register("name")}
            />
          </DialogContent>
        </div>

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
