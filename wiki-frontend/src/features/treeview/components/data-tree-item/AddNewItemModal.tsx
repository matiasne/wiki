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
  Box,
} from "@mui/material";
import UploadFileModal from "./UploadFileModal";
import { useState } from "react";
import TextEditorFormModal from "./TextEditorFormModal";
import DataNode from "../../models/dataNode";
import URLItemFormModal from "./AddURLItemModal";

type AddNewItemModalProps = {
  open: boolean;
  parentId: string;
  onClose: () => void;
  onAddFile: () => void;
  onAddDocument?: () => void;
};

export default function AddNewItemModal({
  open,
  parentId,
  onClose,
  onAddFile,
  onAddDocument,
}: AddNewItemModalProps) {
  const [openUploadFileModal, setOpenUploadFileModal] = useState(false);
  const [OpenTextEditorModal, setOpenTextEditorModal] = useState(false);
  const [openURLItemFormModal, setOpenURLItemFormModal] = useState(false);

  return (
    <>
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
            <Button
              onClick={() => {
                onClose();
                setOpenUploadFileModal(true);
              }}
            >
              Upload File
            </Button>
            <Button
              onClick={() => {
                onClose();
                setOpenURLItemFormModal(true);
              }}
            >
              Add Site to Crawl
            </Button>
            <Button
              onClick={() => {
                onClose();
                setOpenTextEditorModal(true);
              }}
            >
              Write a Document
            </Button>
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
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>

      <URLItemFormModal
        open={openURLItemFormModal}
        onClose={() => {
          setOpenURLItemFormModal(false);
        }}
        onSave={() => {
          setOpenURLItemFormModal(false);
          onAddFile();
        }}
        node={new DataNode(parentId)}
      />

      <UploadFileModal
        open={openUploadFileModal}
        parentId={parentId}
        onClose={() => {
          setOpenUploadFileModal(false);
        }}
        onAddFile={() => {
          onAddFile();
        }}
      />

      <TextEditorFormModal
        open={OpenTextEditorModal}
        onClose={() => {
          setOpenTextEditorModal(false);
        }}
        onSave={() => {
          setOpenTextEditorModal(false);
          onAddFile();
        }}
        node={new DataNode(parentId)}
      />
    </>
  );
}
