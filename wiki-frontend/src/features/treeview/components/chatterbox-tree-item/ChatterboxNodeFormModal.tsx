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
  TextareaAutosize,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import NodeService from "../../services/node.service";
import EmojiPicker, { Emoji, EmojiClickData } from "emoji-picker-react";
import EmojiSelector from "@/shared/components/EmojiSelector";
import styles from "./chatterboxNodeForm.module.css";
import DataNode from "../../models/dataNode";
import ChatterboxNode from "../../models/chatterboxNode";
import ChatterboxService from "../../../chat/services/chatterbox.service";

type ChatterboxNodeFormModalProps = {
  node: ChatterboxNode;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
};

export default function ChatterboxNodeFormModal({
  node,
  open,
  onClose,
  onSave,
}: ChatterboxNodeFormModalProps) {
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
    setValue(
      "emojiUnified",
      node.emojiUnified ? node.emojiUnified : "1f575-fe0f"
    );
    setValue("type", node.type);
    setValue("description", node.description);
    setValue("parentId", node.parentId);
    setValue("emojiUnified", node.emojiUnified);
    setValue("temperature", node.temperature);
    setValue("textChunkSize", node.textChunkSize);
    setValue("textOverlapSize", node.textOverlapSize);
  }, [node]);

  const onSubmit = async (data: any) => {
    if (node && node.id) {
      await ChatterboxService.update(node.id, data);
    } else {
      await ChatterboxService.post(data);
    }
    setTimeout(() => {
      onSave();
    }, 600);
  };

  return (
    <Dialog
      open={open}
      sx={{
        "& .MuiTextField-root": { m: 1 },
      }}
    >
      <DialogTitle>
        {node.id ? "Edit Chatterbox" : "Add New Chatterbox"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.container}>
          <DialogContent>
            <EmojiSelector
              default={node.emojiUnified ? node.emojiUnified : "1f575-fe0f"}
              onEmojiSelected={function (emojiUnified: string): void {
                setValue("emojiUnified", emojiUnified);
              }}
            />

            <TextField
              label="Chatterbox Name"
              type="text"
              size="small"
              {...register("name")}
            />
            <TextField
              label="Temperature"
              type="number"
              size="small"
              inputProps={{ type: "number" }}
              {...register("temperature")}
            />

            <TextField
              label="Text Chunk Size"
              type="number"
              size="small"
              inputProps={{ type: "number" }}
              {...register("textChunkSize")}
            />

            <TextField
              label="Text Overlap Size"
              type="number"
              size="small"
              inputProps={{ type: "number" }}
              {...register("textOverlapSize")}
            />
            <InputLabel id="demo-simple-select-label">
              Additional Prompt
            </InputLabel>
            <FormControl fullWidth size="small">
              <TextareaAutosize
                aria-label="empty textarea"
                placeholder="Empty"
                {...register("aditionalPrompt")}
                style={{ width: 500, height: 250, padding: "10px" }}
              />
            </FormControl>
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
