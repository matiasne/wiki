"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import NodeService from "../../services/node.service";
import EmojiSelector from "@/shared/components/EmojiSelector";
import styles from "./dataNodeForm.module.css";
import { EnumNodeType } from "../../models/contentNode";
import DataNode from "../../models/dataNode";

type TextEditorFormModalProps = {
  node: DataNode;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
};

export default function TextEditorFormModal({
  node,
  open,
  onClose,
  onSave,
}: TextEditorFormModalProps) {
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
    setValue("emojiUnified", "1f4dd");
    setValue("type", EnumNodeType.RICH_TEXT);
    setValue("data", node.data);
    setValue("description", node.description);
    setValue("extension", node.extension);
    setValue("parentId", node.parentId);
  }, [node]);

  const onSubmit = async (data: any) => {
    if (node && node.id !== undefined) {
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
      <DialogTitle>{node ? "Edit" : "Add New Text Editor"}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.container}>
          <EmojiSelector
            default={"1f4dd"}
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
