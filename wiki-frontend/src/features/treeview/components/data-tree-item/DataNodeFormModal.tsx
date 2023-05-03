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
import styles from "./dataNodeForm.module.css";
import DataNode from "../../models/dataNode";

type DataNodeFormModalProps = {
  node: DataNode;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
};

export default function DataNodeFormModal({
  node,
  open,
  onClose,
  onSave,
}: DataNodeFormModalProps) {
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
    setValue("type", node.type);
    setValue("parentId", node.parentId);
    setValue("data", node.data);
    setValue("description", node.description);
    setValue("extension", node.extension);
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
      <DialogTitle>{node.id ? "Edit Folder" : "Add New Folder"}</DialogTitle>
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
