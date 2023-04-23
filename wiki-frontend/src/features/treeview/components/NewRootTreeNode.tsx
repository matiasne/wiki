"use client";
import { OutlinedButton } from "@/shared/components/OutlinedButton";
import { SmallOutlinedButton } from "@/shared/components/SmallOutlinedButton";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";
import NodeService from "../services/node.service";
import INewNodeDTO, { EnumContentNodeType } from "../models/newFolderDTO";
import { useForm } from "react-hook-form";
import AddNewFolderModal from "./tree-item/AddNewFolderModal";
import { useUpdateTreeView } from "./NodesTreeView";

export interface INewRooTreeNodeProps {
  onSaved: () => void;
}

export default function NewRooTreeNode(props: INewRooTreeNodeProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const updateTreeView = useUpdateTreeView();
  return (
    <>
      <SmallOutlinedButton
        onClick={() => {
          setOpenDialog(true);
        }}
      >
        Nueva Carpeta
      </SmallOutlinedButton>
      <AddNewFolderModal
        parentId="0"
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
        }}
        onSave={() => {
          setOpenDialog(false);
          updateTreeView();
          props.onSaved();
        }}
      />
    </>
  );
}
